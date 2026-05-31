interface InfoCardProps {
  title: string
  children: React.ReactNode
}

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div
      className="border-[0.5px] border-gold rounded-xl px-5 py-4"
      style={{ backgroundColor: '#2A2A2A' }}
    >
      <p className="font-sans text-xs text-gold font-medium mb-3">{title}</p>
      {children}
    </div>
  )
}

export default function InfoSection() {
  return (
    <section className="py-16 px-6 bg-charcoal">
      {/* 섹션 제목 */}
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl text-gold tracking-wide">A Little Guide</h2>
        <p className="font-sans text-xs text-warm-white/60 mt-2 tracking-[0.15em]">추가 안내</p>
      </div>

      {/* 안내 카드 목록 — 항목 추가 시 <InfoCard> 블록 하나씩 추가 */}
      <div className="space-y-4">

        {/* 화동 안내 */}
        <InfoCard title="🌸 화동 소개">
          <p className="font-sans text-sm text-warm-white/90 font-medium">정유누</p>
          <p className="font-sans text-xs text-warm-white/45 mt-0.5 mb-3">신부 지인 아들</p>
          <p className="font-sans text-xs text-warm-white/65 leading-relaxed">
            오늘 꽃길을 함께 걸어줄 작은 친구,<br />
            정유누가 두 사람의 첫 걸음을 빛내줄 거예요 ✨
          </p>
        </InfoCard>

      </div>
    </section>
  )
}
