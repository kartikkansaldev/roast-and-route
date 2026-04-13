import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPRESSIONS } from '../constants'
import { useAppStore } from '../AppContext'

const MESSAGE_INTERVAL_MS = 9000

export default function FloatingBot({ expression = 'neutral', onExprChange, onChatOpen }) {
  const { sassLevel } = useAppStore()

  const chillGreetings = [
    "Hey! Looking forward to helping you grow your Vault today. 📈",
    "Welcome back! Let's make some smart financial moves together. 🤝",
    "Good to see you! Your Vault is ready for your next deposit. 🏦",
    "Hello! Remember, every small saving counts towards your big goals. 🌱"
  ];

  const sassyGreetings = [
    "Oh, you're back. Let's try not to blow our entire paycheck today, alright? 💸",
    "Look who decided to check their balance. Brace yourself. 🫣",
    "Ready to make some questionable financial choices? I'm watching. 🤨",
    "I see you've returned. Let's hope your wallet survives the day. 🛍️"
  ];

  const ruthlessGreetings = [
    "You have ₹62k to your name. Stop looking at your phone and go earn money. 💀",
    "Oh great, the financial disaster has returned. Don't touch the 'Pay' button. 🚫",
    "Your bank account is crying. I am judging. Do better. 📉",
    "Are you here to apologize to your wallet, or just hurt it more? 🤡"
  ];

  const [currentGreeting, setCurrentGreeting] = useState('');

  useEffect(() => {
    let arrayToUse = ruthlessGreetings;
    if (sassLevel === 'Chill') arrayToUse = chillGreetings;
    if (sassLevel === 'Sassy') arrayToUse = sassyGreetings;

    setCurrentGreeting({
      text: arrayToUse[Math.floor(Math.random() * arrayToUse.length)]
    });
  }, [sassLevel]);

  const [msg, setMsg] = useState(null)
  const [bubbleOpen, setBubbleOpen] = useState(true)
  const [robotShake, setRobotShake] = useState(false)

  // Override msg with currentGreeting naturally
  const displayMsg = bubbleOpen ? currentGreeting : null;

  useEffect(() => {
    const id = setInterval(() => {
      if (!bubbleOpen) return
      // For now, re-pick a random greeting based on sassLevel if interval hits
      let arrayToUse = ruthlessGreetings;
      if (sassLevel === 'Chill') arrayToUse = chillGreetings;
      if (sassLevel === 'Sassy') arrayToUse = sassyGreetings;
      setCurrentGreeting({
        text: arrayToUse[Math.floor(Math.random() * arrayToUse.length)]
      });
    }, MESSAGE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [bubbleOpen, sassLevel])

  const dismiss = useCallback(() => setBubbleOpen(false), [])

  const handleRobotTap = useCallback(() => {
    if (!bubbleOpen) {
      let arrayToUse = ruthlessGreetings;
      if (sassLevel === 'Chill') arrayToUse = chillGreetings;
      if (sassLevel === 'Sassy') arrayToUse = sassyGreetings;
      setCurrentGreeting({
        text: arrayToUse[Math.floor(Math.random() * arrayToUse.length)]
      });
      setBubbleOpen(true)
    } else {
      // Bubble is open — open the full chat overlay
      if (onChatOpen) onChatOpen()
    }
  }, [bubbleOpen, sassLevel, onChatOpen])

  return (
    /* Anchored to bottom-right of the phone */
    <div className="absolute bottom-[calc(76px+16px)] right-4 z-40 pointer-events-none">

      {/*
        Robot wrapper is `relative` so the speech bubble can be
        positioned as `absolute bottom-full right-0` — always
        sprouting from the robot, never floating mid-screen.
      */}
      <motion.div
        className="relative pointer-events-auto"
        animate={robotShake
          ? { rotate: [-8, 8, -4, 4, 0] }
          : { y: [0, -5, 0] }}
        transition={robotShake
          ? { duration: 0.45, ease: 'easeInOut' }
          : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* ── Speech bubble — absolute, above the robot ── */}
        <AnimatePresence>
          {bubbleOpen && (
            <motion.button
              key="bubble"
              initial={{ opacity: 0, scale: 0.6, y: 10, originX: 1, originY: 1 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={dismiss}
              className="absolute bottom-full right-0 mb-2 w-48
                         text-left pointer-events-auto cursor-pointer
                         px-3 py-2.5
                         rounded-[14px_14px_4px_14px]
                         bg-[rgba(14,14,16,0.95)] border border-white/10
                         backdrop-blur-[48px]
                         shadow-[0_8px_28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]
                         hover:border-white/20 transition-colors"
              style={{ pointerEvents: 'auto' }}
              aria-label="Bot message — tap to dismiss"
            >
              <BubbleText msg={displayMsg} />

              {/* Triangle pointer pointing down-right toward robot */}
              <span
                aria-hidden="true"
                className="absolute -bottom-[7px] right-5"
                style={{
                  width: 0, height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '7px solid rgba(14,14,16,0.95)',
                }}
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Robot avatar ── */}
        <motion.button
          onClick={handleRobotTap}
          whileTap={{ scale: 0.93 }}
          className="relative w-[68px] h-[68px] cursor-pointer"
          aria-label={`AI companion — ${expression}`}
        >
          <div className="robot-ring" aria-hidden="true" />

          <img
            src={`${import.meta.env.BASE_URL}robot.png`}
            alt="Roast & Route bot"
            className="relative z-10 w-full h-full rounded-full object-contain"
            style={{
              filter:
                'drop-shadow(0 4px 16px rgba(0,0,0,0.7)) drop-shadow(0 0 24px rgba(255,255,255,0.06))',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              document.getElementById('robot-fb').style.display = 'flex'
            }}
          />
          <div
            id="robot-fb"
            style={{ display: 'none' }}
            className="absolute inset-0 z-10 rounded-full bg-[#111]
                       border border-white/10 items-center justify-center text-3xl"
          >
            🤖
          </div>

          {/* Expression badge */}
          <div className="absolute bottom-0 right-0 z-20 w-5 h-5 rounded-full
                          bg-[#111] border-[1.5px] border-black
                          flex items-center justify-center text-[10px]">
            {EXPRESSIONS[expression] ?? '😎'}
          </div>
        </motion.button>
      </motion.div>
    </div>
  )
}

function BubbleText({ msg }) {
  if (!msg) return null
  if (msg.em) {
    return (
      <p className="text-[11px] text-white leading-[1.55] font-normal">
        {msg.text}
        <strong className="font-bold text-white">{msg.em}</strong>
        {msg.suffix ?? ''}
      </p>
    )
  }
  return (
    <p className="text-[11px] text-white leading-[1.55] font-normal">
      {msg.text}
    </p>
  )
}
