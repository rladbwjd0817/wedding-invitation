// 재사용 가능한 5각별 컴포넌트 (섹션 간 모티프 연결용)
// 부모에서 className으로 실제 크기 제어 (예: className="w-5 h-5")
// viewBox 중심 (0,0) 고정, 외곽 반지름 10 기준으로 내부 계산

interface StarProps {
  color?: string
  delay?: number    // 애니메이션 시작 딜레이 (초)
  duration?: number // 애니메이션 한 사이클 (초)
  className?: string
}

const r = 10
const inner = r * 0.42
const POINTS = Array.from({ length: 10 }, (_, i) => {
  const radius = i % 2 === 0 ? r : inner
  const angle = (i * Math.PI) / 5 - Math.PI / 2
  return `${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`
}).join(' ')

export default function Star({
  color = '#B8956A',
  delay = 0,
  duration = 3.5,
  className,
}: StarProps) {
  return (
    <svg viewBox="-11 -11 22 22" className={className} aria-hidden="true">
      <style>{`
        @keyframes star-breathe {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .star-breathe {
          animation: star-breathe var(--dur) ease-in-out infinite;
          animation-delay: var(--del);
        }
        @media (prefers-reduced-motion: reduce) {
          .star-breathe { animation: none; }
        }
      `}</style>
      <polygon
        points={POINTS}
        fill={color}
        className="star-breathe"
        style={{
          '--dur': `${duration}s`,
          '--del': `${delay}s`,
        } as React.CSSProperties}
      />
    </svg>
  )
}
