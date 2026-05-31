'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// 별 5색 팔레트
const STAR_COLORS = ['#FAF8F3', '#B8956A', '#D4B896', '#9A7A52', '#E8C4B8']

interface StarData {
  id: string
  nickname: string
  message: string
  x: number    // 0~100 (%)
  y: number    // 0~100 (%)
  color: string
  size: number
  dur: number
  del: number
}

// 5각별 polygon 좌표 — viewBox 0 0 20 20, 중심 (10,10)
function starPoints(r: number): string {
  const inner = r * 0.42
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : inner
    const angle = (i * Math.PI) / 5 - Math.PI / 2
    return `${(10 + radius * Math.cos(angle)).toFixed(2)},${(10 + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')
}

// 별 배치 최소 거리 체크 — 컨테이너 370×320px 기준 픽셀 근사
function tooClose(x: number, y: number, existing: Pick<StarData, 'x' | 'y'>[]): boolean {
  return existing.some(s => {
    const dx = (x - s.x) * 3.7
    const dy = (y - s.y) * 3.2
    return dx * dx + dy * dy < 900
  })
}

// DB 행 → StarData 변환
// x, y 컬럼이 없으므로 클라이언트에서 랜덤 위치 부여
function rowToStar(row: Record<string, unknown>): StarData {
  return {
    id: String(row.id),
    nickname: String(row.nickname),
    message: String(row.message),
    x: 5 + Math.random() * 85,
    y: 5 + Math.random() * 52,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    size: 4 + Math.floor(Math.random() * 4),
    dur: parseFloat((3 + Math.random() * 2).toFixed(1)),
    del: parseFloat((Math.random() * 4).toFixed(2)),
  }
}

const DUMMY_DATA = [
  { nickname: '준호', message: '오래오래 행복하세요 ✨' },
  { nickname: '수진이', message: '두 분 진심으로 축하드려요!' },
  { nickname: '이모', message: '건강하고 행복한 가정 이루세요' },
  { nickname: '민준', message: '결혼 축하합니다 🎉' },
  { nickname: '예은', message: '평생 서로 아껴주세요' },
  { nickname: '동현', message: '행복하게 사세요!' },
  { nickname: '지윤', message: '새 출발 진심으로 응원해요' },
  { nickname: '현서', message: '두 분 잘 어울려요 ❤️' },
  { nickname: '승호', message: '결혼 너무 축하해!' },
  { nickname: '미래', message: '항상 웃으며 사세요' },
  { nickname: '하준', message: '오래 행복하세요 🌟' },
  { nickname: '서연', message: '두 분 정말 잘 어울려요' },
  { nickname: '태양', message: '축복합니다!' },
  { nickname: '나연', message: '새 가정 화이팅!' },
  { nickname: '지호', message: '평생 함께 행복하세요' },
  { nickname: '윤서', message: '결혼 진심 축하드려요 🎊' },
  { nickname: '재원', message: '두 분의 앞날을 응원합니다' },
  { nickname: '소희', message: '행복만 가득하세요' },
  { nickname: '건우', message: '축하해요! 잘 살아요 ☺️' },
  { nickname: '혜진', message: '오래오래 사랑하세요 💕' },
]

// 더미 별 30개 — 클라이언트에서만 생성 (hydration 방지)
function buildDummyStars(): StarData[] {
  const stars: StarData[] = []
  const TOTAL = 30
  for (let i = 0; i < TOTAL; i++) {
    const d = DUMMY_DATA[i % DUMMY_DATA.length]
    let x = 5 + ((i * 17 + 7) % 90)
    let y = 5 + ((i * 13 + 3) % 52)
    for (let t = 0; t < 120 && tooClose(x, y, stars); t++) {
      x = 5 + ((i * 17 + 7 + t * 13) % 90)
      y = 5 + ((i * 13 + 3 + t * 9) % 52)
    }
    stars.push({
      id: `dummy-${i}`,
      nickname: d.nickname,
      message: d.message,
      x, y,
      color: STAR_COLORS[i % STAR_COLORS.length],
      size: 4 + (i % 4),
      dur: 3 + (i % 5) * 0.4,
      del: parseFloat(((i * 0.37) % 4).toFixed(2)),
    })
  }
  return stars
}

export default function MessageSection() {
  // hydration 방지: 서버에서는 빈 배열로 시작, 클라이언트 useEffect에서만 생성
  const [dummyStars, setDummyStars] = useState<StarData[]>([])
  const [userStars, setUserStars] = useState<StarData[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // 클라이언트에서만 더미 별 생성 (hydration mismatch 방지)
    setDummyStars(buildDummyStars())

    // 초기 데이터 로드 — nickname, message만 존재하는 컬럼 선택
    supabase
      .from('star_messages')
      .select('id, nickname, message, created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('[star_messages] load error:', error)
          return
        }
        console.log('[star_messages] loaded:', data?.length ?? 0, 'rows')
        if (data) setUserStars(data.map(rowToStar))
      })

    // Realtime 구독 — 다른 사람이 추가한 별 실시간 반영
    const channel = supabase
      .channel('star_messages_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'star_messages' },
        (payload) => {
          const newStar = rowToStar(payload.new as Record<string, unknown>)
          setUserStars(prev =>
            prev.some(s => s.id === newStar.id) ? prev : [...prev, newStar]
          )
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const allStars = [...dummyStars, ...userStars]

  async function addStar() {
    if (!nickname.trim() || !message.trim()) return
    let x = 5 + Math.random() * 85
    let y = 5 + Math.random() * 52
    for (let t = 0; t < 50 && tooClose(x, y, allStars); t++) {
      x = 5 + Math.random() * 85
      y = 5 + Math.random() * 52
    }

    // DB에는 nickname, message만 저장 (x, y 컬럼 없음)
    const payload = {
      nickname: nickname.trim(),
      message: message.trim(),
    }
    console.log('[star_messages] insert payload:', payload)

    setNickname('')
    setMessage('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)

    const { data, error } = await supabase
      .from('star_messages')
      .insert(payload)
      .select()
    if (error) console.error('[star_messages] insert error:', error)
    else console.log('[star_messages] insert success:', data)
    // 새 별 위치는 realtime 핸들러의 rowToStar에서 랜덤 생성
  }

  function tooltipPos(star: StarData): string {
    const vert  = star.y <= 30 ? 'top-full mt-2' : 'bottom-full mb-2'
    const horiz = star.x <= 20 ? 'left-0'
                : star.x >= 80 ? 'right-0'
                : 'left-1/2 -translate-x-1/2'
    return `absolute ${vert} ${horiz} w-36 rounded-lg px-3 py-2 text-left pointer-events-none`
  }

  return (
    <section className="bg-charcoal">
      <style>{`
        @keyframes star-twinkle-msg {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @media (prefers-reduced-motion: reduce) {
          .star-msg { animation: none !important; }
        }
        .msg-input:-webkit-autofill,
        .msg-input:-webkit-autofill:hover,
        .msg-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #1F1F1F inset;
          -webkit-text-fill-color: #FAF8F3;
        }
      `}</style>

      {/* 섹션 제목 */}
      <div className="pt-16 pb-8 text-center px-6">
        <h2 className="font-serif text-2xl text-gold tracking-wide">A Sky Full of Wishes</h2>
        <p className="font-sans text-xs text-warm-white/60 mt-2 tracking-[0.15em]">
          축하의 별을 더해주세요
        </p>
      </div>

      {/* 밤하늘 영역 */}
      <div
        className="relative mx-6 h-80 border border-warm-white/10 rounded-xl overflow-hidden"
        onClick={() => setActiveId(null)}
      >
        {allStars.map((star) => (
          <button
            key={star.id}
            className="absolute p-1.5"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: activeId === star.id ? 100 : 1,
            }}
            onClick={(e) => {
              e.stopPropagation()
              setActiveId(activeId === star.id ? null : star.id)
            }}
            aria-label={`${star.nickname}의 별`}
          >
            {activeId === star.id && (
              <div
                className={tooltipPos(star)}
                style={{ backgroundColor: '#2A2A2A', border: '1px solid #B8956A', zIndex: 101 }}
              >
                <p className="font-sans text-[11px] text-gold font-medium truncate">{star.nickname}</p>
                <p className="font-sans text-[10px] text-warm-white/65 mt-0.5 leading-relaxed">{star.message}</p>
              </div>
            )}
            <svg
              width={star.size * 4}
              height={star.size * 4}
              viewBox="0 0 20 20"
              className="star-msg"
              style={{
                animation: `star-twinkle-msg ${star.dur.toFixed(1)}s ease-in-out ${star.del.toFixed(2)}s infinite`,
              }}
              aria-hidden="true"
            >
              <polygon points={starPoints(star.size)} fill={star.color} />
            </svg>
          </button>
        ))}

        {/* 나무 실루엣 */}
        <svg
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          viewBox="0 0 400 150"
          aria-hidden="true"
        >
          <g transform="translate(100, -40)" fill="#2D2D2D">
            <rect x="93" y="140" width="14" height="50" />
            <ellipse cx="100" cy="130" rx="55" ry="40" />
            <ellipse cx="100" cy="105" rx="45" ry="35" />
            <ellipse cx="100" cy="82"  rx="35" ry="28" />
            <ellipse cx="100" cy="62"  rx="22" ry="20" />
          </g>
        </svg>
      </div>

      {/* 메시지 입력 폼 */}
      <div className="px-6 pb-14 pt-6">
        <div className="space-y-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 (최대 10자)"
            maxLength={10}
            className="msg-input w-full bg-charcoal border-[0.5px] border-gold/50 rounded-lg px-4 py-3 font-sans text-sm text-warm-white placeholder:text-warm-white/30 outline-none focus:border-gold transition-colors"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="두 분께 전하는 축하 메시지 (최대 50자)"
            maxLength={50}
            rows={2}
            className="msg-input w-full bg-charcoal border-[0.5px] border-gold/50 rounded-lg px-4 py-3 font-sans text-sm text-warm-white placeholder:text-warm-white/30 outline-none focus:border-gold resize-none transition-colors"
          />
          <button
            onClick={addStar}
            disabled={!nickname.trim() || !message.trim()}
            className="w-full py-3.5 rounded-lg bg-gold text-warm-white font-sans text-sm font-medium tracking-wide disabled:opacity-30 transition-opacity"
          >
            {submitted ? '별이 추가되었어요 ✨' : '별 달기'}
          </button>
        </div>
      </div>
    </section>
  )
}
