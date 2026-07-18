import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import BladeButton from './BladeButton.jsx'

/* The Swiss cross emblem */
function SwissCross({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M13 5h6v8h8v6h-8v8h-6v-8H5v-6h8z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Knife({ tools, openIds, onToggle, onCloseAll }) {
  const openSet = new Set(openIds)

  return (
    <div className="knife">
      <div className="handle">
        <div className="handle__brand">
          <span className="emblem">
            <SwissCross />
          </span>
          <span className="handle__title">
            <b>Swiss Army Toolkit</b>
            <span>Everyday tools, folded into one</span>
          </span>
          {openIds.length > 0 ? (
            <button className="handle__count" onClick={onCloseAll} title="Fold all tools in">
              <span className="hstack" style={{ gap: 6 }}>
                {openIds.length} open <X size={13} />
              </span>
            </button>
          ) : (
            <span className="handle__count">{tools.length} tools</span>
          )}
        </div>

        <motion.div className="blades" layout>
          {tools.map((tool) => (
            <BladeButton
              key={tool.id}
              tool={tool}
              isOpen={openSet.has(tool.id)}
              onToggle={onToggle}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
