import IntroSection from "@/components/sections/IntroSection";
import GreetingSection from "@/components/sections/GreetingSection";
import GallerySection from "@/components/sections/GallerySection";
import CalendarSection from "@/components/sections/CalendarSection";
import LocationSection from "@/components/sections/LocationSection";
import RsvpSection from "@/components/sections/RsvpSection";
import GiftSection from "@/components/sections/GiftSection";
import StarMessageSection from "@/components/sections/StarMessageSection";
import InfoSection from "@/components/sections/InfoSection";
import ShareSection from "@/components/sections/ShareSection";

// 임시 더미 데이터 — 나중에 props/DB로 교체 예정
const weddingData = {
  groomName: "홍길동",
  brideName: "김영희",
  date: "2025년 10월 10일 금요일",
  time: "오후 2시",
  venue: "그랜드 웨딩홀",
  address: "서울시 강남구 테헤란로 123",
};

const divider = <hr className="border-charcoal/10 mx-6" />;

export default function InvitationPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* 모바일 기준 컨테이너 — 데스크탑에서는 가운데 정렬 */}
      <div className="mx-auto w-full max-w-[420px] bg-warm-white">
        <IntroSection />
        {divider}
        <GreetingSection />
        {divider}
        <GallerySection />
        {divider}
        <CalendarSection />
        {divider}
        <LocationSection />
        {divider}
        <RsvpSection />
        {divider}
        <GiftSection />
        {divider}
        <StarMessageSection />
        {divider}
        <InfoSection />
        {divider}
        <ShareSection />
      </div>
    </div>
  );
}
