import { motion } from 'framer-motion'

/**
 * A tool rendered as a steel blade hinged on one long side of the handle.
 * Left blades swing out to the left, right blades to the right, using a spring.
 */
export default function BladeButton({ tool, tilt, side, isOpen, onToggle }) {
  const Icon = tool.icon
  const dir = side === 'left' ? -1 : 1 // outward direction
  return (
    <motion.button
      type="button"
      className={`blade blade--${side} ${isOpen ? 'is-open' : ''}`}
      style={{ '--blade-accent': tool.accent }}
      onClick={() => onToggle(tool.id)}
      aria-pressed={isOpen}
      title={isOpen ? `Fold in ${tool.name}` : `Fold out ${tool.name}`}
      initial={false}
      animate={{
        rotate: isOpen ? tilt * 0.3 : tilt,
        x: isOpen ? dir * 12 : 0,
        scale: isOpen ? 1.04 : 1,
      }}
      whileHover={{ x: dir * (isOpen ? 16 : 9), scale: isOpen ? 1.06 : 1.04, rotate: tilt * 0.55 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
    >
      <span className="blade__steel" aria-hidden="true">
        <span className="blade__edge" />
        <span className="blade__rivet" />
      </span>
      <span className="blade__icon">
        <Icon size={18} strokeWidth={2.1} />
      </span>
      <span className="blade__label">{tool.short}</span>
    </motion.button>
  )
}
