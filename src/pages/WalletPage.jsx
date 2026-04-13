import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '../AppContext'

export default function WalletPage() {
    const { userBalance, transactions, showToast, requestPin } = useAppStore()
    const [isWalletUnlocked, setIsWalletUnlocked] = useState(false)

    const handleUnlock = () => {
        if (!isWalletUnlocked) {
            requestPin(() => {
                setIsWalletUnlocked(true)
                showToast('Wallet Unlocked 💸')
            })
        } else {
            setIsWalletUnlocked(false)
            showToast('Wallet locked 🔒')
        }
    }

    return (
        <div className="px-5 pt-[60px] pb-36 font-sans">
            {/* Top Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="rounded-[32px] overflow-hidden bg-[#1c1c1c] border border-white/5 mb-8 relative"
            >
                <div className="bg-[#ccddff] px-6 py-5 rounded-[32px] relative cursor-pointer active:scale-[0.98] transition-transform">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[#121212] font-semibold text-[17px]">Kartik Sharma</span>
                        <div className="w-8 h-5 rounded-full bg-black/10 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full border-[2px] border-[#121212] flex -space-x-1.5">
                                <div className="w-full h-full rounded-full border border-transparent"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end text-[#121212]/60 font-medium text-[13px]">
                        <span>•••• 2431</span>
                        <span>09/28</span>
                    </div>
                </div>

                <div className="px-6 py-6 pb-7">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-white/60 text-[13px] font-medium">Balance</p>
                        <button onClick={handleUnlock} className="text-white/40 hover:text-white transition-colors cursor-pointer text-xl">
                            {isWalletUnlocked ? '🔓' : '🔒'}
                        </button>
                    </div>

                    <h2 className={`text-white text-[38px] font-bold tracking-tight mb-2 transition-all duration-300 ${!isWalletUnlocked ? 'blur-md select-none opacity-60' : ''}`}>
                        ₹{isWalletUnlocked ? userBalance.toLocaleString('en-IN') : '••••••'}
                    </h2>
                    <p className="text-white/60 text-[14px] font-medium flex items-center gap-2">
                        <span className="text-[#34c97a] font-bold">+11.05%</span> Total Week Profit
                    </p>
                </div>
            </motion.div>

            {/* Transactions List */}
            <div className="relative">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-white text-[18px] font-bold tracking-tight">Transactions</h3>
                    <span className="text-white/40 text-[13px] font-medium cursor-pointer hover:text-white">Analytics</span>
                </div>

                <div className={`flex flex-col gap-3 transition-all duration-300 ${!isWalletUnlocked ? 'blur-[8px] opacity-40 pointer-events-none' : ''}`}>
                    <AnimatePresence>
                        {transactions.map((tx, idx) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                className="bg-[#1c1c1c] border border-white/5 p-3.5 pr-5 rounded-[22px] flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-inner" style={{ background: tx.color }}>
                                    {tx.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white text-[15px] font-medium tracking-wide mb-0.5">{tx.name}</h4>
                                    <p className="text-white/40 text-[12px] font-medium">{tx.date}</p>
                                </div>
                                <span className={`text-[15px] font-bold tracking-wide ${tx.amount > 0 ? 'text-[#34c97a]' : 'text-[#ff8a8a]'}`}>
                                    {tx.amount > 0 ? '+' : '-'}₹{Math.abs(tx.amount).toFixed(2)}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Lock Overlay */}
                {!isWalletUnlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 top-10">
                        <button
                            onClick={handleUnlock}
                            className="bg-white text-black px-7 py-3.5 rounded-full font-bold text-[15px] shadow-[0_8px_32px_rgba(255,255,255,0.2)] active:scale-95 transition-transform"
                        >
                            Unlock Wallet
                        </button>
                        <p className="text-white/60 text-[12px] font-medium mt-3">Pin required to view history</p>
                    </div>
                )}
            </div>
        </div>
    )
}
