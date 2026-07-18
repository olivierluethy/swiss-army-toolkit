import { useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Wrench } from 'lucide-react'
import { TOOLS, TOOL_MAP } from './data/tools.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import Knife from './components/Knife.jsx'
import ToolPanel from './components/ToolPanel.jsx'

export default function App() {
  // Ordered list of open tool ids — persisted so a reload keeps your bench.
  const [open, setOpen] = useLocalStorage('sak:open', [])

  const valid = open.filter((id) => TOOL_MAP[id])

  const toggle = useCallback(
    (id) => {
      setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
    },
    [setOpen],
  )

  const close = useCallback(
    (id) => setOpen((cur) => cur.filter((x) => x !== id)),
    [setOpen],
  )

  return (
    <div className="app">
      <div className="app__inner">
        <Knife tools={TOOLS} openIds={valid} onToggle={toggle} onCloseAll={() => setOpen([])} />

        {valid.length === 0 ? (
          <div className="empty">
            <div className="empty__ring">
              <Wrench size={30} />
            </div>
            <h2>Pick a blade to begin</h2>
            <p>
              Tap any tool above and watch it fold out. Open as many as you like —
              they all keep working side by side.
            </p>
          </div>
        ) : (
          <div className="workspace">
            <AnimatePresence mode="popLayout">
              {valid.map((id) => {
                const tool = TOOL_MAP[id]
                return <ToolPanel key={id} tool={tool} onClose={() => close(id)} />
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <footer className="app__footer">
        <strong>Swiss Army Toolkit</strong> — 15 everyday tools that fold out when
        you need them.
        <br />
        Runs fully offline. Your notes, lists &amp; settings stay on this device.
      </footer>
    </div>
  )
}
