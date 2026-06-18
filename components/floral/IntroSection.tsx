'use client'

import { useEffect, useState } from 'react'

// ─── 꽃잎 타입 ────────────────────────────────────────────────────────────────
interface Petal {
  id:      number
  x:       number  // 시작 가로 위치 (vw%)
  delay:   number  // 애니메이션 딜레이 (s)
  dur:     number  // 낙하 시간 (s)
  swayDur: number  // 흔들림 주기 (s)
  size:    number  // 크기 (px)
  opacity: number  // 0.6~0.9
}

// 결정론적 생성 — hydration 안전 (mounted 후에만 렌더)
function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id:      i,
    x:       (i * 37 + 5) % 95,                         // 0~94%
    delay:   parseFloat(((i * 1.1) % 7).toFixed(1)),    // 0~6.9s
    dur:     parseFloat((8 + (i * 1.3) % 8).toFixed(1)), // 8~15.9s
    swayDur: parseFloat((4 + (i * 0.8) % 5).toFixed(1)), // 4~8.9s
    size:    16 + (i * 6 % 19),                          // 16~34px
    opacity: 0.6 + (i % 4) * 0.1,                        // 0.6/0.7/0.8/0.9
  }))
}

const PETALS = makePetals(14)

// ─── 플로럴 장식 SVG (상/하 공용) ────────────────────────────────────────────
function FloralDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="56" height="22" viewBox="0 0 56 22"
      style={{ opacity: 0.7, transform: flip ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      {/* 중앙 골드 원 */}
      <circle cx="28" cy="11" r="3.2" fill="#B8956A" />
      {/* 블러쉬 꽃잎 타원 (좌우) */}
      <ellipse cx="16" cy="11" rx="8" ry="4.2" fill="#C0938C" opacity="0.5" transform="rotate(-28 16 11)" />
      <ellipse cx="40" cy="11" rx="8" ry="4.2" fill="#C0938C" opacity="0.5" transform="rotate(28 40 11)" />
      {/* 세이지 잎 (바깥) */}
      <ellipse cx="5"  cy="7"  rx="5" ry="2.8" fill="#9DA88C" opacity="0.55" transform="rotate(-55 5 7)" />
      <ellipse cx="51" cy="7"  rx="5" ry="2.8" fill="#9DA88C" opacity="0.55" transform="rotate(55 51 7)" />
    </svg>
  )
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function FloralIntroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #FAF0ED 0%, #F6E7E2 55%, #F1DDD8 100%)',
      }}
    >
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-10vh); opacity: 0; }
          7%   { opacity: 1; }
          93%  { opacity: 0.7; }
          100% { transform: translateY(112vh); opacity: 0; }
        }
        @keyframes petalSway {
          0%   { transform: translateX(-15px) rotate(0deg);   }
          50%  { transform: translateX(15px)  rotate(170deg); }
          100% { transform: translateX(-15px) rotate(350deg); }
        }
        @keyframes floralFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* 꽃잎 레이어 — 클라이언트에서만 렌더 */}
      {mounted && PETALS.map(p => (
        <div
          key={p.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${p.x}%`,
            // 외부 div: 세로 낙하 + opacity
            animation: `petalFall ${p.dur}s ease-in ${p.delay}s infinite`,
          }}
        >
          {/* 내부 div: 좌우 흔들림 + 회전 */}
          <div style={{ animation: `petalSway ${p.swayDur}s ease-in-out ${p.delay}s infinite` }}>
            <svg
              width={p.size}
              height={Math.round(p.size * 1.2)}
              viewBox="0 0 60 72"
              style={{ opacity: p.opacity }}
            >
              <defs>
                <linearGradient id={`pg-${p.id}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#B98A8C" />
                  <stop offset="1" stopColor="#E6CCC7" />
                </linearGradient>
              </defs>
              {/* 벚꽃 꽃잎 — 위 노치형 하트, 아래 줄기 포인트 */}
              <path
                d="M30 70 C8 56 8 22 22 8 C25 4 28 9 30 14 C32 9 35 4 38 8 C52 22 52 56 30 70 Z"
                fill={`url(#pg-${p.id})`}
              />
              {/* 중심 맥 */}
              <path
                d="M30 64 Q26 36 30 14"
                stroke="#F2E2DD" strokeWidth="1.4" fill="none" opacity="0.45"
              />
            </svg>
          </div>
        </div>
      ))}

      {/* 중앙 콘텐츠 */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-10"
        style={mounted ? { animation: 'floralFadeUp 1.2s ease 0.4s both' } : { opacity: 0 }}
      >
        {/* 상단 플로럴 장식 */}
        <div className="mb-7">
          <FloralDivider />
        </div>

        <p
          className="font-sans tracking-[0.32em] mb-5"
          style={{ color: '#C0938C', fontSize: 10 }}
        >
          WEDDING INVITATION
        </p>

        <h1
          className="font-serif leading-snug mb-3"
          style={{ color: '#5C4A45', fontSize: 34, letterSpacing: '0.05em' }}
        >
          유정 · 재근
        </h1>

        <p
          className="font-serif italic mb-7"
          style={{ color: '#A8746C', fontSize: 17, letterSpacing: '0.07em' }}
        >
          Yujeong &amp; Jaekeun
        </p>

        {/* 골드 가로 라인 */}
        <div className="w-14 h-px mb-7" style={{ backgroundColor: '#B8956A', opacity: 0.6 }} />

        <p
          className="font-sans tracking-[0.2em]"
          style={{ color: '#8A766E', fontSize: 12 }}
        >
          2027 . 10 . 23
        </p>
        <p
          className="font-sans tracking-[0.13em] mt-2"
          style={{ color: '#8A766E', fontSize: 11, opacity: 0.75 }}
        >
          SAT PM 12:00 | 울산시티컨벤션
        </p>

        {/* 하단 플로럴 장식 */}
        <div className="mt-7">
          <FloralDivider flip />
        </div>
      </div>
    </section>
  )
}
