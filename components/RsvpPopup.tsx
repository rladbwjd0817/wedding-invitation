'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'wedding_rsvp_done'

type Step = 'choice' | 'count' | 'done'

export default function RsvpPopup() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<Step>('choice')
  const [count, setCount] = useState(2)

  useEffect(() => {
    // 이미 응답했거나 닫은 경우 옵저버 등록 안 함
    if (localStorage.getItem(STORAGE_KEY)) return

    const sentinel = document.getElementById('rsvp-trigger')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 갤러리 섹션을 지나쳐서 sentinel이 화면 위로 사라진 경우
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
    // 애니메이션 완료 후 step 초기화
    setTimeout(() => {
      setStep('choice')
      setCount(2)
    }, 300)
  }

  function handleChoice(choice: 'attending' | 'absent') {
    if (choice === 'absent') {
      setStep('done')
      setTimeout(dismiss, 1800)
    } else {
      setStep('count')
    }
  }

  function handleConfirm() {
    setStep('done')
    setTimeout(dismiss, 1800)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end ${!visible ? 'pointer-events-none' : ''}`}
    >
      {/* 배경 오버레이 */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          visible ? 'bg-charcoal/85 opacity-100' : 'opacity-0'
        }`}
        onClick={dismiss}
      />

      {/* 팝업 카드 — 하단 슬라이드업 */}
      <div
        className={`relative w-full bg-warm-white rounded-t-2xl px-6 pt-6 pb-10 transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-charcoal/30 w-8 h-8 flex items-center justify-center text-base"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* Step 1: 참석/불참 선택 */}
        {step === 'choice' && (
          <div>
            <p className="font-sans text-base font-semibold text-charcoal text-center">
              참석 여부를 알려주세요
            </p>
            <p className="font-sans text-xs text-charcoal/40 text-center mt-1 mb-7 tracking-wide">
              2027. 10. 23. SAT · 오후 12시
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleChoice('attending')}
                className="flex-1 py-3.5 rounded-xl border border-gold text-gold font-sans text-sm font-medium tracking-wide"
              >
                참석
              </button>
              <button
                onClick={() => handleChoice('absent')}
                className="flex-1 py-3.5 rounded-xl border border-charcoal/15 text-charcoal/40 font-sans text-sm tracking-wide"
              >
                불참
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 인원수 선택 (참석 선택 시) */}
        {step === 'count' && (
          <div>
            <p className="font-sans text-base font-semibold text-charcoal text-center">
              몇 분이 참석하시나요?
            </p>
            <p className="font-sans text-xs text-charcoal/40 text-center mt-1 mb-7 tracking-wide">
              식사 준비에 참고합니다
            </p>
            <div className="flex items-center justify-center gap-6 mb-7">
              <button
                onClick={() => setCount(c => Math.max(1, c - 1))}
                className="w-9 h-9 rounded-full border border-charcoal/20 text-charcoal/50 flex items-center justify-center text-xl leading-none"
                aria-label="인원 줄이기"
              >
                −
              </button>
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans text-3xl font-semibold text-charcoal">{count}</span>
                <span className="font-sans text-sm text-charcoal/40">명</span>
              </div>
              <button
                onClick={() => setCount(c => Math.min(10, c + 1))}
                className="w-9 h-9 rounded-full border border-charcoal/20 text-charcoal/50 flex items-center justify-center text-xl leading-none"
                aria-label="인원 늘리기"
              >
                +
              </button>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl bg-gold text-warm-white font-sans text-sm font-medium tracking-wide"
            >
              확인
            </button>
          </div>
        )}

        {/* Step 3: 완료 메시지 */}
        {step === 'done' && (
          <div className="py-8 text-center">
            <p className="text-3xl mb-3">🌙</p>
            <p className="font-sans text-base font-semibold text-charcoal">감사합니다</p>
            <p className="font-sans text-xs text-charcoal/40 mt-1.5 tracking-wide">
              소중한 답변 감사드립니다
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
