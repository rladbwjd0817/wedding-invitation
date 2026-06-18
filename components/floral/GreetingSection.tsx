// 플로럴 컨셉 인사말 섹션 — 더스티 로즈 팔레트

// ─── 잎 + 꽃봉오리 구분자 SVG ─────────────────────────────────────────────────
function LeafDivider() {
  return (
    <svg
      width="80" height="16" viewBox="0 0 80 16"
      className="mx-auto my-4"
      aria-hidden="true"
    >
      <line x1="0"  y1="8" x2="22" y2="8" stroke="#B8956A" strokeWidth="0.6" opacity="0.45" />
      <path d="M24 8 C26 3, 31 3, 33 8 C31 13, 26 13, 24 8Z" fill="#9DA88C" opacity="0.65" />
      <circle cx="40" cy="8" r="2.8" fill="#C0938C" opacity="0.65" />
      <path d="M47 8 C49 3, 54 3, 56 8 C54 13, 49 13, 47 8Z" fill="#9DA88C" opacity="0.65" />
      <line x1="58" y1="8" x2="80" y2="8" stroke="#B8956A" strokeWidth="0.6" opacity="0.45" />
    </svg>
  )
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function FloralGreetingSection() {
  return (
    <section
      className="py-24 px-8 text-center"
      style={{ backgroundColor: '#F6E7E2' }}
    >
      {/* 영문 소제목 */}
      <p
        className="font-serif tracking-[0.22em] mb-3"
        style={{ color: '#B8956A', fontSize: 13 }}
      >
        Invitation
      </p>

      {/* 골드 가로 라인 */}
      <div
        className="mx-auto mb-12"
        style={{ width: 36, height: 1, backgroundColor: '#B8956A', opacity: 0.5 }}
      />

      {/* 인사말 본문 */}
      <div
        className="font-sans max-w-[300px] mx-auto text-center"
        style={{ color: '#5C4A45', fontSize: 13, lineHeight: 2.0 }}
      >
        <p>
          평범한 하루가 특별해지는 건<br />
          함께하는 사람 덕분이라는 걸<br />
          서로를 통해 알게 되었습니다.
        </p>

        <LeafDivider />

        <p>
          같은 계절을 몇 번 지나는 동안<br />
          서로 없는 하루를 상상하기 어려워졌고
        </p>

        <LeafDivider />

        {/* 핵심 문단 — 블러쉬 강조 */}
        <p style={{ color: '#A8746C', fontSize: 14.5, lineHeight: 2.1 }}>
          이제 두 사람이<br />
          하나의 이름으로<br />
          새로운 계절을 맞이하려 합니다.
        </p>

        <LeafDivider />

        <p>
          귀한 걸음으로 축복해 주시면 감사하겠습니다.
        </p>
      </div>

      {/* 골드 구분선 */}
      <div
        className="mx-auto mt-14 mb-12"
        style={{ width: 1, height: 36, backgroundColor: '#B8956A', opacity: 0.35 }}
      />

      {/* 신랑·신부 및 양가 부모 */}
      <div
        className="font-sans max-w-[280px] mx-auto space-y-7"
        style={{ color: '#5C4A45', fontSize: 12 }}
      >
        {/* 신랑측 */}
        <div>
          <p
            className="font-serif tracking-[0.18em] mb-2"
            style={{ color: '#8A766E', fontSize: 10 }}
          >
            GROOM
          </p>
          <p style={{ letterSpacing: '0.12em', fontSize: 15, color: '#5C4A45' }}>
            홍 &nbsp; 길 &nbsp; 동
          </p>
          <p className="mt-1.5" style={{ color: '#8A766E', lineHeight: 1.8 }}>
            홍길민 · 이순희의 장남
          </p>
        </div>

        {/* 잎 미니 장식 */}
        <svg width="24" height="10" viewBox="0 0 24 10" className="mx-auto" aria-hidden="true">
          <path d="M2 5 C5 1, 10 1, 12 5 C10 9, 5 9, 2 5Z"  fill="#9DA88C" opacity="0.55" />
          <path d="M12 5 C14 1, 19 1, 22 5 C19 9, 14 9, 12 5Z" fill="#9DA88C" opacity="0.55" />
        </svg>

        {/* 신부측 */}
        <div>
          <p
            className="font-serif tracking-[0.18em] mb-2"
            style={{ color: '#8A766E', fontSize: 10 }}
          >
            BRIDE
          </p>
          <p style={{ letterSpacing: '0.12em', fontSize: 15, color: '#5C4A45' }}>
            김 &nbsp; 영 &nbsp; 희
          </p>
          <p className="mt-1.5" style={{ color: '#8A766E', lineHeight: 1.8 }}>
            김철수 · 박미영의 차녀
          </p>
        </div>
      </div>
    </section>
  )
}
