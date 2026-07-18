import { useState } from 'react'
import { CopyButton } from '../components/ui.jsx'

const titleCase = (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
const sentenceCase = (s) =>
  s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())

const TRANSFORMS = [
  { label: 'UPPER', fn: (s) => s.toUpperCase() },
  { label: 'lower', fn: (s) => s.toLowerCase() },
  { label: 'Title', fn: titleCase },
  { label: 'Sentence', fn: sentenceCase },
  { label: 'Trim spaces', fn: (s) => s.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim() },
  { label: 'Clear', fn: () => '' },
]

export default function TextTools() {
  const [text, setText] = useState('')

  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]*/g) || []).length : 0
  const lines = text ? text.split(/\n/).length : 0
  const readMin = Math.max(words ? 1 : 0, Math.round(words / 200))

  const stats = [
    ['Words', words], ['Characters', chars], ['No spaces', charsNoSpace],
    ['Sentences', sentences], ['Lines', lines], ['Read time', `${readMin}m`],
  ]

  return (
    <div className="tool">
      <textarea
        className="inp notes__area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text to analyse and transform…"
      />

      <div className="text__stats">
        {stats.map(([l, v]) => (
          <div className="text__stat" key={l}>
            <b className="stat">{v}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>

      <div className="text__actions">
        {TRANSFORMS.map((t) => (
          <button key={t.label} className="btn btn--ghost" onClick={() => setText((s) => t.fn(s))} disabled={!text && t.label !== 'Clear'}>
            {t.label}
          </button>
        ))}
        <CopyButton value={text} small />
      </div>
    </div>
  )
}
