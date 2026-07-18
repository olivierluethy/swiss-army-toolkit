import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import { Field, Segmented } from '../components/ui.jsx'

export default function QrCodeTool() {
  const [text, setText] = useState('https://')
  const [level, setLevel] = useState('M')
  const [url, setUrl] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    const value = text.trim()
    if (!value) { setUrl(''); setErr(''); return }
    QRCode.toDataURL(value, {
      errorCorrectionLevel: level,
      margin: 2,
      width: 512,
      color: { dark: '#101317ff', light: '#ffffffff' },
    })
      .then((u) => { if (alive) { setUrl(u); setErr('') } })
      .catch(() => { if (alive) { setErr('Text is too long for a QR code.'); setUrl('') } })
    return () => { alive = false }
  }, [text, level])

  return (
    <div className="tool">
      <Field label="Text or URL">
        <textarea
          className="inp"
          style={{ minHeight: 70 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a link, Wi-Fi, message…"
        />
      </Field>

      <Field label="Error correction">
        <Segmented size="sm"
          options={[{ value: 'L', label: 'L' }, { value: 'M', label: 'M' }, { value: 'Q', label: 'Q' }, { value: 'H', label: 'H' }]}
          value={level} onChange={setLevel} />
      </Field>

      <div className="qr__stage">
        {url ? (
          <img className="qr__img" src={url} alt="QR code" />
        ) : (
          <div className="qr__empty">{err || 'Your QR code appears here'}</div>
        )}
      </div>

      <a
        className={`btn btn--primary btn--block ${!url ? 'is-disabled' : ''}`}
        href={url || undefined}
        download="qr-code.png"
        aria-disabled={!url}
        onClick={(e) => { if (!url) e.preventDefault() }}
      >
        <Download size={16} /> Download PNG
      </a>
    </div>
  )
}
