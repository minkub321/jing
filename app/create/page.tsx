import { CreateGiftForm } from '@/components/create-gift-form'
import Link from 'next/link'

export default function CreatePage() {
  return (
    <div className="bg-[#fbf9f1] text-[#1b1c17] min-h-screen flex flex-col">

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fbf9f1]/70 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(27,28,23,0.06)]">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-screen-2xl mx-auto">
          <Link href="/" className="font-serif italic text-2xl text-[#6b5a60]">
            The Ethereal Exchange
          </Link>
          <div className="flex items-center gap-6">
            <button
              className="text-[#6b5a60] hover:opacity-80 transition-opacity duration-300 scale-95"
              aria-label="Account"
            >
              <span
                className="material-symbols-outlined text-[28px] leading-none align-middle select-none"
              >
                account_circle
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-32 pb-24 px-6 flex flex-col items-center">

        {/* Header Section */}
        <header className="text-center mb-16 max-w-2xl">
          <h1 className="font-serif italic text-5xl md:text-6xl text-[#6b5a60] mb-4 leading-tight text-balance">
            Craft Your Moment
          </h1>
          <p className="font-sans text-[#4d4447] tracking-wide uppercase text-xs">
            Transform a simple gift into a lasting memory
          </p>
        </header>

        {/* Central Form Card */}
        <section className="w-full max-w-2xl bg-white rounded-[1rem] shadow-[0_12px_32px_-4px_rgba(27,28,23,0.06)] p-8 md:p-12 relative overflow-hidden">
          {/* Asymmetric decorative blob */}
          <div
            className="absolute -top-12 -right-12 w-32 h-32 bg-[#fce4ec] rounded-full opacity-40 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <CreateGiftForm />
        </section>

        {/* Bottom Informational Grid (Bento style) */}
        <section className="mt-24 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'lock',          title: 'Encrypted',      desc: 'Your messages are private and readable only by the recipient.' },
            { icon: 'auto_awesome',  title: 'Magical Reveal', desc: 'An interactive unwrapping experience designed for delight.' },
            { icon: 'schedule',      title: 'Ephemeral',      desc: 'Links can be set to expire after the first opening.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-8 bg-[#f5f4ec] rounded-[1rem] flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-[32px] text-[#6b5a60] mb-4 leading-none select-none">
                {icon}
              </span>
              <h3 className="font-serif text-lg mb-2">{title}</h3>
              <p className="text-xs text-[#4d4447] font-sans leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>
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
            &copy; 2024 The Ethereal Exchange. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
