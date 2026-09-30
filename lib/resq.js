export const TOKEN_KEY = 'resqai_token'

export function getToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}
export function setToken(t) {
  if (typeof window === 'undefined') return
  if (t) window.localStorage.setItem(TOKEN_KEY, t)
  else window.localStorage.removeItem(TOKEN_KEY)
}

export async function api(path, { method = 'GET', body, token } = {}) {
  const t = token ?? getToken()
  const res = await fetch(`/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const SEV_STYLE = {
  none: { text: 'text-emerald-500', bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30', dot: '#10b981', label: 'All clear' },
  low: { text: 'text-lime-500', bg: 'bg-lime-500/15 text-lime-700 dark:text-lime-300 border-lime-500/30', dot: '#84cc16', label: 'Low' },
  moderate: { text: 'text-amber-500', bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30', dot: '#f59e0b', label: 'Moderate' },
  severe: { text: 'text-orange-500', bg: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30', dot: '#f97316', label: 'Severe' },
  extreme: { text: 'text-red-500', bg: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30', dot: '#ef4444', label: 'Extreme' },
}
export const sevWord = (n) => ['none', 'low', 'moderate', 'severe', 'extreme'][Math.max(0, Math.min(4, Math.round(n || 0)))]
export const sevFromFive = (n) => ['none', 'low', 'moderate', 'moderate', 'severe', 'extreme'][Math.max(0, Math.min(5, Math.round(n || 0)))]

export const LANG_TTS = {
  English: 'en-US', Hindi: 'hi-IN', Marathi: 'mr-IN', Bengali: 'bn-IN', Tamil: 'ta-IN', Telugu: 'te-IN', Gujarati: 'gu-IN', Kannada: 'kn-IN', Malayalam: 'ml-IN', Punjabi: 'pa-IN', Odia: 'or-IN', Assamese: 'as-IN', Urdu: 'ur-PK', Nepali: 'ne-NP', Sinhala: 'si-LK',
  Spanish: 'es-ES', French: 'fr-FR', German: 'de-DE', Italian: 'it-IT', Dutch: 'nl-NL', Portuguese: 'pt-BR', Turkish: 'tr-TR', Russian: 'ru-RU', Ukrainian: 'uk-UA', Polish: 'pl-PL', Catalan: 'ca-ES', Welsh: 'cy-GB',
  'Chinese (Simplified)': 'zh-CN', 'Chinese (Traditional)': 'zh-TW', Japanese: 'ja-JP', Korean: 'ko-KR', Vietnamese: 'vi-VN', Thai: 'th-TH', Indonesian: 'id-ID', Malay: 'ms-MY', Filipino: 'fil-PH', Cebuano: 'fil-PH',
  Arabic: 'ar-SA', Persian: 'fa-IR', Swahili: 'sw-KE', Amharic: 'am-ET', Hausa: 'ha-NG', Yoruba: 'yo-NG', Igbo: 'ig-NG', Zulu: 'zu-ZA', Afrikaans: 'af-ZA',
}

export function speak(text, language = 'English') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = LANG_TTS[language] || 'en-US'
  u.rate = 0.95
  const voices = window.speechSynthesis.getVoices?.() || []
  const v = voices.find((x) => x.lang === u.lang) || voices.find((x) => x.lang?.startsWith(u.lang.split('-')[0]))
  if (v) u.voice = v
  window.speechSynthesis.speak(u)
  return true
}
export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
}

export function timeAgo(iso) {
  if (!iso) return ''
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function fmtTime(iso, tz) {
  try { return new Date(iso).toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit', ...(tz ? { timeZone: tz } : {}) }) } catch { return iso }
}

export const REPORT_TYPES = {
  flooding: { label: 'Flooding / Water depth', icon: '\u{1F30A}', color: '#0ea5e9' },
  blocked_road: { label: 'Blocked road', icon: '\u{1F6A7}', color: '#f59e0b' },
  fallen_power_line: { label: 'Fallen power line', icon: '\u26A1', color: '#ef4444' },
  landslide: { label: 'Landslide', icon: '\u{26F0}', color: '#a16207' },
  building_damage: { label: 'Building damage', icon: '\u{1F3DA}', color: '#f97316' },
  fallen_tree: { label: 'Fallen tree', icon: '\u{1F333}', color: '#16a34a' },
  fire: { label: 'Fire', icon: '\u{1F525}', color: '#dc2626' },
  medical: { label: 'Medical emergency', icon: '\u{1FA7A}', color: '#e11d48' },
  other: { label: 'Other hazard', icon: '\u{1F4CD}', color: '#64748b' },
}

export const ZONE_CATEGORIES = {
  flood: { label: 'Flood-prone / low-lying', color: '#0ea5e9' },
  coastal: { label: 'Coastal surge', color: '#2563eb' },
  landslide: { label: 'Landslide corridor', color: '#a16207' },
  wind: { label: 'High-velocity wind', color: '#8b5cf6' },
  drainage: { label: 'Open drainage', color: '#14b8a6' },
  fire: { label: 'Fire risk', color: '#dc2626' },
  other: { label: 'Other', color: '#64748b' },
}

export const HAZARD_ICON = { rain: '\u{1F327}', flood: '\u{1F30A}', wind: '\u{1F32C}', storm: '\u26C8', fog: '\u{1F32B}', heat: '\u{1F321}', cold: '\u2744', snow: '\u{1F328}', ice: '\u{1F9CA}' }
