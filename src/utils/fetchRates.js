// Fetch live FX rates from free, no-key, CORS-enabled public APIs, with a
// fallback chain so it stays reliable. Every endpoint is normalised to our
// internal shape: units of each currency per 1 USD. Purely an online
// enhancement — callers must treat failure as "keep the saved rates".
import { CURRENCIES } from '../data/currency.js'

const CODES = CURRENCIES.map((c) => c.code)

async function getJson(url, timeout = 8000) {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(id)
  }
}

// Keep only the currencies we know about, as positive numbers, base USD = 1.
function normalise(map, lowercase = false) {
  const out = {}
  for (const code of CODES) {
    const v = map?.[lowercase ? code.toLowerCase() : code]
    if (typeof v === 'number' && isFinite(v) && v > 0) out[code] = v
  }
  out.USD = 1
  return out
}

const SOURCES = [
  {
    name: 'Frankfurter',
    run: async () => {
      const j = await getJson('https://api.frankfurter.app/latest?base=USD')
      return normalise(j.rates)
    },
  },
  {
    name: 'open.er-api.com',
    run: async () => {
      const j = await getJson('https://open.er-api.com/v6/latest/USD')
      if (j.result && j.result !== 'success') throw new Error('bad result')
      return normalise(j.rates)
    },
  },
  {
    name: 'currency-api',
    run: async () => {
      const j = await getJson(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      )
      return normalise(j.usd, true)
    },
  },
]

/**
 * Try each source in order; return { rates, source } from the first that
 * yields a usable table. Throws only if every source fails.
 */
export async function fetchLatestRates() {
  let lastErr
  for (const src of SOURCES) {
    try {
      const rates = await src.run()
      // Require a few currencies so a malformed/empty response falls through.
      if (Object.keys(rates).length >= 5) return { rates, source: src.name }
      throw new Error('sparse response')
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr || new Error('All rate sources failed')
}
