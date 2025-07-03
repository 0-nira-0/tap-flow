import { useState, useCallback, RefObject } from 'react'

interface ParallaxStyle {
  transform: string
}

export function useMouseParallax(
  ref: RefObject<HTMLElement>,
  maxDegrees = 8
): { style: ParallaxStyle; handlers: { onMouseMove: (e: React.MouseEvent) => void; onMouseLeave: () => void } } {
  const [style, setStyle] = useState<ParallaxStyle>({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' })

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    const rotateY = dx * maxDegrees
    const rotateX = -dy * maxDegrees
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    })
  }, [ref, maxDegrees])

  const onMouseLeave = useCallback(() => {
    setStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' })
  }, [])

  return { style, handlers: { onMouseMove, onMouseLeave } }
}
