import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  visible: boolean
}

export default function Preloader({ visible }: PreloaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: '#050505' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="relative">
            {/* outer ring */}
            <motion.div
              className="w-20 h-20 rounded-full border border-primary/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* inner ring */}
            <motion.div
              className="absolute inset-3 rounded-full border border-secondary/40"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
            {/* core dot */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-3 h-3 rounded-full bg-primary" />
            </motion.div>
          </div>

          <motion.p
            className="font-display font-bold text-white text-2xl mt-6 tracking-tight"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            TapFlow
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
