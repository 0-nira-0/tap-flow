import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

export default function Footer() {
  const [qrHovered, setQrHovered] = useState(false)
  const [glitching, setGlitching] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const skewX = useTransform(mouseX, [-150, 150], [-3, 3])
  const skewY = useTransform(mouseY, [-150, 150], [-1.5, 1.5])

  const handleQrMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  const handleQrEnter = () => {
    setQrHovered(true)
    let count = 0
    const interval = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 200)
      count++
      if (count >= 3) clearInterval(interval)
    }, 400)
  }

  const handleQrLeave = () => {
    setQrHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <footer id="footer" style={{ background: '#050505' }}>
      {/* fullscreen CTA */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      >
        {/* big background text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="font-display font-bold text-white opacity-[0.02] text-center leading-none"
            style={{ fontSize: 'clamp(80px, 20vw, 240px)' }}
          >
            TAP
          </span>
        </div>

        {/* ambient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.12), transparent 70%)', filter: 'blur(100px)' }} />

        <motion.h2
          className="font-display font-bold text-white text-center relative z-10 mb-10"
          style={{ fontSize: 'clamp(48px, 10vw, 140px)' }}
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
          <button className="font-body font-medium px-8 py-4 rounded border border-primary text-white transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(138,43,226,0.4)]">
            Download for iOS
          </button>
          <button className="font-body font-medium px-8 py-4 rounded border border-white/20 text-white/70 transition-all duration-300 hover:border-secondary/60 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            Download for Android
          </button>
        </motion.div>

        {/* QR Code */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="font-body text-xs text-white/30 uppercase tracking-widest">Scan to download</p>
          <div
            className="relative cursor-pointer p-3 rounded-lg glass"
            onMouseMove={handleQrMouseMove}
            onMouseEnter={handleQrEnter}
            onMouseLeave={handleQrLeave}
          >
            <motion.div
              style={{ skewX, skewY }}
              className={glitching ? 'animate-glitch' : ''}
            >
              <QRCodeSVG
                value="https://tapflow.app/download"
                size={160}
                fgColor="#FFFFFF"
                bgColor="transparent"
                level="M"
              />
            </motion.div>
            {qrHovered && (
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(138,43,226,0.2), transparent 60%)' }}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/5 px-6 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display font-bold text-white text-xl">TapFlow</div>

          <nav className="flex flex-wrap justify-center gap-6">
            {['Features', 'How it works', 'Shop', 'Privacy', 'Terms'].map(link => (
              <a
                key={link}
                href="#"
                className="font-body text-sm text-white/40 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="flex gap-4">
            {['𝕏', 'in', 'ig'].map(icon => (
              <a
                key={icon}
                href="#"
                className="w-8 h-8 rounded glass flex items-center justify-center font-body text-sm text-white/40 hover:text-white hover:border-primary/40 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/5 text-center">
          <p className="font-body text-xs text-white/20">
            © 2025 TapFlow. All rights reserved. Built with precision and intent.
          </p>
        </div>
      </div>
    </footer>
  )
}
