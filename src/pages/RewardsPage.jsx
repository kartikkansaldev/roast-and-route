import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '../AppContext'
import SpinWheelModal from '../components/SpinWheelModal'

const FRIENDS_LEADERBOARD = [
    { rank: 1, name: 'Vanessa', pts: '1,823', avatar: '👩', me: false },
    { rank: 2, name: 'Julie', pts: '1,503', avatar: '👱‍♀️', me: false },
    { rank: 3, name: 'Kartik', pts: '1,250', avatar: '😎', me: true },
    { rank: 4, name: 'Michael', pts: '901', avatar: '👨', me: false },
    { rank: 5, name: 'Stephen', pts: '900', avatar: '👦', me: false },
]

const DAILY_TASKS = [
    { id: 1, title: 'Scan 1 QR Code', reward: '+50 points', claimed: false },
    { id: 2, title: 'Invest ₹50', reward: '+100 points', claimed: false },
    { id: 3, title: 'Log in 3 days', reward: '+20 points', claimed: true },
]

export default function RewardsPage() {
    const [tasks, setTasks] = useState(DAILY_TASKS)
    const [spinOpen, setSpinOpen] = useState(false)

    const claimTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, claimed: true } : t))
    }

    const completedCount = tasks.filter(t => t.claimed).length

    return (
        <div className="px-5 pt-[60px] pb-36 font-sans">

            {/* Daily Spin CTA */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
                <button
                    onClick={() => setSpinOpen(true)}
                    className="w-full relative overflow-hidden rounded-[24px] p-6 shadow-sm hover:bg-white/5 transition-colors text-left bg-[#1c1c1c] border border-white/10 flex items-center justify-between"
                >
                    <div className="relative z-10">
                        <h2 className="text-white text-[24px] font-bold tracking-tight mb-1">Daily spin ✨</h2>
                        <p className="text-white/60 text-[13px] font-medium">Win up to ₹50 or 100 pts</p>
                    </div>
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full text-black shadow-lg relative z-10 transition-transform hover:rotate-180 duration-500">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                </button>
            </motion.div>

            {/* Daily Tasks Section */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="mb-8">
                <div className="flex justify-between items-end mb-3">
                    <h2 className="text-white text-[20px] font-semibold tracking-tight">Daily tasks</h2>
                    <span className="text-white/40 text-[13px] font-medium">{completedCount}/{tasks.length}</span>
                </div>

                {/* Progress bar */}
                <div className="h-[6px] w-full rounded-full bg-white/5 mb-4 overflow-hidden shadow-inner">
                    <motion.div
                        className="h-full bg-[#6342ff] rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Task List */}
                <div className="flex flex-col gap-2.5">
                    {tasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center bg-[#1c1c1c] border border-white/5 p-3.5 pr-4 rounded-[20px]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                    {task.claimed ? '✅' : '🎯'}
                                </div>
                                <div>
                                    <p className="text-white text-[14px] font-semibold mb-0.5">{task.title}</p>
                                    <p className="text-[#34c97a] text-[12px] font-bold">{task.reward}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => claimTask(task.id)}
                                disabled={task.claimed}
                                className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all
                  ${task.claimed
                                        ? 'bg-white/5 text-white/40 shadow-none'
                                        : 'bg-[#eeebff] text-[#6342ff] shadow-[0_4px_12px_rgba(238,235,255,0.2)]'}`}
                            >
                                {task.claimed ? 'Claimed' : 'Claim'}
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Leaderboard Section */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-[22px] font-semibold tracking-tight">Leaderboard</h2>
                    <div className="bg-[#1c1c1c] border border-white/5 px-3 py-1.5 rounded-full text-[11px] text-white/60 font-semibold flex items-center gap-1">
                        Gold League <span className="text-[9px]">▼</span>
                    </div>
                </div>

                <div className="bg-[#1c1c1c] border border-white/5 rounded-[24px] p-5">
                    {/* Podium (Top 3) */}
                    <div className="flex justify-center items-end gap-3 h-[180px] mb-6 border-b border-white/5 pb-6">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center justify-end w-[85px] h-[120px] bg-white/5 rounded-t-[20px] pb-4 relative">
                            <div className="absolute -top-6 w-14 h-14 rounded-full border-[3px] border-[#1c1c1c] bg-[#a8a8a8] flex items-center justify-center text-xl shadow-lg z-10">{FRIENDS_LEADERBOARD[1].avatar}</div>
                            <p className="text-white text-[13px] font-semibold mt-4 mb-0.5">{FRIENDS_LEADERBOARD[1].name}</p>
                            <p className="text-[#34c97a] text-[11px] font-bold">{FRIENDS_LEADERBOARD[1].pts} pts</p>
                            <span className="text-white/20 text-[28px] font-bold absolute bottom-2">2</span>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center justify-end w-[95px] h-[150px] bg-white/10 rounded-t-[20px] pb-5 relative shadow-[0_0_24px_rgba(255,255,255,0.05)] border-t border-white/10">
                            <span className="absolute -top-10 text-xl z-20">👑</span>
                            <div className="absolute -top-5 w-16 h-16 rounded-full border-[3px] border-[#1c1c1c] bg-[#e6c15c] flex items-center justify-center text-2xl shadow-[0_4px_16px_rgba(230,193,92,0.3)] z-10">{FRIENDS_LEADERBOARD[0].avatar}</div>
                            <p className="text-white text-[14px] font-semibold mt-6 mb-0.5">{FRIENDS_LEADERBOARD[0].name}</p>
                            <p className="text-[#34c97a] text-[12px] font-bold">{FRIENDS_LEADERBOARD[0].pts} pts</p>
                            <span className="text-white/30 text-[38px] font-extrabold absolute bottom-2">1</span>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center justify-end w-[85px] h-[100px] bg-white/5 rounded-t-[20px] pb-3 relative">
                            <div className="absolute -top-6 w-14 h-14 rounded-full border-[3px] border-[#1c1c1c] bg-[#cd7f32] flex items-center justify-center text-xl shadow-lg z-10">{FRIENDS_LEADERBOARD[2].avatar}</div>
                            <p className="text-white text-[13px] font-semibold mt-4 mb-0.5">{FRIENDS_LEADERBOARD[2].name}</p>
                            <p className="text-[#34c97a] text-[11px] font-bold">{FRIENDS_LEADERBOARD[2].pts} pts</p>
                            <span className="text-white/20 text-[24px] font-bold absolute bottom-2">3</span>
                        </div>
                    </div>

                    {/* List the rest */}
                    <div className="flex flex-col gap-4">
                        {FRIENDS_LEADERBOARD.slice(3).map(f => (
                            <div key={f.rank} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-white/40 font-bold w-4">#{f.rank}</span>
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">{f.avatar}</div>
                                    <div>
                                        <p className="text-white text-[14px] font-semibold">{f.name}</p>
                                        <p className="text-[#34c97a] text-[11px] font-bold">{f.pts} pts</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-semibold">
                                    + Add friend
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </motion.div>
            <SpinWheelModal isOpen={spinOpen} onClose={() => setSpinOpen(false)} />
        </div>
    )
}
