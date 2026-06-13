'use client'

import { useEffect, useState } from 'react'

// ─── 꽃잎 타입 ────────────────────────────────────────────────────────────────
interface Petal {
  id:     number
  x:      number  // 시작 가로 위치 (vw%)
  delay:  number  // 애니메이션 딜레이 (s)
  dur:    number  // 낙하 시간 (s)
  size:   number  // 크기 (px)
  rotate: number  // 초기 회전 (deg)
  color:  string
}

const PETAL_COLORS = ['#C9848A', '#D4B896', '#E8C0C4', '#DBA8AC', '#F0D0D4']

// 결정론적 생성 — Math.random() 사용 안 함 (hydration 안전)
function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id:     i,
    x:      (i * 37 + 5) % 95,
    delay:  parseFloat(((i * 0.7) % 6).toFixed(1)),
    dur:    parseFloat((5 + (i * 0.45) % 4).toFixed(1)),
    size:   8 + (i % 3) * 5,
    rotate: (i * 53) % 360,
    color:  PETAL_COLORS[i % PETAL_COLORS.length],
  }))
}

const PETALS = makePetals(20)

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function FloralIntroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #FFF5F5 0%, #FDF0F0 55%, #FAE8E8 100%)',
      }}
    >
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-8vh)  translateX(0px)   rotate(0deg);   opacity: 0;   }
          8%   { opacity: 0.8; }
          25%  { transform: translateY(25vh)  translateX(18px)  rotate(90deg);  }
          50%  { transform: translateY(52vh)  translateX(-12px) rotate(200deg); }
          75%  { transform: translateY(76vh)  translateX(16px)  rotate(290deg); }
          92%  { opacity: 0.5; }
          100% { transform: translateY(108vh) translateX(0px)   rotate(400deg); opacity: 0;   }
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
            animation: `petalFall ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          <svg
            width={p.size}
            height={Math.round(p.size * 1.5)}
            viewBox="0 0 20 30"
            style={{ transform: `rotate(${p.rotate}deg)` }}
          >
            <ellipse cx="10" cy="15" rx="8"  ry="14" fill={p.color} opacity="0.5" />
            <ellipse cx="10" cy="15" rx="3.5" ry="9" fill={p.color} opacity="0.25" />
          </svg>
        </div>
      ))}

      {/* 중앙 콘텐츠 */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-10"
        style={mounted ? { animation: 'floralFadeUp 1.2s ease 0.4s both' } : { opacity: 0 }}
      >
        {/* 상단 플로럴 장식 */}
        <svg width="56" height="22" viewBox="0 0 56 22" className="mb-7" style={{ opacity: 0.65 }}>
          <circle cx="28" cy="11" r="3.5" fill="#C9848A" />
          <ellipse cx="16" cy="11" rx="8" ry="4.5" fill="#C9848A" opacity="0.45" transform="rotate(-28 16 11)" />
          <ellipse cx="40" cy="11" rx="8" ry="4.5" fill="#C9848A" opacity="0.45" transform="rotate(28 40 11)" />
          <ellipse cx="6"  cy="7"  rx="5" ry="3"   fill="#D4B896" opacity="0.4"  transform="rotate(-55 6 7)" />
          <ellipse cx="50" cy="7"  rx="5" ry="3"   fill="#D4B896" opacity="0.4"  transform="rotate(55 50 7)" />
        </svg>

        <p
          className="font-sans tracking-[0.32em] mb-5"
          style={{ color: '#C9848A', fontSize: 10 }}
        >
          WEDDING INVITATION
        </p>

        <h1
          className="font-serif leading-snug mb-3"
          style={{ color: '#5C3535', fontSize: 34, letterSpacing: '0.05em' }}
        >
          유정 · 재근
        </h1>

        <p
          className="font-serif italic mb-7"
          style={{ color: '#C9848A', fontSize: 17, letterSpacing: '0.07em' }}
        >
          Yujeong &amp; Jaekeun
        </p>

        <div className="w-14 h-px mb-7" style={{ backgroundColor: '#D4B896' }} />

        <p
          className="font-sans tracking-[0.2em]"
          style={{ color: '#7A5050', fontSize: 12 }}
        >
          2027 . 10 . 23
        </p>
        <p
          className="font-sans tracking-[0.13em] mt-2"
          style={{ color: '#7A5050', fontSize: 11, opacity: 0.7 }}
        >
          SAT PM 12:00 | 울산시티컨벤션
        </p>

        {/* 하단 플로럴 장식 (뒤집기) */}
        <svg
          width="56" height="22" viewBox="0 0 56 22" className="mt-7"
          style={{ opacity: 0.65, transform: 'scaleY(-1)' }}
        >
          <circle cx="28" cy="11" r="3.5" fill="#C9848A" />
          <ellipse cx="16" cy="11" rx="8" ry="4.5" fill="#C9848A" opacity="0.45" transform="rotate(-28 16 11)" />
          <ellipse cx="40" cy="11" rx="8" ry="4.5" fill="#C9848A" opacity="0.45" transform="rotate(28 40 11)" />
          <ellipse cx="6"  cy="7"  rx="5" ry="3"   fill="#D4B896" opacity="0.4"  transform="rotate(-55 6 7)" />
          <ellipse cx="50" cy="7"  rx="5" ry="3"   fill="#D4B896" opacity="0.4"  transform="rotate(55 50 7)" />
        </svg>
      </div>
    </section>
  )
}
