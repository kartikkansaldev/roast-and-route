import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { useAppStore } from '../AppContext'
import { FRIENDS } from '../constants'

// ─────────────────────────────────────────────────────────────
//  Reusable Framer Motion tap-spring wrapper
// ─────────────────────────────────────────────────────────────
function Tappable({ children, className, onClick, delay = 0, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay }}
      whileTap={{ scale: 0.95 }}
      className={`cursor-pointer select-none ${className ?? ''}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Toast (local to MainContent)
// ─────────────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="absolute top-16 left-0 right-0 mx-auto w-fit max-w-[300px]
                     px-4 py-2 rounded-2xl z-[200] pointer-events-none
                     bg-[rgba(14,14,14,0.95)] text-white/80 text-xs font-medium
                     border border-white/10 backdrop-blur-xl
                     shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────
//  MainContent — central scrollable area
// ─────────────────────────────────────────────────────────────
export default function MainContent({ onScanPay }) {
  const { showToast, setActiveTab, setIsBankTransferOpen } = useAppStore()
  const [toast, setToast] = useState(null)

  return (
    <div className="relative">
      <Toast message={toast} />

      {/* ── Greeting ── */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.45 }}
      >
        <p className="text-[11.5px] mb-0.5 text-gray-400">
          good evening
        </p>
        <h1 className="text-[26px] font-bold tracking-[-0.035em] leading-[1.15] text-white">
          sup,{' '}
          <span className="bg-gradient-to-br from-white to-white/65
                           bg-clip-text text-transparent">
            kartik
          </span>{' '}
          👋
        </h1>
      </motion.div>

      {/* ── Hero: Scan & Pay ── */}
      <Tappable delay={0.22} onClick={() => { onScanPay(); showToast('opening camera... point at any QR 📷') }}
        whileHover={{ y: -3 }}
        className="relative w-full rounded-[20px] hero-glass border border-white/15
                           backdrop-blur-xl overflow-hidden mb-3.5
                           shadow-[0_2px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.07),inset_0_-1px_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-5 px-6 py-7 relative z-10">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center
                          bg-white/5 border border-white/10 group-hover:scale-105 transition-transform duration-300">
            <QrIcon />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-bold tracking-tight text-white mb-0.5">
              Scan & Pay
            </p>
            <p className="text-[12px] font-medium" style={{ color: '#9ca3af' }}>
              works on any QR
            </p>
          </div>
          <svg className="flex-shrink-0 w-4 h-4 stroke-white/28" viewBox="0 0 24 24"
            fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </Tappable>

      {/* 3D Roast Cards Horizontal List */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22, duration: 0.45 }}
        className="flex overflow-x-auto snap-x snap-mandatory no-scroll pb-5 -mx-5 px-5"
      >
        <RoastCard showToast={showToast} />
        <div className="flex-shrink-0 w-[240px] h-[170px] rounded-[24px] bg-[#1c1c1c] border border-white/10 
                        border-dashed flex items-center justify-center snap-center cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => showToast('Order physical card - coming soon 📦')}>
          <span className="text-white/40 text-[13px] font-semibold">+ Add New Card</span>
        </div>
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div className="flex gap-2.5 mb-7"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.45 }}>

        <QuickActionButton
          label="balance"
          icon={EyeIcon}
          onClick={() => setActiveTab('wallet')}
        />
        <QuickActionButton
          label="Bank Transfer"
          icon={BankIcon}
          onClick={() => setIsBankTransferOpen(true)}
        />
        <QuickActionButton
          label="history"
          icon={HistoryIcon}
          onClick={() => setActiveTab('wallet')}
        />
      </motion.div>

      {/* ── Pay Friends ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.45 }}>
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[13px] font-semibold tracking-[-0.01em]"
            style={{ color: 'rgba(255,255,255,0.85)' }}>
            pay friends 🤙
          </span>
          <button className="text-[12px] font-medium text-accent opacity-75 hover:opacity-100 transition-opacity">
            see all →
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scroll pb-2">
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <motion.button whileTap={{ scale: 0.91 }} onClick={() => showToast('add friend to pay 👫')}
              className="w-[52px] h-[52px] rounded-full bg-white/5 border-[1.5px] border-dashed
                         border-white/10 flex items-center justify-center text-white/28 text-xl
                         hover:text-white/60 hover:border-white/25 transition-all">+</motion.button>
            <span className="text-[10.5px] text-white/28">add</span>
          </div>
          {FRIENDS.map((f, i) => (
            <motion.div key={f.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.38 + i * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
              whileTap={{ scale: 0.91 }}
              onClick={() => showToast(`sending to ${f.name}... 💸`)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-full p-[2px]"
                style={{ background: f.ring }}>
                <div className="w-full h-full rounded-full flex items-center justify-center
                                text-[19px] outline outline-2 outline-black outline-offset-[-2px]"
                  style={{ background: f.bg }}>
                  {f.emoji}
                </div>
              </div>
              <span className="text-[10.5px] max-w-[52px] truncate text-center text-gray-400">
                {f.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Divider ── */}
      <div className="h-px mb-5"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)' }} />

      {/* ── Spend Chips ── */}
      <motion.div className="flex gap-3 mb-3"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.40, duration: 0.45 }}>
        <motion.div whileTap={{ scale: 0.96 }} onClick={() => showToast('Today details... coming soon 🤷')}
          className="flex-1 p-3.5 rounded-xl bg-[#1c1c1c] border border-white/5
                     cursor-pointer hover:bg-white/5 transition-colors">
          <p className="text-[10px] font-medium lowercase tracking-wide mb-1.5" style={{ color: '#9ca3af' }}>spent today</p>
          <p className="text-[17px] font-bold tracking-[-0.03em] text-white mb-0.5">₹340</p>
          <p className="text-[10.5px] font-medium text-[#ff8a8a]">↑ ₹120 vs yest.</p>
        </motion.div>
        <motion.div whileTap={{ scale: 0.96 }} onClick={() => showToast('Savings details... coming soon 🔥')}
          className="flex-1 p-3.5 rounded-xl bg-[#1c1c1c] border border-white/5
                     cursor-pointer hover:bg-white/5 transition-colors">
          <p className="text-[10px] font-medium lowercase tracking-wide mb-1.5" style={{ color: '#9ca3af' }}>saved this week</p>
          <p className="text-[17px] font-bold tracking-[-0.03em] text-white mb-0.5">₹1,240</p>
          <p className="text-[10.5px] font-medium text-[#34c97a]">↓ 14% spend 🎉</p>
        </motion.div>
      </motion.div>

      <div className="h-32 w-full shrink-0" />
    </div>
  )
}

function QuickActionButton({ label, icon: Icon, onClick }) {
  return (
    <motion.button whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-[7px] py-3.5 px-1.5
                 rounded-xl bg-white/5 border border-white/10
                 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                 cursor-pointer select-none hover:bg-white/10 transition-colors">
      <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center
                      bg-white/5 border border-white/10">
        <Icon className="w-4 h-4 stroke-white/80" />
      </div>
      <span className="text-[10.5px] font-bold whitespace-nowrap text-gray-400">
        {label}
      </span>
    </motion.button>
  )
}

function QrIcon() {
  return (
    <svg className="w-6 h-6 stroke-white/80" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <path d="M3 14h7v7H3z" />
      <path d="M10 10v.01M14 10v.01M10 14v.01M14 14v.01M6 6v.01M17 6v.01M17 17v.01" />
    </svg>
  )
}

function RoastCard({ showToast }) {
  const { requestPin } = useAppStore()
  const [revealed, setRevealed] = useState(false)

  const handleReveal = (e) => {
    e.stopPropagation()
    if (!revealed) {
      requestPin(() => {
        setRevealed(true)
        showToast('Access Granted 🔓')
      })
    } else {
      setRevealed(false)
    }
  }

  return (
    <div className="flex-shrink-0 w-[280px] h-[170px] rounded-[24px] p-5 relative overflow-hidden group
                    border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] snap-center mr-4"
      style={{ background: 'linear-gradient(135deg, #1f1f1f 0%, #121212 100%)' }}>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <TypographyIcon />
        <span className="text-[14px] font-bold tracking-widest text-[#6342ff]">💳 ROAST</span>
      </div>

      <div className="text-white text-[16px] font-medium tracking-[0.2em] mb-4 relative z-10 transition-all">
        {revealed ? '4321  8765  0987  1234' : '••••  ••••  ••••  1234'}
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Card Holder</span>
          <span className="text-[13px] text-white font-semibold uppercase">{revealed ? 'Kartik Sharma' : '•••••• ••••••'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">CVV</span>
          <span className="text-[13px] text-white font-semibold">{revealed ? '888' : '•••'}</span>
        </div>
      </div>

      <button onClick={handleReveal}
        className="absolute top-0 right-0 bottom-0 left-0 w-full h-full bg-transparent flex items-center justify-center
                   opacity-0 hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm z-20"
      >
        <span className="bg-white/10 px-4 py-2 rounded-full text-white text-[12px] font-bold border border-white/20">
          {revealed ? 'Hide Details' : 'View Details'}
        </span>
      </button>
    </div>
  )
}

function TypographyIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#EB001B" opacity="0.8" />
      <circle cx="22" cy="10" r="10" fill="#F79E1B" opacity="0.8" />
    </svg>
  )
}

function EyeIcon({ className }) {
  return (
    <svg className={className || "w-4 h-4 stroke-white/80"} viewBox="0 0 24 24" fill="none"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function PlusIcon({ className }) {
  return (
    <svg className={className || "w-4 h-4 stroke-white/80"} viewBox="0 0 24 24" fill="none"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function HistoryIcon({ className }) {
  return (
    <svg className={className || "w-4 h-4 stroke-white/80"} viewBox="0 0 24 24" fill="none"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14" />
      <path d="M3.05 11a9 9 0 1 0 .5-3" />
      <polyline points="3 4 3 11 10 11" />
    </svg>
  )
}

function BankIcon({ className }) {
  return (
    <svg className={className || "w-4 h-4 stroke-white/80"} viewBox="0 0 24 24" fill="none"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="18" height="10" rx="2" />
      <path d="M2.5 10L12 4l9.5 6" />
      <path d="M12 20v-4" />
    </svg>
  )
}
