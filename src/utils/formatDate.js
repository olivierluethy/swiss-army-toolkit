// One shared date formatter used everywhere, so every user-facing date reads
// like "15th of January 2026" — never ISO (2026-01-15) or slashes (07/18/2026).

function ordinal(day) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = day % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

function toDate(value) {
  return value instanceof Date ? value : new Date(value)
}

/** "15th of January 2026" (timeZone optional, for zone-aware displays). */
export function formatDate(value, opts = {}) {
  const d = toDate(value)
  if (isNaN(d)) return ''
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: opts.timeZone,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(d)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const day = parseInt(get('day'), 10)
  return `${day}${ordinal(day)} of ${get('month')} ${get('year')}`
}

/** "15th of January 2026, 14:32" (24-hour). */
export function formatDateTime(value, opts = {}) {
  const d = toDate(value)
  if (isNaN(d)) return ''
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: opts.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
  return `${formatDate(d, opts)}, ${time}`
}

/** Short weekday, e.g. "Thu" (timeZone optional). */
export function formatWeekday(value, opts = {}) {
  const d = toDate(value)
  if (isNaN(d)) return ''
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: opts.timeZone,
    weekday: 'short',
  }).format(d)
}
