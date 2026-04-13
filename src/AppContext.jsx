import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { TRANSACTIONS as INITIAL_TXS } from './constants'

const AppContext = createContext(null)

export function AppProvider({ children }) {
    const [userBalance, setUserBalance] = useState(10000)
    const [portfolioValue, setPortfolioValue] = useState(1280.48)
    const [survivalPoints, setSurvivalPoints] = useState(850)
    const [transactions, setTransactions] = useState(INITIAL_TXS || [])
    const [toastMsg, setToastMsg] = useState(null)
    const [pinCallback, setPinCallback] = useState(null)
    const [activeTab, setActiveTab] = useState('home')
    const [isBankTransferOpen, setIsBankTransferOpen] = useState(false)
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false)
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
    const [sassLevel, setSassLevel] = useState('Ruthless')

    const showToast = useCallback((msg) => {
        setToastMsg(msg)
        setTimeout(() => setToastMsg(null), 2500)
    }, [])

    const buyAsset = (amount, assetName) => {
        if (userBalance < amount) {
            showToast(`Insufficient balance for ${assetName} 😢`)
            return false
        }
        setUserBalance(prev => prev - amount)
        setPortfolioValue(prev => prev + amount)
        showToast(`Bought ${assetName} for ₹${amount.toFixed(2)} 📈`)
        return true
    }

    const sellAsset = (amount, assetName) => {
        setUserBalance(prev => prev + amount)
        setPortfolioValue(prev => Math.max(0, prev - amount))
        showToast(`Sold ${assetName} for ₹${amount.toFixed(2)} 💸`)
        return true
    }

    const addSurvivalPoints = (points) => {
        setSurvivalPoints(prev => prev + points)
    }

    const addCashback = (amount) => {
        setUserBalance(prev => prev + amount)
    }

    const requestPin = useCallback((callback) => {
        setPinCallback(() => callback)
    }, [])

    return (
        <AppContext.Provider value={{
            userBalance, setUserBalance,
            portfolioValue, setPortfolioValue,
            survivalPoints, addSurvivalPoints,
            transactions, setTransactions,
            toastMsg, showToast,
            buyAsset, sellAsset, addCashback,
            pinCallback, setPinCallback, requestPin,
            activeTab, setActiveTab,
            isBankTransferOpen, setIsBankTransferOpen,
            isAddMoneyOpen, setIsAddMoneyOpen,
            isScannerOpen, setIsScannerOpen,
            hasCompletedOnboarding, setHasCompletedOnboarding,
            sassLevel, setSassLevel
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppStore() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useAppStore must be used within AppProvider')
    return ctx
}
