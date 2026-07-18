import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { CopyButton } from '../components/ui.jsx'

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}
function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
}
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#d4102b')
  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 }
  const hsl = rgbToHsl(rgb)
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  const setChannel = (ch, v) => {
    const next = { ...rgb, [ch]: Math.max(0, Math.min(255, +v || 0)) }
    setHex(rgbToHex(next))
  }
  const randomize = () => {
    const buf = new Uint8Array(3)
    crypto.getRandomValues(buf)
    setHex(rgbToHex({ r: buf[0], g: buf[1], b: buf[2] }))
  }
  const textColor = hsl.l > 60 ? '#101317' : '#ffffff'

  return (
    <div className="tool">
      <div className="color__preview" style={{ background: hex, color: textColor }}>
        <span className="stat">{hex.toUpperCase()}</span>
        <input className="color__native" type="color" value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : '#000000'} onChange={(e) => setHex(e.target.value)} aria-label="Pick color" />
      </div>

      <div className="color__row">
        <label className="fld" style={{ flex: 1 }}>
          <span className="fld__label">HEX</span>
          <input className="inp inp--mono" value={hex} onChange={(e) => setHex(e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value)} />
        </label>
        <CopyButton value={hex.toUpperCase()} small />
      </div>

      <div className="color__channels">
        {['r', 'g', 'b'].map((ch) => (
          <label className="fld" key={ch}>
            <span className="fld__label">{ch.toUpperCase()}</span>
            <input className="inp inp--mono" type="number" min="0" max="255" value={rgb[ch]} onChange={(e) => setChannel(ch, e.target.value)} />
          </label>
        ))}
      </div>

      <div className="color__strings">
        <div className="color__str"><span className="stat">{rgbStr}</span><CopyButton value={rgbStr} small /></div>
        <div className="color__str"><span className="stat">{hslStr}</span><CopyButton value={hslStr} small /></div>
      </div>

      <button className="btn btn--block" onClick={randomize}><Shuffle size={16} /> Random color</button>
    </div>
  )
}
