import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Segmented, Field } from '../components/ui.jsx'

// Each unit maps to a factor relative to the category's base unit.
const CATEGORIES = {
  Length: {
    base: 'm',
    units: {
      mm: 0.001, cm: 0.01, m: 1, km: 1000,
      in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, nmi: 1852,
    },
    def: ['m', 'ft'],
  },
  Weight: {
    base: 'kg',
    units: { mg: 1e-6, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592, st: 6.35029 },
    def: ['kg', 'lb'],
  },
  Volume: {
    base: 'L',
    units: {
      ml: 0.001, L: 1, 'm³': 1000,
      tsp: 0.00492892, tbsp: 0.0147868, 'cup (US)': 0.236588,
      'fl oz': 0.0295735, 'pt (US)': 0.473176, 'gal (US)': 3.78541,
    },
    def: ['L', 'cup (US)'],
  },
  Speed: {
    base: 'm/s',
    units: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444, 'ft/s': 0.3048 },
    def: ['km/h', 'mph'],
  },
  Temperature: { base: '°C', units: { '°C': 1, '°F': 1, K: 1 }, def: ['°C', '°F'], temp: true },
}

function toBaseTemp(v, unit) {
  if (unit === '°C') return v
  if (unit === '°F') return (v - 32) * (5 / 9)
  return v - 273.15 // K
}
function fromBaseTemp(c, unit) {
  if (unit === '°C') return c
  if (unit === '°F') return c * (9 / 5) + 32
  return c + 273.15
}

export default function UnitConverter() {
  const [cat, setCat] = useState('Length')
  const conf = CATEGORIES[cat]
  const [from, setFrom] = useState(conf.def[0])
  const [to, setTo] = useState(conf.def[1])
  const [amount, setAmount] = useState('1')

  const switchCat = (c) => {
    setCat(c)
    setFrom(CATEGORIES[c].def[0])
    setTo(CATEGORIES[c].def[1])
  }

  const unitList = Object.keys(conf.units)

  const result = useMemo(() => {
    const v = parseFloat(amount)
    if (!isFinite(v)) return null
    if (conf.temp) return fromBaseTemp(toBaseTemp(v, from), to)
    return (v * conf.units[from]) / conf.units[to]
  }, [amount, from, to, conf])

  const fmt = (n) => {
    if (n == null || !isFinite(n)) return '—'
    const abs = Math.abs(n)
    if (abs !== 0 && (abs < 1e-4 || abs >= 1e9)) return n.toExponential(4)
    return parseFloat(n.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  return (
    <div className="tool">
      <Segmented
        size="sm"
        options={Object.keys(CATEGORIES)}
        value={cat}
        onChange={switchCat}
      />

      <Field label="Value">
        <input
          className="inp inp--mono"
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Field>

      <div className="cur__pair">
        <Field label="From">
          <select className="inp" value={from} onChange={(e) => setFrom(e.target.value)}>
            {unitList.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <button className="btn btn--icon cur__swap" onClick={() => { setFrom(to); setTo(from) }} title="Swap" aria-label="Swap units">
          <ArrowLeftRight size={17} />
        </button>
        <Field label="To">
          <select className="inp" value={to} onChange={(e) => setTo(e.target.value)}>
            {unitList.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
      </div>

      <div className="cur__result">
        <div className="cur__result-amt stat">
          {fmt(result)} <span className="cur__code">{to}</span>
        </div>
        <div className="cur__rate">{amount || '0'} {from}</div>
      </div>
    </div>
  )
}
