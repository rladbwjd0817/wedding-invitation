'use client'

import { useState } from 'react'

interface Account {
  name: string
  bank: string
  number: string
}

interface AccountGroup {
  label: string
  accounts: Account[]
}

// 더미 계좌 데이터 — 나중에 props로 교체 예정
const ACCOUNT_GROUPS: AccountGroup[] = [
  {
    label: '신랑측',
    accounts: [
      { name: '김재근', bank: '카카오뱅크', number: '3333-00-0000000' },
      { name: '김한민', bank: '국민은행', number: '000000-00-000000' },
      { name: '한수경', bank: '신한은행', number: '000-000-000000' },
    ],
  },
  {
    label: '신부측',
    accounts: [
      { name: '김유정', bank: '카카오뱅크', number: '3333-00-0000000' },
      { name: '김경연', bank: '경남은행', number: '000000-00-000000' },
      { name: '배은주', bank: '농협은행', number: '000-000-000000' },
    ],
  },
]

export default function MoneySection() {
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set())
  const [toast, setToast] = useState(false)

  function toggleGroup(index: number) {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  async function copyNumber(number: string) {
    try {
      await navigator.clipboard.writeText(number)
      setToast(true)
      setTimeout(() => setToast(false), 2000)
    } catch {
      // clipboard API 미지원 환경에서 조용히 실패
    }
  }

  return (
    <section className="py-16 px-6 bg-charcoal">
      {/* 섹션 제목 */}
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl text-gold tracking-wide">With Your Heart</h2>
        <p className="font-sans text-xs text-warm-white/60 mt-2 tracking-[0.15em]">마음 전하기</p>
      </div>

      {/* 계좌 그룹 */}
      <div className="space-y-4">
        {ACCOUNT_GROUPS.map((group, gi) => {
          const isOpen = openGroups.has(gi)
          return (
            <div key={gi} className="border border-warm-white/15 rounded-xl overflow-hidden">
              {/* 그룹 헤더 + 아코디언 토글 */}
              <button
                onClick={() => toggleGroup(gi)}
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <span className="font-sans text-sm text-warm-white/80 tracking-wider">
                  {group.label}
                </span>
                <span className="font-sans text-xs text-warm-white/40 flex items-center gap-1.5">
                  계좌번호 보기
                  <svg
                    viewBox="0 0 12 12"
                    className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {/* 아코디언 본문 */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5">
                  {group.accounts.map((acc, ai) => (
                    <div key={ai}>
                      {ai > 0 && <div className="border-t border-warm-white/10 my-4" />}
                      {/* 계좌 행 — 탭하면 번호 클립보드 복사 */}
                      <button
                        onClick={() => copyNumber(acc.number)}
                        className="w-full text-left"
                        aria-label={`${acc.name} ${acc.bank} ${acc.number} 복사`}
                      >
                        <p className="font-sans text-xs text-warm-white/40 mb-1">
                          {acc.name} · {acc.bank}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-sm text-warm-white/75 tracking-wider">
                            {acc.number}
                          </span>
                          <span className="font-sans text-xs text-warm-white/30">복사</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 복사 완료 토스트 */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-gold text-warm-white font-sans text-xs tracking-wide whitespace-nowrap transition-opacity duration-300 ${
          toast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        복사되었습니다
      </div>
    </section>
  )
}
