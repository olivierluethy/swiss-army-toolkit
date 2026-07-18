import { motion } from 'framer-motion'

/**
 * A single folded blade in the handle. Hovering lets it "peek" out of the
 * handle; clicking swings it (a quick pivot) and toggles the tool open.
 */
export default function BladeButton({ tool, isOpen, onToggle }) {
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
      whileHover={{ y: -4, rotate: -3 }}
      whileTap={{ scale: 0.95, rotate: 4 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      layout
    >
      {isOpen && <span className="blade__nick" />}
      <span className="blade__icon">
        <Icon size={20} strokeWidth={2.1} />
      </span>
      <span className="blade__label">{tool.short}</span>
    </motion.button>
  )
}
