import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8A2BE2',
        secondary: '#00FFFF',
        dark: '#050505',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        card: '8px',
        lg: '12px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(138,43,226,0.4)',
        'glow-cyan': '0 0 20px rgba(0,255,255,0.4)',
        'glow-sm': '0 0 10px rgba(138,43,226,0.3)',
      },
      backdropBlur: {
        glass: '10px',
      },
    },
  },
  plugins: [],
}

export default config
