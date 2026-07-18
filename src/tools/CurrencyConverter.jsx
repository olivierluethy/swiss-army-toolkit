import { useMemo, useState } from 'react'
import { ArrowLeftRight, RotateCcw, Pencil, Check } from 'lucide-react'
import { CURRENCIES, DEFAULT_RATES, RATES_DATE, BASE } from '../data/currency.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { Field } from '../components/ui.jsx'

const NAME = Object.fromEntries(CURRENCIES.map((c) => [c.code, c]))

export default function CurrencyConverter() {
  const [rates, setRates] = useLocalStorage('sak:rates', DEFAULT_RATES)
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useLocalStorage('sak:cur:from', 'USD')
  const [to, setTo] = useLocalStorage('sak:cur:to', 'EUR')
  const [editing, setEditing] = useState(false)

  const value = parseFloat(amount)
  const result = useMemo(() => {
    if (!isFinite(value)) return null
    const rFrom = rates[from] ?? DEFAULT_RATES[from]
    const rTo = rates[to] ?? DEFAULT_RATES[to]
    if (!rFrom || !rTo) return null
    return (value / rFrom) * rTo
  }, [value, from, to, rates])

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  const fmtMoney = (n) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })

  const rate = result != null && value ? result / value : null

  return (
    <div className="tool">
      <Field label="Amount">
        <input
          className="inp inp--mono"
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
        />
      </Field>

      <div className="cur__pair">
        <Field label="From">
          <select className="inp" value={from} onChange={(e) => setFrom(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} · {c.name}</option>
            ))}
          </select>
        </Field>
        <button className="btn btn--icon cur__swap" onClick={swap} title="Swap currencies" aria-label="Swap">
          <ArrowLeftRight size={17} />
        </button>
        <Field label="To">
          <select className="inp" value={to} onChange={(e) => setTo(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} · {c.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="cur__result">
        <div className="cur__result-amt stat">
          {result != null ? (
            <>
              <span className="cur__sym">{NAME[to]?.symbol}</span>
              {fmtMoney(result)} <span className="cur__code">{to}</span>
            </>
          ) : '—'}
        </div>
        {rate != null && (
          <div className="cur__rate">1 {from} = {fmtMoney(rate).replace(/\.00$/, '')} {to}</div>
        )}
      </div>

      <div className="spread">
        <span className="tool__note">Static rates · {RATES_DATE} · base {BASE}</span>
        <button className="btn btn--ghost" onClick={() => setEditing((e) => !e)}>
          {editing ? <Check size={15} /> : <Pencil size={15} />} {editing ? 'Done' : 'Edit rates'}
        </button>
      </div>

      {editing && (
        <div className="cur__editor">
          <p className="tool__note">Rate = units per 1 {BASE}. Adjust to match today if you like.</p>
          <div className="cur__grid">
            {CURRENCIES.map((c) => (
              <label key={c.code} className="cur__rate-row">
                <span>{c.code}</span>
                <input
                  className="inp inp--mono"
                  type="number"
                  value={rates[c.code] ?? DEFAULT_RATES[c.code]}
                  disabled={c.code === BASE}
                  onChange={(e) =>
                    setRates((r) => ({ ...r, [c.code]: parseFloat(e.target.value) || 0 }))
                  }
                />
              </label>
            ))}
          </div>
          <button className="btn btn--ghost" onClick={() => setRates(DEFAULT_RATES)}>
            <RotateCcw size={15} /> Reset to bundled rates
          </button>
        </div>
      )}
    </div>
  )
}
