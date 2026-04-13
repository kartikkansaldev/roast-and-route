// ─────────────────────────────────────────────────────────────
//  App-wide constants — single source of truth
// ─────────────────────────────────────────────────────────────

export const FRIENDS = [
  { id: 1, name: 'arjun', emoji: '🧑‍🎤', bg: '#1a1035', ring: 'rgba(110,63,255,0.5)' },
  { id: 2, name: 'siddhima', emoji: '👩‍💻', bg: '#2a1320', ring: 'rgba(201,74,74,0.45)' },
  { id: 3, name: 'ayasha', emoji: '🧕', bg: '#0d2320', ring: 'rgba(52,201,122,0.45)' },
  { id: 4, name: 'pranjal', emoji: '👨‍🎨', bg: '#201a08', ring: 'rgba(201,168,82,0.45)' },
  { id: 5, name: 'yasmin', emoji: '👩‍🎤', bg: '#200a14', ring: 'rgba(201,77,130,0.45)' },
  { id: 6, name: 'rohan', emoji: '🧑‍🚀', bg: '#0d1e24', ring: 'rgba(52,170,201,0.45)' },
]

export const TRANSACTIONS = [
  { id: 1, name: 'Youtube Music', date: '21 October 19:20', amount: -5.50, color: '#ff8a8a', icon: '▶️', intercept: false },
  { id: 2, name: 'Bogdan Nikitin', date: '02 Minutes Ago', amount: 61.00, color: '#34c97a', icon: '👦', intercept: true },
  { id: 3, name: 'iTunes', date: '14 September 12:25', amount: -3.50, color: '#ffcf52', icon: '🎵', intercept: false },
  { id: 4, name: 'Easy Pay', date: '12 October 17:10', amount: 15.00, color: '#8af0b7', icon: '💳', intercept: true },
  { id: 5, name: 'Starbucks', date: '15 October 09:30', amount: -8.50, color: '#8a8aff', icon: '☕', intercept: false },
]

export const EXPRESSIONS = {
  neutral: '😎',
  happy: '🥳',
  angry: '😤',
  judging: '🤨',
  shocked: '😱',
  sad: '😔',
}

export const BOT_MESSAGES = {
  neutral: [
    { id: 'n1', text: "you've been staring at this screen for 2 mins. don't even think about opening ", em: "myntra", suffix: ". 🤨" },
    { id: 'n2', text: "your wallet said hi. and also please stop. 🙃" },
    { id: 'n3', text: "just checking in. don't do anything reckless. 🫡" },
  ],
  happy: [
    { id: 'h1', text: "you actually saved money today? i'm genuinely proud 🥹" },
    { id: 'h2', text: "bestie behavior. keep it up 💅" },
  ],
  judging: [
    { id: 'j1', text: "another scroll session? we need to talk. 🪑" },
    { id: 'j2', text: "i see you eyeing a ₹500 impulse rn. don't. 💀" },
  ],
  angry: [
    { id: 'a1', text: "₹800 on delivery?? in this economy?? 😤" },
    { id: 'a2', text: "we had a budget. and you did THIS. 🙃" },
  ],
}

/** Picks a random message object from a mood group */
export function randomMessage(expression = 'neutral') {
  const pool = BOT_MESSAGES[expression] ?? BOT_MESSAGES.neutral
  return pool[Math.floor(Math.random() * pool.length)]
}
