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
    year: 'numeric',
    month: '2-digit',
    day:   '2-digit',
    hour:  '2-digit',
    minute:'2-digit',
  })
}

// ─── 공용 인풋 스타일 ─────────────────────────────────────────────────────────
const INPUT_CLS =
  'w-full bg-warm-white/5 border border-warm-white/15 rounded-lg px-4 py-3 ' +
  'font-sans text-sm text-warm-white placeholder:text-warm-white/25 ' +
  'outline-none focus:border-gold/50 transition-colors'

// ─── 페이지 ──────────────────────────────────────────────────────────────────
export default function AdminPage() {
  // 인증
  const [authed,   setAuthed]   = useState(false)
  const [groom,    setGroom]    = useState('')
  const [bride,    setBride]    = useState('')
  const [authErr,  setAuthErr]  = useState(false)

  // 방명록
  const [records,    setRecords]    = useState<MessageRecord[]>([])
  const [loading,    setLoading]    = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null) // 삭제 확인 중인 id

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
  useEffect(() => {
    if (!authed) return
    setLoading(true)
    supabase
      .from('star_messages')
      .select('id, nickname, message, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('[admin] load error:', error) }
        else if (data) setRecords(data)
        setLoading(false)
      })
  }, [authed])

  // ── 삭제 ────────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('star_messages')
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
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="w-full max-w-xs">
          <h1 className="font-serif text-2xl text-gold text-center tracking-wide mb-2">
            관리자
          </h1>
          <p className="font-sans text-xs text-warm-white/40 text-center mb-8 tracking-wider">
            신랑·신부 생년월일로 접속
          </p>

          <div className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              value={groom}
              onChange={e => { setGroom(e.target.value.replace(/\D/g, '').slice(0, 8)); setAuthErr(false) }}
              onKeyDown={handleKeyDown}
              placeholder="신랑 생년월일 8자리 예: 19960315"
              maxLength={8}
              className={INPUT_CLS}
              autoComplete="off"
            />
            <input
              type="password"
              inputMode="numeric"
              value={bride}
              onChange={e => { setBride(e.target.value.replace(/\D/g, '').slice(0, 8)); setAuthErr(false) }}
              onKeyDown={handleKeyDown}
              placeholder="신부 생년월일 8자리 예: 19970823"
              maxLength={8}
              className={INPUT_CLS}
              autoComplete="off"
            />

            {authErr && (
              <p className="font-sans text-xs text-center" style={{ color: '#F87171' }}>
                비밀번호가 올바르지 않아요
              </p>
            )}

            <button
              onClick={handleAuth}
              disabled={groom.length !== 8 || bride.length !== 8}
              className="w-full py-3.5 rounded-lg bg-gold text-warm-white font-sans text-sm font-medium tracking-wide disabled:opacity-30 transition-opacity"
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
    <div className="min-h-screen bg-charcoal px-4 py-10">
      <div className="max-w-lg mx-auto">

        {/* 헤더 */}
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-serif text-2xl text-gold tracking-wide">방명록 관리</h1>
          <span className="font-sans text-xs text-warm-white/35 tracking-wider">
            총 {records.length}개
          </span>
        </div>

        {/* 목록 */}
        {loading ? (
          <p className="font-sans text-xs text-warm-white/35 text-center py-20">
            불러오는 중…
          </p>
        ) : records.length === 0 ? (
          <p className="font-sans text-xs text-warm-white/35 text-center py-20">
            방명록이 없습니다
          </p>
        ) : (
          <div className="space-y-3">
            {records.map(r => (
              <div
                key={r.id}
                className="rounded-xl px-4 py-4 border border-warm-white/10"
                style={{ backgroundColor: '#2A2A2A' }}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-warm-white/90 font-medium truncate">
                      {r.nickname}
                    </p>
                    <p className="font-sans text-xs text-warm-white/55 mt-1 leading-relaxed break-words">
                      {r.message}
                    </p>
                    <p className="font-sans text-[10px] text-warm-white/25 mt-2 tracking-wider">
                      {formatKorDate(r.created_at)}
                    </p>
                  </div>

                  {/* 삭제 버튼 / 인라인 확인 */}
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
                          className="px-3 py-1.5 rounded font-sans text-[11px] text-warm-white/40 border border-warm-white/15"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDelConfirm(r.id)}
                        className="px-3 py-1.5 rounded font-sans text-[11px] text-warm-white/35 border border-warm-white/15 hover:border-red-400/50 hover:text-red-400 transition-colors"
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
