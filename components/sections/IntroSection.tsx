// 전갈자리 별 좌표 — viewBox 0 0 440 240 기준
// glow: 'antares' | 'medium' | 'small' — 글로우 강도 구분
const STARS: readonly { cx: number; cy: number; r: number; color: string; glow: 'antares' | 'medium' | 'small' }[] = [
  // ── Antares (심장, 제일 밝은 별) — 골드 강조 [인덱스 0] ──────────────
  { cx: 240, cy: 135, r: 9.0 * 2.5 * 0.7, color: '#D4A843', glow: 'antares' }, // Antares

  // ── 머리 / 집게발 영역 (Antares 왼쪽) [인덱스 1-3] ──────────────────
  { cx: 160, cy:  95, r: 5.0 * 1.8 * 0.8, color: '#F0C96A', glow: 'medium'  }, // 별 1
  { cx: 100, cy: 115, r: 4.0 * 1.8 * 0.8, color: '#B8892A', glow: 'medium'  }, // 별 2
  { cx:  50, cy: 145, r: 4.5 * 1.8 * 0.8, color: '#FFDD88', glow: 'medium'  }, // 별 3

  // ── 몸통 (Antares 아래쪽) [인덱스 4-5] ──────────────────────────────
  { cx: 180, cy: 165, r: 3.5 * 1.8 * 0.8, color: '#F2C4A0', glow: 'small'   }, // 별 4
  { cx: 220, cy: 205, r: 3.0 * 1.8 * 0.8, color: '#E8B49A', glow: 'small'   }, // 별 5

  // ── 꼬리 곡선 (오른쪽으로 휘며 올라감) [인덱스 6-8] ─────────────────
  { cx: 280, cy: 225, r: 3.5 * 1.8 * 0.8, color: '#F0C0A8', glow: 'small'   }, // 별 6
  { cx: 330, cy: 195, r: 4.0 * 1.8 * 0.8, color: '#D4A843', glow: 'medium'  }, // 별 7
  { cx: 370, cy: 155, r: 3.5 * 1.8 * 0.8, color: '#B8892A', glow: 'small'   }, // 별 8

  // ── 꼬리 끝 (Shaula 영역) [인덱스 9-11] ─────────────────────────────
  { cx: 390, cy: 105, r: 5.0 * 1.8 * 0.8, color: '#E8B49A', glow: 'medium'  }, // 별 9 — 밝은 꼬리별
  { cx: 380, cy:  55, r: 4.0 * 1.8 * 0.7, color: '##F2C4A0', glow: 'medium'  }, // 별 10
  { cx: 360, cy:  15, r: 3.0 * 1.8 * 0.8, color: '#B8892A', glow: 'small'   }, // 별 11
]

const GLOW: Record<'antares' | 'medium' | 'small', string> = {
  antares: 'drop-shadow(0 0 10px #FFE99A) drop-shadow(0 0 20px #D4A843)',
  medium:  'drop-shadow(0 0 5px #FFE99A)',
  small:   'drop-shadow(0 0 2px #F0C96A)',
}

// 별 연결 순서: 별1→별2→별3→Antares→별4→별5→별6→별7→별8→별9→별10→별11
const LINE_PATH = [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11]
  .map((i, seq) => `${seq === 0 ? 'M' : 'L'} ${STARS[i].cx} ${STARS[i].cy}`)
  .join(' ')

// 5각별 polygon 좌표 생성 — 외곽 반지름 r, 내부 반지름 r * 0.42
function starPolygon(cx: number, cy: number, r: number): string {
  const inner = r * 0.42
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : inner
    const angle = (i * Math.PI) / 5 - Math.PI / 2
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')
}

export default function IntroSection() {
  return (
    <section className="pt-16 pb-14 bg-[#EEE9E1]">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .star-twinkle {
          animation-name: twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-duration: var(--dur);
          animation-delay: var(--del);
        }
        @media (prefers-reduced-motion: reduce) {
          .star-twinkle { animation: none; }
        }
      `}</style>

      <div className="px-4">
        <svg
          viewBox="0 0 440 240"
          className="w-full"
          role="img"
          aria-label="전갈자리 별자리"
        >
          {/* 연결선 — 별 뒤에 깔리도록 먼저 렌더링 */}
          <path
            d={LINE_PATH}
            stroke="#F0C96A"
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {STARS.map((star, i) => (
            <polygon
              key={i}
              points={starPolygon(star.cx, star.cy, star.r)}
              fill={star.color}
              className="star-twinkle"
              style={{
                '--dur': `${(3 + (i % 5) * 0.3).toFixed(1)}s`,
                '--del': `${((i * 0.37) % 5).toFixed(2)}s`,
                filter: GLOW[star.glow],
              } as React.CSSProperties}
            />
          ))}
        </svg>
      </div>

      {/* 이름 · 날짜 */}
      <div className="mt-10 px-6 text-center">
        <p className="font-serif text-3xl text-charcoal tracking-wide">
          YUJEONG <span className="text-gold">·</span> JAEKEUN
        </p>
        <p className="mt-3 font-sans text-xs tracking-[0.2em] text-charcoal/50">
          2027. 10. 23. SAT
        </p>
      </div>
    </section>
  )
}
