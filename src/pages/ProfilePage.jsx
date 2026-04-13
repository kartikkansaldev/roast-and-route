import { motion } from 'framer-motion'
import { useAppStore } from '../AppContext'

export default function ProfilePage() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="px-5 pt-[60px] pb-36 font-sans absolute inset-0 overflow-y-auto no-scroll"
        >
            {/* Header Area */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 shadow-[0_8px_32px_rgba(255,255,255,0.05)] border-4 border-[#1c1c1c]">
                    <div className="w-full h-full bg-[#6342ff] flex items-center justify-center text-white text-3xl font-bold">
                        K
                    </div>
                </div>
                <h1 className="text-white text-[28px] font-bold tracking-tight mb-1">
                    Kartik Sharma
                </h1>
                <p className="text-white/60 text-[14px] font-medium mb-3">
                    kartik@roastpay
                </p>
                <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-[13px] font-semibold border border-white/5">
                    +91 98765 43210
                </span>
            </div>

            {/* Menu List */}
            <div className="flex flex-col gap-3">
                <MenuItem
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>}
                    title="Set up payment method"
                    subtitle="Bank accounts, credit cards"
                />

                <MenuItem
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></svg>}
                    title="Your QR Code"
                    subtitle="To receive money"
                />


                <MenuItem
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
                    title="Language"
                    subtitle="English"
                />

                <MenuItem
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>}
                    title="Get Help"
                    subtitle="24/7 Support"
                />

            </div>
        </motion.div>
    )
}

function MenuItem({ icon, title, subtitle }) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-4 bg-[#1c1c1c] border border-white/5 rounded-[22px] shadow-none cursor-pointer w-full text-left"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                    {icon}
                </div>
                <div>
                    <h3 className="text-white text-[16px] font-bold">{title}</h3>
                    <p className="text-white/40 text-[13px] font-medium leading-tight mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className="text-white/30 mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </div>
        </motion.button>
    )
}
