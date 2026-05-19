// 레무니스케이트(∞) 매개변수 방정식으로 사전 계산한 별 좌표
// x(t) = 200 + 125√2 · cos(t) / (1 + sin²t)
// y(t) = 100 + 125√2 · cos(t)·sin(t) / (1 + sin²t)
// viewBox 0 0 400 200 기준 (a=125, cx=200, cy=100)
//
// 좌표·크기·색 조정이 필요하면 이 배열만 수정하세요
const STARS: readonly { cx: number; cy: number; r: number; color: string }[] = [
  // ── 큰 별 (r 7.5) — 양 끝점 ─────────────────────────────────────────
  { cx: 377, cy: 100, r: 7.5, color: '#B8956A' }, // 오른쪽 끝    t = 0°
  { cx:  23, cy: 100, r: 7.5, color: '#9C7A4F' }, // 왼쪽 끝     t = 180°

  // ── 양 끝점 위아래 보강 (r 4) ───────────────────────────────────────
  { cx: 360, cy:  59, r: 4.0, color: '#E8A599' }, // 오른쪽 끝 위  t = 345°
  { cx: 360, cy: 141, r: 4.0, color: '#9C7A4F' }, // 오른쪽 끝 아래 t = 15°
  { cx:  40, cy:  59, r: 4.0, color: '#D4B896' }, // 왼쪽 끝 위   t = 165°
  { cx:  40, cy: 141, r: 4.0, color: '#B8956A' }, // 왼쪽 끝 아래  t = 195°

  // ── 교차점 강조 (r 3~5) — "두 사람이 만나는 지점" ────────────────────
  { cx: 200, cy: 100, r: 5.0, color: '#B8956A' }, // 교차점 정중앙  t = 90°
  { cx: 184, cy:  85, r: 3.0, color: '#FAF8F3' }, // 교차점 왼위   t ≈ 100°
  { cx: 216, cy: 115, r: 3.0, color: '#E8A599' }, // 교차점 오른아래 t ≈ 80°
  { cx: 175, cy:  75, r: 3.5, color: '#E8A599' }, // 교차점 위     t ≈ 106°
  { cx: 225, cy: 125, r: 3.5, color: '#D4B896' }, // 교차점 아래   t ≈ 74°
  // 교차점 보조 — 오른위·왼아래 방향 보강 (r 2~2.5, 기존보다 작게)
  { cx: 216, cy:  85, r: 2.5, color: '#D4B896' }, // 교차점 오른위  t ≈ 280°
  { cx: 184, cy: 115, r: 2.5, color: '#FAF8F3' }, // 교차점 왼아래  t ≈ 260°
  { cx: 232, cy:  70, r: 2.0, color: '#9C7A4F' }, // 교차점 오른위 더   t ≈ 290°
  { cx: 342, cy: 155, r: 2.0, color: '#B8956A' }, // 오른쪽 아래 바깥 빈 구간  t ≈ 22.5°
  // 곡선 빈 구간 보강 (r 1.8, 가장 작은 보조별)
  { cx: 342, cy:  45, r: 1.8, color: '#FAF8F3' }, // 오른쪽 위 곡선 빈 구간  t ≈ 337.5°
  { cx:  58, cy:  45, r: 1.8, color: '#E8A599' }, // 왼쪽 위 곡선 빈 구간   t ≈ 157.5°
  { cx: 266, cy: 152, r: 1.8, color: '#D4B896' }, // 오른쪽 아래 곡선 빈 구간 t ≈ 52.5°
  { cx: 145, cy:  53, r: 1.8, color: '#9C7A4F' }, // 왼쪽 위 안쪽 빈 구간   t ≈ 122°

  // ── 오른쪽 루프 (r 3.5~5) ────────────────────────────────────────────
  { cx: 322, cy:  39, r: 5.0, color: '#E8A599' }, // 오른쪽 위 바깥  t = 330°
  { cx: 322, cy: 161, r: 5.0, color: '#D4B896' }, // 오른쪽 아래 바깥 t = 30°
  { cx: 283, cy:  41, r: 4.5, color: '#D4B896' }, // 오른쪽 위 중간  t = 315°
  { cx: 283, cy: 159, r: 4.5, color: '#9C7A4F' }, // 오른쪽 아래 중간 t = 45°
  { cx: 251, cy:  56, r: 3.5, color: '#B8956A' }, // 오른쪽 위 안쪽  t = 300°

  // ── 왼쪽 루프 (r 3.5~5) ──────────────────────────────────────────────
  { cx:  78, cy:  39, r: 5.0, color: '#D4B896' }, // 왼쪽 위 바깥   t = 150°
  { cx:  78, cy: 161, r: 5.0, color: '#E8A599' }, // 왼쪽 아래 바깥  t = 210°
  { cx: 117, cy:  41, r: 4.5, color: '#B8956A' }, // 왼쪽 위 중간   t = 135°
  { cx: 117, cy: 159, r: 4.5, color: '#D4B896' }, // 왼쪽 아래 중간  t = 225°
  { cx: 150, cy: 144, r: 3.5, color: '#9C7A4F' }, // 왼쪽 아래 안쪽  t = 240°
]

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
      {/* 인피니티 별자리 SVG */}
      <div className="px-4">
        <svg
          viewBox="0 0 400 200"
          className="w-full"
          role="img"
          aria-label="인피니티 모양 별자리"
        >
          {STARS.map((star, i) => (
            <polygon
              key={i}
              points={starPolygon(star.cx, star.cy, star.r)}
              fill={star.color}
              className="star-twinkle"
              style={{
                '--dur': `${(3 + (i % 5) * 0.3).toFixed(1)}s`,
                '--del': `${((i * 0.37) % 5).toFixed(2)}s`,
              } as React.CSSProperties}
            />
          ))}
        </svg>
      </div>

      {/* 이름 · 날짜 */}
      <div className="mt-2 px-6 text-center">
        <p className="font-serif text-3xl text-charcoal tracking-wide">
          YUJEONG <span className="text-gold">·</span> JAEKEUN
        </p>
        <p className="mt-3 font-sans text-xs tracking-[0.2em] text-charcoal/50">
          2026. 9. 19. SAT
        </p>
      </div>
    </section>
  )
}
