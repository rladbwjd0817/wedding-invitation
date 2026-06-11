'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// ─── 상수 ───────────────────────────────────────────────────────────────────
const STAR_COLORS = ['#FAF8F3', '#B8956A', '#D4B896', '#9A7A52', '#E8C4B8']
const MY_STAR_IDS_KEY = 'my_star_ids'

// ─── 타입 ────────────────────────────────────────────────────────────────────
interface StarData {
  id: string
  nickname: string
  message: string
  x: number
  y: number
  color: string
  size: number
  dur: number
  del: number
}

type ModalMode = 'none' | 'pw_check' | 'edit'
type ModalAction = 'edit' | 'delete'

// ─── 모듈 레벨 함수 ───────────────────────────────────────────────────────────

function starPoints(r: number): string {
  const inner = r * 0.42
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : inner
    const angle  = (i * Math.PI) / 5 - Math.PI / 2
    return `${(10 + radius * Math.cos(angle)).toFixed(2)},${(10 + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')
}

function tooClose(x: number, y: number, existing: Pick<StarData, 'x' | 'y'>[]): boolean {
  return existing.some(s => {
    const dx = (x - s.x) * 3.7
    const dy = (y - s.y) * 3.2
    return dx * dx + dy * dy < 900
  })
}

function randomPos() {
  return { x: 5 + Math.random() * 85, y: 5 + Math.random() * 52 }
}

function rowToStar(row: Record<string, unknown>): StarData {
  return {
    id:       String(row.id),
    nickname: String(row.nickname),
    message:  String(row.message),
    x:     5 + Math.random() * 85,
    y:     5 + Math.random() * 52,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    size:  4 + Math.floor(Math.random() * 4),
    dur:   parseFloat((3 + Math.random() * 2).toFixed(1)),
    del:   parseFloat((Math.random() * 4).toFixed(2)),
  }
}

const DUMMY_DATA = [
  { nickname: '준호',  message: '오래오래 행복하세요 ✨' },
  { nickname: '수진이', message: '두 분 진심으로 축하드려요!' },
  { nickname: '이모',  message: '건강하고 행복한 가정 이루세요' },
  { nickname: '민준',  message: '결혼 축하합니다 🎉' },
  { nickname: '예은',  message: '평생 서로 아껴주세요' },
  { nickname: '동현',  message: '행복하게 사세요!' },
  { nickname: '지윤',  message: '새 출발 진심으로 응원해요' },
]

function buildDummyStars(): StarData[] {
  const stars: StarData[] = []
  for (let i = 0; i < 5; i++) {
    const d = DUMMY_DATA[i % DUMMY_DATA.length]
    let x = 5 + ((i * 17 + 7) % 90)
    let y = 5 + ((i * 13 + 3) % 52)
    for (let t = 0; t < 120 && tooClose(x, y, stars); t++) {
      x = 5 + ((i * 17 + 7 + t * 13) % 90)
      y = 5 + ((i * 13 + 3 + t * 9)  % 52)
    }
    stars.push({
      id: `dummy-${i}`,
      nickname: d.nickname,
      message:  d.message,
      x, y,
      color: STAR_COLORS[i % STAR_COLORS.length],
      size:  4 + (i % 4),
      dur:   3 + (i % 5) * 0.4,
      del:   parseFloat(((i * 0.37) % 4).toFixed(2)),
    })
  }
  return stars
}

const DUMMY_STARS = buildDummyStars()

// ─── 공용 모달 스타일 ─────────────────────────────────────────────────────────
const MODAL_CARD: React.CSSProperties = {
  backgroundColor: '#2A2A2A',
  border: '0.5px solid #B8956A',
}
const MODAL_OVERLAY: React.CSSProperties = {
  backgroundColor: 'rgba(0,0,0,0.6)',
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function MessageSection() {
  // ── 별 상태 ──
  const [userStars,    setUserStars]   = useState<StarData[]>([])
  const [myStarIds,    setMyStarIds]   = useState<string[]>([])
  const [highlightMe,  setHighlightMe] = useState(false)
  const [activeId,     setActiveId]    = useState<string | null>(null)

  // ── 입력 폼 ──
  const [nickname,     setNickname]    = useState('')
  const [message,      setMessage]     = useState('')
  const [password,     setPassword]    = useState('')
  const [submitted,    setSubmitted]   = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── 모달 상태 기계 ──
  const [modalMode,    setModalMode]   = useState<ModalMode>('none')
  const [modalStarId,  setModalStarId] = useState<string | null>(null)
  const [modalAction,  setModalAction] = useState<ModalAction>('edit')
  const [pwInput,      setPwInput]     = useState('')
  const [editNick,     setEditNick]    = useState('')
  const [editMsg,      setEditMsg]     = useState('')

  // ── 토스트 ──
  const [noStarToast,  setNoStarToast]  = useState(false)
  const [pwErrToast,   setPwErrToast]   = useState(false)
  const [deleteToast,  setDeleteToast]  = useState(false)

  const skyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('myStarIds:', myStarIds)
  }, [myStarIds])

  useEffect(() => {
    setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(MY_STAR_IDS_KEY) || '[]') as string[]
        setMyStarIds(saved)
      } catch { /* ignore */ }
    }, 0)

    supabase
      .from('star_messages')
      .select('id, nickname, message')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) { console.error('[stars] load error:', error); return }
        if (data)  setUserStars(data.map(row => rowToStar(row as Record<string, unknown>)))
      })

    const chName = `star_ch_${Date.now()}`
    const channel = supabase
      .channel(chName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'star_messages' },
        (payload) => {
          const newStar = rowToStar(payload.new as Record<string, unknown>)
          setUserStars(prev => {
            if (prev.find(s => s.id === newStar.id)) return prev
            return [...prev, newStar]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const allStars = [...DUMMY_STARS, ...userStars]

  // ── 별 달기 ──────────────────────────────────────────────────────────────────
  async function addStar() {
    if (!nickname.trim() || !message.trim() || password.length !== 4) return
    if (isSubmitting) return

    setIsSubmitting(true)

    let pos = randomPos()
    const current = [...DUMMY_STARS, ...userStars]
    for (let t = 0; t < 80 && tooClose(pos.x, pos.y, current); t++) {
      pos = randomPos()
    }

    const nick = nickname.trim()
    const msg  = message.trim()
    const pw   = password

    setNickname('')
    setMessage('')
    setPassword('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)

    try {
      const { data, error } = await supabase
        .from('star_messages')
        .insert([{ nickname: nick, message: msg, password: pw }])
        .select()

      console.log('insert result:', data, error)
      if (error) { console.error('[stars] insert error:', error); return }

      const newId  = String(data[0].id)
      console.log('새 별 id:', newId, '| 기존 myStarIds:', myStarIds)
      const newIds = [...myStarIds, newId]
      localStorage.setItem(MY_STAR_IDS_KEY, JSON.stringify(newIds))
      setMyStarIds(newIds)
      console.log('myStarIds 업데이트 →', newIds)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── 내 별 찾기 ───────────────────────────────────────────────────────────────
  function findMyStar() {
    if (myStarIds.length === 0) {
      setNoStarToast(true)
      setTimeout(() => setNoStarToast(false), 2000)
      return
    }
    skyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlightMe(true)
    setTimeout(() => setHighlightMe(false), 2400)
  }

  // ── 비밀번호 모달 열기 ────────────────────────────────────────────────────────
  function openPwModal(starId: string, action: ModalAction) {
    setModalStarId(starId)
    setModalAction(action)
    setPwInput('')
    setModalMode('pw_check')
    setActiveId(null)
  }

  // ── 비밀번호 확인 ─────────────────────────────────────────────────────────────
  async function handlePwConfirm() {
    if (!modalStarId || pwInput.length !== 4) return

    const { data } = await supabase
      .from('star_messages')
      .select('id, nickname, message, password')
      .eq('id', modalStarId)
      .single()

    if (!data || data.password !== pwInput) {
      setPwErrToast(true)
      setTimeout(() => setPwErrToast(false), 2000)
      setPwInput('')
      return
    }

    if (modalAction === 'delete') {
      const { error } = await supabase
        .from('star_messages')
        .delete()
        .eq('id', modalStarId)

      if (!error) {
        setUserStars(prev => prev.filter(s => s.id !== modalStarId))
        const newIds = myStarIds.filter(id => id !== modalStarId)
        localStorage.setItem(MY_STAR_IDS_KEY, JSON.stringify(newIds))
        setMyStarIds(newIds)
      }
      setModalMode('none')
      setDeleteToast(true)
      setTimeout(() => setDeleteToast(false), 2000)
    } else {
      setEditNick(data.nickname)
      setEditMsg(data.message)
      setModalMode('edit')
    }
    setPwInput('')
  }

  // ── 수정 저장 ─────────────────────────────────────────────────────────────────
  async function handleEditSave() {
    if (!modalStarId || !editNick.trim() || !editMsg.trim()) return

    const { error } = await supabase
      .from('star_messages')
      .update({ nickname: editNick.trim(), message: editMsg.trim() })
      .eq('id', modalStarId)

    if (!error) {
      setUserStars(prev => prev.map(s =>
        s.id === modalStarId
          ? { ...s, nickname: editNick.trim(), message: editMsg.trim() }
          : s
      ))
    }
    setModalMode('none')
  }

  // ── 툴팁 위치 (pointer-events 제거 — 버튼 클릭 가능) ─────────────────────────
  function tooltipPos(star: StarData): string {
    const vert  = star.y <= 30 ? 'top-full mt-2' : 'bottom-full mb-2'
    const horiz = star.x <= 20 ? 'left-0'
                : star.x >= 80 ? 'right-0'
                : 'left-1/2 -translate-x-1/2'
    return `absolute ${vert} ${horiz} w-40 rounded-lg px-3 py-2 text-left`
  }

  const inputCls = 'msg-input w-full bg-charcoal border-[0.5px] border-gold/50 rounded-lg px-4 py-3 font-sans text-sm text-warm-white placeholder:text-warm-white/30 outline-none focus:border-gold transition-colors'

  return (
    <section className="bg-charcoal">
      <style>{`
        @keyframes star-twinkle-msg {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes star-flash-anim {
          0%, 100% { filter: drop-shadow(0 0 8px #B8956A); }
          50%       { filter: drop-shadow(0 0 20px #FFE99A) drop-shadow(0 0 36px #B8956A); }
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

      {/* 밤하늘 */}
      <div
        ref={skyRef}
        className="relative mx-6 h-80 border border-warm-white/10 rounded-xl overflow-hidden"
        onClick={() => setActiveId(null)}
      >
        {allStars.map(star => {
          const isMyStar  = myStarIds.includes(star.id)
          const displayPx = isMyStar ? star.size * 4 * 1.5 : star.size * 4
          const starColor = isMyStar ? '#B8956A' : star.color
          const animStyle: React.CSSProperties = (isMyStar && highlightMe)
            ? { animation: 'star-flash-anim 0.5s ease-in-out 4' }
            : {
                animation: `star-twinkle-msg ${star.dur.toFixed(1)}s ease-in-out ${star.del.toFixed(2)}s infinite`,
                ...(isMyStar && { filter: 'drop-shadow(0 0 8px #B8956A) drop-shadow(0 0 14px #B8956A)' }),
              }

          return (
            <button
              key={star.id}
              className="absolute p-1.5"
              style={{
                left: `${star.x}%`,
                top:  `${star.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: activeId === star.id ? 100 : 1,
              }}
              onClick={e => {
                e.stopPropagation()
                setActiveId(activeId === star.id ? null : star.id)
              }}
              aria-label={`${star.nickname}의 별${isMyStar ? ' (내 별)' : ''}`}
            >
              {activeId === star.id && (
                <div
                  className={tooltipPos(star)}
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #B8956A', zIndex: 101 }}
                  onClick={e => e.stopPropagation()} // 툴팁 내 클릭이 별 버튼 토글로 전파되지 않도록
                >
                  <p className="font-sans text-[11px] text-gold font-medium truncate">
                    {star.nickname}{isMyStar ? ' ✦' : ''}
                  </p>
                  <p className="font-sans text-[10px] text-warm-white/65 mt-0.5 leading-relaxed">
                    {star.message}
                  </p>
                  {/* 내 별에만 수정/삭제 버튼 표시 */}
                  {isMyStar && (
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={e => { e.stopPropagation(); openPwModal(star.id, 'edit') }}
                        className="flex-1 py-1 rounded font-sans text-[10px] text-warm-white/60 border-[0.5px] border-warm-white/20 hover:border-gold/50 hover:text-warm-white transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); openPwModal(star.id, 'delete') }}
                        className="flex-1 py-1 rounded font-sans text-[10px] text-warm-white/60 border-[0.5px] border-warm-white/20 hover:border-red-400/50 hover:text-red-400 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
              <svg
                width={displayPx}
                height={displayPx}
                viewBox="0 0 20 20"
                className="star-msg"
                style={animStyle}
                aria-hidden="true"
              >
                <polygon points={starPoints(star.size)} fill={starColor} />
              </svg>
            </button>
          )
        })}

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

      {/* 입력 폼 */}
      <div className="px-6 pb-14 pt-6">
        <div className="space-y-3">
          {myStarIds.length > 0 && (
            <button
              onClick={findMyStar}
              className="w-full py-2.5 rounded-lg border-[0.5px] border-gold/30 font-sans text-xs text-warm-white/50 tracking-widest transition-opacity hover:opacity-80"
            >
              ✦ 내 별 찾기
            </button>
          )}

          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임 (최대 10자)"
            maxLength={10}
            className={inputCls}
          />
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="두 분께 전하는 축하 메시지 (최대 50자)"
            maxLength={50}
            rows={2}
            className={`${inputCls} resize-none`}
          />
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={password}
            onChange={e => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="비밀번호 4자리 숫자"
            maxLength={4}
            className={inputCls}
          />
          <button
            onClick={addStar}
            disabled={!nickname.trim() || !message.trim() || password.length !== 4 || isSubmitting}
            className="w-full py-3.5 rounded-lg bg-gold text-warm-white font-sans text-sm font-medium tracking-wide disabled:opacity-30 transition-opacity"
          >
            {submitted ? '별이 추가되었어요 ✨' : '별 달기'}
          </button>
        </div>
      </div>

      {/* ── 비밀번호 확인 모달 ─────────────────────────────────────────────────── */}
      {modalMode === 'pw_check' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={MODAL_OVERLAY}
          onClick={() => setModalMode('none')}
        >
          <div
            className="w-full max-w-xs rounded-2xl px-6 py-7 relative"
            style={MODAL_CARD}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalMode('none')}
              className="absolute top-4 right-4 text-warm-white/40 w-7 h-7 flex items-center justify-center hover:text-warm-white/70 transition-colors"
              aria-label="닫기"
            >✕</button>

            <h3 className="font-serif text-lg text-gold tracking-wide text-center mb-1">
              비밀번호 확인
            </h3>
            <p className="font-sans text-[11px] text-warm-white/45 text-center mb-5">
              {modalAction === 'delete' ? '삭제' : '수정'}하려면 비밀번호를 입력해주세요
            </p>

            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pwInput}
              onChange={e => setPwInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="4자리 숫자"
              maxLength={4}
              className={inputCls}
              autoFocus
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setModalMode('none')}
                className="flex-1 py-3 rounded-lg font-sans text-sm text-warm-white/50 border-[0.5px] border-warm-white/20"
              >
                취소
              </button>
              <button
                onClick={handlePwConfirm}
                disabled={pwInput.length !== 4}
                className="flex-1 py-3 rounded-lg bg-gold text-warm-white font-sans text-sm font-medium disabled:opacity-30"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 수정 모달 ──────────────────────────────────────────────────────────── */}
      {modalMode === 'edit' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={MODAL_OVERLAY}
          onClick={() => setModalMode('none')}
        >
          <div
            className="w-full max-w-xs rounded-2xl px-6 py-7 relative"
            style={MODAL_CARD}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalMode('none')}
              className="absolute top-4 right-4 text-warm-white/40 w-7 h-7 flex items-center justify-center hover:text-warm-white/70 transition-colors"
              aria-label="닫기"
            >✕</button>

            <h3 className="font-serif text-lg text-gold tracking-wide text-center mb-5">
              별 수정
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={editNick}
                onChange={e => setEditNick(e.target.value)}
                placeholder="닉네임"
                maxLength={10}
                className={inputCls}
              />
              <textarea
                value={editMsg}
                onChange={e => setEditMsg(e.target.value)}
                placeholder="메시지"
                maxLength={50}
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setModalMode('none')}
                className="flex-1 py-3 rounded-lg font-sans text-sm text-warm-white/50 border-[0.5px] border-warm-white/20"
              >
                취소
              </button>
              <button
                onClick={handleEditSave}
                disabled={!editNick.trim() || !editMsg.trim()}
                className="flex-1 py-3 rounded-lg bg-gold text-warm-white font-sans text-sm font-medium disabled:opacity-30"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 토스트 ─────────────────────────────────────────────────────────────── */}
      {/* 아직 별 없음 */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-charcoal border border-warm-white/20 text-warm-white/70 font-sans text-xs tracking-wide whitespace-nowrap transition-opacity duration-300 ${noStarToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        아직 별을 달지 않으셨어요
      </div>
      {/* 비밀번호 오류 */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-charcoal border border-warm-white/20 text-warm-white/70 font-sans text-xs tracking-wide whitespace-nowrap transition-opacity duration-300 ${pwErrToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        비밀번호가 올바르지 않아요
      </div>
      {/* 삭제 완료 */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-charcoal border border-warm-white/20 text-warm-white/70 font-sans text-xs tracking-wide whitespace-nowrap transition-opacity duration-300 ${deleteToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        별이 삭제되었어요
      </div>
    </section>
  )
}
