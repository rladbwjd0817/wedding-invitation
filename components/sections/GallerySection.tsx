'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface GallerySectionProps {
  images: string[]
}

// 이미지별 크롭 위치 — images prop 배열 순서와 동일
// 조정 필요 시 해당 인덱스 값만 수정
const OBJECT_POSITIONS = [
  'center center', // 01
  'center center', // 02
  'center center', // 03
  'center center', // 04
  'center top',    // 05
  'center center', // 06
  'left center',   // 07
  'center center', // 08
  'left center',   // 09
]

export default function GallerySection({ images }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const touchStartX = useRef<number>(0)

  const isOpen = selectedIndex !== null
  const total = images.length

  function open(index: number) { setSelectedIndex(index) }
  function close() { setSelectedIndex(null) }
  function prev() { setSelectedIndex(i => i !== null ? (i - 1 + total) % total : null) }
  function next() { setSelectedIndex(i => i !== null ? (i + 1) % total : null) }

  // 키보드 네비게이션
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // 터치 스와이프
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx > 50)  prev()
    if (dx < -50) next()
  }

  return (
    <section className="bg-warm-white">
      {/* 섹션 제목 */}
      <div className="pt-10 pb-6 text-center">
        <h2 className="font-serif text-2xl text-gold tracking-wide">Gallery</h2>
        <p className="font-sans text-xs text-gold/60 mt-1 tracking-[0.12em]">우리의 순간들</p>
      </div>

      {/* 3×3 그리드 — 좌우 여백 없이 꽉 차게 */}
      <div className="grid grid-cols-3 gap-[3px] pb-10">
        {images.map((src, i) => (
          <button
            key={i}
            className="relative aspect-square overflow-hidden block w-full"
            onClick={() => open(i)}
            aria-label={`사진 ${i + 1} 확대보기`}
          >
            <Image
              src={src}
              alt={`웨딩 사진 ${i + 1}`}
              fill
              quality={90}
              sizes="(max-width: 768px) 33vw, 25vw"
              style={{
                objectFit: 'cover',
                objectPosition: OBJECT_POSITIONS[i] ?? 'center center',
              }}
            />
          </button>
        ))}
      </div>

      {/* 라이트박스 */}
      {isOpen && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* 닫기 */}
          <button
            className="absolute top-4 right-4 text-warm-white/70 w-10 h-10 flex items-center justify-center text-xl"
            onClick={(e) => { e.stopPropagation(); close() }}
            aria-label="닫기"
          >
            ✕
          </button>

          {/* 카운터 */}
          <p className="absolute top-4 left-1/2 -translate-x-1/2 font-sans text-xs text-warm-white/60 tracking-widest">
            {selectedIndex + 1} / {total}
          </p>

          {/* 이전 화살표 */}
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-warm-white/80"
            style={{ backgroundColor: 'rgba(31,31,31,0.55)' }}
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="이전 사진"
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 이미지 */}
          <div
            className="relative w-[90vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex]}
              alt={`웨딩 사진 ${selectedIndex + 1}`}
              fill
              quality={90}
              sizes="90vw"
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* 다음 화살표 */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-warm-white/80"
            style={{ backgroundColor: 'rgba(31,31,31,0.55)' }}
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="다음 사진"
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
