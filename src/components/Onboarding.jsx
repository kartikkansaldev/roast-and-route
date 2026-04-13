import { motion } from 'framer-motion'
import { useAppStore } from '../AppContext'

export default function Onboarding() {
    const { setHasCompletedOnboarding, setSassLevel } = useAppStore()

    const handleSelect = (level) => {
        setSassLevel(level)
        setHasCompletedOnboarding(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center h-full overflow-y-auto bg-[#0A0A0A] text-white px-6 font-sans tracking-tight"
        >
            {/* Glowing orb behind the robot */}
            <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" style={{ top: '15%' }} />

            <motion.img
                src={`${import.meta.env.BASE_URL}bot.png`}
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-48 h-48 object-contain relative z-10 mb-8 mix-blend-screen"
            />

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-extrabold tracking-tight mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 relative z-20"
            >
                Choose Your Financial Advisor
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-sm mb-10 text-center font-medium relative z-20"
            >
                How strict do you need me to be?
            </motion.p>

            <div className="flex flex-col w-full max-w-md gap-4 relative z-20">
                <OptionButton
                    delay={0.4}
                    hoverClass="hover:bg-blue-500/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    level="Level 1: Chill"
                    description="Just help me save."
                    onClick={() => handleSelect('Chill')}
                />
                <OptionButton
                    delay={0.5}
                    hoverClass="hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                    level="Level 2: Sassy"
                    description="Tease me when I spend."
                    onClick={() => handleSelect('Sassy')}
                />
                <OptionButton
                    delay={0.6}
                    hoverClass="hover:bg-red-500/10 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    level="Level 3: Ruthless"
                    description="Destroy my ego to save my wallet."
                    onClick={() => handleSelect('Ruthless')}
                />
            </div>
        </motion.div>
    )
}

function OptionButton({ delay, hoverClass, level, description, onClick }) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-start text-left transition-all duration-300 cursor-pointer ${hoverClass}`}
        >
            <span className="text-white font-bold text-lg mb-1">{level}</span>
            <span className="text-gray-400 text-sm">{description}</span>
        </motion.button>
    )
}
