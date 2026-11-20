'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 종이 섬유 그레인 (feTurbulence) — 질감 오버레이용 데이터 URI
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

// 4각 반짝임 별 (얇은 광선) path
const SPARKLE = 'M12 1 C12.6 7.6 16.4 11.4 23 12 C16.4 12.6 12.6 16.4 12 23 C11.4 16.4 7.6 12.6 1 12 C7.6 11.4 11.4 7.6 12 1 Z'

// 배경에 아주 은은한 금빛 반짝임 몇 개 (고정값 — 하이드레이션 방지)
const BG_SPARKLES = [
  { x: 16, y: 24, s: 13, dur: 4.2, del: 0.0, op: 0.35 },
  { x: 85, y: 30, s: 10, dur: 3.6, del: 1.3, op: 0.3 },
  { x: 22, y: 70, s: 9,  dur: 4.8, del: 0.7, op: 0.28 },
  { x: 80, y: 74, s: 12, dur: 4.0, del: 2.0, op: 0.3 },
] as const

export default function LandingPage() {
  const router = useRouter()
  const [opened, setOpened]   = useState(false)
  const [hint, setHint]       = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHint(true), 1500)
    return () => clearTimeout(t)
  }, [])

  function open() {
    if (opened) return
    setOpened(true)
    // 씰 깨짐 → 플랩 3D 개봉 → 카드가 그림자 끌며 빠져나옴 → 페이드 → 이동
    setTimeout(() => setLeaving(true), 1950)
    setTimeout(() => router.push('/invitation'), 2550)
  }

  return (
    <>
      {/* ── 공용 SVG 정의 (금박 그라데이션 · 데클 엣지 필터) ───────────────────── */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0"    stopColor="#ECD6A4" />
            <stop offset="0.4"  stopColor="#C9A25C" />
            <stop offset="0.66" stopColor="#E7CF8C" />
            <stop offset="1"    stopColor="#A67D3C" />
          </linearGradient>
          <radialGradient id="sealSheen" cx="38%" cy="32%" r="75%">
            <stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1"   stopColor="#5A4A30" stopOpacity="0.18" />
          </radialGradient>
          <filter id="deckle">
            <feTurbulence type="fractalNoise" baseFrequency="0.013 0.02" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes land-twinkle { 0%,100% { opacity: var(--op); } 50% { opacity: 0.08; } }
        @keyframes land-float   { 0%,100% { transform: translateY(0) rotate(-0.4deg); } 50% { transform: translateY(-5px) rotate(0.4deg); } }
        @keyframes hint-pulse   { 0%,100% { opacity: 0.45; } 50% { opacity: 0.85; } }

        .land-spark { animation: land-twinkle var(--dur) ease-in-out var(--del) infinite; }
        .land-float { animation: land-float 5s ease-in-out infinite; }
        .land-hint  { animation: hint-pulse 2.6s ease-in-out infinite; }

        /* 종이 질감 — 요소 위에 그레인을 곱하기 합성 */
        .paper::after {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background-image: ${NOISE}; background-size: 140px 140px;
          mix-blend-mode: multiply; opacity: 0.5; pointer-events: none;
          -webkit-clip-path: inherit; clip-path: inherit;
        }

        /* ── 봉투 ──────────────────────────────────────────── */
        .env-wrap { position: relative; width: 274px; height: 186px; perspective: 1200px; }

        .env-shadow {
          position: absolute; inset: 0; border-radius: 6px;
          box-shadow: 0 26px 50px rgba(31,31,31,0.18);
          transition: box-shadow 0.9s ease;
        }
        .opened .env-shadow { box-shadow: 0 40px 70px rgba(31,31,31,0.26); }

        .env-back {
          position: absolute; inset: 0; border-radius: 6px;
          background: var(--color-kraft);
          filter: url(#deckle);
        }

        /* 카드(편지) — 데클 엣지 + 종이 질감, 닫힘 땐 봉투 안에 숨음 */
        .env-letter {
          position: absolute; left: 9%; top: 5%; width: 82%; height: 90%;
          background: var(--color-warm-white); z-index: 2; border-radius: 3px;
          filter: url(#deckle);
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
          transform: translateY(0) scale(1);
          transition: transform 1.0s cubic-bezier(0.22,1,0.36,1) 0.75s;
        }
        .opened .env-letter { transform: translateY(-78%) scale(1.04); }
        .letter-inner {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start; padding-top: 18px; gap: 7px;
        }

        /* 앞 주머니 — 편지 아래·옆을 덮음(상단 V자 개방) */
        .env-front {
          position: absolute; inset: 0; z-index: 3; border-radius: 6px;
          background: linear-gradient(158deg, var(--color-kraft) 0%, var(--color-kraft-dark) 100%);
          clip-path: polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%);
        }
        .env-front::before {
          content: ''; position: absolute; inset: 0;
          background:
            linear-gradient(to bottom right, transparent 49.5%, rgba(31,31,31,0.08) 50%, transparent 50.5%),
            linear-gradient(to bottom left,  transparent 49.5%, rgba(31,31,31,0.08) 50%, transparent 50.5%);
        }

        /* 금실 (봉투를 감은 가는 금선 몇 가닥) */
        .env-string {
          position: absolute; left: -2%; width: 104%; top: 44%; height: 9px; z-index: 4;
          background: repeating-linear-gradient(to bottom,
            transparent 0 2.5px,
            rgba(184,149,106,0.75) 2.5px 3.2px,
            transparent 3.2px 4px);
          transition: opacity 0.4s ease;
        }
        .opened .env-string { opacity: 0; }

        /* 윗 플랩 — 3D 개봉 */
        .env-flap {
          position: absolute; left: 0; top: 0; width: 100%; height: 52%; z-index: 5;
          transform-origin: top center; transform: rotateX(0deg);
          transition: transform 0.85s cubic-bezier(0.6,0,0.3,1) 0.3s, z-index 0s linear 0.7s;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
        .flap-face {
          position: absolute; inset: 0; clip-path: inherit;
          background: linear-gradient(to bottom, var(--color-kraft-dark) 0%, var(--color-kraft) 92%);
          box-shadow: 0 2px 5px rgba(31,31,31,0.10);
          transition: filter 0.85s ease 0.3s;
        }
        .opened .env-flap { transform: rotateX(172deg); z-index: 1; }
        .opened .flap-face { filter: brightness(0.82); }  /* 젖혀지며 안쪽 그늘 */

        /* 왁스 씰 */
        .env-seal {
          position: absolute; left: 50%; top: 44%; transform: translate(-50%,-50%);
          width: 58px; height: 58px; z-index: 6;
          transition: opacity 0.4s ease, transform 0.4s ease;
          filter: drop-shadow(0 3px 6px rgba(31,31,31,0.25));
        }
        .opened .env-seal { opacity: 0; transform: translate(-50%,-50%) scale(0.45) rotate(-12deg); }

        @media (prefers-reduced-motion: reduce) {
          .land-spark, .land-float, .land-hint { animation: none; }
          .env-letter, .env-flap, .env-seal, .env-shadow, .flap-face { transition-duration: 0.01s; }
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
            'radial-gradient(135% 95% at 50% 42%, #FFFDFA 0%, var(--color-warm-white) 52%, #EFE8DC 100%)',
          opacity: leaving ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* 전체 종이 그레인 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: NOISE, backgroundSize: '150px 150px', mixBlendMode: 'multiply', opacity: 0.06 }}
        />

        {/* 배경 은은한 금빛 반짝임 */}
        {BG_SPARKLES.map((st, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="land-spark pointer-events-none absolute"
            style={{
              left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s,
              ['--dur' as string]: `${st.dur}s`, ['--del' as string]: `${st.del}s`, ['--op' as string]: st.op,
            }}
            aria-hidden="true"
          >
            <path d={SPARKLE} fill="url(#foil)" />
          </svg>
        ))}

        {/* 상단 구성 — 문구 둘레에 금박 달·별 배치 (레퍼런스 구도) */}
        <div className="absolute" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: 300, textAlign: 'center' }}>
          {/* 초승달 — 문구 우상단 */}
          <svg
            viewBox="0 0 48 48" width="42" height="42"
            className="absolute" style={{ right: 18, top: -20, filter: 'drop-shadow(0 1px 2px rgba(120,90,40,0.3))' }}
            aria-hidden="true"
          >
            <mask id="moonmask">
              <rect width="48" height="48" fill="#000" />
              <circle cx="24" cy="24" r="17" fill="#fff" />
              <circle cx="16" cy="21" r="15" fill="#000" />
            </mask>
            <rect width="48" height="48" fill="url(#foil)" mask="url(#moonmask)" />
          </svg>
          {/* 반짝임 — 문구 좌상단(큰 것), 우하단(작은 것) */}
          <svg viewBox="0 0 24 24" width="20" height="20" className="absolute" style={{ left: 40, top: -8 }} aria-hidden="true">
            <path d={SPARKLE} fill="url(#foil)" />
          </svg>
          <svg viewBox="0 0 24 24" width="13" height="13" className="absolute" style={{ right: 66, bottom: -22 }} aria-hidden="true">
            <path d={SPARKLE} fill="url(#foil)" />
          </svg>

          <p
            className="font-sans text-charcoal/75"
            style={{ fontSize: 15, letterSpacing: '0.16em', lineHeight: 2.0 }}
          >
            두 사람의 초대가
            <br />
            도착했습니다
          </p>
        </div>

        {/* 봉투 */}
        <div className={`land-float ${opened ? 'opened' : ''}`} style={opened ? { animation: 'none' } : undefined}>
          <div className="env-wrap">
            <div className="env-shadow" />
            <div className="env-back paper" />
            <div className="env-letter paper">
              <div className="letter-inner">
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                  <path d={SPARKLE} fill="url(#foil)" />
                </svg>
                <p className="font-serif text-charcoal" style={{ fontSize: 15, letterSpacing: '0.14em' }}>
                  YUJEONG <span className="text-gold">·</span> JAEKEUN
                </p>
                <p className="font-sans text-charcoal/45" style={{ fontSize: 9.5, letterSpacing: '0.24em' }}>
                  2027 · 10 · 23
                </p>
              </div>
            </div>
            <div className="env-front" />
            <div className="env-string" />
            <div className="env-flap"><div className="flap-face" /></div>

            {/* 왁스 씰 — 반투명 + 금박 조각 */}
            <svg className="env-seal" viewBox="0 0 58 58" aria-hidden="true">
              <circle cx="29" cy="29" r="26" fill="rgba(206,190,164,0.52)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              <polygon points="24,22 31,19 34,26 28,31 21,28" fill="url(#foil)" opacity="0.92" />
              <polygon points="33,30 39,29 37,36 31,35" fill="url(#foil)" opacity="0.85" />
              <polygon points="20,33 26,34 24,39 19,37" fill="url(#foil)" opacity="0.8" />
              <circle cx="29" cy="29" r="26" fill="url(#sealSheen)" />
            </svg>
          </div>
        </div>

        {/* 하단 힌트 */}
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
