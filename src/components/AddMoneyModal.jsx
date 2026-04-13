import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useAppStore } from '../AppContext'

export default function AddMoneyModal({ isOpen, onClose }) {
    const { userBalance, setUserBalance, showToast } = useAppStore()
    const [amountStr, setAmountStr] = useState('')

    const amount = parseInt(amountStr || '0', 10)
    const fee = amount > 0 ? (amount * 0.005).toFixed(2) : '0.00'
    const total = (amount + parseFloat(fee)).toFixed(2)

    const handleKey = (key) => {
        if (key === 'DELETE') {
            setAmountStr(prev => prev.slice(0, -1))
        } else {
            setAmountStr(prev => {
                if (prev === '0') return key
                if (prev.length > 7) return prev
                return prev + key
            })
        }
    }

    const handleAdd = () => {
        if (amount <= 0) return
        setUserBalance(prev => prev + amount)
        showToast(`Added ₹${amount.toLocaleString('en-IN')}`)
        setAmountStr('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="w-full h-auto bg-[#121212] rounded-t-[32px] relative z-10 flex flex-col pt-5"
            >
                <div className="flex items-center justify-between px-5 pb-5">
                    <button onClick={onClose} className="w-10 h-10 flex text-gray-400">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12L12 19M5 12L12 5" /></svg>
                    </button>
                    <h2 className="text-[17px] font-bold text-white">
                        Add money
                    </h2>
                    <div className="w-10" />
                </div>

                <div className="px-5 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-sm" />
                            <span className="font-semibold text-gray-400 text-[14px]">Colour wallet</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">₹{userBalance.toLocaleString('en-IN')}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M8 9l4-4 4 4M16 15l-4 4-4-4" /></svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center mb-8 px-5">
                    <p className="text-[14px] font-semibold text-white mb-2">You're adding</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-400 text-[32px] font-bold">₹</span>
                        <span className="text-white text-[44px] font-bold tracking-tight">
                            {amount > 0 ? amount.toLocaleString('en-IN') : '0'}
                        </span>
                        <div className="w-1 h-10 bg-[#34c97a] rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="px-5 mb-6">
                    <div className="flex items-center justify-between text-[13px] font-semibold text-gray-400 relative">
                        <span className="bg-[#121212] pr-2 z-10">Total Fee</span>
                        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/20 -z-0" />
                        <span className="bg-[#121212] pl-2 text-white z-10">= ₹{fee}</span>
                    </div>
                </div>

                <div className="px-5 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[#00579f] font-bold text-[14px] italic tracking-tighter">VISA</span>
                            <span className="text-[14px] text-gray-400 font-medium">Pay with credit card <strong className="text-gray-400"> *1942</strong></span>
                        </div>
                        <button className="bg-[#2c2c2c] text-white px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm">
                            Change
                        </button>
                    </div>
                </div>

                <div className="px-5 mb-8">
                    <button
                        onClick={handleAdd}
                        className={`w-full py-4 rounded-[16px] transition-colors font-bold text-[16px] flex items-center justify-center
              ${amount > 0
                                ? 'bg-[#a6ec5c] hover:bg-[#9bdd4d] text-[#050505] shadow-lg cursor-pointer'
                                : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
                    >
                        Add ₹ {amount > 0 ? Number(total).toLocaleString('en-IN') : '0'}
                    </button>
                </div>

                {/* Numpad */}
                <div className="grid grid-cols-3 bg-[#0f0f0f] pb-8 pt-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'DELETE'].map((key, i) => (
                        <button
                            key={i}
                            onClick={() => handleKey(key)}
                            className="py-4 text-[24px] font-medium text-white flex items-center justify-center active:bg-white/5 transition-colors"
                        >
                            {key === 'DELETE' ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="18" y1="9" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="9" x2="18" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            ) : (
                                key
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
