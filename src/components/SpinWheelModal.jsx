import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { useAppStore } from '../AppContext'

const PRIZES = [
    { id: 1, label: '+50 pts', type: 'points', amount: 50, color: '#6342ff' },
    { id: 2, label: '₹10 Cash', type: 'cashback', amount: 10, color: '#34c97a' },
    { id: 3, label: '+10 pts', type: 'points', amount: 10, color: '#e6c15c' },
    { id: 4, label: 'No Luck', type: 'none', amount: 0, color: '#333333' },
    { id: 5, label: '₹50 Cash', type: 'cashback', amount: 50, color: '#ff8a8a' },
    { id: 6, label: '+100 pts', type: 'points', amount: 100, color: '#f7931a' },
]

export default function SpinWheelModal({ isOpen, onClose }) {
    const { addSurvivalPoints, addCashback, showToast } = useAppStore()
    const [spinning, setSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [prizeWon, setPrizeWon] = useState(null)

    const handleSpin = () => {
        if (spinning) return
        setSpinning(true)
        setPrizeWon(null)

        // Spin randomly between 5 to 10 full rotations
        const extraSpins = 5 + Math.floor(Math.random() * 5)
        const prizeIndex = Math.floor(Math.random() * PRIZES.length)
        const sliceAngle = 360 / PRIZES.length
        const targetRotation = rotation + (extraSpins * 360) + (360 - (prizeIndex * sliceAngle))

        setRotation(targetRotation)

        setTimeout(() => {
            setSpinning(false)
            const won = PRIZES[prizeIndex]
            setPrizeWon(won)

            if (won.type === 'points') addSurvivalPoints(won.amount)
            if (won.type === 'cashback') addCashback(won.amount)

            if (won.type !== 'none') {
                showToast(`🎉 You won ${won.label}!`)
            } else {
                showToast(`Ah, better luck next time 🤷`)
            }

        }, 3000) // 3 seconds total duration
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center font-sans p-6"
                >
                    <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => !spinning && onClose()} />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                        className="w-full max-w-[360px] bg-[#1c1c1c] rounded-[40px] p-8 flex flex-col items-center border border-white/10 shadow-2xl relative overflow-hidden"
                        style={{ background: 'linear-gradient(180deg, #2a2a2a 0%, #121212 100%)' }}
                    >
                        {prizeWon && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-0 inset-x-0 h-full w-full pointer-events-none z-0"
                                style={{ background: `radial-gradient(circle at center, ${prizeWon.color}40 0%, transparent 70%)` }}
                            />
                        )}

                        <button onClick={onClose} disabled={spinning} className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:bg-white/20 transition-colors z-20">
                            ✕
                        </button>
                        <button className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:bg-white/20 transition-colors z-20">
                            🕒
                        </button>

                        <h2 className="text-white text-[24px] font-bold tracking-tight mt-4 z-10">Daily spin</h2>
                        {prizeWon ? (
                            <p className="text-white/80 text-[14px] font-medium mt-1 mb-8 z-10 text-center">
                                Congratulations!<br /><span className="text-white font-bold text-[18px]">{prizeWon.label}</span>
                            </p>
                        ) : (
                            <p className="text-white/40 text-[14px] font-medium mt-1 mb-10 z-10">Test your luck today</p>
                        )}

                        {/* The Wheel */}
                        <div className="relative w-[280px] h-[280px] mb-10 z-10 flex items-center justify-center">
                            {/* Pointer */}
                            <div className="absolute -top-4 z-20" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 24l-8-12h16z" /></svg>
                            </div>

                            {/* Wheel graphic */}
                            <div className="w-full h-full rounded-full border-[8px] border-white/10 overflow-hidden relative shadow-[0_0_32px_rgba(255,255,255,0.05),inset_0_0_20px_rgba(0,0,0,0.5)]">
                                <motion.div
                                    className="w-full h-full relative"
                                    animate={{ rotate: rotation }}
                                    transition={{ duration: 3, ease: [0.2, 0.8, 0.2, 1] }}
                                >
                                    {PRIZES.map((prize, i) => {
                                        const angle = (360 / PRIZES.length) * i
                                        return (
                                            <div
                                                key={prize.id}
                                                className="absolute w-full h-[50%] top-0 left-0 origin-bottom"
                                                style={{ transform: `rotate(${angle}deg)` }}
                                            >
                                                {/* CSS trick for drawing slices */}
                                                <div
                                                    className="absolute bottom-0 w-full h-full origin-bottom"
                                                    style={{
                                                        background: prize.color,
                                                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                                                    }}
                                                />
                                                <div className="absolute text-center w-full top-[15%] text-white font-bold text-[14px] uppercase tracking-wider drop-shadow-md">
                                                    {prize.label}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </motion.div>
                                {/* Center dot */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-[4px] border-[#1c1c1c] shadow-lg flex items-center justify-center">
                                    ✨
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSpin} disabled={spinning}
                            className={`w-full py-4 rounded-full text-white text-[16px] font-bold shadow-lg transition-all z-10
                          ${spinning ? 'bg-white/20 opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                            style={{ background: spinning ? '' : 'rgba(255,255,255,0.1)' }}
                        >
                            {spinning ? 'Spinning...' : 'Spin 1x'}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
