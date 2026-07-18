import { motion } from 'framer-motion'
import { X } from 'lucide-react'

// The panel swings open from the handle side: left panels hinge on their right
// edge and swing out left, right panels mirror it — a springy door-opening feel.
const spring = { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 }

export default function ToolPanel({ tool, side, onClose }) {
  const Icon = tool.icon
  const Body = tool.Component
  const dir = side === 'left' ? 1 : -1

  const variants = {
    initial: { opacity: 0, x: dir * 34, rotateY: -dir * 40, scale: 0.94 },
    open: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: { ...spring, opacity: { duration: 0.18 } },
    },
    exit: {
      opacity: 0,
      x: dir * 26,
      rotateY: -dir * 30,
      scale: 0.95,
      transition: { type: 'spring', stiffness: 320, damping: 30, opacity: { duration: 0.15 } },
    },
  }

  return (
    <motion.section
      layout
      className={`panel panel--${side}`}
      style={{
        '--panel-accent': tool.accent,
        transformPerspective: 1200,
        transformOrigin: side === 'left' ? 'right center' : 'left center',
      }}
      variants={variants}
      initial="initial"
      animate="open"
      exit="exit"
    >
      <header className="panel__head">
        <span className="panel__badge">
          <Icon size={18} strokeWidth={2.2} />
        </span>
        <span className="panel__title">{tool.name}</span>
        <button className="panel__close" onClick={onClose} title={`Fold in ${tool.name}`} aria-label={`Close ${tool.name}`}>
          <X size={18} />
        </button>
      </header>
      <div className="panel__body">
        <Body />
      </div>
    </motion.section>
  )
}
