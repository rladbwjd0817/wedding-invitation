'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// ─── 타입 ────────────────────────────────────────────────────────────────────
interface MessageRecord {
  id: string
  nickname: string
  message: string
  created_at: string
}

// ─── 한국 시간 포맷 ───────────────────────────────────────────────────────────
function formatKorDate(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

// ─── 플로럴 테마 색상 ─────────────────────────────────────────────────────────
const ROSE    = '#C9848A'
const CREAM   = '#FDF0F0'
const DARK_BG = '#2D1A1A'  // 어두운 웜 브라운

// ─── 공용 인풋 스타일 ─────────────────────────────────────────────────────────
const INPUT_CLS =
  'w-full rounded-lg px-4 py-3 font-sans text-sm outline-none transition-colors ' +
  'placeholder:opacity-40'

// ─── 눈 아이콘 (보이기) ───────────────────────────────────────────────────────
function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={ROSE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

// ─── 눈 아이콘 (숨기기) ───────────────────────────────────────────────────────
function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={ROSE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

// ─── 페이지 ──────────────────────────────────────────────────────────────────
export default function FloralAdminPage() {
  // 인증
  const [authed,    setAuthed]    = useState(false)
  const [groom,     setGroom]     = useState('')
  const [bride,     setBride]     = useState('')
  const [authErr,   setAuthErr]   = useState(false)
  const [showGroom, setShowGroom] = useState(false)
  const [showBride, setShowBride] = useState(false)

  // 방명록
  const [records,    setRecords]    = useState<MessageRecord[]>([])
  const [loading,    setLoading]    = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  // ── 인증 ────────────────────────────────────────────────────────────────────
  async function handleAuth() {
    const { data } = await supabase
      .from('admin_credentials')
      .select('groom_birth, bride_birth')
      .single()

    if (!data || groom.trim() !== data.groom_birth || bride.trim() !== data.bride_birth) {
      setAuthErr(true)
    } else {
      setAuthed(true)
      setAuthErr(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAuth()
  }

  // ── 방명록 로드 (인증 후) ───────────────────────────────────────────────────
  // TODO: Supabase에 floral_messages 테이블 생성 후 테이블명 교체
  useEffect(() => {
    if (!authed) return
    setLoading(true)
    supabase
      .from('floral_messages')
      .select('id, nickname, message, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('[floral-admin] load error:', error) }
        else if (data) setRecords(data)
        setLoading(false)
      })
  }, [authed])

  // ── 삭제 ────────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('floral_messages')
      .delete()
      .eq('id', id)
    if (!error) {
      setRecords(prev => prev.filter(r => r.id !== id))
    }
    setDelConfirm(null)
  }

  // ── 인증 화면 ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: DARK_BG }}
      >
        <div className="w-full max-w-xs">
          <h1
            className="font-serif text-2xl text-center tracking-wide mb-2"
            style={{ color: ROSE }}
          >
            관리자
          </h1>
          <p
            className="font-sans text-xs text-center mb-8 tracking-wider"
            style={{ color: CREAM, opacity: 0.4 }}
          >
            신랑·신부 생년월일로 접속
          </p>

          <div className="space-y-3">
            {/* 신랑 생년월일 */}
            <div className="relative">
              <input
                type={showGroom ? 'text' : 'password'}
                inputMode="numeric"
                value={groom}
                onChange={e => { setGroom(e.target.value.replace(/\D/g, '').slice(0, 8)); setAuthErr(false) }}
                onKeyDown={handleKeyDown}
                placeholder="신랑 생년월일 8자리 예: 19960315"
                maxLength={8}
                autoComplete="off"
                className={INPUT_CLS + ' pr-11'}
                style={{
                  backgroundColor: 'rgba(253,240,240,0.06)',
                  border: `1px solid rgba(201,132,138,0.25)`,
                  color: CREAM,
                }}
              />
              <button
                type="button"
                onClick={() => setShowGroom(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                tabIndex={-1}
              >
                {showGroom ? <EyeOpen /> : <EyeOff />}
              </button>
            </div>

            {/* 신부 생년월일 */}
            <div className="relative">
              <input
                type={showBride ? 'text' : 'password'}
                inputMode="numeric"
                value={bride}
                onChange={e => { setBride(e.target.value.replace(/\D/g, '').slice(0, 8)); setAuthErr(false) }}
                onKeyDown={handleKeyDown}
                placeholder="신부 생년월일 8자리 예: 19970823"
                maxLength={8}
                autoComplete="off"
                className={INPUT_CLS + ' pr-11'}
                style={{
                  backgroundColor: 'rgba(253,240,240,0.06)',
                  border: `1px solid rgba(201,132,138,0.25)`,
                  color: CREAM,
                }}
              />
              <button
                type="button"
                onClick={() => setShowBride(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                tabIndex={-1}
              >
                {showBride ? <EyeOpen /> : <EyeOff />}
              </button>
            </div>

            {authErr && (
              <p className="font-sans text-xs text-center" style={{ color: '#F87171' }}>
                비밀번호가 올바르지 않아요
              </p>
            )}

            <button
              onClick={handleAuth}
              disabled={groom.length !== 8 || bride.length !== 8}
              className="w-full py-3.5 rounded-lg font-sans text-sm font-medium tracking-wide disabled:opacity-30 transition-opacity"
              style={{ backgroundColor: ROSE, color: CREAM }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── 방명록 목록 화면 ─────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ backgroundColor: DARK_BG }}
    >
      <div className="max-w-lg mx-auto">

        {/* 헤더 */}
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-serif text-2xl tracking-wide" style={{ color: ROSE }}>
            방명록 관리
          </h1>
          <span
            className="font-sans text-xs tracking-wider"
            style={{ color: CREAM, opacity: 0.35 }}
          >
            총 {records.length}개
          </span>
        </div>

        {/* 목록 */}
        {loading ? (
          <p
            className="font-sans text-xs text-center py-20 tracking-wider"
            style={{ color: CREAM, opacity: 0.35 }}
          >
            불러오는 중…
          </p>
        ) : records.length === 0 ? (
          <p
            className="font-sans text-xs text-center py-20 tracking-wider"
            style={{ color: CREAM, opacity: 0.35 }}
          >
            방명록이 없습니다
          </p>
        ) : (
          <div className="space-y-3">
            {records.map(r => (
              <div
                key={r.id}
                className="rounded-xl px-4 py-4"
                style={{ backgroundColor: '#3D2020', border: '0.5px solid rgba(201,132,138,0.2)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-sans text-sm font-medium truncate"
                      style={{ color: CREAM, opacity: 0.9 }}
                    >
                      {r.nickname}
                    </p>
                    <p
                      className="font-sans text-xs mt-1 leading-relaxed break-words"
                      style={{ color: CREAM, opacity: 0.55 }}
                    >
                      {r.message}
                    </p>
                    <p
                      className="font-sans text-[10px] mt-2 tracking-wider"
                      style={{ color: CREAM, opacity: 0.25 }}
                    >
                      {formatKorDate(r.created_at)}
                    </p>
                  </div>

                  {/* 삭제 버튼 */}
                  <div className="shrink-0 flex flex-col gap-1.5">
                    {delConfirm === r.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="px-3 py-1.5 rounded font-sans text-[11px] font-medium text-white"
                          style={{ backgroundColor: 'rgba(239,68,68,0.75)' }}
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setDelConfirm(null)}
                          className="px-3 py-1.5 rounded font-sans text-[11px]"
                          style={{
                            color: `${CREAM}66`,
                            border: `1px solid rgba(253,240,240,0.15)`,
                          }}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDelConfirm(r.id)}
                        className="px-3 py-1.5 rounded font-sans text-[11px] transition-colors"
                        style={{
                          color: `${CREAM}55`,
                          border: `1px solid rgba(253,240,240,0.15)`,
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
