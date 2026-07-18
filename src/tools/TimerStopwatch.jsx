import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Flag, Bell } from 'lucide-react'
import { Segmented } from '../components/ui.jsx'

// A short, pleasant beep using the Web Audio API — no audio file, works offline.
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    const now = ctx.currentTime
    ;[0, 0.2, 0.4].forEach((t) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.0001, now + t)
      gain.gain.exponentialRampToValueAtTime(0.35, now + t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.16)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + t)
      osc.stop(now + t + 0.18)
    })
    setTimeout(() => ctx.close(), 900)
  } catch {
    /* ignore */
  }
}

function two(n) { return String(n).padStart(2, '0') }
function fmtSW(ms) {
  const cs = Math.floor((ms % 1000) / 10)
  const s = Math.floor(ms / 1000) % 60
  const m = Math.floor(ms / 60000) % 60
  const h = Math.floor(ms / 3600000)
  return `${h > 0 ? two(h) + ':' : ''}${two(m)}:${two(s)}.${two(cs)}`
}
function fmtTimer(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const s = total % 60
  const m = Math.floor(total / 60) % 60
  const h = Math.floor(total / 3600)
  return `${h > 0 ? two(h) + ':' : ''}${two(m)}:${two(s)}`
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const raf = useRef(0)
  const start = useRef(0)

  useEffect(() => {
    if (!running) return
    start.current = performance.now() - elapsed
    const tick = () => {
      setElapsed(performance.now() - start.current)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const reset = () => { setRunning(false); setElapsed(0); setLaps([]) }
  const lap = () => setLaps((l) => [{ n: l.length + 1, t: elapsed }, ...l])

  return (
    <>
      <div className="clockface stat">{fmtSW(elapsed)}</div>
      <div className="grid-3">
        <button className="btn" onClick={lap} disabled={!running}><Flag size={16} /> Lap</button>
        <button className={`btn ${running ? '' : 'btn--primary'}`} onClick={() => setRunning((r) => !r)}>
          {running ? <><Pause size={16} /> Stop</> : <><Play size={16} /> Start</>}
        </button>
        <button className="btn" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>
      {laps.length > 0 && (
        <div className="laps">
          {laps.map((l) => (
            <div className="laps__row" key={l.n}>
              <span className="muted">Lap {l.n}</span>
              <span className="stat">{fmtSW(l.t)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function Timer() {
  const [preset, setPreset] = useState({ m: 5, s: 0 })
  const [remaining, setRemaining] = useState(5 * 60000)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const raf = useRef(0)
  const target = useRef(0)

  useEffect(() => {
    if (!running) return
    target.current = performance.now() + remaining
    const tick = () => {
      const left = target.current - performance.now()
      if (left <= 0) {
        setRemaining(0)
        setRunning(false)
        setDone(true)
        beep()
        return
      }
      setRemaining(left)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const setFromPreset = (m, s) => {
    setPreset({ m, s })
    setRemaining((m * 60 + s) * 1000)
    setDone(false)
    setRunning(false)
  }
  const startTotal = (preset.m * 60 + preset.s) * 1000

  const reset = () => { setRunning(false); setDone(false); setRemaining(startTotal) }
  const pct = startTotal > 0 ? Math.max(0, Math.min(100, (remaining / startTotal) * 100)) : 0

  return (
    <>
      <div className={`clockface stat ${done ? 'is-done' : ''}`}>
        {done ? <span className="hstack" style={{ gap: 8 }}><Bell size={26} /> Time!</span> : fmtTimer(remaining)}
      </div>
      <div className="timer__bar"><span style={{ width: `${pct}%` }} /></div>

      {!running && (
        <div className="timer__set">
          <label className="fld">
            <span className="fld__label">Min</span>
            <input className="inp inp--mono" type="number" min="0" max="180" value={preset.m}
              onChange={(e) => setFromPreset(Math.max(0, +e.target.value || 0), preset.s)} />
          </label>
          <label className="fld">
            <span className="fld__label">Sec</span>
            <input className="inp inp--mono" type="number" min="0" max="59" value={preset.s}
              onChange={(e) => setFromPreset(preset.m, Math.min(59, Math.max(0, +e.target.value || 0)))} />
          </label>
        </div>
      )}

      <div className="timer__presets">
        {[[1, 0], [3, 0], [5, 0], [10, 0], [25, 0]].map(([m, s]) => (
          <button key={m} className="btn btn--ghost" onClick={() => setFromPreset(m, s)}>{m}m</button>
        ))}
      </div>

      <div className="grid-2">
        <button className="btn btn--primary" disabled={startTotal === 0}
          onClick={() => { if (done) { reset() } setRunning((r) => !r); setDone(false) }}>
          {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> {remaining < startTotal && remaining > 0 ? 'Resume' : 'Start'}</>}
        </button>
        <button className="btn" onClick={reset}><RotateCcw size={16} /> Reset</button>
      </div>
    </>
  )
}

export default function TimerStopwatch() {
  const [mode, setMode] = useState('Stopwatch')
  return (
    <div className="tool">
      <Segmented options={['Stopwatch', 'Timer']} value={mode} onChange={setMode} />
      {mode === 'Stopwatch' ? <Stopwatch /> : <Timer />}
    </div>
  )
}
