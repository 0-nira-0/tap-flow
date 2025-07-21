import { AnimatePresence, motion } from 'framer-motion'

interface PhoneScreenProps {
  step: number
}

function SpotifyScreen() {
  return (
    <div className="w-full h-full bg-[#121212] rounded-[20px] p-5 flex flex-col justify-between">
      <div className="text-xs text-gray-400 font-body">Now Playing</div>
      <div>
        <div className="w-full aspect-square bg-gradient-to-br from-purple-900 to-primary/60 rounded-lg mb-4 flex items-center justify-center text-4xl">
          ♪
        </div>
        <div className="font-display font-semibold text-white text-base">Morning Vibes</div>
        <div className="text-gray-400 text-sm font-body">Chill Mix • 32 songs</div>
        <div className="mt-3">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-[#1DB954] rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1:23</span><span>3:47</span>
          </div>
        </div>
        <div className="flex justify-around items-center mt-4 text-white">
          <span className="text-lg opacity-60">⏮</span>
          <span className="text-3xl">⏸</span>
          <span className="text-lg opacity-60">⏭</span>
        </div>
      </div>
      <div className="text-xs text-gray-600 font-body">Bluetooth: Kitchen Speaker</div>
    </div>
  )
}

function MapsScreen() {
  return (
    <div className="w-full h-full bg-[#1C2526] rounded-[20px] p-5 flex flex-col justify-between">
      <div className="text-xs text-secondary font-body font-medium">Navigation</div>
      <div className="flex-1 flex items-center justify-center my-3">
        <div className="w-full h-32 bg-[#2A3A3C] rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-500" />
            <div className="absolute top-1/3 left-0 right-0 h-px bg-gray-600" />
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-600" />
          </div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
            <path d="M20,60 Q60,20 100,40 Q140,60 180,30" stroke="#00FFFF" strokeWidth="3" fill="none" strokeDasharray="4 2"/>
          </svg>
          <div className="absolute bottom-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>
      <div>
        <div className="font-display font-bold text-white text-xl">23 min</div>
        <div className="text-gray-400 text-sm font-body">via Main St · 12.4 km</div>
        <div className="mt-3 bg-secondary/10 border border-secondary/20 rounded-lg p-2 text-center">
          <span className="text-secondary text-sm font-body">Navigation started</span>
        </div>
      </div>
    </div>
  )
}

function NightScreen() {
  return (
    <div className="w-full h-full bg-[#0A0A0F] rounded-[20px] p-5 flex flex-col justify-between">
      <div className="text-xs text-gray-500 font-body">22:47</div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🌙</div>
        <div className="font-display font-semibold text-white text-base text-center">Do Not Disturb</div>
        <div className="text-gray-500 text-sm font-body text-center">Until 7:00 AM</div>
        <div className="bg-white/5 rounded-lg p-3 text-center w-full border border-white/10">
          <div className="text-gray-400 text-xs font-body">Alarm set for</div>
          <div className="font-display text-2xl font-bold text-white mt-1">07:00</div>
        </div>
      </div>
      <div className="flex justify-around">
        {['💡','🔌','🌡️'].map((icon, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg opacity-40">{icon}</div>
            <div className="text-xs text-gray-600 font-body">Off</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const screens = [SpotifyScreen, MapsScreen, NightScreen]

export default function PhoneScreen({ step }: PhoneScreenProps) {
  const Screen = screens[step] ?? SpotifyScreen

  return (
    <div
      className="relative mx-auto rounded-[32px] border-2 border-white/10 overflow-hidden"
      style={{ width: '240px', aspectRatio: '9/19.5', background: '#0d0d0d' }}
    >
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/10 rounded-full z-10" />
      <div className="absolute inset-x-0 top-6 bottom-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

