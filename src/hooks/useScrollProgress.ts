import { useState, useEffect, useRef } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const el = ref.current
      const rect = el.getBoundingClientRect()
      const sectionTop = window.scrollY + rect.top
      const sectionHeight = el.offsetHeight
      // the sticky frame (first child) is 100svh; window.innerHeight changes
      // whenever mobile browser bars slide in or out
      const frame = el.firstElementChild as HTMLElement | null
      const viewportHeight = frame?.offsetHeight ?? window.innerHeight

      const scrolled = window.scrollY - sectionTop
      const scrollable = sectionHeight - viewportHeight
      const raw = scrolled / scrollable

      setProgress(Math.max(0, Math.min(1, raw)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return { ref, progress }
}
