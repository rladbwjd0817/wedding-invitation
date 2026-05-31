'use client'

import { useState } from 'react'

export default function ShareSection() {
  const [toast, setToast] = useState(false)

  function handleKakao() {
    // 배포 후 카카오 SDK 연동 예정
    console.log('[ShareSection] 카카오톡 공유 버튼 클릭')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch { /* clipboard API 미지원 환경 */ }
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <footer className="bg-charcoal pb-12 pt-6">
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

      {/* 복사 완료 토스트 */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-gold text-warm-white font-sans text-xs tracking-wide whitespace-nowrap transition-opacity duration-300 ${
          toast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        복사되었습니다
      </div>
    </footer>
  )
}
