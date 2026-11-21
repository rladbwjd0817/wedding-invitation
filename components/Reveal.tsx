'use client'

import { useEffect, useRef, useState } from 'react'

// 스크롤 리빌 — 요소가 화면에 들어오면 아래에서 위로 스르릉 떠오르며 페이드인.
// 한 번 나타나면 유지(되돌아가도 다시 숨지 않음).
//
// 주의: 애니메이션이 끝나면 transform을 'none'으로 완전히 제거한다.
// (자식에 position:fixed 모달/토스트가 있을 때, 조상에 transform이 남아 있으면
//  fixed가 그 조상 기준으로 잡혀 전체화면 오버레이가 깨지기 때문.)
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown]     = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 모션 최소화 설정이면 애니메이션 없이 즉시 표시
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      setSettled(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: settled ? 'none' : shown ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: settled ? 'auto' : 'opacity, transform',
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'transform' && shown) setSettled(true)
      }}
    >
      {children}
    </div>
  )
}
