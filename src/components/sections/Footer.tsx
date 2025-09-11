import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

const navLinks: [string, string][] = [
  ['Features', '#features'],
  ['How it works', '#how-it-works'],
  ['Shop', '#shop'],
  ['Privacy', '#'],
  ['Terms', '#'],
]

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href === '#') return
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="footer" style={{ background: 'var(--c-bg)' }}>
      {/* fullscreen CTA */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* big background text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="font-display font-bold text-center leading-none"
            style={{ fontSize: 'clamp(80px, 20vw, 240px)', color: 'var(--c-text)', opacity: 0.02 }}
          >
            TAP
          </span>
        </div>

        {/* ambient blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.12), transparent 70%)', filter: 'blur(100px)' }}
        />

        <motion.h2
          className="font-display font-bold text-center relative z-10 mb-10"
          style={{ fontSize: 'clamp(48px, 10vw, 140px)', color: 'var(--c-text)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Ready to<br />
          <span style={{ color: '#8A2BE2' }}>tap in?</span>
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            className="font-body font-medium px-8 py-4 rounded border border-primary transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(138,43,226,0.4)]"
            style={{ color: 'var(--c-text)' }}
          >
            Download for iOS
          </button>
          <button
            className="font-body font-medium px-8 py-4 rounded border border-white/20 transition-all duration-300 hover:border-secondary/60 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            style={{ color: 'var(--c-text-70)' }}
          >
            Download for Android
          </button>
        </motion.div>

        {/* QR Code — no hover effects */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: 'var(--c-text-30)' }}>
            Scan to download
          </p>
          <div className="p-3 rounded-lg glass">
            <QRCodeSVG
              value="https://tapflow.app/download"
              size={160}
              fgColor="#FFFFFF"
              bgColor="transparent"
              level="M"
            />
          </div>
        </motion.div>
      </div>

      {/* bottom bar */}
      <div className="border-t px-6 lg:px-12 py-10" style={{ borderColor: 'var(--c-border-faint)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display font-bold text-xl" style={{ color: 'var(--c-text)' }}>TapFlow</div>

          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={e => { e.preventDefault(); scrollTo(href) }}
                className="font-body text-sm transition-colors duration-200 hover:text-white"
                style={{ color: 'var(--c-text-40)' }}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex gap-4">
            {(['𝕏', 'in', 'ig'] as const).map(icon => (
              <a
                key={icon}
                href="#"
                className="w-8 h-8 rounded glass flex items-center justify-center font-body text-sm transition-all duration-200 hover:border-primary/40"
                style={{ color: 'var(--c-text-40)' }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 pt-6 text-center" style={{ borderTop: '1px solid var(--c-border-faint)' }}>
          <p className="font-body text-xs" style={{ color: 'var(--c-text-20)' }}>
            © 2025 TapFlow. All rights reserved. Built with precision and intent.
          </p>
        </div>
      </div>
    </footer>
  )
}
