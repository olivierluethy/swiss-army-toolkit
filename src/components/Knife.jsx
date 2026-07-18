import { X } from 'lucide-react'
import BladeButton from './BladeButton.jsx'

/* The Victorinox-style cross-and-shield emblem */
function Shield({ size = 32 }) {
  return (
    <svg width={size} height={size * 1.18} viewBox="0 0 40 48" aria-hidden="true" className="shield">
      <path d="M20 1.5 L37 7.5 V25 C37 38 28.5 44 20 46.5 C11.5 44 3 38 3 25 V7.5 Z" fill="#ffffff" />
      <path d="M20 4 L34.5 9 V25 C34.5 36.2 27.2 41.6 20 44 C12.8 41.6 5.5 36.2 5.5 25 V9 Z" fill="var(--red)" />
      <path d="M17 11 h6 v6 h6 v6 h-6 v9 h-6 v-9 h-6 v-6 h6 z" fill="#ffffff" />
    </svg>
  )
}

const MAX_TILT = 9 // degrees at the ends of each vertical fan

function tiltFor(i, n) {
  const center = (n - 1) / 2
  return center === 0 ? 0 : ((i - center) / center) * MAX_TILT
}

export default function Knife({ leftTools, rightTools, openSet, onToggle, onCloseAll, openCount, total }) {
  return (
    <div className="knife--v">
      <div className="rail rail--left">
        {leftTools.map((tool, i) => (
          <BladeButton
            key={tool.id}
            tool={tool}
            side="left"
            tilt={tiltFor(i, leftTools.length)}
            isOpen={openSet.has(tool.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      <div className="handle handle--v">
        <span className="bolster bolster--top" aria-hidden="true" />
        <span className="bolster bolster--bottom" aria-hidden="true" />
        <span className="rivet rivet--1" aria-hidden="true" />
        <span className="rivet rivet--2" aria-hidden="true" />

        <div className="handle__inner--v">
          <span className="emblem"><Shield /></span>
          <span className="handle__title--v">Swiss Army Toolkit</span>
          {openCount > 0 ? (
            <button className="handle__count" onClick={onCloseAll} title="Fold all tools in">
              {openCount}<X size={12} />
            </button>
          ) : (
            <span className="handle__count handle__count--static">{total}</span>
          )}
        </div>
      </div>

      <div className="rail rail--right">
        {rightTools.map((tool, i) => (
          <BladeButton
            key={tool.id}
            tool={tool}
            side="right"
            tilt={tiltFor(i, rightTools.length)}
            isOpen={openSet.has(tool.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
