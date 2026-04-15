import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../AppContext'
import { generateBloopResponse } from '../utils/geminiEngine'

export default function PaymentSimulator({ isOpen, onClose }) {
    const [phase, setPhase] = useState('SCANNER') // SCANNER, LOAD_A, ROAST_ENTRY, ROAST_MODAL, VIDEO_SMASH
    const [aiData, setAiData] = useState(null)
    const [payeeName, setPayeeName] = useState('')
    const [scannedAmount, setScannedAmount] = useState(0)
    
    // Feature Update: Food Order Tracking
    const [foodOrderCount, setFoodOrderCount] = useState(0)
    
    // Phase 11: Essential UPI Flow States
    const [paymentStep, setPaymentStep] = useState(0) // 0: Hidden, 1: Amount/Bank, 2: PIN, 3: Success
    const [paymentAmount, setPaymentAmount] = useState('')
    const [selectedBank, setSelectedBank] = useState('HDFC Bank ending in 1234')
    const [enteredPin, setEnteredPin] = useState('')
    const [pinError, setPinError] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [hasPassedSmash, setHasPassedSmash] = useState(false)

    const scannerRef = useRef(null)

    const { userBalance, setUserBalance, portfolioValue, setPortfolioValue, addSurvivalPoints, showToast, requestPin, sassLevel } = useAppStore()

    useEffect(() => {
        if (isOpen) {
            setPhase('SCANNER')
            setAiData(null)
            setPayeeName('')
            setScannedAmount(0)
            setPaymentStep(0)
            setPaymentAmount('')
            setEnteredPin('')
            setPinError(false)
            setIsProcessing(false)
            setHasPassedSmash(false)
            setPendingRoast(null)
            setRoastType(null)
            if (scannerRef.current) {
                try {
                    scannerRef.current.stop().catch(() => {})
                } catch(e) {}
            }
        }
    }, [isOpen])

    // Pre-fetched AI response — fired the moment QR is scanned
    const [pendingRoast, setPendingRoast] = useState(null)
    const [roastType, setRoastType] = useState(null) // 'ESSENTIAL' or 'IMPULSE'

    const processScan = async (rawText) => {
        console.log("RAW QR SCAN DETECTED:", rawText)
        
        if (!rawText || rawText.trim() === '') {
            showToast("Unable to detect QR code. Please try again or use the test buttons.")
            return
        }

        // Accept: UPI QR codes (upi://), payment URLs, any text with payment signals
        // Previously rejected friend's GPay/PhonePe QRs that have no digits in clean P2P format
        const isUpiScheme = /^upi:\/\//i.test(rawText.trim());
        const hasPaymentSignal = /\d|₹|pay|upi|gpay|phone|paytm|bhim|merchant|amount/i.test(rawText);
        if (!isUpiScheme && !hasPaymentSignal) {
            showToast("Invalid QR Code: Not a payment QR.");
            return;
        }

        if (scannerRef.current) {
            try {
                scannerRef.current.stop().catch(() => {})
            } catch(e) {}
        }
        
        let parsedName = rawText;
        let amount = Math.floor(Math.random() * 2000) + 100;

        // Process for UI visual rendering ONLY - AI still receives untouched rawText
        try {
            const url = new URL(rawText);
            if (url.searchParams.has('pn')) {
                parsedName = decodeURIComponent(url.searchParams.get('pn'));
            } else if (url.searchParams.has('pa')) {
                // Fallback: extract readable name from UPI ID (e.g. john.doe@okaxis -> John Doe)
                const pa = url.searchParams.get('pa');
                parsedName = pa.split('@')[0].replace(/[._-]/g, ' ');
            }
            if (url.searchParams.has('am')) {
                const parsedAm = parseFloat(url.searchParams.get('am'));
                if (!isNaN(parsedAm) && parsedAm > 0) amount = parsedAm;
            }
        } catch (e) {
            const amountMatch = rawText.match(/₹\s*(\d+)/i) || rawText.match(/\b(\d{2,5})\b/);
            if (amountMatch) {
                amount = parseInt(amountMatch[1]);
            }
        }

        setScannedAmount(amount)
        setPayeeName(parsedName.substring(0, 35))
        setPaymentAmount(amount.toString())
        setPendingRoast(null)
        setRoastType(null)
        setPhase('LOAD_A')

        try {
            // 🔥 FIRE AI IMMEDIATELY ON SCAN — store result, don't wait for PIN
            const aiReply = await generateBloopResponse(rawText, sassLevel, userBalance, true, foodOrderCount)

            if (aiReply.includes('[ESSENTIAL]')) {
                const cleanText = aiReply.replace('[ESSENTIAL]', '').trim();
                setPendingRoast(cleanText)
                setRoastType('ESSENTIAL')
                setAiData({ roast: cleanText })

                const lowerName = parsedName.toLowerCase();
                if (lowerName.includes('swiggy') || lowerName.includes('zomato')) {
                    setFoodOrderCount(prev => prev + 1);
                }

                setPhase('SCANNER');
                setPaymentStep(1); // Show payment flow immediately
            } else {
                const cleanText = aiReply.replace('[IMPULSE]', '').replace('[ESSENTIAL]', '').trim();
                setPendingRoast(cleanText)
                setRoastType('IMPULSE')
                setAiData({ roast: cleanText })
                setPaymentStep(0);
                setPhase('ROAST_ENTRY'); // Launch roast intercept immediately
            }

        } catch (err) {
            console.error(err)
            setPaymentAmount(amount.toString())
            setPhase('SCANNER');
            setPaymentStep(1)
        }
    }


    // Setup QR Scanner — dynamic import to prevent SSR/init crashes
    useEffect(() => {
        let isSetup = false
        let invertedInterval = null  // Parallel dark-QR scanner cleanup handle

        if (isOpen && phase === 'SCANNER') {
            if (scannerRef.current) return;
            import('html5-qrcode').then(({ Html5Qrcode }) => {
                const readerNode = document.getElementById("reader");
                if (!readerNode) return;
                readerNode.innerHTML = ""; // Prune any zombie videos from StrictMode double-mounts

                const scanner = new Html5Qrcode("reader", {
                    experimentalFeatures: { useBarCodeDetectorIfSupported: true }
                })
                scannerRef.current = scanner

                // ── Main scanner: handles standard (light-bg) QR codes ──────────────
                scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 20,
                        qrbox: (w, h) => {
                            const edge = Math.floor(Math.min(w, h) * 0.8);
                            return { width: edge, height: edge };
                        }
                    },
                    async (decodedText) => {
                        if (isSetup) return
                        isSetup = true
                        if (invertedInterval) clearInterval(invertedInterval)
                        processScan(decodedText)
                    },
                    () => { /* per-frame parse errors — ignore */ }
                ).catch(err => {
                    console.error("Camera access failed:", err)
                })

                // ── Parallel jsQR Scanner (fallback for dark/inverted QRs) ───────────
                // Starts after 500ms so video stream is live. Catches anything html5-qrcode misses.
                setTimeout(() => {
                    import('jsqr').then(({ default: jsQR }) => {
                        const ivCanvas = document.createElement('canvas');
                        const ivCtx = ivCanvas.getContext('2d');

                        invertedInterval = setInterval(() => {
                            if (isSetup) { clearInterval(invertedInterval); return; }

                            const video = document.querySelector('#reader video');
                            if (!video || video.readyState < 2) return;

                            ivCanvas.width  = Math.floor(video.videoWidth  * 0.75);
                            ivCanvas.height = Math.floor(video.videoHeight * 0.75);
                            ivCtx.drawImage(video, 0, 0, ivCanvas.width, ivCanvas.height);

                            const imageData = ivCtx.getImageData(0, 0, ivCanvas.width, ivCanvas.height);

                            // 'attemptBoth' = tries normal + inverted every frame
                            // Catches dark-bg QRs (PhonePe, GPay dark mode) that html5-qrcode misses
                            const code = jsQR(imageData.data, ivCanvas.width, ivCanvas.height, {
                                inversionAttempts: 'attemptBoth'
                            });

                            if (code && !isSetup) {
                                isSetup = true;
                                clearInterval(invertedInterval);
                                processScan(code.data);
                            }
                        }, 150);
                    }).catch(e => console.warn('jsQR load failed (non-critical):', e));
                }, 500);
            }).catch(err => {
                console.error("html5-qrcode load failed", err)
            })
        }

        return () => {
            if (invertedInterval) clearInterval(invertedInterval)
            if (scannerRef.current) {
                try {
                    scannerRef.current.stop().then(() => {
                        if (scannerRef.current) {
                            scannerRef.current.clear()
                            scannerRef.current = null
                        }
                    }).catch(() => {
                        scannerRef.current = null
                    })
                } catch(e) {
                    scannerRef.current = null
                }
            }
            
            // Absolute nuclear option to ensure UI doesn't visually stack multiple cameras on fast-reloads
            const readerNode = document.getElementById("reader");
            if (readerNode) readerNode.innerHTML = "";
        }
    }, [isOpen, phase]) 
    // Stripped all other dependencies to brutally prevent mid-scan re-initialization crashes

    // Fallback timer for video duration if onEnded fails
    useEffect(() => {
        if (phase === 'VIDEO_SMASH') {
            const t = setTimeout(() => {
                handleSmashEnd()
            }, 4000) // Assumes hammer smash is around 4s max
            return () => clearTimeout(t)
        }
    }, [phase])

    if (!isOpen) return null



    const cancelInvest = () => {
        const amount = scannedAmount > 0 ? scannedAmount : 500
        setPortfolioValue(prev => prev + amount)
        addSurvivalPoints(20)
        showToast(`Smart choice. +₹${amount} to Vault. 📈`)
        onClose()
    }

    const buyAnyway = () => {
        requestPin(() => {
            setPhase('VIDEO_SMASH')
        })
    }

    const handleSmashEnd = () => {
        // Prevent double execution if triggered by both onEnded and Timeout
        setPhase(curr => {
            if (curr === 'VIDEO_SMASH') {
                setUserBalance(prev => prev - (scannedAmount > 0 ? scannedAmount : 2500))
                addSurvivalPoints(-15)
                showToast("Payment forced through. But I'm judging you. 💀")
                onClose()
                return 'DONE'
            }
            return curr
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-[80] font-sans overflow-hidden ${phase === 'VIDEO_SMASH' ? 'bg-[#121212]' : ''}`}
        >
            {/* Dark backing */}
            {phase !== 'VIDEO_SMASH' && (
                <div
                    className="absolute inset-0 bg-[#1c1c1c] transition-colors duration-200"
                    onClick={phase === 'SCANNER' ? onClose : undefined}
                />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 pointer-events-none">
                <AnimatePresence mode="wait">

                    {/* PHASE: SCANNER UI */}
                    {phase === 'SCANNER' && (
                        <motion.div key="scanner" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm pointer-events-auto h-full max-h-[100dvh] overflow-y-auto no-scroll flex flex-col justify-center py-2">
                            <div className="w-full aspect-square max-h-[45vh] border-2 border-white/20 rounded-[40px] relative overflow-hidden mb-5 shadow-[0_0_50px_rgba(255,255,255,0.05)] bg-black shrink-0" id="reader">
                            </div>

                            <p className="text-white/40 text-center font-bold tracking-widest uppercase text-[12px] sm:text-sm mb-4 shrink-0">Scanning for UPI QR...</p>

                            <div className="flex flex-col items-center gap-2.5 w-full border border-white/10 p-3.5 rounded-2xl bg-white/5 shrink-0">
                                <span className="text-white/60 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold mb-1">Simulate Scan (Dev Tools)</span>
                                <button onClick={() => processScan("Zara Fast Fashion Jacket - ₹4500")} className="w-full py-2.5 rounded-xl bg-[#ff4444]/20 border border-[#ff4444]/50 text-[#ff8a8a] text-[13px] font-bold hover:bg-[#ff4444]/30 transition-colors">
                                    Simulate: Zara Jacket (₹4500)
                                </button>
                                <button onClick={() => processScan("Apollo Pharmacy Medical Bill - ₹500")} className="w-full py-2.5 rounded-xl bg-[#34c97a]/20 border border-[#34c97a]/50 text-[#8af0b7] text-[13px] font-bold hover:bg-[#34c97a]/30 transition-colors">
                                    Simulate: Apollo Pharmacy (₹500)
                                </button>
                            </div>

                            <button onClick={onClose} className="mt-5 text-white/50 text-[14px] font-medium block mx-auto hover:text-white/80 transition-colors shrink-0">
                                Cancel Scan
                            </button>
                        </motion.div>
                    )}

                    {/* PHASE: LOAD A */}
                    {phase === 'LOAD_A' && (
                        <motion.div key="loada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-white/20 border-t-[#34c97a] rounded-full animate-spin mb-4" />
                            <p className="text-white font-bold tracking-wide">Analyzing Purchase...</p>
                        </motion.div>
                    )}

                    {/* PHASE: ROAST ENTRY & MODAL */}
                    {(phase === 'ROAST_ENTRY' || phase === 'ROAST_MODAL') && (
                        <motion.img
                            key="bot_image"
                            src={`${import.meta.env.BASE_URL}ezgif-frame-001-transparent.png`}
                            initial={{ y: '100vh', opacity: 1, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', damping: 16, stiffness: 120 }}
                            onAnimationComplete={() => {
                                if (phase === 'ROAST_ENTRY') setPhase('ROAST_MODAL')
                            }}
                            className="w-full h-full object-cover absolute inset-0 z-20 pointer-events-none"
                            style={{ opacity: phase === 'ROAST_MODAL' ? 0.3 : 1, transition: 'opacity 0.5s ease' }}
                        />
                    )}

                </AnimatePresence>
            </div>

            {/* Fades in content once image settles */}
            <AnimatePresence>
                {phase === 'ROAST_MODAL' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 w-full p-6 z-30"
                    >
                        <div className="w-full max-w-sm mx-auto bg-[#1c1c1c] border border-white/10 p-6 rounded-[32px] shadow-2xl pointer-events-auto">
                            <div className="text-center h-auto max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words pb-4 text-white">
                                <h3 className="text-[#ff8a8a] text-[18px] font-bold mb-3 uppercase tracking-wider">Intercept Activated</h3>
                                {aiData ? aiData.roast : `Bro, really? Another purchase? Do you really want to waste ₹${scannedAmount} right now?`}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button onClick={onClose} className="w-full py-3.5 rounded-2xl bg-[#2a2a2a] hover:bg-[#333333] border border-white/5 text-white font-bold text-[14px] transition-colors shadow-sm">
                                    Cancel Payment
                                </button>
                                <button onClick={cancelInvest} className="w-full py-4 rounded-2xl bg-[#34c97a] text-[#121212] font-bold text-[15px] shadow-[0_8px_24px_rgba(52,201,122,0.25)] active:scale-95 transition-transform flex flex-col items-center">
                                    <span>Invest ₹{scannedAmount > 0 ? scannedAmount : 500}</span>
                                    <span className="text-[#121212]/70 text-[11px]">+20 Survival</span>
                                </button>
                                <button onClick={buyAnyway} className="w-full py-3.5 rounded-2xl bg-transparent border border-white/10 text-white/50 hover:text-white hover:bg-white/5 font-bold text-[14px] transition-colors">
                                    Buy Anyway
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE: VIDEO SMASH (contained within mobile frame) */}
            {phase === 'VIDEO_SMASH' && (
                <div className="absolute inset-0 z-50 bg-[#121212]">
                    <video
                        src={`${import.meta.env.BASE_URL}hammer-smash.mp4`}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleSmashEnd}
                        className="w-full h-full pointer-events-none"
                        style={{ objectFit: 'cover', display: 'block' }}
                    />
                </div>
            )}

            {/* PHASE 11: ESSENTIAL PAYMENT FLOW OVERLAYS */}
            <AnimatePresence mode="sync">
                {/* STEP 1: AMOUNT & BANK SELECTION */}
                {paymentStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 pb-12 font-sans overflow-hidden pointer-events-auto">
                        <div className="flex-1 flex flex-col pt-16">
                            <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-white/20 transition-colors z-10">✕</button>
                            
                            <p className="text-white/60 text-center text-sm font-medium mb-1 tracking-wide uppercase">Paying</p>
                            <h2 className="text-white text-center text-2xl font-bold mb-12 drop-shadow-md">{payeeName}</h2>
                            
                            <div className="flex items-center justify-center text-5xl font-bold font-sans text-white mb-16 relative">
                                <span className="text-white/40 mr-1 mt-1">₹</span>
                                <input 
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="bg-transparent border-none outline-none w-full max-w-[240px] text-left p-0 m-0 leading-tight focus:ring-0"
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>

                            <div className="mx-auto w-full max-w-[320px] bg-white/5 border border-white/10 rounded-[20px] p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-[18px]">🏛️</div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-[14px] font-semibold tracking-tight">{selectedBank}</span>
                                        <span className="text-[#34c97a] text-[11px] font-bold mt-0.5">Available Balance: ₹{userBalance}</span>
                                    </div>
                                </div>
                                <span className="text-white/40 text-[10px]">▼</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                 const amt = Number(paymentAmount);
                                 if(amt > 0 && amt <= userBalance) {
                                     setPaymentStep(2);
                                 } else {
                                     showToast(amt > userBalance ? "Insufficient vault balance!" : "Enter a valid amount.");
                                 }
                            }} 
                            className="w-full max-w-[350px] mx-auto py-4 rounded-full bg-[#34c97a] text-[#121212] font-bold text-[17px] hover:bg-[#34c97a]/90 active:scale-95 transition-all shadow-[0_8px_32px_rgba(52,201,122,0.25)]"
                        >
                            Proceed to Pay
                        </button>
                    </motion.div>
                )}

                {/* STEP 2: UPI PIN */}
                {paymentStep === 2 && (
                    <motion.div key="step2" initial={{ x: '100%'} } animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 220 }} className="absolute inset-0 z-[110] bg-[#121212] flex flex-col justify-between p-6 pb-12 font-sans items-center pointer-events-auto">
                        <div className="w-full flex-1 flex flex-col pt-12 items-center">
                            <div className="flex items-center gap-2 mb-6 text-white/50 text-[13px] font-semibold bg-white/5 px-4 py-1.5 rounded-full">
                                <span>🔒</span> Secured by NPCI
                            </div>
                            
                            <h2 className={`text-[19px] font-bold tracking-tight mb-2 transition-colors ${pinError ? 'text-[#ff4444]' : 'text-white'}`}>
                                {pinError ? 'Incorrect PIN' : 'Enter 4-digit UPI PIN'}
                            </h2>
                            <p className="text-white/50 text-[14px] font-medium mb-10">Paying <span className="text-white">₹{paymentAmount}</span> to <span className="text-white">{payeeName}</span></p>
                            
                            {!isProcessing && <p className="text-white/30 text-[12px] mb-8 font-medium">Hint: Enter any 4 digits</p>}

                            {isProcessing ? (
                                <div className="mt-4 flex flex-col items-center">
                                    <div className="w-10 h-10 border-[3px] border-white/10 border-t-[#34c97a] rounded-full animate-spin mb-4" />
                                    <p className="text-white/60 text-[13px] font-bold">Processing Securly...</p>
                                </div>
                            ) : (
                                <div className={`flex gap-5 mb-16 ${pinError ? 'animate-shake' : ''}`}>
                                    {[1, 2, 3, 4].map(num => (
                                        <div key={num} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 shadow-sm ${enteredPin.length >= num ? 'bg-white border-white scale-110' : 'border-white/20'}`} />
                                    ))}
                                </div>
                            )}
                            
                            {!isProcessing && (
                                <div className="grid grid-cols-3 gap-x-12 gap-y-5 w-full max-w-[320px] px-2 mx-auto mt-auto pb-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <button key={num} onClick={() => {
                                            if(enteredPin.length < 4) {
                                                setPinError(false);
                                                setEnteredPin(prev => prev + num);
                                            }
                                        }} className="w-[68px] h-[68px] rounded-full mx-auto flex items-center justify-center text-white text-[28px] font-medium hover:bg-white/10 active:bg-white/20 transition-colors">
                                            {num}
                                        </button>
                                    ))}
                                    <button onClick={() => {
                                        setEnteredPin(prev => prev.slice(0, -1));
                                        setPinError(false);
                                    }} className="w-[68px] h-[68px] rounded-full mx-auto flex items-center justify-center text-white text-2xl hover:bg-white/10 active:bg-white/20 transition-colors">
                                        ⌫
                                    </button>
                                    <button onClick={() => {
                                        if(enteredPin.length < 4) {
                                            setPinError(false);
                                            setEnteredPin(prev => prev + '0');
                                        }
                                    }} className="w-[68px] h-[68px] rounded-full mx-auto flex items-center justify-center text-white text-[28px] font-medium hover:bg-white/10 active:bg-white/20 transition-colors">
                                        0
                                    </button>
                                    <button onClick={() => {
                                        if(enteredPin.length === 4) {
                                            if (roastType === 'IMPULSE' && pendingRoast) {
                                                // 🔥 INSTANT HIDE → Hammer Smash → Intercept Modal
                                                setPaymentStep(0);     // Immediately hide PIN screen
                                                setPhase('VIDEO_SMASH'); // Play hammer video at once
                                            } else {
                                                // ESSENTIAL: show processing spinner then success
                                                setIsProcessing(true);
                                                setTimeout(() => {
                                                    setIsProcessing(false);
                                                    setPaymentStep(3);
                                                }, 1400);
                                            }
                                        }
                                    }} className={`w-[68px] h-[68px] rounded-full mx-auto flex items-center justify-center text-black text-2xl transition-all duration-300 ${enteredPin.length === 4 ? 'bg-[#34c97a] hover:bg-[#34c97a]/90 shadow-[0_4px_16px_rgba(52,201,122,0.4)] cursor-pointer scale-105' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
                                        ✓
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: SUCCESS ANIMATION */}
                {paymentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[120] bg-black flex flex-col items-center justify-between p-6 pb-12 font-sans pointer-events-auto">
                        <div className="flex-1 flex flex-col items-center justify-center w-full relative -top-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 0.1 }}
                                className="w-[100px] h-[100px] rounded-full bg-[#34c97a] flex items-center justify-center mb-8 shadow-[0_0_100px_rgba(52,201,122,0.35)]"
                            >
                                <motion.svg 
                                    initial={{ pathLength: 0 }} 
                                    animate={{ pathLength: 1 }} 
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </motion.svg>
                            </motion.div>
                            
                            <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-white font-bold text-[26px] mb-2 tracking-tight">
                                Payment Successful!
                            </motion.h2>
                            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-white font-bold text-[40px] mb-4 tracking-tighter drop-shadow-md">
                                ₹{paymentAmount}
                            </motion.p>
                            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="text-white/50 font-medium text-[15px] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                Paid securely to <span className="text-white font-semibold">{payeeName}</span>
                            </motion.p>
                        </div>

                        <motion.button 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
                            onClick={() => {
                                setUserBalance(prev => prev - Number(paymentAmount));
                                showToast(`Securely paid ₹${paymentAmount} to ${payeeName}.`);
                                onClose();
                            }} 
                            className="w-full max-w-[350px] mx-auto py-4 rounded-full border border-white/20 bg-[#1c1c1c] text-white hover:bg-white/10 active:bg-white/20 font-bold text-[17px] transition-all shadow-lg"
                        >
                            Done
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
