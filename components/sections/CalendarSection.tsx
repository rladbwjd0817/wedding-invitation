'use client'

// 결혼 날짜 — 나중에 props로 교체 예정
const WEDDING_YEAR = 2027
const WEDDING_MONTH = 10  // 1-indexed
const WEDDING_DAY = 23

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// 해당 월의 달력 셀 배열 생성 (앞쪽 빈 칸은 null)
function buildCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

// 오늘 기준 D-day 계산 (양수=이전, 0=당일, 음수=이후)
function calcDDay(year: number, month: number, day: number): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const wedding = new Date(year, month - 1, day)
  return Math.round((wedding.getTime() - today.getTime()) / 86_400_000)
}

export default function CalendarSection() {
  const days = buildCalendarDays(WEDDING_YEAR, WEDDING_MONTH)
  const diff = calcDDay(WEDDING_YEAR, WEDDING_MONTH, WEDDING_DAY)
  const dDayLabel =
    diff > 0 ? `D-${diff}` : diff === 0 ? 'D-day' : `D+${Math.abs(diff)}`

  return (
    <section className="py-16 px-6 bg-charcoal text-center">
      {/* 섹션 제목 */}
      <h2 className="font-serif text-2xl text-gold tracking-wide">
        The Day We Promised
      </h2>
      <p className="font-sans text-xs text-warm-white/60 mt-2 tracking-[0.15em]">
        우리가 약속한 날
      </p>

      {/* D-day 카운트다운 */}
      <div className="mt-10 mb-12">
        <p className="font-serif text-6xl text-gold tracking-tight leading-none">
          {dDayLabel}
        </p>
        <p className="font-sans text-xs text-warm-white/40 mt-3 tracking-[0.12em]">
          {WEDDING_YEAR}. {String(WEDDING_MONTH).padStart(2, '0')}. {String(WEDDING_DAY).padStart(2, '0')}
        </p>
      </div>

      {/* 풀 달력 */}
      <div>
        <p className="font-serif text-sm text-warm-white/60 tracking-[0.2em] mb-6">
          {new Date(WEDDING_YEAR, WEDDING_MONTH - 1).toLocaleString('en-US', { month: 'long' })} {WEDDING_YEAR}
        </p>
        <div className="max-w-70 mx-auto">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-3">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center font-sans text-[10px] text-warm-white/25 tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>
          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-y-2">
            {days.map((d, i) => (
              <div key={i} className="flex items-center justify-center py-1">
                {d === null ? null : d === WEDDING_DAY ? (
                  <span className="w-7 h-7 rounded-full bg-gold flex items-center justify-center font-sans text-xs text-charcoal font-semibold">
                    {d}
                  </span>
                ) : (
                  <span className="font-sans text-xs text-warm-white/40">{d}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
