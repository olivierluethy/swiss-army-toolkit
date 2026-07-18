import { Trash2, Save } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { CopyButton } from '../components/ui.jsx'

export default function Notes() {
  const [text, setText, reset] = useLocalStorage('sak:notes', '')

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length

  return (
    <div className="tool">
      <textarea
        className="inp notes__area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Jot anything down… it saves automatically on this device."
        spellCheck
      />
      <div className="spread">
        <span className="tool__note"><Save size={13} style={{ verticalAlign: '-2px' }} /> Auto-saved · {words} words · {chars} chars</span>
        <div className="hstack">
          <CopyButton value={text} small />
          <button className="btn btn--ghost" onClick={reset} disabled={!text} title="Clear note">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
