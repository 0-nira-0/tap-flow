import { useState, useCallback } from 'react'

interface SpotlightStyle {
  background: string
}

export function useCursorSpotlight() {
  const [spotStyle, setSpotStyle] = useState<SpotlightStyle>({
    background: 'transparent',
  })

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setSpotStyle({
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(138,43,226,0.15), transparent 60%)`,
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    setSpotStyle({ background: 'transparent' })
  }, [])

  return { spotStyle, handlers: { onMouseMove, onMouseLeave } }
}
