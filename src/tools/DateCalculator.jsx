import { useEffect, useState } from 'react'
import { Segmented, Field } from '../components/ui.jsx'
import { formatDate } from '../utils/formatDate.js'

const DAY = 86400000
function isoToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function Between() {
  const [from, setFrom] = useState(isoToday())
  const [to, setTo] = useState(isoToday())
  const a = new Date(from + 'T00:00')
  const b = new Date(to + 'T00:00')
  const valid = !isNaN(a) && !isNaN(b)
  const days = valid ? Math.round((b - a) / DAY) : null

  let breakdown = null
  if (valid) {
    const totalDays = Math.abs(days)
    const weeks = Math.floor(totalDays / 7)
    breakdown = `${weeks} weeks, ${totalDays % 7} days`
  }

  return (
    <>
      <div className="grid-2">
        <Field label="From"><input className="inp" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label="To"><input className="inp" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
      </div>
      <div className="cur__result">
        <div className="cur__result-amt stat">{days != null ? `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}` : '—'}</div>
        {breakdown && <div className="cur__rate">{breakdown}{days < 0 ? ' · in the past' : ''}</div>}
      </div>
    </>
  )
}

function AddSubtract() {
  const [base, setBase] = useState(isoToday())
  const [count, setCount] = useState(30)
  const [unit, setUnit] = useState('days')
  const [dir, setDir] = useState(1)

  const d = new Date(base + 'T00:00')
  let result = null
  if (!isNaN(d)) {
    const nd = new Date(d)
    const n = (parseInt(count, 10) || 0) * dir
    if (unit === 'days') nd.setDate(nd.getDate() + n)
    else if (unit === 'weeks') nd.setDate(nd.getDate() + n * 7)
    else if (unit === 'months') nd.setMonth(nd.getMonth() + n)
    else nd.setFullYear(nd.getFullYear() + n)
    result = nd
  }

  return (
    <>
      <Field label="Start date"><input className="inp" type="date" value={base} onChange={(e) => setBase(e.target.value)} /></Field>
      <Segmented size="sm" options={[{ value: 1, label: 'Add' }, { value: -1, label: 'Subtract' }]} value={dir} onChange={setDir} />
      <div className="row">
        <label className="fld" style={{ flex: 1 }}>
          <span className="fld__label">Amount</span>
          <input className="inp inp--mono" type="number" value={count} onChange={(e) => setCount(e.target.value)} />
        </label>
        <label className="fld" style={{ flex: 1 }}>
          <span className="fld__label">Unit</span>
          <select className="inp" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option>days</option><option>weeks</option><option>months</option><option>years</option>
          </select>
        </label>
      </div>
      <div className="cur__result">
        <div className="cur__result-amt stat" style={{ fontSize: 21 }}>
          {result ? formatDate(result) : '—'}
        </div>
      </div>
    </>
  )
}

function Countdown() {
  const [target, setTarget] = useState('')
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const t = target ? new Date(target).getTime() : null
  const diff = t != null && !isNaN(t) ? t - now : null
  const past = diff != null && diff < 0
  const abs = diff != null ? Math.abs(diff) : 0
  const d = Math.floor(abs / DAY)
  const h = Math.floor((abs % DAY) / 3600000)
  const m = Math.floor((abs % 3600000) / 60000)
  const s = Math.floor((abs % 60000) / 1000)

  return (
    <>
      <Field label="Target date & time">
        <input className="inp" type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} />
      </Field>
      {diff != null ? (
        <div className="count__grid">
          {[[d, 'days'], [h, 'hrs'], [m, 'min'], [s, 'sec']].map(([v, l]) => (
            <div className="count__cell" key={l}>
              <b className="stat">{v}</b><span>{l}</span>
            </div>
          ))}
        </div>
      ) : <p className="tool__note">Pick a date to start the countdown.</p>}
      {t != null && !isNaN(t) && (
        <p className="tool__note">
          {past ? 'Passed on ' : 'Counting down to '}
          <b>{formatDate(t)}</b>
        </p>
      )}
    </>
  )
}

export default function DateCalculator() {
  const [mode, setMode] = useState('Between')
  return (
    <div className="tool">
      <Segmented options={['Between', 'Add / Sub', 'Countdown']} value={mode} onChange={setMode} />
      {mode === 'Between' && <Between />}
      {mode === 'Add / Sub' && <AddSubtract />}
      {mode === 'Countdown' && <Countdown />}
    </div>
  )
}
