import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { CopyButton } from '../components/ui.jsx'

const SETS = {
  lower: 'abcdefghijkmnopqrstuvwxyz',
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  digits: '23456789',
  symbols: '!@#$%^&*-_=+?',
}
const AMBIG = 'il1Lo0O'
const FULL = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*-_=+?',
}

// Cryptographically strong random index.
function randInt(max) {
  const buf = new Uint32Array(1)
  const limit = Math.floor(0xffffffff / max) * max
  let x
  do {
    crypto.getRandomValues(buf)
    x = buf[0]
  } while (x >= limit)
  return x % max
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true })
  const [noAmbig, setNoAmbig] = useState(true)
  const [pw, setPw] = useState('')

  const generate = useCallback(() => {
    const active = Object.keys(opts).filter((k) => opts[k])
    if (active.length === 0) { setPw(''); return }
    const src = noAmbig ? SETS : FULL
    // Guarantee at least one char from each selected set, then fill the rest.
    const pool = active.map((k) => src[k]).join('')
    const chars = active.map((k) => src[k][randInt(src[k].length)])
    for (let i = chars.length; i < length; i++) chars.push(pool[randInt(pool.length)])
    // Fisher–Yates shuffle so the guaranteed chars aren't at the front.
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randInt(i + 1)
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    setPw(chars.slice(0, length).join(''))
  }, [length, opts, noAmbig])

  useEffect(() => { generate() }, [generate])

  // Simple entropy-based strength estimate.
  const poolSize = Object.keys(opts).filter((k) => opts[k]).reduce((n, k) => n + (noAmbig ? SETS : FULL)[k].length, 0)
  const bits = pw ? Math.round(length * Math.log2(poolSize || 1)) : 0
  const strength = bits >= 100 ? { label: 'Excellent', lvl: 4 } : bits >= 70 ? { label: 'Strong', lvl: 3 } : bits >= 45 ? { label: 'Fair', lvl: 2 } : { label: 'Weak', lvl: 1 }

  const toggle = (k) => setOpts((o) => {
    const next = { ...o, [k]: !o[k] }
    if (!Object.values(next).some(Boolean)) return o // keep at least one
    return next
  })

  return (
    <div className="tool">
      <div className="pw__out">
        <span className="pw__value stat">{pw || '—'}</span>
        <div className="hstack">
          <button className="btn btn--icon" onClick={generate} title="Regenerate"><RefreshCw size={16} /></button>
          <CopyButton value={pw} small />
        </div>
      </div>

      <div className={`pw__meter lvl-${strength.lvl}`}>
        <span /><span /><span /><span />
      </div>
      <div className="spread">
        <span className="tool__note">{strength.label}</span>
        <span className="tool__note">~{bits} bits entropy</span>
      </div>

      <label className="fld">
        <span className="fld__label">Length: {length}</span>
        <input type="range" min="6" max="40" value={length} onChange={(e) => setLength(+e.target.value)} className="pw__range" />
      </label>

      <div className="pw__opts">
        {[['lower', 'a-z'], ['upper', 'A-Z'], ['digits', '0-9'], ['symbols', '!@#']].map(([k, lbl]) => (
          <button key={k} className={`chip ${opts[k] ? 'is-on' : ''}`} onClick={() => toggle(k)}>{lbl}</button>
        ))}
        <button className={`chip ${noAmbig ? 'is-on' : ''}`} onClick={() => setNoAmbig((v) => !v)}>No look-alikes</button>
      </div>
    </div>
  )
}
