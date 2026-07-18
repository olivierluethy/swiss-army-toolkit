import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/* Labeled field wrapper */
export function Field({ label, hint, children, htmlFor }) {
  return (
    <label className="fld" htmlFor={htmlFor}>
      {label != null && <span className="fld__label">{label}</span>}
      {children}
      {hint != null && <span className="fld__hint">{hint}</span>}
    </label>
  )
}

/* Segmented control / tab switcher */
export function Segmented({ options, value, onChange, size }) {
  return (
    <div className={`seg ${size === 'sm' ? 'seg--sm' : ''}`} role="tablist">
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const active = val === value
        return (
          <button
            key={val}
            type="button"
            role="tab"
            aria-selected={active}
            className={`seg__btn ${active ? 'is-active' : ''}`}
            onClick={() => onChange(val)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

/* Copy-to-clipboard button with feedback */
export function CopyButton({ value, label = 'Copy', small }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    const text = String(value ?? '')
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1400)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      className={`copybtn ${small ? 'copybtn--sm' : ''} ${copied ? 'is-copied' : ''}`}
      onClick={copy}
      title="Copy to clipboard"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {!small && <span>{copied ? 'Copied' : label}</span>}
    </button>
  )
}

/* A big readout / result display */
export function Readout({ children, mono = true }) {
  return <div className={`readout ${mono ? 'readout--mono' : ''}`}>{children}</div>
}
