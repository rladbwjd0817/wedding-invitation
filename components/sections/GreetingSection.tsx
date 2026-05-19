import Star from '@/components/Star'

export default function GreetingSection() {
  return (
    <section className="py-20 px-8 bg-charcoal text-center">
      {/* 인트로 별자리 모티프 연결 — 작은 골드 별 */}
      <div className="flex justify-center mb-10">
        <Star color="#D4B896" duration={3.8} delay={0.8} className="w-5 h-5" />
      </div>

      {/* 인사말 본문 */}
      <div className="font-sans text-warm-white text-sm leading-[1.9] tracking-[0.04em] max-w-[320px] mx-auto">
        <p>
          평범한 하루가 특별해지는 건<br />
          함께하는 사람 덕분이라는 걸<br />
          서로를 통해 알게 되었습니다.
        </p>
        <p className="mt-7">
          같은 계절을 몇 번 지나는 동안<br />
          서로 없는 하루를 상상하기 어려워졌고
        </p>
        <p className="mt-7">
          이제 두 사람이<br />
          하나의 이름으로<br />
          새로운 계절을 맞이하려 합니다.
        </p>
        <p className="mt-7">
          귀한 걸음으로 축복해 주시면 감사하겠습니다.
        </p>
      </div>
    </section>
  )
}
