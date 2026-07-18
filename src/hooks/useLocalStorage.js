import { useCallback, useEffect, useState } from 'react'

/**
 * Persist a piece of state to localStorage. Falls back gracefully to plain
 * in-memory state when storage is unavailable (e.g. some file:// / privacy
 * modes) so tools never crash.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw)
    } catch {
      /* ignore */
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore quota / unavailable */
    }
  }, [key, value])

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
    setValue(typeof initialValue === 'function' ? initialValue() : initialValue)
  }, [key, initialValue])

  return [value, setValue, reset]
}
