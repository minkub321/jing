'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

type Props = {
  id: string
  message: string
  senderName: string
  recipientName: string
  boxStyle: string
  imageUrl: string | null
  alreadyOpened: boolean
}

type Particle = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'rect' | 'circle' | 'diamond'
  opacity: number
}

const CONFETTI_COLORS = [
  '#6b5a60', '#fce4ec', '#f4dce4', '#d7c1c8',
  '#c1c9b8', '#dde5d3', '#524249', '#76646b',
  '#ffb3c6', '#a29bfe', '#c9a84c', '#e8c97a',
]

const BOX_THEMES: Record<string, { lid: string; body: string; ribbon: string; bow: string; shadow: string }> = {
  simple:   { lid: '#6b5a60', body: '#524249', ribbon: '#f4dce4', bow: '#fce4ec', shadow: 'rgba(107,90,96,0.25)' },
  romantic: { lid: '#c9184a', body: '#a4133c', ribbon: '#ffb3c6', bow: '#ff8fab', shadow: 'rgba(201,24,74,0.25)' },
  surprise: { lid: '#e67e22', body: '#ca6f1e', ribbon: '#a29bfe', bow: '#6c5ce7', shadow: 'rgba(230,126,34,0.25)' },
  midnight: { lid: '#2c2c2c', body: '#1a1a1a', ribbon: '#c9a84c', bow: '#e8c97a', shadow: 'rgba(44,44,44,0.25)' },
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 8,
    y: 35,
    vx: (Math.random() - 0.5) * 18,
    vy: -(Math.random() * 14 + 8),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 10 + 5,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    shape: (['rect', 'circle', 'diamond'] as const)[Math.floor(Math.random() * 3)],
    opacity: 1,
  }))
}

async function markOpened(id: string) {
  try { await fetch(`/api/gifts/${id}`, { method: 'PATCH' }) } catch { /* silent */ }
}

export function GiftUnboxing({ id, message, senderName, recipientName, boxStyle, imageUrl, alreadyOpened }: Props) {
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'opening' | 'revealed'>('idle')
  const [particles, setParticles] = useState<Particle[]>([])
  const animRef = useRef<number | null>(null)
  const theme = BOX_THEMES[boxStyle] ?? BOX_THEMES.simple

  function handleOpen() {
    if (phase !== 'idle') return
    setPhase('shaking')

    setTimeout(() => {
      setPhase('opening')
      setParticles(createParticles(80))

      let tick = 0
      function animate() {
        tick++
        setParticles(prev =>
          prev.map(p => ({
            ...p,
            x: p.x + p.vx * 0.085,
            y: p.y + p.vy * 0.085 + tick * 0.055,
            vy: p.vy + 0.32,
            rotation: p.rotation + p.rotationSpeed,
            opacity: Math.max(0, 1 - tick / 55),
          }))
        )
        animRef.current = requestAnimationFrame(animate)
      }
      animRef.current = requestAnimationFrame(animate)

      setTimeout(() => {
        if (animRef.current) cancelAnimationFrame(animRef.current)
        setPhase('revealed')
        if (!alreadyOpened) markOpened(id)
      }, 2200)
    }, 750)
  }

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current) }, [])

  const isIdle     = phase === 'idle'
  const isShaking  = phase === 'shaking'
  const isOpening  = phase === 'opening'
  const isRevealed = phase === 'revealed'

  return (
    <div className="bg-mesh min-h-screen flex flex-col overflow-x-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-fixed rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-50" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#fbf9f1]/70 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(27,28,23,0.06)]">
        <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto w-full">
          <span className="font-serif italic text-2xl text-primary">The Ethereal Exchange</span>
          <span className="material-symbols-outlined text-primary cursor-pointer hover:opacity-70 transition-opacity">account_circle</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-24 relative z-10">
        <div className="w-full max-w-2xl text-center space-y-12">

          {/* ── GIFT BOX SCENE (idle / shaking / opening) ── */}
          {!isRevealed && (
            <>
              {/* Box scene */}
              <div className="relative group">
                {/* Ground shadow */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full blur-2xl transition-all duration-700"
                  style={{
                    bottom: -24,
                    width: isOpening ? 220 : 160,
                    height: 20,
                    background: theme.shadow,
                  }}
                />

                {/* Confetti layer */}
                {(isOpening) && (
                  <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 30 }} aria-hidden="true">
                    {particles.map(p => (
                      <div
                        key={p.id}
                        className="absolute"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          width: p.shape === 'diamond' ? p.size : p.size,
                          height: p.shape === 'rect' ? p.size * 0.45 : p.size,
                          backgroundColor: p.color,
                          borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? 2 : 0,
                          transform: `rotate(${p.rotation}deg) ${p.shape === 'diamond' ? 'skew(20deg, 20deg)' : ''}`,
                          opacity: p.opacity,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* 3D gift box */}
                <div
                  className="relative mx-auto cursor-pointer select-none"
                  style={{
                    width: 240,
                    height: 280,
                    perspective: '800px',
                    animation: isIdle ? 'float 6s ease-in-out infinite' : undefined,
                  }}
                  onClick={handleOpen}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to open the gift box"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpen() }}
                >
                  {/* BOW (above the lid, always visible) */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 z-30 transition-all duration-700"
                    style={{
                      top: isOpening ? -80 : 4,
                      opacity: isOpening ? 0 : 1,
                      transform: `translateX(-50%) ${isOpening ? 'scale(1.3) rotate(-15deg)' : ''}`,
                      animation: isShaking ? 'giftShake 0.1s ease-in-out infinite' : undefined,
                    }}
                  >
                    <span
                      className="material-symbols-outlined drop-shadow-lg"
                      style={{
                        fontSize: 72,
                        color: theme.bow,
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      featured_seasonal_and_gifts
                    </span>
                  </div>

                  {/* LID */}
                  <div
                    className="absolute left-0 right-0 z-20 rounded-t-xl transition-all"
                    style={{
                      top: 56,
                      height: 52,
                      background: theme.lid,
                      transformOrigin: '50% 0%',
                      transform: isOpening
                        ? 'perspective(800px) rotateX(-140deg) translateY(-8px)'
                        : isShaking
                        ? 'perspective(800px) rotateX(-4deg)'
                        : 'perspective(800px) rotateX(0deg)',
                      transition: isOpening
                        ? 'transform 0.75s cubic-bezier(0.34,1.3,0.64,1)'
                        : 'transform 0.18s ease',
                      boxShadow: `0 6px 24px ${theme.shadow}`,
                    }}
                  >
                    {/* Lid ribbon */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 opacity-70" style={{ background: theme.ribbon }} />
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-5 opacity-70" style={{ background: theme.ribbon }} />
                    {/* Lid highlight */}
                    <div className="absolute inset-x-0 top-0 h-3 rounded-t-xl" style={{ background: 'rgba(255,255,255,0.18)' }} />
                  </div>

                  {/* BOX BODY */}
                  <div
                    className="absolute left-0 right-0 bottom-0 rounded-b-xl rounded-t-sm overflow-hidden"
                    style={{
                      top: 108,
                      background: theme.body,
                      boxShadow: `0 24px 48px ${theme.shadow}, inset -8px 0 24px rgba(0,0,0,0.12)`,
                      animation: isShaking ? 'giftShake 0.1s ease-in-out infinite' : undefined,
                    }}
                  >
                    {/* Paper texture overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
                    {/* Body ribbon vertical */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 opacity-70" style={{ background: theme.ribbon }} />
                    {/* Body ribbon horizontal */}
                    <div className="absolute inset-x-0 top-1/3 h-6 opacity-70" style={{ background: theme.ribbon }} />
                    {/* Body shimmer dots */}
                    <div className="absolute w-3 h-3 rounded-full opacity-25" style={{ background: 'white', top: 20, left: 30 }} />
                    <div className="absolute w-2 h-2 rounded-full opacity-20" style={{ background: 'white', bottom: 30, right: 28 }} />
                    {/* "For You" pill */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 bottom-10 bg-white/90 px-4 py-1.5 rounded-full shadow-sm"
                      style={{ opacity: isOpening ? 0 : 1, transition: 'opacity 0.3s' }}
                    >
                      <span className="font-serif italic text-sm" style={{ color: theme.lid }}>For You</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt text */}
              <div className="space-y-3">
                {(isIdle || isShaking) && (
                  <h2 className="font-serif text-3xl md:text-4xl text-primary tracking-tight italic">
                    {isShaking ? 'Opening...' : 'Tap to open your gift'}
                  </h2>
                )}
                {isIdle && (
                  <p className="font-sans text-on-surface-variant max-w-sm mx-auto leading-relaxed text-sm animate-pulse">
                    Something special awaits inside...
                  </p>
                )}
                {isOpening && (
                  <p className="font-sans text-on-surface-variant text-sm animate-pulse">Revealing your surprise...</p>
                )}
              </div>
            </>
          )}

          {/* ── REVEALED CARD ── */}
          {isRevealed && (
            <div
              className="relative w-full bg-surface-container-low rounded-[2rem] p-8 md:p-12 shadow-[0_12px_48px_-8px_rgba(107,90,96,0.18)] overflow-hidden text-left"
              style={{ animation: 'fadeScaleIn 0.75s cubic-bezier(0.34,1.4,0.64,1) both' }}
            >
              {/* Inner decorative frame */}
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-outline-variant/20 rounded-[1.5rem] pointer-events-none" />

              {/* Confetti dots accent (static) */}
              <div className="absolute top-6 right-8 flex gap-1.5" aria-hidden="true">
                {['#6b5a60','#fce4ec','#d7c1c8','#c1c9b8','#dde5d3'].map((c, i) => (
                  <span key={i} className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: c, opacity: 0.6 }} />
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center">
                {/* Photo */}
                {imageUrl ? (
                  <div className="relative flex-shrink-0">
                    <div
                      className="bg-white p-3 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 rounded-2xl overflow-hidden"
                      style={{ width: 224, height: 288 }}
                    >
                      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '0.75rem', overflow: 'hidden' }}>
                        <Image
                          src={imageUrl}
                          alt="Gift image"
                          fill
                          className="object-cover"
                          style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <span
                          className="text-xl opacity-50"
                          style={{ fontFamily: 'var(--font-handwritten)', color: theme.lid }}
                        >
                          {new Date().getFullYear()}
                        </span>
                      </div>
                    </div>
                    {/* Heart accent */}
                    <div
                      className="absolute -bottom-3 -right-3 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: theme.lid }}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  /* No photo: show gift icon */
                  <div
                    className="flex-shrink-0 w-40 h-40 rounded-[2rem] flex items-center justify-center shadow-xl"
                    style={{ background: theme.lid }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 72, color: 'white', fontVariationSettings: "'FILL' 1" }}
                    >
                      featured_seasonal_and_gifts
                    </span>
                  </div>
                )}

                {/* Message */}
                <div className="space-y-5 flex-1 text-center md:text-left">
                  {/* Tag */}
                  <div className="inline-block px-3 py-1 rounded-full" style={{ background: theme.lid + '22' }}>
                    <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.lid }}>
                      Personal Message
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote
                    className="font-serif italic text-2xl md:text-3xl leading-relaxed text-pretty whitespace-pre-wrap"
                    style={{ color: theme.lid }}
                  >
                    &ldquo;{message}&rdquo;
                  </blockquote>

                  {/* Signature */}
                  <div className="space-y-0.5 pt-3">
                    <p
                      className="leading-none"
                      style={{
                        fontFamily: 'var(--font-handwritten)',
                        fontSize: '2.25rem',
                        color: theme.lid,
                        opacity: 0.85,
                      }}
                    >
                      With love,
                    </p>
                    <p className="font-serif font-bold text-xl" style={{ color: theme.lid }}>{senderName}</p>
                  </div>
                </div>
              </div>

              {/* Bottom dots */}
              <div className="mt-10 flex justify-center gap-2" aria-hidden="true">
                {['#6b5a60','#fce4ec','rgba(107,90,96,0.4)','#f4dce4','rgba(107,90,96,0.6)'].map((c, i) => (
                  <span key={i} className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-12 px-8 bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-screen-2xl mx-auto">
          <span className="font-serif italic text-lg text-primary">The Ethereal Exchange</span>
          <nav className="flex gap-8">
            {['Journal', 'Curations', 'Privacy', 'Contact'].map(link => (
              <a key={link} href="#" className="font-sans text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors duration-300">{link}</a>
            ))}
          </nav>
          <p className="font-sans text-xs uppercase tracking-widest text-foreground/40">
            &copy; {new Date().getFullYear()} The Ethereal Exchange
          </p>
        </div>
      </footer>
    </div>
  )
}
