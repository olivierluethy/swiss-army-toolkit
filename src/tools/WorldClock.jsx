import { useEffect, useMemo, useState } from 'react'
import { Plus, X, Radio } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { Field } from '../components/ui.jsx'
import { formatDate, formatWeekday } from '../utils/formatDate.js'

const ZONES = [
  { tz: 'Pacific/Honolulu', city: 'Honolulu' },
  { tz: 'America/Los_Angeles', city: 'Los Angeles' },
  { tz: 'America/Denver', city: 'Denver' },
  { tz: 'America/Chicago', city: 'Chicago' },
  { tz: 'America/New_York', city: 'New York' },
  { tz: 'America/Sao_Paulo', city: 'São Paulo' },
  { tz: 'Europe/London', city: 'London' },
  { tz: 'Europe/Zurich', city: 'Zürich' },
  { tz: 'Europe/Paris', city: 'Paris' },
  { tz: 'Europe/Berlin', city: 'Berlin' },
  { tz: 'Europe/Moscow', city: 'Moscow' },
  { tz: 'Africa/Johannesburg', city: 'Johannesburg' },
  { tz: 'Asia/Dubai', city: 'Dubai' },
  { tz: 'Asia/Kolkata', city: 'Mumbai' },
  { tz: 'Asia/Singapore', city: 'Singapore' },
  { tz: 'Asia/Shanghai', city: 'Shanghai' },
  { tz: 'Asia/Tokyo', city: 'Tokyo' },
  { tz: 'Australia/Sydney', city: 'Sydney' },
  { tz: 'Pacific/Auckland', city: 'Auckland' },
]
const CITY = Object.fromEntries(ZONES.map((z) => [z.tz, z.city]))
const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone

function parts(date, tz) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
    weekday: 'short', day: 'numeric', month: 'short',
  })
  const map = {}
  for (const p of f.formatToParts(date)) map[p.type] = p.value
  return map
}

// Offset (in hours) of a timezone relative to the viewer's local zone.
function offsetHours(date, tz) {
  const asUTC = (t) => {
    const s = new Intl.DateTimeFormat('en-US', {
      timeZone: t, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).formatToParts(date)
    const m = {}
    for (const p of s) m[p.type] = p.value
    return Date.UTC(m.year, m.month - 1, m.day, m.hour === '24' ? 0 : m.hour, m.minute, m.second)
  }
  return Math.round((asUTC(tz) - asUTC(localTz)) / 3600000 * 10) / 10
}

export default function WorldClock() {
  const [selected, setSelected] = useLocalStorage('sak:zones', [
    'Europe/Zurich', 'America/New_York', 'Asia/Tokyo',
  ])
  const [now, setNow] = useState(() => new Date())
  const [override, setOverride] = useState('') // HH:MM in local zone, or '' for live
  const [add, setAdd] = useState('')

  useEffect(() => {
    if (override) return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [override])

  const baseDate = useMemo(() => {
    if (!override) return now
    const [h, m] = override.split(':').map(Number)
    const d = new Date()
    d.setHours(h || 0, m || 0, 0, 0)
    return d
  }, [override, now])

  const remove = (tz) => setSelected((s) => s.filter((z) => z !== tz))
  const addZone = (tz) => {
    if (tz && !selected.includes(tz)) setSelected((s) => [...s, tz])
    setAdd('')
  }
  const available = ZONES.filter((z) => !selected.includes(z.tz))

  return (
    <div className="tool">
      <div className="wc__ctrl">
        <Field label="Reference time (your local zone)">
          <div className="row">
            <input className="inp inp--mono" type="time" value={override || parts(now, localTz).hour + ':' + parts(now, localTz).minute}
              onChange={(e) => setOverride(e.target.value)} />
            <button className={`btn ${override ? '' : 'btn--primary'}`} onClick={() => setOverride('')} title="Follow live time">
              <Radio size={15} /> {override ? 'Go live' : 'Live'}
            </button>
          </div>
        </Field>
      </div>

      <div className="wc__list">
        {selected.map((tz) => {
          const p = parts(baseDate, tz)
          const off = offsetHours(baseDate, tz)
          const offLabel = tz === localTz ? 'local' : `${off >= 0 ? '+' : ''}${off}h`
          return (
            <div className="wc__row" key={tz}>
              <div className="wc__city">
                <b>{CITY[tz] || tz}</b>
                <span className="muted">
                  {formatWeekday(baseDate, { timeZone: tz })}, {formatDate(baseDate, { timeZone: tz })} · {offLabel}
                </span>
              </div>
              <div className="wc__time stat">{p.hour}:{p.minute}</div>
              <button className="wc__x" onClick={() => remove(tz)} aria-label={`Remove ${CITY[tz]}`}><X size={15} /></button>
            </div>
          )
        })}
        {selected.length === 0 && <p className="tool__note">Add a city to start tracking its time.</p>}
      </div>

      {available.length > 0 && (
        <div className="row">
          <select className="inp" value={add} onChange={(e) => setAdd(e.target.value)}>
            <option value="">Add a city…</option>
            {available.map((z) => <option key={z.tz} value={z.tz}>{z.city}</option>)}
          </select>
          <button className="btn btn--primary" onClick={() => addZone(add)} disabled={!add}><Plus size={16} /> Add</button>
        </div>
      )}
    </div>
  )
}
