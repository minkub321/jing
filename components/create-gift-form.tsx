'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

const BOX_STYLES = [
  { value: 'simple',    label: 'Simple Box' },
  { value: 'romantic',  label: 'Romantic Ribbon' },
  { value: 'surprise',  label: 'Surprise Box' },
  { value: 'midnight',  label: 'Midnight Velvet' },
] as const

export function CreateGiftForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    message: '',
    box_style: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.message.trim()) {
      setError('Please write a heartfelt message.')
      return
    }

    setSubmitting(true)
    try {
      let image_url: string | null = null

      if (imageFile) {
        setUploading(true)
        const fd = new FormData()
        fd.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed')
        image_url = uploadData.url
        setUploading(false)
      }

      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: form.message,
          box_style: form.box_style || 'simple',
          image_url,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create gift')

      router.push(`/create/success?id=${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  const isLoading = submitting || uploading

  return (
    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">

      {/* Message */}
      <div className="space-y-3">
        <label className="block font-sans text-sm font-semibold text-[#6b5a60] tracking-wide uppercase">
          The Message
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your heartfelt message..."
          rows={4}
          className="w-full bg-[#eae8e0] border-none rounded-[1rem] p-6 focus:outline-none focus:bg-white focus:shadow-[0_0_0_1px_rgba(107,90,96,0.15)] transition-all duration-300 font-serif text-xl text-[#1b1c17] italic placeholder:text-[#7f7478]/40 resize-none"
        />
      </div>

      {/* Photo Upload */}
      <div className="space-y-3">
        <label className="block font-sans text-sm font-semibold text-[#6b5a60] tracking-wide uppercase">
          A Visual Memory
        </label>

        {imagePreview ? (
          <div className="w-full h-48 rounded-[1rem] overflow-hidden border-2 border-dashed border-[#d0c3c7]/40 bg-[#f5f4ec]" style={{ position: 'relative' }}>
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => {
                setImageFile(null)
                setImagePreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1b1c17]/60 text-white flex items-center justify-center hover:bg-[#1b1c17] transition-colors text-lg font-bold"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-[#d0c3c7]/40 rounded-[1rem] bg-[#f5f4ec] flex flex-col items-center justify-center group hover:bg-[#fce4ec]/20 transition-colors duration-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[40px] text-[#d0c3c7] group-hover:text-[#6b5a60] transition-colors duration-300 leading-none select-none">
              add_a_photo
            </span>
            <p className="mt-4 font-sans text-sm text-[#4d4447]">Upload a photo</p>
            <p className="text-[10px] text-[#7f7478] mt-1 uppercase tracking-widest">JPG, PNG up to 10MB</p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          aria-label="Upload image"
        />
      </div>

      {/* Gift Box Selection + Preview hint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="space-y-3">
          <label className="block font-sans text-sm font-semibold text-[#6b5a60] tracking-wide uppercase">
            Presentation
          </label>
          <select
            name="box_style"
            value={form.box_style}
            onChange={handleChange}
            className="w-full bg-[#eae8e0] border-none rounded-full px-6 py-4 text-[#1b1c17] font-sans text-sm focus:outline-none focus:bg-white focus:shadow-[0_0_0_1px_rgba(107,90,96,0.15)] transition-all duration-300 cursor-pointer pr-10"
            style={{
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b5a60'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.25rem',
            }}
          >
            <option value="" disabled>Choose your gift box</option>
            {BOX_STYLES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Preview hint */}
        <div className="hidden md:flex items-center gap-4 p-4 bg-[#f5f4ec] rounded-[1rem] opacity-60">
          <div className="w-12 h-12 bg-[#fce4ec] rounded-[0.75rem] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px] text-[#6b5a60] leading-none select-none">
              featured_seasonal_and_gifts
            </span>
          </div>
          <p className="text-xs font-sans italic text-[#4d4447]">
            Your gift will be wrapped in our signature eco-fiber paper.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-[1rem] bg-[#ffdad6] text-[#93000a] text-sm border border-[#ba1a1a]/20">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="pt-8 flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative px-12 py-5 bg-[#6b5a60] text-white rounded-full font-sans font-semibold tracking-widest uppercase text-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploading ? 'Uploading...' : 'Creating...'}
              </>
            ) : (
              'Generate Secret Link'
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#6b5a60] to-[#8d7a81] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>
    </form>
  )
}
