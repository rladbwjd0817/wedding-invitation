import Star from '@/components/Star'

export default function GreetingSection() {
  return (
    <section className="py-20 px-8 bg-charcoal text-center">
      {/* 별 + 양옆 골드 라인 */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span style={{ display: 'block', width: 40, height: 0.5, background: '#B8956A' }} />
        <Star color="#D4B896" duration={3.8} delay={0.8} className="w-5 h-5" />
        <span style={{ display: 'block', width: 40, height: 0.5, background: '#B8956A' }} />
      </div>

      {/* 인사말 본문 */}
      <div
        className="font-serif text-warm-white text-sm tracking-wide max-w-[320px] mx-auto"
        style={{ lineHeight: 2.1 }}
      >
        <p>
          평범한 하루가 특별해지는 건<br />
          함께하는 사람 덕분이라는 걸<br />
          서로를 통해 알게 되었습니다.
        </p>

        <p className="mt-1.5" style={{ color: '#B8956A', fontSize: 10 }}>✦</p>

        <p className="mt-1.5">
          같은 계절을 몇 번 지나는 동안<br />
          서로 없는 하루를 상상하기 어려워졌고
        </p>

        <p className="mt-1.5" style={{ color: '#B8956A', fontSize: 10 }}>✦</p>

        {/* 핵심 문단 — 한 단계 크게, 골드 계열 */}
        <p className="mt-1.5 text-base" style={{ color: '#D4B896' }}>
          이제 두 사람이<br />
          하나의 이름으로<br />
          새로운 계절을 맞이하려 합니다.
        </p>

        <p className="mt-1.5" style={{ color: '#B8956A', fontSize: 10 }}>✦</p>

        <p className="mt-1.5">
          귀한 걸음으로 축복해 주시면 감사하겠습니다.
        </p>
      </div>
    </section>
  )
}
