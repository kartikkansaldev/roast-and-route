import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../AppContext'
import { EXPRESSIONS } from '../constants'
import { generateBloopResponse } from '../utils/geminiEngine'

export default function ChatPage() {
    const { userBalance, sassLevel } = useAppStore()
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            text: `Sup. I'm Bloop. I see your balance is ₹${userBalance}. What do you want?`,
            expression: 'neutral'
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const endRef = useRef(null)

    useEffect(() => {
        // Scroll to bottom when messages update
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userText = input.trim()
        setInput('')

        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }])
        setIsLoading(true)

        try {
            const botResponse = await generateBloopResponse(userText, sassLevel, userBalance, false)

            // Random expression based on response length for flavor
            const expressions = Object.keys(EXPRESSIONS).filter(e => e !== 'neutral')
            const randomExpr = expressions[Math.floor(Math.random() * expressions.length)]

            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'bot',
                text: botResponse,
                expression: randomExpr
            }])
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'bot',
                text: "Sorry, I lost connection to my brain. Try again in a sec.",
                expression: 'scared'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full px-5 pt-4 pb-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#1c1c1c] rounded-full flex items-center justify-center border border-white/10 shrink-0 relative overflow-hidden">
                    <img src={`${import.meta.env.BASE_URL}bot.png`} alt="Bloop" className="w-full h-full object-cover mix-blend-screen scale-150" />
                </div>
                <div>
                    <h2 className="text-white font-bold text-lg">Bloop</h2>
                    <p className="text-[#34c97a] text-xs font-semibold uppercase tracking-wider">Online • Sass Level: {sassLevel}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scroll flex flex-col gap-4 mb-4">
                {messages.map(msg => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user'
                                ? "bg-white/10 self-end rounded-tr-sm backdrop-blur-md text-white"
                                : "bg-[#1c1c1c] self-start rounded-tl-sm border border-white/5 text-white/90"
                            }`}
                        style={{
                            boxShadow: msg.role === 'user' ? '0 4px 20px rgba(255,255,255,0.05)' : 'none'
                        }}
                    >
                        <div className="text-[14px] leading-relaxed break-words whitespace-normal overflow-visible">{msg.text}</div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="max-w-[85%] p-4 rounded-2xl bg-[#1c1c1c] self-start rounded-tl-sm border border-white/5 flex gap-1 items-center">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    </div>
                )}
                <div ref={endRef} />
            </div>

            <div className="relative mt-auto shrink-0">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Bloop something..."
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white text-[15px] placeholder-white/30 focus:outline-none focus:border-[#34c97a]/50 transition-colors"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#34c97a] rounded-xl flex items-center justify-center disabled:opacity-50 transition-opacity active:scale-95"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
