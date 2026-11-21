'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 실제 종이 텍스처 (ambientCG · CC0) — public/images/landing/textures
const KRAFT  = '/images/landing/textures/kraft-paper.jpg'
const COTTON = '/images/landing/textures/cotton-paper.jpg'

// 페이지 전체 미세 그레인
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

const SPARKLE = 'M12 1 C12.6 7.6 16.4 11.4 23 12 C16.4 12.6 12.6 16.4 12 23 C11.4 16.4 7.6 12.6 1 12 C7.6 11.4 11.4 7.6 12 1 Z'

const BG_SPARKLES = [
  { x: 16, y: 24, s: 13, dur: 4.2, del: 0.0, op: 0.33 },
  { x: 85, y: 30, s: 10, dur: 3.6, del: 1.3, op: 0.28 },
  { x: 22, y: 70, s: 9,  dur: 4.8, del: 0.7, op: 0.26 },
  { x: 80, y: 74, s: 12, dur: 4.0, del: 2.0, op: 0.28 },
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
    setTimeout(() => setLeaving(true), 1950)
    setTimeout(() => router.push('/invitation'), 2550)
  }

  return (
    <>
      {/* ── 공용 SVG 정의 (금박 그라데이션 · 데클 엣지 · 씰 불규칙 엣지) ─────────── */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0"    stopColor="#ECD6A4" />
            <stop offset="0.4"  stopColor="#C9A25C" />
            <stop offset="0.66" stopColor="#E7CF8C" />
            <stop offset="1"    stopColor="#A67D3C" />
          </linearGradient>
          <radialGradient id="sealSheen" cx="38%" cy="32%" r="75%">
            <stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1"   stopColor="#5A4A30" stopOpacity="0.2" />
          </radialGradient>
          {/* 종이 찢긴 가장자리 */}
          <filter id="deckle">
            <feTurbulence type="fractalNoise" baseFrequency="0.013 0.02" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* 왁스 씰 유기적 가장자리 */}
          <filter id="wax">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
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

        /* ── 봉투 ──────────────────────────────────────────── */
        .env-wrap { position: relative; width: 278px; height: 190px; perspective: 1200px; }

        /* 자연광 드롭섀도 (별도 레이어 — 데클 필터 영향 안 받게) */
        .env-shadow {
          position: absolute; left: 3%; right: 3%; top: 6%; bottom: 2%; border-radius: 8px;
          box-shadow: 0 24px 46px rgba(60,48,32,0.22), 0 8px 18px rgba(60,48,32,0.14);
          transition: box-shadow 0.9s ease, transform 0.9s ease;
        }
        .opened .env-shadow { box-shadow: 0 42px 72px rgba(60,48,32,0.3), 0 12px 26px rgba(60,48,32,0.18); }

        /* 봉투 뒷면 (크라프트 종이) */
        .env-back {
          position: absolute; inset: 0; border-radius: 5px;
          background: url(${KRAFT}) center/cover no-repeat;
          filter: url(#deckle);
        }

        /* 초대장 카드 (코튼 종이) — 닫힘 땐 봉투 안에 숨음 */
        .env-letter {
          position: absolute; left: 8%; top: 7%; width: 84%; height: 80%;
          background: url(${COTTON}) center/cover no-repeat, var(--color-warm-white);
          z-index: 2; border-radius: 2px;
          filter: url(#deckle) drop-shadow(0 5px 9px rgba(60,48,32,0.14));
          transform: translateY(0) scale(1);
          transition: transform 1.0s cubic-bezier(0.22,1,0.36,1) 0.75s;
        }
        .opened .env-letter { transform: translateY(-80%) scale(1.04); }
        .letter-inner {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start; padding-top: 20px; gap: 7px;
        }

        /* 앞 주머니 (크라프트 + 접힘 음영) — 편지 아래·옆을 덮음 */
        .env-front {
          position: absolute; inset: 0; z-index: 3; border-radius: 5px;
          background:
            linear-gradient(158deg, rgba(60,48,32,0) 42%, rgba(60,48,32,0.14) 100%),
            url(${KRAFT}) 30% 60%/cover no-repeat;
          clip-path: polygon(0 0, 50% 47%, 100% 0, 100% 100%, 0 100%);
        }
        /* 대각 접힘 솔기 + 종이 두께 하이라이트 */
        .env-front::before {
          content: ''; position: absolute; inset: 0;
          background:
            linear-gradient(to bottom right, transparent 49.3%, rgba(60,48,32,0.16) 49.8%, rgba(255,250,240,0.25) 50.2%, transparent 50.7%),
            linear-gradient(to bottom left,  transparent 49.3%, rgba(60,48,32,0.16) 49.8%, rgba(255,250,240,0.25) 50.2%, transparent 50.7%);
        }

        /* 금실 몇 가닥 */
        .env-string {
          position: absolute; left: -2%; width: 104%; top: 45%; height: 9px; z-index: 4;
          background: repeating-linear-gradient(to bottom,
            transparent 0 2.6px,
            rgba(184,149,106,0.7) 2.6px 3.2px,
            transparent 3.2px 4.2px);
          filter: drop-shadow(0 1px 1px rgba(60,48,32,0.25));
          transition: opacity 0.4s ease;
        }
        .opened .env-string { opacity: 0; }

        /* 윗 플랩 — 3D 개봉 */
        .env-flap {
          position: absolute; left: 0; top: 0; width: 100%; height: 53%; z-index: 5;
          transform-origin: top center; transform: rotateX(0deg);
          transition: transform 0.85s cubic-bezier(0.6,0,0.3,1) 0.3s, z-index 0s linear 0.7s;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
        .flap-face {
          position: absolute; inset: 0; clip-path: inherit;
          background:
            linear-gradient(to bottom, rgba(255,250,240,0.12) 0%, rgba(60,48,32,0) 30%, rgba(60,48,32,0.12) 100%),
            url(${KRAFT}) 60% 20%/cover no-repeat;
          filter: brightness(1.02);
          transition: filter 0.85s ease 0.3s;
        }
        /* 플랩 아래 꼭지(접힘 능선) 하이라이트로 종이 두께감 */
        .flap-face::after {
          content: ''; position: absolute; inset: 0; clip-path: inherit;
          background: linear-gradient(to bottom, transparent 86%, rgba(255,250,240,0.35) 93%, transparent 97%);
        }
        .opened .env-flap { transform: rotateX(172deg); z-index: 1; }
        .opened .flap-face { filter: brightness(0.78); }

        /* 왁스 씰 */
        .env-seal {
          position: absolute; left: 50%; top: 45%; transform: translate(-50%,-50%);
          width: 60px; height: 60px; z-index: 6;
          transition: opacity 0.4s ease, transform 0.4s ease;
          filter: url(#wax) drop-shadow(0 3px 6px rgba(60,48,32,0.3));
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
        {/* 페이지 전체 미세 그레인 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px', mixBlendMode: 'multiply', opacity: 0.05 }}
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

        {/* 상단 구성 — 문구 둘레에 금박 달·별 */}
        <div className="absolute" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: 300, textAlign: 'center' }}>
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
          <svg viewBox="0 0 24 24" width="20" height="20" className="absolute" style={{ left: 40, top: -8 }} aria-hidden="true">
            <path d={SPARKLE} fill="url(#foil)" />
          </svg>
          <svg viewBox="0 0 24 24" width="13" height="13" className="absolute" style={{ right: 66, bottom: -22 }} aria-hidden="true">
            <path d={SPARKLE} fill="url(#foil)" />
          </svg>

          <p className="font-sans text-charcoal/75" style={{ fontSize: 15, letterSpacing: '0.16em', lineHeight: 2.0 }}>
            두 사람의 초대가
            <br />
            도착했습니다
          </p>
        </div>

        {/* 봉투 */}
        <div className={`land-float ${opened ? 'opened' : ''}`} style={opened ? { animation: 'none' } : undefined}>
          <div className="env-wrap">
            <div className="env-shadow" />
            <div className="env-back" />
            <div className="env-letter">
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
            <svg className="env-seal" viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="27" fill="rgba(206,190,164,0.5)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <polygon points="25,22 32,19 35,27 29,32 22,29" fill="url(#foil)" opacity="0.92" />
              <polygon points="34,31 40,30 38,37 32,36" fill="url(#foil)" opacity="0.85" />
              <polygon points="21,34 27,35 25,40 20,38" fill="url(#foil)" opacity="0.8" />
              <circle cx="30" cy="30" r="27" fill="url(#sealSheen)" />
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
