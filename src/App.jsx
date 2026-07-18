import { useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Wrench } from 'lucide-react'
import { LEFT_TOOLS, RIGHT_TOOLS, SIDE, TOOL_MAP } from './data/tools.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import Knife from './components/Knife.jsx'
import ToolPanel from './components/ToolPanel.jsx'

export default function App() {
  // Ordered list of open tool ids — persisted so a reload keeps your bench.
  const [open, setOpen] = useLocalStorage('sak:open', [])

  const valid = open.filter((id) => TOOL_MAP[id])
  const openSet = new Set(valid)
  const leftOpen = valid.filter((id) => SIDE[id] === 'left')
  const rightOpen = valid.filter((id) => SIDE[id] === 'right')

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

  const renderPanels = (ids, side) => (
    <AnimatePresence mode="popLayout">
      {ids.map((id) => (
        <ToolPanel key={id} tool={TOOL_MAP[id]} side={side} onClose={() => close(id)} />
      ))}
    </AnimatePresence>
  )

  return (
    <div className="app">
      <div className="app__inner">
        <div className="stage">
          <div className="side side--left">{renderPanels(leftOpen, 'left')}</div>

          <Knife
            leftTools={LEFT_TOOLS}
            rightTools={RIGHT_TOOLS}
            openSet={openSet}
            onToggle={toggle}
            onCloseAll={() => setOpen([])}
            openCount={valid.length}
            total={LEFT_TOOLS.length + RIGHT_TOOLS.length}
          />

          <div className="side side--right">{renderPanels(rightOpen, 'right')}</div>
        </div>

        {valid.length === 0 && (
          <div className="empty">
            <div className="empty__ring">
              <Wrench size={30} />
            </div>
            <h2>Pick a blade to begin</h2>
            <p>
              Tap any blade to fold out its tool. Left-hand blades open to the left,
              right-hand blades to the right — open as many as you like.
            </p>
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
