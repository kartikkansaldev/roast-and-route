import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Header from './components/Header'
import MainContent from './components/MainContent'
import FloatingBot from './components/FloatingBot'
import BottomNav from './components/BottomNav'
import WalletPage from './pages/WalletPage'
import InvestPage from './pages/InvestPage'
import ChatPage from './pages/ChatPage'
import RewardsPage from './pages/RewardsPage'
import ProfilePage from './pages/ProfilePage'
import BankTransferModal from './components/BankTransferModal'
import AddMoneyModal from './components/AddMoneyModal'
import { AppProvider, useAppStore } from './AppContext'
import PinModal from './components/PinModal'
import PaymentSimulator from './components/PaymentSimulator'
import Onboarding from './components/Onboarding'

function AppContent() {
  const {
    survivalPoints, userBalance, toastMsg,
    pinCallback, setPinCallback,
    activeTab, setActiveTab,
    isBankTransferOpen, setIsBankTransferOpen,
    isAddMoneyOpen, setIsAddMoneyOpen,
    isScannerOpen, setIsScannerOpen,
    hasCompletedOnboarding
  } = useAppStore()
  const [botExpression, setBotExpression] = useState('neutral')
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleScanPay = useCallback(() => {
    setIsScannerOpen(true)
  }, [setIsScannerOpen])

  return (
    <div className="min-h-screen bg-black font-sans flex items-center justify-center py-8">


      {/* Global Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 30, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-0 z-[999] px-5 py-3 rounded-full bg-[#34c97a] text-[#050505] font-bold text-[14px] shadow-[0_8px_32px_rgba(52,201,122,0.4)]"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Outer phone frame ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 28, delay: 0.05 }}
        className="relative flex-shrink-0"
      >
        {/* Physical chassis */}
        <div
          className="relative rounded-[54px] p-[10px]"
          style={{
            background: 'linear-gradient(145deg, #2e2e2e 0%, #1a1a1a 50%, #111 100%)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.09), inset 0 0 0 1px rgba(255,255,255,0.03), 0 60px 160px rgba(0,0,0,0.9)',
          }}
        >
          {/* Volume buttons */}
          <div className="absolute -left-[3.5px] top-[110px] w-[3.5px] h-[32px] bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3.5px] top-[154px] w-[3.5px] h-[32px] bg-[#2a2a2a] rounded-l-sm" />
          {/* Power button */}
          <div className="absolute -right-[3.5px] top-[130px] w-[3.5px] h-[64px] bg-[#2a2a2a] rounded-r-sm" />

          {/* Screen */}
          <div className="relative w-[390px] h-[844px] bg-[#121212] rounded-[44px] overflow-hidden flex flex-col shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">

            {/* Dynamic Island notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[124px] h-[34px] bg-black rounded-full z-50 flex items-center justify-between px-3 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.05)]">
              <div className="w-[13px] h-[13px] rounded-full bg-[#181818]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#181818]" />
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-white/20 rounded-full z-50" />

            {/* Onboarding overlay inside the phone screen */}
            <AnimatePresence>
              {!hasCompletedOnboarding && <Onboarding key="onboarding" />}
            </AnimatePresence>

            {/* ── Scrollable content ── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scroll relative z-10 text-white pb-4">
              <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                  <PageWrapper key="home">
                    <div className="px-[22px] pt-[60px]">
                      <Header survivalRating={Math.min(100, Math.floor(survivalPoints / 10))} vaultBalance={userBalance} />
                      <MainContent onScanPay={handleScanPay} />
                    </div>
                  </PageWrapper>
                )}

                {activeTab === 'wallet' && (
                  <PageWrapper key="wallet">
                    <WalletPage />
                  </PageWrapper>
                )}

                {activeTab === 'invest' && (
                  <PageWrapper key="invest">
                    <InvestPage />
                  </PageWrapper>
                )}

                {activeTab === 'rewards' && (
                  <PageWrapper key="rewards">
                    <RewardsPage />
                  </PageWrapper>
                )}

                {activeTab === 'profile' && (
                  <PageWrapper key="profile">
                    <ProfilePage />
                  </PageWrapper>
                )}
              </AnimatePresence>
            </div>

            {/* Floating bot — visible on all tabs */}
            <AnimatePresence>
              <FloatingBot
                key="bot"
                expression={botExpression}
                onExprChange={setBotExpression}
                onChatOpen={() => setIsChatOpen(true)}
              />
            </AnimatePresence>

            {/* Chat overlay triggered by bot tap */}
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  key="chat-overlay"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                  className="absolute inset-0 z-[60] bg-[#0A0A0A]/98 backdrop-blur-lg flex flex-col"
                >
                  <div className="flex items-center justify-between px-5 pt-6 pb-3">
                    <h2 className="text-white font-bold text-lg">Chat with Bloop</h2>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatPage />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onScanPay={handleScanPay} />

            {/* Modals */}
            <BankTransferModal isOpen={isBankTransferOpen} onClose={() => setIsBankTransferOpen(false)} />
            <AddMoneyModal isOpen={isAddMoneyOpen} onClose={() => setIsAddMoneyOpen(false)} />
            <PaymentSimulator isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

            {/* PIN overlay */}
            <PinModal
              isOpen={!!pinCallback}
              onClose={() => setPinCallback(null)}
              onSuccess={() => {
                if (pinCallback) pinCallback()
                setPinCallback(null)
              }}
            />

          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
