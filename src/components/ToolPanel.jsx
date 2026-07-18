import { motion } from 'framer-motion'
import { X } from 'lucide-react'

// The blade "swings" out of the handle: it pivots at its top-left hinge,
// unfolds in 3D (rotateX) and settles with a springy overshoot.
const foldSpring = { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 }

const variants = {
  initial: { opacity: 0, rotate: -12, rotateX: -55, scale: 0.9, y: -8 },
  open: {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    scale: 1,
    y: 0,
    transition: { ...foldSpring, opacity: { duration: 0.18 } },
  },
  exit: {
    opacity: 0,
    rotate: -8,
    rotateX: -45,
    scale: 0.92,
    y: -6,
    transition: { type: 'spring', stiffness: 320, damping: 30, opacity: { duration: 0.16 } },
  },
}

export default function ToolPanel({ tool, onClose }) {
  const Icon = tool.icon
  const Body = tool.Component

  return (
    <motion.section
      layout
      className="panel"
      style={{ '--panel-accent': tool.accent, transformPerspective: 1100 }}
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
