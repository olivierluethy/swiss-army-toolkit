import { motion } from 'framer-motion'

/**
 * A single tool rendered as a steel blade that pivots from the handle edge.
 * At rest it sits at its fanned `tilt` angle; on hover it swings up out of the
 * fan, and when open it deploys fully with its accent colour.
 */
export default function BladeButton({ tool, tilt, isOpen, onToggle }) {
  const Icon = tool.icon
  return (
    <motion.button
      type="button"
      className={`blade ${isOpen ? 'is-open' : ''}`}
      style={{ '--blade-accent': tool.accent }}
      onClick={() => onToggle(tool.id)}
      aria-pressed={isOpen}
      title={isOpen ? `Fold in ${tool.name}` : `Fold out ${tool.name}`}
      initial={false}
      animate={{
        rotate: isOpen ? tilt * 0.35 : tilt,
        y: isOpen ? -16 : 0,
        scale: isOpen ? 1.05 : 1,
      }}
      whileHover={{ rotate: tilt * 0.5, y: isOpen ? -20 : -12, scale: isOpen ? 1.08 : 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
    >
      <span className="blade__steel" aria-hidden="true">
        <span className="blade__edge" />
        <span className="blade__rivet" />
      </span>
      <span className="blade__icon">
        <Icon size={19} strokeWidth={2.1} />
      </span>
      <span className="blade__label">{tool.short}</span>
    </motion.button>
  )
}
