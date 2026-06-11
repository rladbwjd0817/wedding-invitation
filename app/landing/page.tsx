'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dancing_Script } from 'next/font/google'
import Image from 'next/image'

const dancing = Dancing_Script({ subsets: ['latin'], weight: ['700'] })

const FULL_TEXT = 'We are Married'

export default function LandingPage() {
  const router = useRouter()
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      index += 1
      setDisplayed(FULL_TEXT.slice(0, index))
      if (index >= FULL_TEXT.length) {
        clearInterval(timer)
        // 타이핑 완료 → 커서 숨김 → 2초 대기 → 페이드아웃 → 이동
        setShowCursor(false)
        setTimeout(() => {
          setOpacity(0)
          setTimeout(() => { router.push('/invitation') }, 600)
        }, 2000)
      }
    }, 150)

    return () => clearInterval(timer)
  }, [router])

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .cursor { animation: blink 0.8s ease-in-out infinite; }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        style={{ height: '100dvh', opacity, transition: 'opacity 0.6s ease' }}
      >
        {/* 배경 사진 */}
        <Image
          src="/images/gallery/landing.jpg"
          alt="웨딩 사진"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />

        {/* 어두운 오버레이 */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        />

        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className={dancing.className}
            style={{ color: '#FAF8F3', fontSize: 48, letterSpacing: '0.02em' }}
          >
            {displayed}
            {showCursor && <span className="cursor">|</span>}
          </p>
        </div>
      </div>
    </>
  )
}
