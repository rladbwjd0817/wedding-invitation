import FloralIntroSection   from '@/components/floral/IntroSection'
import FloralGreetingSection from '@/components/floral/GreetingSection'

// 플로럴 컨셉 청첩장 페이지
// 섹션은 순서대로 추가 예정: Intro → Greeting → Gallery → Calendar → Location → Money → Message → Info → Share
export default function FloralPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF0F0' }}>
      <div className="mx-auto w-full max-w-[420px]" style={{ backgroundColor: '#FDF0F0' }}>
        <FloralIntroSection />
        <FloralGreetingSection />
        {/* 추후 섹션 추가 예정 */}
      </div>
    </div>
  )
}
