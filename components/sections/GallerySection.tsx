'use client'

import { useState } from 'react'
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
  const [selected, setSelected] = useState<string | null>(null)

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
            onClick={() => setSelected(src)}
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

      {/* 라이트박스 — 탭하면 전체화면 확대 */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-warm-white/80 w-10 h-10 flex items-center justify-center text-2xl leading-none"
            onClick={() => setSelected(null)}
            aria-label="닫기"
          >
            ✕
          </button>
          {/* fill 사용 시 부모에 명시적 크기 필요 — 뷰포트 90%×80% 컨테이너 */}
          <div
            className="relative w-[90vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected}
              alt="확대 이미지"
              fill
              quality={90}
              sizes="(max-width: 768px) 33vw, 25vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
