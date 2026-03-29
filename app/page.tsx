import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="bg-[#fbf9f1] text-[#1b1c17] min-h-screen flex flex-col">

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fbf9f1]/70 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(27,28,23,0.06)]">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-screen-2xl mx-auto">
          <span className="font-serif italic text-2xl text-[#6b5a60]">The Ethereal Exchange</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-24 relative">
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#fce4ec] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f4dce4] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-50" />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">

          {/* Floating gift icon */}
          <div className="floating mx-auto w-fit mb-10">
            <div className="w-28 h-28 rounded-[2rem] bg-[#fce4ec] flex items-center justify-center shadow-[0_12px_40px_-8px_rgba(107,90,96,0.25)]">
              <svg viewBox="0 0 48 48" className="w-14 h-14" fill="none" aria-hidden="true">
                <rect x="6" y="22" width="36" height="22" rx="3" fill="#6b5a60" />
                <rect x="4" y="16" width="40" height="8" rx="3" fill="#524249" />
                <rect x="21" y="16" width="6" height="28" fill="#fce4ec" opacity="0.8" />
                <rect x="4" y="24" width="40" height="6" fill="#fce4ec" opacity="0.8" />
                <ellipse cx="18" cy="17" rx="7" ry="5" fill="#f4dce4" style={{ transform: 'rotate(-25deg)', transformOrigin: '23px 17px' }} />
                <ellipse cx="30" cy="17" rx="7" ry="5" fill="#f4dce4" style={{ transform: 'rotate(25deg)', transformOrigin: '25px 17px' }} />
                <circle cx="24" cy="17" r="4" fill="#6b5a60" />
                <circle cx="24" cy="17" r="2.5" fill="#f4dce4" />
              </svg>
            </div>
          </div>

          <h1 className="font-serif italic text-5xl md:text-6xl text-[#6b5a60] leading-tight text-balance mb-4">
            Craft Your Moment
          </h1>
          <p className="font-sans text-[#4d4447] leading-relaxed text-base md:text-lg text-pretty max-w-md mx-auto mb-10 tracking-wide">
            Transform a simple gift into a lasting memory. Write from the heart, choose your wrapping, and share a secret link.
          </p>

          <Link
            href="/create"
            className="group relative inline-flex items-center px-12 py-5 bg-[#6b5a60] text-white rounded-full font-sans font-semibold tracking-widest uppercase text-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10">Generate Secret Link</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#6b5a60] to-[#8d7a81] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          {/* Bento info grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Encrypted', desc: 'Your messages are private and readable only by the recipient.' },
              { title: 'Magical Reveal', desc: 'An interactive unwrapping experience designed for delight.' },
              { title: 'Ephemeral', desc: 'Links can be set to expire after the first opening.' },
            ].map(({ title, desc }) => (
              <div key={title} className="p-8 bg-[#f5f4ec] rounded-[1rem] flex flex-col items-center text-center shadow-[0_12px_32px_-4px_rgba(27,28,23,0.06)]">
                <h3 className="font-serif text-lg mb-2 text-[#1b1c17]">{title}</h3>
                <p className="text-xs text-[#4d4447] font-sans leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-[#f5f4ec]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-screen-2xl mx-auto">
          <div className="font-serif text-lg text-[#6b5a60]">The Ethereal Exchange</div>
          <div className="flex gap-8">
            {['Journal', 'Curations', 'Privacy', 'Contact'].map(item => (
              <a
                key={item}
                href="#"
                className="font-sans text-xs uppercase tracking-widest text-[#1b1c17]/40 hover:text-[#6b5a60] transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="font-sans text-xs uppercase tracking-widest text-[#1b1c17]/40">
            &copy; 2025 The Ethereal Exchange. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
