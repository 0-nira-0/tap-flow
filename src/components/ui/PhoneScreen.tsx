import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import {
  AlarmIcon,
  BatteryIcon,
  BulbIcon,
  CalendarIcon,
  CheckIcon,
  HeadsetIcon,
  MoonIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  SignalIcon,
  SpeakerIcon,
  TapIcon,
  TurnRightIcon,
  WifiIcon,
} from './icons'

interface PhoneScreenProps {
  step: number
}

interface SceneProps {
  // changes on every NFC tap, so the routine's actions replay
  tapId: number
}

// keeps clicks on in-screen controls from also replaying the tap
const stop = (e: MouseEvent) => e.stopPropagation()

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function ActionChip({ icon, label, delay, tapId }: { icon: ReactNode; label: string; delay: number; tapId: number }) {
  return (
    <motion.span
      key={tapId}
      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 pl-1.5 pr-2.5 py-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
    >
      <span className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center text-white">{icon}</span>
      <span className="text-[9px] font-medium text-white/80 whitespace-nowrap">{label}</span>
    </motion.span>
  )
}

function Toggle({ on, onClick, color }: { on: boolean; onClick: () => void; color: string }) {
  return (
    <button
      onClick={e => { stop(e); onClick() }}
      aria-pressed={on}
      className="relative w-[30px] h-[18px] rounded-full transition-colors duration-300 flex-shrink-0"
      style={{ background: on ? color : 'rgba(255,255,255,0.18)' }}
    >
      <span
        className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform duration-300"
        style={{ transform: on ? 'translateX(12px)' : 'translateX(0)' }}
      />
    </button>
  )
}

// ── Morning: music starts on the kitchen speaker ─────────

const tracks = [
  ['Morning Vibes', 'Chill Mix'],
  ['Golden Hour', 'Lo-fi Beats'],
  ['Slow Start', 'Acoustic Mornings'],
]
const TRACK_LENGTH = 227

function MusicScreen({ tapId }: SceneProps) {
  const [playing, setPlaying] = useState(true)
  const [track, setTrack] = useState(0)
  const [elapsed, setElapsed] = useState(83)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setElapsed(s => (s + 1) % TRACK_LENGTH), 1000)
    return () => clearInterval(id)
  }, [playing])

  const skip = (dir: number) => {
    setTrack(t => (t + dir + tracks.length) % tracks.length)
    setElapsed(0)
    setPlaying(true)
  }

  return (
    <div className="absolute inset-0 pt-[46px] pb-7 px-4 flex flex-col" style={{ background: 'linear-gradient(180deg, #2a1452 0%, #120a22 55%, #0b0b10 100%)' }}>
      <div className="flex items-center gap-1.5 text-white/50 text-[9px] font-medium">
        <SpeakerIcon size={11} /> Kitchen speaker
      </div>

      <motion.div
        className="relative mt-3 w-full aspect-square rounded-[18px] overflow-hidden shadow-[0_18px_40px_-12px_rgba(138,43,226,0.7)]"
        style={{
          background:
            'radial-gradient(circle at 28% 24%, rgba(255,214,140,0.9) 0%, rgba(255,214,140,0) 34%), radial-gradient(circle at 78% 78%, rgba(0,255,255,0.45) 0%, rgba(0,255,255,0) 46%), linear-gradient(140deg, #3b0f7a 0%, #8A2BE2 60%, #b05cff 100%)',
        }}
        animate={{ scale: playing ? 1 : 0.94 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className="absolute inset-x-3 bottom-3 font-display font-bold text-white/90 text-[15px] leading-none tracking-tight">
          {tracks[track][0].split(' ')[0]}
        </div>
      </motion.div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="font-display font-semibold text-white text-[14px] truncate">{tracks[track][0]}</div>
          <div className="text-white/50 text-[10px] truncate">{tracks[track][1]}</div>
        </div>
        <div className="flex items-end gap-[2px] h-3 mb-1" aria-hidden>
          {[0, 0.2, 0.4, 0.1].map(d => (
            <span
              key={d}
              className="w-[3px] h-full rounded-full bg-[#1DB954] origin-bottom"
              style={{ animation: playing ? `eq 0.9s ease-in-out ${d}s infinite` : 'none', transform: playing ? undefined : 'scaleY(0.3)' }}
            />
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="h-[3px] rounded-full bg-white/15 overflow-hidden">
          <div className="h-full rounded-full bg-white transition-[width] duration-1000 ease-linear" style={{ width: `${(elapsed / TRACK_LENGTH) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[8px] text-white/40 mt-1 tabular-nums">
          <span>{fmt(elapsed)}</span>
          <span>-{fmt(TRACK_LENGTH - elapsed)}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-6 text-white">
        <button onClick={e => { stop(e); skip(-1) }} aria-label="Previous track" className="opacity-80 hover:opacity-100 transition-opacity">
          <PrevIcon size={20} />
        </button>
        <button
          onClick={e => { stop(e); setPlaying(p => !p) }}
          aria-label={playing ? 'Pause' : 'Play'}
          className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center active:scale-95 transition-transform"
        >
          {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
        </button>
        <button onClick={e => { stop(e); skip(1) }} aria-label="Next track" className="opacity-80 hover:opacity-100 transition-opacity">
          <NextIcon size={20} />
        </button>
      </div>

      <div className="mt-auto flex flex-wrap gap-1.5">
        <ActionChip tapId={tapId} delay={0.6} icon={<BulbIcon size={10} />} label="Lights 80%" />
        <ActionChip tapId={tapId} delay={0.8} icon={<CalendarIcon size={10} />} label="Standup 9:30" />
      </div>
    </div>
  )
}

// ── Drive: navigation starts and the playlist resumes ────

const ROUTE = 'M42 352 C 58 322, 50 296, 96 280 S 170 236, 150 192 S 118 156, 168 134'

function MapsScreen({ tapId }: SceneProps) {
  const reduce = useReducedMotion()
  const [handsFree, setHandsFree] = useState(true)

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0f1a1c' }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 222 502" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect x="120" y="300" width="80" height="70" rx="8" fill="#12302a" />
        <rect x="18" y="150" width="60" height="90" rx="8" fill="#152427" />
        <path d="M0 120 L222 96 M0 260 L222 230 M0 400 L222 360 M60 0 L84 502 M150 0 L176 502" stroke="#22363a" strokeWidth="9" />
        <path d="M0 330 L222 300 M110 0 L120 502" stroke="#1b2c2f" strokeWidth="4" />
        <path id="tf-route" d={ROUTE} fill="none" stroke="rgba(0,255,255,0.18)" strokeWidth="9" strokeLinecap="round" />
        <motion.path
          key={tapId}
          d={ROUTE}
          fill="none"
          stroke="#00FFFF"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
        />
        <circle cx="168" cy="134" r="6" fill="#8A2BE2" stroke="#fff" strokeWidth="2" />
        {/* the car drives along the route; it waits at the start under reduced motion */}
        <g transform={reduce ? 'translate(42 352)' : undefined}>
          <circle r="7" fill="#00FFFF" fillOpacity="0.25" />
          <circle r="4" fill="#fff" />
          {!reduce && (
            <animateMotion dur="10s" repeatCount="indefinite" rotate="auto"><mpath href="#tf-route" /></animateMotion>
          )}
        </g>
      </svg>

      <motion.div
        key={`turn-${tapId}`}
        className="absolute left-3 right-3 top-[44px] rounded-2xl p-2.5 flex items-center gap-2.5"
        style={{ background: 'rgba(10,20,22,0.92)', border: '1px solid rgba(0,255,255,0.18)' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-black" style={{ background: '#00FFFF' }}>
          <TurnRightIcon size={18} />
        </span>
        <div>
          <div className="text-white font-display font-semibold text-[13px] leading-tight">400 m</div>
          <div className="text-white/60 text-[9px]">Turn right onto Main St</div>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] px-4 pt-3 pb-7" style={{ background: 'rgba(12,16,18,0.96)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="mx-auto w-8 h-1 rounded-full bg-white/20 mb-2.5" />
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-white text-[22px] leading-none">23 min</span>
          <span className="text-[#30d158] text-[9px] font-medium">fastest</span>
        </div>
        <div className="text-white/50 text-[9px] mt-1">12.4 km · arrive 8:38</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button onClick={e => { stop(e); setHandsFree(v => !v) }} aria-pressed={handsFree}>
            <ActionChip tapId={tapId} delay={0.9} icon={<HeadsetIcon size={10} />} label={handsFree ? 'Hands-free on' : 'Hands-free off'} />
          </button>
          <ActionChip tapId={tapId} delay={1.1} icon={<PlayIcon size={9} />} label="Playlist resumed" />
        </div>
      </div>
    </div>
  )
}

// ── Night: lights off, Do Not Disturb, alarm ─────────────

const nightActions = [
  { Icon: BulbIcon, label: 'Lights', on: 'On', off: 'Off', from: true, to: false },
  { Icon: MoonIcon, label: 'Do Not Disturb', on: 'On', off: 'Off', from: false, to: true },
  { Icon: AlarmIcon, label: 'Alarm', on: '7:00', off: 'Off', from: false, to: true },
]

const stars = [[24, 70], [62, 112], [180, 64], [198, 140], [140, 104], [36, 196], [190, 214], [96, 58]]

function NightScreen({ tapId }: SceneProps) {
  const [states, setStates] = useState(nightActions.map(a => a.from))

  // after each tap the routine flips the switches one by one
  useEffect(() => {
    setStates(nightActions.map(a => a.from))
    const timers = nightActions.map((a, i) =>
      setTimeout(() => setStates(s => s.map((v, j) => (j === i ? a.to : v))), 700 + i * 350),
    )
    return () => timers.forEach(clearTimeout)
  }, [tapId])

  return (
    <div className="absolute inset-0 pt-[46px] pb-7 px-4 flex flex-col" style={{ background: 'radial-gradient(120% 60% at 50% 0%, #1d1240 0%, #08080d 60%)' }}>
      {stars.map(([x, y]) => (
        <span key={`${x}-${y}`} className="absolute w-[2px] h-[2px] rounded-full bg-white/50" style={{ left: x, top: y }} />
      ))}

      <div className="relative mt-6 text-center">
        <div className="inline-flex items-center gap-1 text-[9px] text-[#b79cff] font-medium">
          <MoonIcon size={10} /> Sleep focus
        </div>
        <div className="font-display font-light text-white text-[54px] leading-none mt-1 tabular-nums">22:47</div>
        <div className="text-white/45 text-[10px] mt-1">Alarm tomorrow at 7:00</div>
      </div>

      <div className="relative mt-auto rounded-2xl p-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {nightActions.map((a, i) => (
          <div key={a.label} className={`flex items-center gap-2.5 px-2 py-2 ${i > 0 ? 'border-t border-white/5' : ''}`}>
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300"
              style={{ background: states[i] ? 'rgba(138,43,226,0.35)' : 'rgba(255,255,255,0.08)', color: states[i] ? '#d7c2ff' : 'rgba(255,255,255,0.5)' }}
            >
              <a.Icon size={14} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[11px] font-medium leading-tight">{a.label}</div>
              <div className="text-white/40 text-[9px]">{states[i] ? a.on : a.off}</div>
            </div>
            <Toggle on={states[i]} color="#8A2BE2" onClick={() => setStates(s => s.map((v, j) => (j === i ? !v : v)))} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Phone ────────────────────────────────────────────────

const scenes = [
  { time: '7:42', tag: 'Coffee tag', routine: 'Morning routine', accent: '#8A2BE2', Screen: MusicScreen },
  { time: '8:15', tag: 'Car tag', routine: 'Drive mode', accent: '#00FFFF', Screen: MapsScreen },
  // the lock screen shows its own big clock, so the status bar stays empty
  { time: '', tag: 'Bedside tag', routine: 'Night mode', accent: '#8A2BE2', Screen: NightScreen },
]

export default function PhoneScreen({ step }: PhoneScreenProps) {
  const scene = scenes[step] ?? scenes[0]
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.4 })
  const reduce = useReducedMotion()
  const [tapId, setTapId] = useState(0)
  const [islandOpen, setIslandOpen] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const tap = useCallback(() => setTapId(id => id + 1), [])

  // a new step means the phone just touched a new tag
  useEffect(() => {
    if (inView) tap()
  }, [step, inView, tap])

  useEffect(() => {
    if (tapId === 0) return
    setIslandOpen(true)
    const t = setTimeout(() => setIslandOpen(false), 2200)
    return () => clearTimeout(t)
  }, [tapId])

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 })
  }

  return (
    <div
      ref={rootRef}
      data-theme="dark"
      onClick={tap}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      title="Tap the phone to replay"
      className="relative mx-auto cursor-pointer select-none"
      style={{
        width: '240px',
        aspectRatio: '9/19.5',
        transform: `perspective(900px) rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 8}deg)`,
        transition: 'transform 0.25s ease-out',
      }}
    >
      {/* side buttons */}
      {[[96, 18], [128, 34], [170, 34]].map(([top, h]) => (
        <span key={top} className="absolute -left-[3px] w-[3px] rounded-l-sm" style={{ top, height: h, background: 'linear-gradient(90deg, #2a2a33, #55555f)' }} />
      ))}
      <span className="absolute -right-[3px] top-[150px] w-[3px] h-[56px] rounded-r-sm" style={{ background: 'linear-gradient(90deg, #55555f, #2a2a33)' }} />

      {/* titanium frame */}
      <div
        className="absolute inset-0 rounded-[46px] p-[3px]"
        style={{
          background: 'linear-gradient(145deg, #6a6a76 0%, #24242c 22%, #3a3a44 55%, #1a1a20 78%, #5c5c68 100%)',
          boxShadow: '0 40px 80px -30px rgba(0,0,0,0.75), 0 24px 50px -24px rgba(138,43,226,0.35)',
        }}
      >
        <div className="w-full h-full rounded-[43px] bg-black p-[6px]">
          <div className="relative w-full h-full rounded-[37px] overflow-hidden bg-black">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <scene.Screen tapId={tapId} />
              </motion.div>
            </AnimatePresence>

            {/* NFC ripple from the antenna at the top of the phone */}
            {tapId > 0 && [0, 0.18].map(d => (
              <motion.span
                key={`${tapId}-${d}`}
                className="absolute left-1/2 top-[14%] w-20 h-20 -ml-10 -mt-10 rounded-full border-2 pointer-events-none z-10"
                style={{ borderColor: scene.accent }}
                initial={{ scale: 0.2, opacity: 0.8 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{ duration: 1.1, delay: d, ease: 'easeOut' }}
              />
            ))}

            {/* status bar */}
            <div className="absolute top-0 inset-x-0 h-[42px] px-[22px] flex items-center justify-between text-white z-20 pointer-events-none">
              <span className="text-[11px] font-semibold tabular-nums">{scene.time}</span>
              <span className="flex items-center gap-1">
                <SignalIcon size={11} />
                <WifiIcon size={11} />
                <BatteryIcon size={9} />
              </span>
            </div>

            {/* Dynamic Island: grows into a live activity on each tap */}
            <motion.div
              className="absolute inset-x-0 mx-auto top-[9px] z-30 bg-black rounded-[22px] overflow-hidden flex items-center"
              initial={false}
              animate={islandOpen ? { width: 196, height: 44 } : { width: 72, height: 22 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              <AnimatePresence>
                {islandOpen && (
                  <motion.div
                    className="flex items-center gap-2 w-full px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  >
                    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${scene.accent}33`, color: scene.accent }}>
                      <TapIcon size={15} />
                    </span>
                    <span className="flex-1 min-w-0 leading-tight">
                      <span className="block text-[8px] uppercase tracking-wider text-white/50">{scene.tag}</span>
                      <span className="block text-[11px] font-semibold text-white truncate">{scene.routine}</span>
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#30d158] text-black flex items-center justify-center flex-shrink-0">
                      <CheckIcon size={11} />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* home indicator */}
            <div className="absolute bottom-[7px] inset-x-0 mx-auto w-[84px] h-[4px] rounded-full bg-white/70 z-20 pointer-events-none" />

            {/* glass glare, follows the tilt */}
            <div
              className="absolute inset-0 pointer-events-none z-40"
              style={{
                background: `linear-gradient(${118 + tilt.x * 14}deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 26%, rgba(255,255,255,0) 42%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
