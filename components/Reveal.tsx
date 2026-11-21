'use client'

import { useEffect, useRef, useState } from 'react'

// 스크롤 리빌 — 섹션이 화면에 들어오면 아래에서 위로 은은히 떠오르며 페이드인.
// 양방향: 화면을 벗어나면 다시 숨고, 들어올 때마다(위로 다시 스크롤 포함) 재생된다.
//
// 주의: '보일 때'는 transform을 'none'으로 둔다(translateY(0)이 아님).
// 조상에 transform이 남아 있으면 자식의 position:fixed(모달/토스트)가
// 그 조상 기준으로 잡혀 전체화면 오버레이가 깨지기 때문.
// none ↔ translateY 전환도 정상적으로 애니메이션된다.
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
  const [inView, setInView] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 모션 최소화 설정이면 애니메이션 없이 항상 표시
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduce(true)
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.15, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(16px)',
        transition: reduce
          ? 'none'
          : `opacity 0.85s ease ${delay}ms, transform 0.95s cubic-bezier(0.33,1,0.68,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
