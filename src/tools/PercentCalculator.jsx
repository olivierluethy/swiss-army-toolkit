import { useState } from 'react'
import { Segmented } from '../components/ui.jsx'

const MODES = ['% of', 'is what %', '% change']

function num(v) { const n = parseFloat(v); return isFinite(n) ? n : null }
function fmt(n) {
  if (n == null) return '—'
  return parseFloat(n.toFixed(4)).toLocaleString(undefined, { maximumFractionDigits: 4 })
}

export default function PercentCalculator() {
  const [mode, setMode] = useState('% of')
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  let result = null
  let sentence = ''
  const x = num(a)
  const y = num(b)

  if (mode === '% of') {
    if (x != null && y != null) result = (x / 100) * y
    sentence = `${a || 'X'}% of ${b || 'Y'} =`
  } else if (mode === 'is what %') {
    if (x != null && y != null && y !== 0) result = (x / y) * 100
    sentence = `${a || 'X'} is what % of ${b || 'Y'} =`
  } else {
    if (x != null && y != null && x !== 0) result = ((y - x) / Math.abs(x)) * 100
    sentence = `change from ${a || 'X'} to ${b || 'Y'} =`
  }

  const labels =
    mode === '% of' ? ['Percent', 'Of value']
    : mode === 'is what %' ? ['Value', 'Total'] : ['From', 'To']
  const suffix = mode === 'is what %' || mode === '% change' ? '%' : ''

  return (
    <div className="tool">
      <Segmented size="sm" options={MODES} value={mode} onChange={setMode} />

      <div className="grid-2">
        <label className="fld">
          <span className="fld__label">{labels[0]}</span>
          <input className="inp inp--mono" type="number" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder="0" />
        </label>
        <label className="fld">
          <span className="fld__label">{labels[1]}</span>
          <input className="inp inp--mono" type="number" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="0" />
        </label>
      </div>

      <div className="cur__result">
        <div className="cur__rate">{sentence}</div>
        <div className="cur__result-amt stat">
          {result != null && mode === '% change' && result > 0 ? '+' : ''}{fmt(result)}{result != null ? suffix : ''}
        </div>
      </div>
    </div>
  )
}
