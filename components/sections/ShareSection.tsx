'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    Kakao: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

const KAKAO_APP_KEY = 'ce0b7f577dbd7031221c5f63035179b4'

export default function ShareSection() {
  const [toast, setToast]         = useState(false)
  const [flowerModal, setFlower]  = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY)
      }
    }
    document.head.appendChild(script)

    return () => {
      const existing = document.querySelector('script[src*="kakao_js_sdk"]')
      if (existing) existing.remove()
    }
  }, [])

  function handleKakao() {
    if (!window.Kakao?.Share) return
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: 'YUJEONG · JAEKEUN',
        description: '2027. 10. 23. SAT 오후 12시 | 울산시티컨벤션',
        imageUrl: 'https://wedding-invitation-eight-dusky-18.vercel.app/images/landing/landing.jpg',
        link: {
          mobileWebUrl: 'https://wedding-invitation-eight-dusky-18.vercel.app',
          webUrl: 'https://wedding-invitation-eight-dusky-18.vercel.app',
        },
      },
    })
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText('https://wedding-invitation-eight-dusky-18.vercel.app')
    } catch { /* clipboard API 미지원 환경 */ }
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <footer className="bg-charcoal pt-6 pb-14">
      {/* 공유 버튼 */}
      <div className="flex items-center justify-center gap-6">
        {/* 카카오톡 공유 */}
        <button
          onClick={handleKakao}
          className="flex flex-col items-center gap-1.5"
          aria-label="카카오톡으로 공유"
        >
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FEE500' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path
                fill="#1F1F1F"
                d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.59 5.09 4 6.57V21l3.47-2.08A11.3 11.3 0 0 0 12 19c5.523 0 10-3.477 10-7.8S17.523 3 12 3Z"
              />
            </svg>
          </span>
          <span className="font-sans text-[10px] text-warm-white/40 tracking-wider">카카오톡</span>
        </button>

        {/* 구분선 */}
        <span className="w-px h-8 bg-warm-white/10" />

        {/* 링크 복사 */}
        <button
          onClick={handleCopy}
          className="flex flex-col items-center gap-1.5"
          aria-label="링크 복사"
        >
          <span className="w-10 h-10 rounded-full border-[0.5px] border-gold/40 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-gold/70" aria-hidden="true">
              <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M3 13V3h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-sans text-[10px] text-warm-white/40 tracking-wider">링크 복사</span>
        </button>
      </div>

      {/* 화환 보내기 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setFlower(true)}
          className="px-5 py-2 rounded-full border-[0.5px] border-gold/40 font-sans text-xs text-warm-white/50 tracking-wider transition-opacity hover:opacity-80"
        >
          💐 화환 보내기
        </button>
      </div>

      {/* 복사 완료 토스트 */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-gold text-warm-white font-sans text-xs tracking-wide whitespace-nowrap transition-opacity duration-300 ${
          toast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        복사되었습니다
      </div>

      {/* 화환 보내기 모달 */}
      {flowerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setFlower(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl px-6 py-8 relative"
            style={{ backgroundColor: '#2A2A2A', border: '0.5px solid #B8956A' }}
            onClick={e => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setFlower(false)}
              className="absolute top-4 right-4 text-warm-white/40 w-7 h-7 flex items-center justify-center text-base hover:text-warm-white/70 transition-colors"
              aria-label="닫기"
            >
              ✕
            </button>

            {/* 내용 */}
            <div className="text-center">
              <p className="text-2xl mb-4">💐</p>
              <h3 className="font-serif text-lg text-gold tracking-wide mb-2">
                화환 보내기
              </h3>
              <p className="font-sans text-xs text-warm-white/55 leading-relaxed mb-8">
                두 분의 결혼을 꽃으로 축하해주세요
              </p>
              <a
                href="https://gift.kakao.com/search/flower"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-sans text-sm font-semibold tracking-wide"
                style={{ backgroundColor: '#FEE500', color: '#1F1F1F' }}
              >
                {/* 카카오 아이콘 */}
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <path
                    fill="#1F1F1F"
                    d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.59 5.09 4 6.57V21l3.47-2.08A11.3 11.3 0 0 0 12 19c5.523 0 10-3.477 10-7.8S17.523 3 12 3Z"
                  />
                </svg>
                카카오 선물하기
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
