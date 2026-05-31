// 더미 장소 데이터 — 나중에 props로 교체 예정
const VENUE = {
  name: '울산시티컨벤션',
  address: '울산 중구 염포로 55 울산종합운동장 1-2층',
  hall: '그린나래홀 1F',
  date: '2027. 10. 23. SAT',
  time: '오후 12시',
  lat: 35.561316,
  lng: 129.348165,
}

export default function LocationSection() {
  return (
    <section className="py-16 bg-charcoal">
      {/* 섹션 제목 */}
      <div className="px-6 text-center mb-8">
        <h2 className="font-serif text-2xl text-gold tracking-wide">오시는 길</h2>
        <p className="font-sans text-xs text-warm-white/60 mt-2 tracking-[0.15em]">
          How to get there
        </p>
      </div>

      {/* 지도 플레이스홀더 — 배포 후 카카오맵 임베드로 교체 예정 */}
      <div
        className="w-full h-62.5 flex items-center justify-center"
        style={{ backgroundColor: '#2A2A2A' }}
      >
        <p className="font-sans text-xs text-warm-white/50">🗺️ 지도는 배포 후 표시됩니다</p>
      </div>

      {/* 외부 지도 앱 연결 버튼 */}
      <div className="px-6 mt-4 flex gap-3">
        <a
          href={`https://map.kakao.com/link/search/${encodeURIComponent(VENUE.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 text-center font-sans text-xs text-warm-white/70 border border-warm-white/20 rounded tracking-widest"
        >
          카카오맵
        </a>
        <a
          href={`https://map.naver.com/search?query=${encodeURIComponent(VENUE.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 text-center font-sans text-xs text-warm-white/70 border border-warm-white/20 rounded tracking-widest"
        >
          네이버맵
        </a>
      </div>

      {/* 장소 텍스트 정보 */}
      <div className="px-6 mt-8 text-center">
        <p className="font-serif text-lg text-warm-white tracking-wide">{VENUE.name}</p>
        <p className="font-sans text-xs text-warm-white/50 mt-1 tracking-[0.06em]">{VENUE.hall}</p>
        <p className="font-sans text-xs text-warm-white/40 mt-4 tracking-[0.08em]">{VENUE.address}</p>
        <p className="font-sans text-xs text-warm-white/40 mt-1 tracking-[0.08em]">
          {VENUE.date} · {VENUE.time}
        </p>
      </div>

      {/* 교통 안내 */}
      <div className="px-6 mt-6 space-y-3">

        {/* 대중교통 */}
        <div className="border border-warm-white/15 rounded-lg px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <svg viewBox="0 0 20 16" fill="none" className="w-4 h-4 text-warm-white/50" aria-hidden="true">
              <rect x="1" y="1" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1 5h18M7 5v7M13 5v7" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="4.5" cy="14" r="1.5" fill="currentColor"/>
              <circle cx="15.5" cy="14" r="1.5" fill="currentColor"/>
            </svg>
            <span className="font-sans text-xs text-warm-white/70 tracking-wider">대중교통</span>
          </div>
          <div className="font-sans text-xs text-warm-white/45 leading-relaxed">
            <p>114 · 118 · 762 · 741 · 711</p>
            <p>735 · 128 · 721 · 722 · 724</p>
            <p>731 · 순환11 · 순환12 · 순환21 · 순환22</p>
          </div>
          <p className="font-sans text-xs text-warm-white/35 mt-3">
            종합운동장앞 하차 · 도보 약 2분
          </p>
        </div>

        {/* 주차 */}
        <div className="border border-warm-white/15 rounded-lg px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-warm-white/50" aria-hidden="true">
              <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5.5 11.5V4.5H9a3 3 0 0 1 0 5H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <span className="font-sans text-xs text-warm-white/70 tracking-wider">주차</span>
          </div>
          <p className="font-sans text-xs text-warm-white/45 leading-relaxed">
            울산종합운동장 내 주차장 이용
          </p>
        </div>

      </div>
    </section>
  )
}
