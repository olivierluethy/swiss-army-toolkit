import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Field } from '../components/ui.jsx'

export default function TipSplitter() {
  const [bill, setBill] = useState('')
  const [tip, setTip] = useState(15)
  const [people, setPeople] = useState(2)
  const [roundUp, setRoundUp] = useState(false)

  const b = parseFloat(bill) || 0
  const tipAmt = (b * tip) / 100
  let total = b + tipAmt
  let per = total / Math.max(1, people)
  if (roundUp) {
    per = Math.ceil(per)
    total = per * people
  }

  const money = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="tool">
      <Field label="Bill amount">
        <input className="inp inp--mono" type="number" inputMode="decimal" value={bill}
          onChange={(e) => setBill(e.target.value)} placeholder="0.00" />
      </Field>

      <Field label={`Tip: ${tip}%`}>
        <div className="tip__chips">
          {[10, 15, 18, 20, 25].map((p) => (
            <button key={p} className={`chip ${tip === p ? 'is-on' : ''}`} onClick={() => setTip(p)}>{p}%</button>
          ))}
        </div>
        <input type="range" min="0" max="30" value={tip} onChange={(e) => setTip(+e.target.value)} className="pw__range" />
      </Field>

      <Field label="Split between">
        <div className="stepper">
          <button className="btn btn--icon" onClick={() => setPeople((p) => Math.max(1, p - 1))} aria-label="Fewer people"><Minus size={16} /></button>
          <span className="stepper__val stat">{people}</span>
          <button className="btn btn--icon" onClick={() => setPeople((p) => p + 1)} aria-label="More people"><Plus size={16} /></button>
          <label className="tip__round">
            <input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} />
            Round up per person
          </label>
        </div>
      </Field>

      <div className="tip__result">
        <div className="tip__per">
          <span className="muted">Each person pays</span>
          <b className="stat">${money(per)}</b>
        </div>
        <div className="tip__breakdown">
          <span>Tip <b className="stat">${money(tipAmt)}</b></span>
          <span>Total <b className="stat">${money(total)}</b></span>
        </div>
      </div>
    </div>
  )
}
