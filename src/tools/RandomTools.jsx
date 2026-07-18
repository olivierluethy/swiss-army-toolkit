import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dices, RefreshCw } from 'lucide-react'
import { Segmented, Field } from '../components/ui.jsx'

function rand(max) {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }

function Die({ value }) {
  return (
    <div className="die">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className={`die__pip ${PIPS[value]?.includes(i) ? 'on' : ''}`} />
      ))}
    </div>
  )
}

function DiceRoller() {
  const [n, setN] = useState(2)
  const [sides, setSides] = useState(6)
  const [rolls, setRolls] = useState([3, 4])
  const [spin, setSpin] = useState(0)

  const roll = () => {
    setRolls(Array.from({ length: n }, () => rand(sides) + 1))
    setSpin((s) => s + 1)
  }
  const total = rolls.reduce((a, b) => a + b, 0)

  return (
    <>
      <div className="row">
        <Field label="Dice"><input className="inp inp--mono" type="number" min="1" max="8" value={n} onChange={(e) => setN(Math.min(8, Math.max(1, +e.target.value || 1)))} /></Field>
        <Field label="Sides"><select className="inp" value={sides} onChange={(e) => setSides(+e.target.value)}>{[4, 6, 8, 10, 12, 20].map((s) => <option key={s} value={s}>d{s}</option>)}</select></Field>
      </div>
      <motion.div key={spin} className="dice__tray" initial={{ rotate: -8, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
        {rolls.map((r, i) => (sides === 6 ? <Die key={i} value={r} /> : <span key={i} className="die die--num stat">{r}</span>))}
      </motion.div>
      <div className="spread">
        <span className="tool__note">Total: <b className="stat">{total}</b></span>
        <button className="btn btn--primary" onClick={roll}><Dices size={16} /> Roll</button>
      </div>
    </>
  )
}

function Coin() {
  const [face, setFace] = useState('Heads')
  const [flip, setFlip] = useState(0)
  return (
    <div className="coin__wrap">
      <AnimatePresence mode="popLayout">
        <motion.div key={flip} className={`coin ${face === 'Heads' ? 'coin--h' : 'coin--t'}`}
          initial={{ rotateY: 0, y: -10, opacity: 0 }} animate={{ rotateY: 720, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
          {face === 'Heads' ? 'H' : 'T'}
        </motion.div>
      </AnimatePresence>
      <b className="coin__label">{face}</b>
      <button className="btn btn--primary" onClick={() => { setFace(rand(2) ? 'Heads' : 'Tails'); setFlip((f) => f + 1) }}>
        <RefreshCw size={16} /> Flip coin
      </button>
    </div>
  )
}

function RandomNumber() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [val, setVal] = useState(null)
  const pick = () => {
    const lo = Math.min(+min, +max)
    const hi = Math.max(+min, +max)
    setVal(lo + rand(hi - lo + 1))
  }
  return (
    <>
      <div className="grid-2">
        <Field label="Min"><input className="inp inp--mono" type="number" value={min} onChange={(e) => setMin(e.target.value)} /></Field>
        <Field label="Max"><input className="inp inp--mono" type="number" value={max} onChange={(e) => setMax(e.target.value)} /></Field>
      </div>
      <div className="cur__result"><div className="cur__result-amt stat" style={{ fontSize: 40 }}>{val ?? '—'}</div></div>
      <button className="btn btn--primary btn--block" onClick={pick}><RefreshCw size={16} /> Generate</button>
    </>
  )
}

export default function RandomTools() {
  const [mode, setMode] = useState('Dice')
  return (
    <div className="tool">
      <Segmented options={['Dice', 'Coin', 'Number']} value={mode} onChange={setMode} />
      {mode === 'Dice' && <DiceRoller />}
      {mode === 'Coin' && <Coin />}
      {mode === 'Number' && <RandomNumber />}
    </div>
  )
}
