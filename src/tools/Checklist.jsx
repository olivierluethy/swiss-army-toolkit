import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, X, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

let idc = 0
const uid = () => `${Date.now().toString(36)}-${idc++}`

export default function Checklist() {
  const [items, setItems] = useLocalStorage('sak:todo', [])
  const [draft, setDraft] = useState('')

  const add = () => {
    const t = draft.trim()
    if (!t) return
    setItems((l) => [{ id: uid(), text: t, done: false }, ...l])
    setDraft('')
  }
  const toggle = (id) => setItems((l) => l.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  const remove = (id) => setItems((l) => l.filter((i) => i.id !== id))
  const clearDone = () => setItems((l) => l.filter((i) => !i.done))

  const done = items.filter((i) => i.done).length

  return (
    <div className="tool">
      <div className="row">
        <input
          className="inp"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add a task and press Enter"
        />
        <button className="btn btn--primary" onClick={add} disabled={!draft.trim()}><Plus size={16} /></button>
      </div>

      {items.length > 0 && (
        <div className="spread">
          <span className="tool__note">{done}/{items.length} done</span>
          {done > 0 && <button className="btn btn--ghost" onClick={clearDone}><Trash2 size={14} /> Clear done</button>}
        </div>
      )}

      <div className="todo__list">
        <AnimatePresence initial={false}>
          {items.map((i) => (
            <motion.div
              key={i.id}
              className={`todo__item ${i.done ? 'is-done' : ''}`}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <button className="todo__check" onClick={() => toggle(i.id)} aria-label="Toggle done">
                {i.done && <Check size={14} strokeWidth={3} />}
              </button>
              <span className="todo__text">{i.text}</span>
              <button className="todo__del" onClick={() => remove(i.id)} aria-label="Delete"><X size={15} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && <p className="tool__note">Nothing yet — add your first task above.</p>}
      </div>
    </div>
  )
}
