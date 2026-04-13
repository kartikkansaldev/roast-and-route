import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const BANKS = [
    { id: 'axis', name: 'Axis Bank', color: '#f03a62', logo: '▲' },
    { id: 'sbi', name: 'State Bank of India', color: '#52ade0', logo: 'S' },
    { id: 'citi', name: 'Citi Bank', color: '#117aca', logo: 'citi' },
    { id: 'icici', name: 'ICICI Bank', color: '#f05a22', logo: 'i' },
    { id: 'hdfc', name: 'HDFC Bank', color: '#e05252', logo: 'H' },
    { id: 'chase', name: 'Chase Bank', color: '#117aca', logo: 'C' },
    { id: 'sc', name: 'Standard Chartered', color: '#34c97a', logo: 'SC' },
    { id: 'boa', name: 'Bank of America', color: '#e31837', logo: 'BoA' },
]

export default function BankTransferModal({ isOpen, onClose }) {
    const [view, setView] = useState('home') // 'home', 'select', 'form'
    const [selectedBank, setSelectedBank] = useState(null)

    // Reset view when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setView('home'), 300)
        }
    }, [isOpen])

    const handleBack = () => {
        if (view === 'form') setView('select')
        else if (view === 'select') setView('home')
        else onClose()
    }

    if (!isOpen) return null

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="w-full max-w-[390px] mx-auto h-[92vh] bg-[#121212] rounded-t-[32px] relative z-10 flex flex-col pt-2 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]"
            >
                {/* Pull indicator */}
                <div className="w-12 h-1.5 rounded-full bg-white/10 mx-auto mb-2" />

                {/* Shared Header */}
                <div className="flex items-center justify-between px-5 pb-4 pt-2 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center text-white cursor-pointer rounded-full hover:bg-white/5 transition-colors -ml-2">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 className="text-[17px] font-bold text-white tracking-wide">
                            {view === 'home' && 'Send Money to Bank A/c'}
                            {view === 'select' && 'Add Bank Accounts'}
                            {view === 'form' && 'Bank Accounts Details'}
                        </h2>
                    </div>
                    {view === 'home' && (
                        <button className="w-8 h-8 flex items-center justify-center text-white cursor-pointer rounded-full transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 no-scroll">
                    <AnimatePresence mode="wait">

                        {/* ── HOME VIEW (Options List) ── */}
                        {view === 'home' && (
                            <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                {/* Main Options Group */}
                                <div className="bg-[#1c1c1c] border border-white/5 rounded-[22px] flex flex-col shadow-sm">

                                    <OptionRow
                                        onClick={() => setView('select')}
                                        icon={<rect x="3" y="10" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />}
                                        iconInner={<path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                                        title="Enter Bank A/c no & IFSC"
                                        subtitle="Send money to any Bank instantly"
                                        showArrow
                                    />
                                    <hr className="border-t border-white/5" />

                                    <OptionRow
                                        icon={<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />}
                                        iconInner={<path d="M8 12h8M12 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
                                        title="Enter UPI ID/Mobile Number"
                                        subtitle="Send money to Gpay, Phonepe, Bhim or any UPI app"
                                        showArrow
                                        iconBg="#2a1335"
                                        iconColor="#a352e0"
                                    />
                                    <hr className="border-t border-white/5" />

                                    <OptionRow
                                        icon={<path d="M16 21v-2a4 4 0 0 0-4-4H5M5 15l-4-4 4-4M21 9v2a4 4 0 0 1-4 4h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
                                        title="Self Transfer"
                                        subtitle="Select A/c where you want to send money"
                                    />
                                    <hr className="border-t border-white/5 mx-4" />

                                    <BankRow logo="H" logoColor="#e05252" title="HDFC Bank - 8470" />
                                    <hr className="border-t border-white/5 mx-4" />

                                    <BankRow logo="U" logoColor="#529ce0" title="Union Bank Of India - 7928" />
                                    <hr className="border-t border-white/5 mx-4" />

                                    <div onClick={() => setView('select')} className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors">
                                        <span className="text-[#34c97a] font-bold text-[14px] px-1">+ Add another Bank A/c</span>
                                    </div>
                                </div>

                                {/* Recents Section */}
                                <div>
                                    <h3 className="text-[17px] font-bold text-white mb-4">Recents & Saved Beneficiaries</h3>

                                    <div className="flex items-center gap-2.5 bg-[#1c1c1c] border border-white/10 rounded-[14px] px-4 py-3 mb-5">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                        <input
                                            type="text"
                                            placeholder="Search Name, Mobile, UPI ID or Bank A/c"
                                            className="bg-transparent outline-none text-[14px] text-white w-full placeholder-white/30 font-medium"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <ContactRow initials="KS" bg="#1a2b35" name="Kuldip Singh" verified id="kuldisingh1513@oksbi" meta="193 sent on 06 Apr" />
                                        <ContactRow initials="IG" bg="#2a1a35" name="Ishan Garg" id="+91 9877755645" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── SELECT VIEW (Grid) ── */}
                        {view === 'select' && (
                            <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col min-h-full">
                                <h3 className="text-[15px] font-bold text-white mb-4">Select Bank:</h3>

                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {BANKS.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => { setSelectedBank(b); setView('form'); }}
                                            className="flex flex-col items-center gap-2 p-4 bg-[#1c1c1c] border border-white/5 rounded-xl hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center text-xl font-bold tracking-tighter" style={{ color: b.color }}>
                                                {b.logo}
                                            </div>
                                            <span className="text-[11px] font-bold text-white/50 text-center leading-tight">
                                                {b.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-auto pb-4">
                                    <button className="w-full py-4 rounded-full bg-[#34c97a] text-[#121212] font-bold text-[16px] shadow-[0_8px_24px_rgba(52,201,122,0.2)] opacity-50 cursor-not-allowed transition-colors">
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── FORM VIEW (Inputs) ── */}
                        {view === 'form' && (
                            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-4 pb-12">
                                <InputGroup label="Account Number" placeholder="Account Number" />
                                <InputGroup label="IFSC Code" placeholder="IFSC Code" />
                                <InputGroup label="Branch Name" placeholder="Branch Name" />
                                <InputGroup label="Address" placeholder="Address Line 1" />

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-white/40">Mobile number</label>
                                    <div className="flex rounded-[14px] border border-white/5 overflow-hidden bg-[#1c1c1c] focus-within:border-[#34c97a] transition-colors">
                                        <div className="px-4 py-3.5 border-r border-white/5 flex items-center gap-1.5 text-white/60 font-bold">
                                            +91 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                        <input type="tel" className="flex-1 bg-transparent px-4 py-3.5 outline-none text-[15px] font-medium text-white placeholder-white/30" placeholder="12345 67890" />
                                    </div>
                                </div>

                                <InputGroup label="Email" placeholder="co.henry@gmail.com" type="email" />

                                <div className="mt-8 mb-4">
                                    <button onClick={() => { onClose(); setView('home'); }} className="w-full py-4 rounded-full bg-[#34c97a] hover:bg-[#2eaa66] text-[#121212] font-bold text-[16px] shadow-[0_8px_24px_rgba(52,201,122,0.2)] active:scale-[0.98] transition-all">
                                        Submit
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

function InputGroup({ label, placeholder, type = "text" }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-white/40">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full rounded-[14px] border border-white/5 px-4 py-3.5 bg-[#1c1c1c] text-[15px] font-medium outline-none focus:border-[#34c97a] transition-colors text-white placeholder-white/30"
            />
        </div>
    )
}

function OptionRow({ icon, iconInner, title, subtitle, showArrow, onClick, iconBg = "#1c2a35", iconColor = "#52ade0" }) {
    return (
        <div onClick={onClick} className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shadow-inner"
                    style={{ background: iconBg, color: iconColor }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        {icon}
                        {iconInner}
                    </svg>
                </div>
                <div className="pr-4">
                    <h4 className="text-white text-[15px] font-bold mb-0.5">{title}</h4>
                    <p className="text-white/40 text-[12px] font-medium leading-tight">{subtitle}</p>
                </div>
            </div>
            {showArrow && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            )}
        </div>
    )
}

function BankRow({ logo, logoColor, title }) {
    return (
        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <div
                    className="w-10 h-10 border border-white/10 rounded-[10px] flex items-center justify-center font-bold text-[18px]"
                    style={{ color: logoColor, background: '#1c1c1c' }}
                >
                    {logo}
                </div>
                <div>
                    <h4 className="text-white text-[15px] font-bold mb-0.5 tracking-wide">{title}</h4>
                    <p className="text-[#34c97a] text-[12px] font-bold">Check Balance</p>
                </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </div>
    )
}

function ContactRow({ initials, bg, name, verified, id, meta }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-[16px] cursor-pointer hover:bg-white/5 transition-colors">
            <div
                className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-white/90 text-[15px] font-bold shadow-inner"
                style={{ background: bg }}
            >
                {initials}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="text-white text-[16px] font-bold tracking-tight">{name}</h4>
                    {verified && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#34c97a">
                            <path d="M12 2l3.09 2.26L18.8 3.5l1.09 3.65L23 8.94l-2.07 3.06L23 15.06l-3.11 1.79-1.09 3.65-3.71-.76L12 22l-3.09-2.26L5.2 20.5l-1.09-3.65L1 15.06l2.07-3.06L1 8.94l3.11-1.79 1.09-3.65 3.71.76L12 2z" />
                            <path d="M9.5 12.5l2 2 4-4" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
                <p className="text-white/40 text-[13px] font-medium leading-tight mb-1">{id}</p>
                {meta && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#34c97a] flex items-center justify-center text-[#121212] font-bold text-[8px]">
                            ₹
                        </div>
                        <p className="text-white/60 text-[12px] font-medium">{meta}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
