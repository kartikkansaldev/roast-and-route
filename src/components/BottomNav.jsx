import { motion } from 'framer-motion'
import { useAppStore } from '../AppContext'

const TABS = [
  { id: 'home', label: 'home', icon: HomeIcon },
  { id: 'wallet', label: 'wallet', icon: WalletIcon },
  { id: 'paynow', label: 'pay now', icon: null, center: true },
  { id: 'invest', label: 'invest', icon: ChartIcon },
  { id: 'rewards', label: 'rewards', icon: StarIcon },
]

export default function BottomNav({ activeTab, onTabChange, onScanPay }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[76px] z-30
                    border-t border-white/5
                    flex items-center justify-around px-1 bg-[#000000]">

      {TABS.map((tab) => {
        if (tab.center) {
          return (
            <div key={tab.id} className="flex-[1.15] flex justify-center">
              <motion.button
                whileTap={{ scale: 0.91 }}
                whileHover={{ y: -3 }}
                onClick={onScanPay}
                className="flex flex-col items-center gap-1 cursor-pointer select-none"
                aria-label="Pay Now"
              >
                <div className="bg-[#34c97a] w-[50px] h-[50px] rounded-[18px]
                               flex items-center justify-center -translate-y-[18px]">
                  <ScannerIcon />
                </div>
                <span className="text-[9.5px] font-semibold text-[#34c97a] -mt-[22px]">
                  {tab.label}
                </span>
              </motion.button>
            </div>
          )
        }

        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.90 }}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-[5px] py-2.5 px-1.5
                       cursor-pointer select-none transition-colors mb-1"
            aria-label={tab.label}
          >
            <Icon active={isActive} />
            <div className="flex flex-col items-center gap-[4px]">
              <span
                className="text-[10px] font-medium tracking-wide lowercase"
                style={{ color: isActive ? '#34c97a' : 'rgba(255,255,255,0.40)' }}
              >
                {tab.label}
              </span>
              {/* Green underline for active tab */}
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="block h-[2.5px] w-5 rounded-full"
                  style={{ background: '#34c97a' }}
                />
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

/* ── Icons — inline stroke so opacity/color renders correctly on SVG ── */
function HomeIcon({ active }) {
  const c = active ? '#34c97a' : 'rgba(255,255,255,0.40)'
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function WalletIcon({ active }) {
  const c = active ? '#34c97a' : 'rgba(255,255,255,0.40)'
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="16" cy="15" r="1" fill={c} stroke="none" />
    </svg>
  )
}

function ChartIcon({ active }) {
  const c = active ? '#34c97a' : 'rgba(255,255,255,0.40)'
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function StarIcon({ active }) {
  const c = active ? '#34c97a' : 'rgba(255,255,255,0.40)'
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ScannerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="#000000" strokeWidth={2.2}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
      <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  )
}
