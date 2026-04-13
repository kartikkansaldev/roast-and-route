import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function PinModal({ isOpen, onClose, onSuccess }) {
    const [pin, setPin] = useState('')
    const [error, setError] = useState(false)

    const handleKey = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num
            setPin(newPin)
            setError(false)

            if (newPin.length === 4) {
                setTimeout(() => {
                    if (newPin === '0000') {
                        onSuccess()
                        onClose()
                        setPin('')
                    } else {
                        setError(true)
                        setTimeout(() => setPin(''), 500)
                    }
                }, 300)
            }
        }
    }

    const handleDelete = () => {
        setPin(pin.slice(0, -1))
        setError(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col items-center justify-end font-sans pb-10"
                >
                    {/* Close Area to Tap */}
                    <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => { setPin(''); onClose(); }} />

                    <motion.div
                        initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
                        className={`w-full max-w-[350px] p-8 pb-10 rounded-[36px] border border-white/5 shadow-2xl flex flex-col items-center
                        transition-colors duration-300 ${error ? 'bg-[#2a1313]' : 'bg-[#1c1c1c]'}`}
                    >
                        <div className="w-12 h-1.5 rounded-full bg-white/10 mb-8" />

                        <h3 className="text-white text-[18px] font-semibold tracking-tight mb-2">
                            {error ? 'Incorrect PIN' : 'Enter Security PIN'}
                        </h3>
                        <p className="text-white/40 text-[13px] font-medium mb-8">Hint: try 0000</p>

                        <div className={`flex gap-5 mb-10 ${error ? 'animate-shake' : ''}`}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all 
                  ${pin.length >= i ? 'bg-white border-white' : 'border-white/20'}`}
                                />
                            ))}
                        </div>

                        {/* Numpad */}
                        <div className="grid grid-cols-3 gap-x-12 gap-y-6 w-full px-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                    key={num} onClick={() => handleKey(num.toString())}
                                    className="w-[60px] h-[60px] rounded-full mx-auto flex items-center justify-center
                             text-white text-[24px] font-medium hover:bg-white/10 transition-colors"
                                >
                                    {num}
                                </button>
                            ))}
                            <div /> {/* Emtpy slot */}
                            <button
                                onClick={() => handleKey('0')}
                                className="w-[60px] h-[60px] rounded-full mx-auto flex items-center justify-center
                           text-white text-[24px] font-medium hover:bg-white/10 transition-colors"
                            >
                                0
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-[60px] h-[60px] rounded-full mx-auto flex items-center justify-center
                           text-white text-xl hover:bg-white/10 transition-colors"
                            >
                                ⌫
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
