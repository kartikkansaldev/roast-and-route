import { motion } from 'framer-motion'
import { useAppStore } from '../AppContext'

// ─────────────────────────────────────────────────────────────
//  Header — top status bar with Survival + Vault pills
//  Props:
//    survivalRating  number   0-100
//    vaultBalance    number   rupees
// ─────────────────────────────────────────────────────────────

const pillVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export default function Header({ survivalRating, vaultBalance }) {
  const { setActiveTab } = useAppStore()

  return (
    <div className="flex items-center justify-between pt-3 mb-6 relative">

      {/* Pills Container */}
      <div className="flex gap-2">
        {/* Survival Pill */}
        <motion.button
          variants={pillVariants}
          initial="hidden"
          animate="visible"
          transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.05 }}
          whileTap={{ scale: 0.93 }}
          className="flex items-center gap-2 px-3 py-[7px] rounded-full
                   bg-white/5 border border-[rgba(52,201,122,0.28)]
                   backdrop-blur-md cursor-pointer select-none"
        >
          {/* Label + bar stacked */}
          <div className="flex flex-col gap-[3px]">
            <span className="text-[9px] font-medium tracking-widest uppercase text-white/45">
              survival
            </span>
            {/* Progress track */}
            <div className="w-9 h-[3px] rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="rating-fill"
                initial={{ width: 0 }}
                animate={{ width: `${survivalRating}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>
          </div>
          {/* Value */}
          <span className="text-[13px] font-bold tracking-tight text-accent leading-none">
            {survivalRating}/100 🔋
          </span>
        </motion.button>

        {/* Vault Pill */}
        <motion.button
          variants={pillVariants}
          initial="hidden"
          animate="visible"
          transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.12 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setActiveTab('wallet')}
          className="flex items-center gap-2 px-3 py-[7px] rounded-full
                   bg-white/5 border border-[rgba(212,174,90,0.28)]
                   backdrop-blur-md cursor-pointer select-none "
        >
          <span className="text-[9px] font-bold tracking-widest uppercase text-white/45">
            vault
          </span>
          <span className="text-[13px] font-bold tracking-tight text-gold leading-none">
            ₹{vaultBalance.toLocaleString('en-IN')} 💰
          </span>
        </motion.button>
      </div>

      {/* Profile Icon Avatar */}
      <motion.button
        variants={pillVariants}
        initial="hidden"
        animate="visible"
        transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.20 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setActiveTab('profile')}
        className="w-10 h-10 rounded-full bg-[#6342ff] flex items-center justify-center
                   shadow-sm cursor-pointer border-2 border-transparent"
      >
        <span className="text-white text-[15px] font-bold leading-none">K</span>
      </motion.button>

    </div>
  )
}
