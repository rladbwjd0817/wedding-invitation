'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ─── 별빛 좌표 (고정값 — 하이드레이션 불일치 방지) ─────────────────────────────
// x,y: %, s: 크기(px), dur: 반짝임 주기(s), del: 지연(s)
const STARS = [
  { x: 12, y: 14, s: 3, dur: 3.2, del: 0.0 },
  { x: 26, y: 30, s: 2, dur: 4.0, del: 1.1 },
  { x: 18, y: 58, s: 2, dur: 3.6, del: 0.6 },
  { x: 10, y: 78, s: 3, dur: 4.4, del: 1.8 },
  { x: 33, y: 72, s: 2, dur: 3.0, del: 0.3 },
  { x: 48, y: 12, s: 2, dur: 4.2, del: 2.1 },
  { x: 72, y: 22, s: 3, dur: 3.4, del: 0.9 },
  { x: 86, y: 40, s: 2, dur: 4.0, del: 1.4 },
  { x: 90, y: 66, s: 3, dur: 3.8, del: 0.2 },
  { x: 78, y: 82, s: 2, dur: 3.2, del: 1.6 },
  { x: 64, y: 88, s: 2, dur: 4.6, del: 0.7 },
  { x: 57, y: 36, s: 2, dur: 3.5, del: 2.4 },
  { x: 40, y: 85, s: 2, dur: 4.1, del: 1.2 },
  { x: 94, y: 16, s: 2, dur: 3.3, del: 0.5 },
] as const

export default function LandingPage() {
  const router = useRouter()
  const [opened, setOpened]   = useState(false)
  const [hint, setHint]       = useState(false)   // 힌트 문구 등장
  const [leaving, setLeaving] = useState(false)   // 전체 페이드아웃

  // 1.5초 뒤 힌트 문구 부드럽게 등장
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 1500)
    return () => clearTimeout(t)
  }, [])

  function open() {
    if (opened) return
    setOpened(true)
    // 씰 사라짐 → 플랩 열림 → 편지 올라옴 (약 1.5s) → 페이드아웃 → 이동
    setTimeout(() => setLeaving(true), 1500)
    setTimeout(() => router.push('/invitation'), 2100)
  }

  return (
    <>
      <style>{`
        @keyframes land-twinkle {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 0.2; }
        }
        @keyframes land-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes hint-pulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.9; }
        }
        .land-star  { animation: land-twinkle var(--dur) ease-in-out var(--del) infinite; }
        .land-float { animation: land-float 4.5s ease-in-out infinite; }
        .land-hint  { animation: hint-pulse 2.4s ease-in-out infinite; }

        /* ── 봉투 ──────────────────────────────────────────── */
        .env-wrap { position: relative; width: 272px; height: 182px; perspective: 1100px; }

        .env-back {
          position: absolute; inset: 0; border-radius: 7px;
          background: var(--color-kraft);
          box-shadow: 0 22px 44px rgba(31,31,31,0.16), inset 0 1px 0 rgba(255,255,255,0.25);
        }
        /* 편지 — 봉투 안에 꽂혀 있다가(닫힘 땐 완전히 숨음) 탭하면 위로 올라옴 */
        .env-letter {
          position: absolute; left: 9%; top: 6%; width: 82%; height: 88%;
          background: var(--color-warm-white); border-radius: 5px; z-index: 2;
          box-shadow: 0 6px 18px rgba(0,0,0,0.10);
          display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
          padding-top: 16px;
          transform: translateY(0);
          transition: transform 1.0s cubic-bezier(0.22,1,0.36,1) 0.5s;
        }
        .opened .env-letter { transform: translateY(-74%); }

        /* 앞 주머니 — 편지의 아래·옆을 덮어 '꽂힌' 느낌 (상단은 V자로 열림) */
        .env-front {
          position: absolute; inset: 0; z-index: 3; border-radius: 7px;
          background: linear-gradient(150deg, var(--color-kraft) 0%, var(--color-kraft-dark) 100%);
          clip-path: polygon(0 0, 50% 47%, 100% 0, 100% 100%, 0 100%);
        }
        /* 앞 주머니 대각 솔기 음영 */
        .env-front::after {
          content: ''; position: absolute; inset: 0;
          background:
            linear-gradient(to bottom right, transparent 49.6%, rgba(31,31,31,0.07) 50%, transparent 50.4%),
            linear-gradient(to bottom left,  transparent 49.6%, rgba(31,31,31,0.07) 50%, transparent 50.4%);
        }
        /* 윗 플랩 — 닫힘(아래 삼각) → 탭하면 뒤로 180° 열림 */
        .env-flap {
          position: absolute; left: 0; top: 0; width: 100%; height: 53%; z-index: 4;
          background: linear-gradient(to bottom, var(--color-kraft-dark) 0%, var(--color-kraft) 100%);
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform-origin: top center; transform: rotateX(0deg);
          transition: transform 0.7s ease 0.25s, z-index 0s linear 0.6s;
          box-shadow: 0 2px 6px rgba(31,31,31,0.08);
        }
        .opened .env-flap { transform: rotateX(176deg); z-index: 1; }

        /* 왁스 씰 — 플랩 꼭지점(중앙) */
        .env-seal {
          position: absolute; left: 50%; top: 45%; transform: translate(-50%,-50%);
          width: 48px; height: 48px; border-radius: 50%; z-index: 5;
          background: radial-gradient(circle at 35% 30%, #D8B577 0%, var(--color-gold) 45%, #8F6E45 100%);
          box-shadow: 0 3px 9px rgba(31,31,31,0.28), inset 0 1px 2px rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .env-seal span { color: var(--color-warm-white); font-size: 18px; opacity: 0.85; }
        .opened .env-seal { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }

        @media (prefers-reduced-motion: reduce) {
          .land-star, .land-float, .land-hint { animation: none; }
          .env-letter, .env-flap, .env-seal { transition-duration: 0.01s; }
        }
      `}</style>

      <main
        onClick={open}
        role="button"
        tabIndex={0}
        aria-label="초대장 열기"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open() }}
        className="relative flex w-full flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
        style={{
          height: '100dvh',
          backgroundColor: 'var(--color-warm-white)',
          backgroundImage:
            'radial-gradient(130% 90% at 50% 40%, #FFFFFF 0%, var(--color-warm-white) 55%, #F0EADE 100%)',
          opacity: leaving ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* 별빛 */}
        {STARS.map((st, i) => (
          <span
            key={i}
            className="land-star pointer-events-none absolute rounded-full"
            style={{
              left: `${st.x}%`, top: `${st.y}%`,
              width: st.s, height: st.s,
              backgroundColor: 'var(--color-gold)',
              boxShadow: '0 0 6px var(--color-gold)',
              ['--dur' as string]: `${st.dur}s`,
              ['--del' as string]: `${st.del}s`,
            }}
          />
        ))}

        {/* 초승달 (골드) */}
        <svg
          className="pointer-events-none absolute"
          style={{ left: '76%', top: '13%', filter: 'drop-shadow(0 0 8px rgba(184,149,106,0.45))' }}
          width="46" height="46" viewBox="0 0 46 46" aria-hidden="true"
        >
          <defs>
            <mask id="land-moon">
              <rect width="46" height="46" fill="#000" />
              <circle cx="23" cy="23" r="16" fill="#fff" />
              <circle cx="30" cy="19" r="14" fill="#000" />
            </mask>
          </defs>
          <rect width="46" height="46" fill="var(--color-gold)" mask="url(#land-moon)" />
        </svg>

        {/* 상단 안내 문구 */}
        <p
          className="font-sans absolute text-center text-charcoal/70"
          style={{ top: '20%', fontSize: 15, letterSpacing: '0.14em', lineHeight: 1.9 }}
        >
          두 사람의 초대가
          <br />
          도착했습니다
        </p>

        {/* 봉투 */}
        <div className={`land-float ${opened ? 'opened' : ''}`}>
          <div className="env-wrap">
            <div className="env-back" />
            <div className="env-letter">
              <span className="text-gold" style={{ fontSize: 13, letterSpacing: '0.1em' }}>✦</span>
              <p className="font-serif text-charcoal" style={{ marginTop: 6, fontSize: 15, letterSpacing: '0.12em' }}>
                YUJEONG <span className="text-gold">·</span> JAEKEUN
              </p>
            </div>
            <div className="env-front" />
            <div className="env-flap" />
            <div className="env-seal"><span>✦</span></div>
          </div>
        </div>

        {/* 하단 힌트 문구 — 1.5초 뒤 등장 */}
        <p
          className={`font-sans absolute text-center text-charcoal/50 ${hint && !opened ? 'land-hint' : ''}`}
          style={{
            bottom: '16%', fontSize: 12.5, letterSpacing: '0.22em',
            opacity: hint && !opened ? undefined : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          살며시 열어보세요
        </p>
      </main>
    </>
  )
}
