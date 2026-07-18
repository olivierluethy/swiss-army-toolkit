import { X } from 'lucide-react'
import BladeButton from './BladeButton.jsx'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

/* The Victorinox-style cross-and-shield emblem */
function Shield({ size = 34 }) {
  return (
    <svg width={size} height={size * 1.18} viewBox="0 0 40 48" aria-hidden="true" className="shield">
      <path d="M20 1.5 L37 7.5 V25 C37 38 28.5 44 20 46.5 C11.5 44 3 38 3 25 V7.5 Z" fill="#ffffff" />
      <path d="M20 4 L34.5 9 V25 C34.5 36.2 27.2 41.6 20 44 C12.8 41.6 5.5 36.2 5.5 25 V9 Z" fill="var(--red)" />
      <path d="M17 11 h6 v6 h6 v6 h-6 v9 h-6 v-9 h-6 v-6 h6 z" fill="#ffffff" />
    </svg>
  )
}

const MAX_TILT = 15 // degrees at the ends of each fanned row

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function Knife({ tools, openIds, onToggle, onCloseAll }) {
  const openSet = new Set(openIds)
  const n = tools.length

  // How many blades fan out per row, so each row is a tidy symmetric fan.
  const wide = useMediaQuery('(min-width: 900px)')
  const medium = useMediaQuery('(min-width: 560px)')
  const perRow = wide ? 8 : medium ? 5 : 3
  const rows = chunk(tools, perRow)

  return (
    <div className="knife">
      {/* The blades fan out from the top edge of the handle */}
      <div className="knife__fan">
        {rows.map((row, ri) => {
          const center = (row.length - 1) / 2
          return (
            <div className="fan-row" key={ri}>
              {row.map((tool) => {
                const pos = row.indexOf(tool)
                const tilt = center === 0 ? 0 : ((pos - center) / center) * MAX_TILT
                return (
                  <BladeButton
                    key={tool.id}
                    tool={tool}
                    tilt={tilt}
                    isOpen={openSet.has(tool.id)}
                    onToggle={onToggle}
                  />
                )
              })}
            </div>
          )
        })}
      </div>

      {/* The red handle — the hero of the page */}
      <div className="handle">
        <span className="bolster bolster--left" aria-hidden="true" />
        <span className="bolster bolster--right" aria-hidden="true" />
        <span className="rivet rivet--1" aria-hidden="true" />
        <span className="rivet rivet--2" aria-hidden="true" />

        <div className="handle__inner">
          <span className="emblem"><Shield /></span>
          <span className="handle__title">
            <b>Swiss Army Toolkit</b>
            <span>Everyday tools, folded into one</span>
          </span>
          {openIds.length > 0 ? (
            <button className="handle__count" onClick={onCloseAll} title="Fold all tools in">
              {openIds.length} open <X size={13} />
            </button>
          ) : (
            <span className="handle__count handle__count--static">{n} tools</span>
          )}
        </div>
      </div>
    </div>
  )
}
