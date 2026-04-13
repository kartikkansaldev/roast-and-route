import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '../AppContext'

const MARKETS = [
    { id: 'spot', sym: 'SPOT', name: 'Spotify', price: 379.70, change: 8.73, color: '#1ed760' },
    { id: 'aapl', sym: 'AAPL', name: 'Apple', price: 189.45, change: 1.25, color: '#ffffff' },
    { id: 'btc', sym: 'BTC', name: 'Bitcoin', price: 52045.00, change: 4.56, color: '#f7931a' },
    { id: 'visa', sym: 'V', name: 'VISA', price: 273.25, change: -0.94, color: '#1a1f71' },
    { id: 'ma', sym: 'MA', name: 'Mastercard', price: 491.24, change: -0.28, color: '#eb001b' },
]

export default function InvestPage() {
    const { portfolioValue, buyAsset, sellAsset } = useAppStore()
    const [selectedAsset, setSelectedAsset] = useState(null)

    return (
        <div className="relative font-sans min-h-screen">
            <AnimatePresence mode="wait">
                {!selectedAsset ? (
                    <MarketView
                        key="market"
                        portfolioValue={portfolioValue}
                        onSelect={(id) => setSelectedAsset(MARKETS.find(m => m.id === id))}
                    />
                ) : (
                    <DetailView
                        key="detail"
                        asset={selectedAsset}
                        onBack={() => setSelectedAsset(null)}
                        buyAsset={buyAsset}
                        sellAsset={sellAsset}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function MarketView({ portfolioValue, onSelect }) {
    const { setIsAddMoneyOpen } = useAppStore()
    const [time, setTime] = useState('1M')

    const graphPaths = {
        '1W': 'M0,130 C40,110 70,120 110,95 C150,70 200,80 250,50 C300,20 350,40 400,10',
        '1M': 'M0,140 C40,120 70,130 110,80 C150,30 200,90 250,60 C300,30 350,50 400,20',
        '6M': 'M0,100 C50,150 100,50 150,90 C200,120 250,40 300,60 C350,80 380,30 400,10',
        '1Y': 'M0,80 C40,90 80,40 120,60 C160,80 200,120 250,50 C300,-10 350,60 400,10'
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="px-5 pt-[60px] pb-36 font-sans absolute inset-0 top-0 overflow-y-auto no-scroll"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-white/60 text-[13px] font-medium mb-1.5">Portfolio balance</p>
                    <h1 className="text-white text-[38px] font-bold tracking-tight leading-none">
                        ₹{portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                    </h1>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAddMoneyOpen(true)}
                    className="w-[46px] h-[46px] rounded-full bg-[#6342ff] flex items-center justify-center text-white text-xl font-light shadow-[0_4px_16px_rgba(99,66,255,0.4)] hover:bg-[#7456ff] transition-colors"
                >
                    +
                </motion.button>
            </div>

            {/* Chart SVG */}
            <div className="relative w-full h-[160px] mb-6">
                <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34c97a" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#34c97a" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow"><feGaussianBlur stdDeviation="4" result="c" /><feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    </defs>
                    <motion.path
                        initial={false}
                        animate={{ d: `${graphPaths[time]} L400,160 L0,160 Z` }}
                        transition={{ duration: 0.4 }}
                        fill="url(#chartFill)"
                    />
                    <motion.path
                        initial={false}
                        animate={{ d: graphPaths[time] }}
                        transition={{ duration: 0.4 }}
                        fill="none"
                        stroke="#34c97a"
                        strokeWidth="3"
                        filter="url(#glow)"
                    />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-white/40 text-[11px] font-medium px-1">
                    <span>Sep 8</span><span>Oct 8</span>
                </div>
            </div>

            <div className="flex bg-[#1c1c1c] rounded-full p-1 border border-white/5 mb-8">
                {['1W', '1M', '6M', '1Y'].map(t => (
                    <button key={t} onClick={() => setTime(t)} className={`flex-1 py-2 rounded-full text-[13px] font-semibold transition-colors ${time === t ? 'bg-[#6342ff] text-white shadow-md' : 'text-white/40 hover:text-white/70'}`}>
                        {t}
                    </button>
                ))}
            </div>

            <p className="text-white text-[18px] font-semibold tracking-tight mb-4">Markets</p>

            <div className="flex flex-col gap-3">
                {MARKETS.map((pos, i) => (
                    <motion.div
                        key={pos.id} onClick={() => onSelect(pos.id)}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                        className="flex items-center justify-between bg-[#1c1c1c] border border-white/5 p-4 rounded-[22px] cursor-pointer hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[#121212]" style={{ background: pos.color }}>
                                {pos.sym.substring(0, 2)}
                            </div>
                            <div>
                                <p className="text-white text-[15px] font-semibold mb-0.5">{pos.sym}</p>
                                <p className="text-white/40 text-[12px] font-medium">{pos.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white text-[15px] font-bold mb-0.5">₹{pos.price.toFixed(2)}</p>
                            <p className={`text-[13px] font-bold tracking-wide ${pos.change > 0 ? 'text-[#34c97a]' : 'text-[#ff8a8a]'}`}>
                                {pos.change > 0 ? '+' : ''}{pos.change}%
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

function DetailView({ asset, onBack, buyAsset, sellAsset }) {

    const handleBuy = () => {
        buyAsset(asset.price, asset.sym)
    }

    const handleSell = () => {
        sellAsset(asset.price, asset.sym)
    }

    const colorHex = asset.color

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 overflow-y-auto no-scroll bg-[#121212]"
        >
            {/* Background Gradient matching Asset Color */}
            <div
                className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none z-0"
                style={{ background: `linear-gradient(180deg, ${colorHex}55 0%, #f9fafb 100%)` }}
            />

            <div className="relative z-10 px-5 pt-[50px] pb-36">
                {/* Top Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={onBack} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span className="text-white text-[16px] font-semibold tracking-wide">{asset.sym}</span>
                </div>

                {/* Center Asset Info */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-[22px] font-bold text-[#121212] mb-4 shadow-[0_4px_32px_rgba(0,0,0,0.15)]" style={{ background: colorHex }}>
                        {asset.sym.substring(0, 2)}
                    </div>
                    <h1 className="text-white text-[44px] font-bold tracking-tight mb-2 leading-none">{asset.price.toFixed(2)}</h1>

                    <div className="px-3 py-1 bg-[#1a221d] rounded-full border border-[#2a3830]">
                        <span className={`text-[13px] font-bold tracking-wide text-[#34c97a]`}>
                            +{((asset.change / 100) * asset.price).toFixed(2)} ({asset.change}%)
                        </span>
                    </div>
                </div>

                <div className="flex gap-4 mb-5">
                    <button onClick={handleBuy} className="flex-1 py-4 bg-[#6342ff] hover:bg-[#7456ff] rounded-[24px] text-white text-[16px] font-semibold shadow-[0_8px_24px_rgba(99,66,255,0.3)] transition-colors flex justify-center items-center gap-1.5">
                        Buy <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M7 17H17M7 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button onClick={handleSell} className="flex-1 py-4 bg-[#2a2a2a] hover:bg-[#333333] rounded-[24px] border border-white/10 text-white text-[16px] font-semibold transition-colors shadow-lg flex justify-center items-center gap-1.5">
                        Sell <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 7L17 17M17 17H7M17 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>

                {/* Info Boxes 2 Column */}
                <div className="flex gap-3 mb-3">
                    <div className="flex-1 bg-transparent border border-white/5 rounded-[20px] p-4 flex flex-col justify-between" style={{ minHeight: '86px' }}>
                        <p className="text-white/40 text-[13px] font-medium">Quantity</p>
                        <p className="text-white text-[22px] font-semibold mt-1">1 st</p>
                    </div>
                    <div className="flex-1 bg-transparent border border-white/5 rounded-[20px] p-4 flex flex-col justify-between" style={{ minHeight: '86px' }}>
                        <p className="text-white/40 text-[13px] font-medium">Price per piece</p>
                        <p className="text-white text-[22px] font-semibold mt-1">₹{asset.price.toFixed(2)}</p>
                    </div>
                </div>

                {/* Information Section */}
                <div className="bg-transparent border border-white/5 rounded-[20px] p-5 pb-6 mb-3">
                    <p className="text-white/40 text-[13px] font-medium mb-3">Information</p>
                    <div className="flex flex-col gap-3.5">
                        <div className="flex justify-between items-center">
                            <span className="text-white/80 text-[14px] font-medium">A stake in portfolio</span>
                            <span className="text-white text-[14px] font-medium">29.65%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/80 text-[14px] font-medium">Entry point</span>
                            <span className="text-white text-[14px] font-medium">₹{(asset.price * 0.9).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/80 text-[14px] font-medium">Book value</span>
                            <span className="text-white text-[14px] font-medium">₹{(asset.price * 0.9).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Candlestick Chart Box mockup */}
                <div className="bg-[#181818] border border-white/5 rounded-[20px] p-5 flex items-end h-[100px] overflow-hidden">
                    <svg width="100%" height="40" viewBox="0 0 300 40" preserveAspectRatio="none">
                        <line x1="10" y1="20" x2="10" y2="30" stroke="#34c97a" strokeWidth="1" />
                        <rect x="8" y="22" width="4" height="6" fill="#34c97a" />

                        <line x1="30" y1="18" x2="30" y2="35" stroke="#ff8a8a" strokeWidth="1" />
                        <rect x="28" y="24" width="4" height="8" fill="#ff8a8a" />

                        <line x1="50" y1="15" x2="50" y2="28" stroke="#34c97a" strokeWidth="1" />
                        <rect x="48" y="18" width="4" height="8" fill="#34c97a" />

                        <line x1="70" y1="10" x2="70" y2="22" stroke="#34c97a" strokeWidth="1" />
                        <rect x="68" y="12" width="4" height="7" fill="#34c97a" />

                        <line x1="90" y1="5" x2="90" y2="18" stroke="#34c97a" strokeWidth="1" />
                        <rect x="88" y="8" width="4" height="7" fill="#34c97a" />

                        <line x1="110" y1="12" x2="110" y2="25" stroke="#ff8a8a" strokeWidth="1" />
                        <rect x="108" y="14" width="4" height="9" fill="#ff8a8a" />

                        <line x1="130" y1="14" x2="130" y2="26" stroke="#34c97a" strokeWidth="1" />
                        <rect x="128" y="16" width="4" height="5" fill="#34c97a" />

                        <line x1="150" y1="10" x2="150" y2="30" stroke="#ff8a8a" strokeWidth="1" />
                        <rect x="148" y="15" width="4" height="10" fill="#ff8a8a" />

                        <line x1="170" y1="8" x2="170" y2="22" stroke="#34c97a" strokeWidth="1" />
                        <rect x="168" y="10" width="4" height="9" fill="#34c97a" />

                        <line x1="190" y1="15" x2="190" y2="28" stroke="#ff8a8a" strokeWidth="1" />
                        <rect x="188" y="20" width="4" height="6" fill="#ff8a8a" />

                        <line x1="210" y1="20" x2="210" y2="35" stroke="#ff8a8a" strokeWidth="1" />
                        <rect x="208" y="22" width="4" height="10" fill="#ff8a8a" />

                        <line x1="230" y1="25" x2="230" y2="38" stroke="#34c97a" strokeWidth="1" />
                        <rect x="228" y="28" width="4" height="8" fill="#34c97a" />

                        <line x1="250" y1="22" x2="250" y2="30" stroke="#34c97a" strokeWidth="1" />
                        <rect x="248" y="24" width="4" height="4" fill="#34c97a" />

                        <line x1="270" y1="18" x2="270" y2="28" stroke="#ff8a8a" strokeWidth="1" />
                        <rect x="268" y="20" width="4" height="6" fill="#ff8a8a" />

                        <line x1="290" y1="15" x2="290" y2="24" stroke="#34c97a" strokeWidth="1" />
                        <rect x="288" y="18" width="4" height="4" fill="#34c97a" />
                    </svg>
                </div>
            </div>
        </motion.div>
    )
}
