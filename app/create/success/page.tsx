'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import Link from 'next/link'

function GiftUrl({ id }: { id: string }) {
  const [url, setUrl] = useState(`/gift/${id}`)
  useEffect(() => { setUrl(`${window.location.origin}/gift/${id}`) }, [id])
  return <span suppressHydrationWarning>{url}</span>
}

function SuccessContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const giftUrl = mounted && id
    ? `${window.location.origin}/gift/${id}`
    : id ? `/gift/${id}` : ''

  if (!id) {
    return (
      <div className="text-center">
        <p className="text-on-surface-variant">ไม่พบของขวัญ</p>
        <Link href="/create" className="text-primary underline mt-4 block">สร้างใหม่</Link>
      </div>
    )
  }

  async function copyLink() {
    await navigator.clipboard.writeText(giftUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="floating mx-auto w-fit mb-8">
        <div className="w-24 h-24 rounded-[1.5rem] bg-primary-container flex items-center justify-center shadow-[0_12px_32px_-8px_rgba(107,90,96,0.2)] mx-auto">
          <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
            <rect x="6" y="22" width="36" height="22" rx="3" fill="#6b5a60" />
            <rect x="4" y="16" width="40" height="8" rx="3" fill="#524249" />
            <rect x="21" y="16" width="6" height="28" fill="#fce4ec" opacity="0.8" />
            <rect x="4" y="24" width="40" height="6" fill="#fce4ec" opacity="0.8" />
            <ellipse cx="18" cy="17" rx="7" ry="5" fill="#f4dce4"
              style={{ transform: 'rotate(-25deg)', transformOrigin: '23px 17px' }} />
            <ellipse cx="30" cy="17" rx="7" ry="5" fill="#f4dce4"
              style={{ transform: 'rotate(25deg)', transformOrigin: '25px 17px' }} />
            <circle cx="24" cy="17" r="4" fill="#6b5a60" />
            <circle cx="24" cy="17" r="2.5" fill="#f4dce4" />
          </svg>
        </div>
      </div>

      <div className="inline-block px-3 py-1 bg-primary-container rounded-full mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">พร้อมส่งแล้ว</span>
      </div>

      <h1 className="font-serif italic text-4xl text-primary mb-3 text-balance leading-tight">
        ของขวัญพร้อมแล้ว!
      </h1>
      <p className="text-on-surface-variant leading-relaxed mb-8 text-pretty max-w-sm mx-auto text-sm">
        คัดลอกลิงก์ด้านล่างแล้วส่งให้คนพิเศษของคุณได้เลย
        เมื่อเขา/เธอเปิดลิงก์ กล่องของขวัญจะปรากฏขึ้น
      </p>

      {/* URL box */}
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-4 mb-4 text-left relative overflow-hidden">
        <div className="absolute top-3 left-3 right-3 bottom-3 border border-outline-variant/15 rounded-xl pointer-events-none" />
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">ลิงก์ลับของคุณ</p>
        <div className="flex items-center gap-3">
          <p className="text-sm text-foreground flex-1 truncate font-mono text-primary/80">
            <GiftUrl id={id} />
          </p>
          <button
            onClick={copyLink}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-sm'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
          </button>
        </div>
      </div>

      <Link
        href={`/gift/${id}`}
        target="_blank"
        className="inline-block text-xs text-on-surface-variant underline underline-offset-2 hover:text-primary transition-colors mb-8"
      >
        ดูตัวอย่างหน้าเปิดกล่อง
      </Link>

      <div className="border-t border-outline-variant/30 pt-6">
        <Link
          href="/create"
          className="text-sm text-primary hover:opacity-80 transition-opacity font-semibold"
        >
          สร้างของขวัญอีกอัน
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="bg-mesh min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-fixed rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-50" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-[0_12px_40px_-8px_rgba(107,90,96,0.18)] border border-outline-variant/30 p-8 md:p-10">
        <Suspense fallback={<p className="text-center text-on-surface-variant">กำลังโหลด...</p>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
