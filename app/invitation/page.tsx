import IntroSection from "@/components/sections/IntroSection";
import GreetingSection from "@/components/sections/GreetingSection";
import GallerySection from "@/components/sections/GallerySection";
import CalendarSection from "@/components/sections/CalendarSection";
import LocationSection from "@/components/sections/LocationSection";
import MoneySection from "@/components/sections/MoneySection";
import MessageSection from "@/components/sections/MessageSection";
import InfoSection from "@/components/sections/InfoSection";
import ShareSection from "@/components/sections/ShareSection";
import RsvpPopup from "@/components/RsvpPopup";

// 임시 더미 데이터 — 나중에 props/DB로 교체 예정
const weddingData = {
  groomName: "홍길동",
  brideName: "김영희",
  date: "2025년 10월 10일 금요일",
  time: "오후 2시",
  venue: "그랜드 웨딩홀",
  address: "서울시 강남구 테헤란로 123",
  galleryImages: [
    "/images/gallery/01.jpg",
    "/images/gallery/02.jpg",
    "/images/gallery/03.jpg",
    "/images/gallery/04.jpg",
    "/images/gallery/05.jpg",
    "/images/gallery/06.jpg",
    "/images/gallery/07.jpg",
    "/images/gallery/08.jpg",
    "/images/gallery/09.jpg",
  ],
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
        <GallerySection images={weddingData.galleryImages} />
        <div id="rsvp-trigger" />
        {divider}
        <CalendarSection />
        {divider}
        <LocationSection />
        {divider}
        <MoneySection />
        {divider}
        <MessageSection />
        {divider}
        <InfoSection />
      </div>
      <ShareSection />
      <RsvpPopup />
    </div>
  );
}
