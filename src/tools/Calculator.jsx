import { useCallback, useEffect, useReducer } from 'react'
import { Divide, X, Minus, Plus, Equal, Delete, Percent } from 'lucide-react'

const initial = {
  display: '0',
  prev: null, // stored operand
  op: null, // pending operator
  fresh: true, // next digit starts a new number
  memory: 0,
}

function compute(a, b, op) {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return b === 0 ? NaN : a / b
    default: return b
  }
}

// Trim floating point noise and keep the display readable.
function fmt(n) {
  if (!isFinite(n)) return 'Error'
  if (Number.isInteger(n)) return String(n)
  const rounded = Math.round((n + Number.EPSILON) * 1e10) / 1e10
  let s = String(rounded)
  if (s.length > 14) s = rounded.toPrecision(10).replace(/\.?0+$/, '')
  return s
}

function reducer(state, action) {
  const { type, value } = action
  const cur = parseFloat(state.display)

  switch (type) {
    case 'digit': {
      if (state.display === 'Error') return { ...initial, display: value }
      if (state.fresh) return { ...state, display: value === '.' ? '0.' : value, fresh: false }
      if (value === '.' && state.display.includes('.')) return state
      if (state.display === '0' && value !== '.') return { ...state, display: value }
      if (state.display.replace(/[-.]/g, '').length >= 12) return state
      return { ...state, display: state.display + value }
    }
    case 'op': {
      if (state.display === 'Error') return state
      if (state.op && !state.fresh) {
        const result = compute(state.prev, cur, state.op)
        return { ...state, display: fmt(result), prev: result, op: value, fresh: true }
      }
      return { ...state, prev: cur, op: value, fresh: true }
    }
    case 'equals': {
      if (state.op == null || state.prev == null) return state
      const result = compute(state.prev, cur, state.op)
      return { ...state, display: fmt(result), prev: null, op: null, fresh: true }
    }
    case 'negate':
      if (state.display === '0' || state.display === 'Error') return state
      return {
        ...state,
        display: state.display.startsWith('-') ? state.display.slice(1) : '-' + state.display,
      }
    case 'percent': {
      if (state.display === 'Error') return state
      // If mid-operation, treat as percentage of the stored operand (e.g. 200 + 10% = 220)
      const base = state.op && state.prev != null ? state.prev : 1
      const pct = state.op && state.prev != null ? (base * cur) / 100 : cur / 100
      return { ...state, display: fmt(pct), fresh: true }
    }
    case 'backspace': {
      if (state.fresh || state.display === 'Error') return state
      const next = state.display.length <= 1 || (state.display.length === 2 && state.display.startsWith('-'))
        ? '0'
        : state.display.slice(0, -1)
      return { ...state, display: next, fresh: next === '0' }
    }
    case 'clear':
      return { ...initial, memory: state.memory }
    case 'mem': {
      if (value === 'mc') return { ...state, memory: 0 }
      if (value === 'mr') return { ...state, display: fmt(state.memory), fresh: true }
      if (value === 'm+') return { ...state, memory: state.memory + (isFinite(cur) ? cur : 0), fresh: true }
      if (value === 'm-') return { ...state, memory: state.memory - (isFinite(cur) ? cur : 0), fresh: true }
      return state
    }
    default:
      return state
  }
}

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initial)

  const onKey = useCallback((e) => {
    const k = e.key
    if (k >= '0' && k <= '9') dispatch({ type: 'digit', value: k })
    else if (k === '.') dispatch({ type: 'digit', value: '.' })
    else if (k === '+' || k === '-' || k === '*' || k === '/') dispatch({ type: 'op', value: k })
    else if (k === 'Enter' || k === '=') { e.preventDefault(); dispatch({ type: 'equals' }) }
    else if (k === 'Backspace') dispatch({ type: 'backspace' })
    else if (k === 'Escape') dispatch({ type: 'clear' })
    else if (k === '%') dispatch({ type: 'percent' })
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  const Btn = ({ children, onClick, variant = '', span, label }) => (
    <button
      className={`calc__key ${variant}`}
      style={span ? { gridColumn: `span ${span}` } : undefined}
      onClick={onClick}
      aria-label={label}
      type="button"
    >
      {children}
    </button>
  )

  return (
    <div className="tool">
      <div className="calc__display">
        <div className="calc__mem">{state.memory !== 0 ? 'M' : ''}</div>
        <div className="calc__value stat">{state.display}</div>
      </div>

      <div className="calc__memrow">
        <button className="calc__memkey" onClick={() => dispatch({ type: 'mem', value: 'mc' })}>MC</button>
        <button className="calc__memkey" onClick={() => dispatch({ type: 'mem', value: 'mr' })}>MR</button>
        <button className="calc__memkey" onClick={() => dispatch({ type: 'mem', value: 'm+' })}>M+</button>
        <button className="calc__memkey" onClick={() => dispatch({ type: 'mem', value: 'm-' })}>M−</button>
      </div>

      <div className="calc__pad">
        <Btn variant="calc__key--fn" onClick={() => dispatch({ type: 'clear' })} label="Clear">AC</Btn>
        <Btn variant="calc__key--fn" onClick={() => dispatch({ type: 'negate' })} label="Plus minus">±</Btn>
        <Btn variant="calc__key--fn" onClick={() => dispatch({ type: 'percent' })} label="Percent"><Percent size={18} /></Btn>
        <Btn variant="calc__key--op" onClick={() => dispatch({ type: 'op', value: '/' })} label="Divide"><Divide size={18} /></Btn>

        <Btn onClick={() => dispatch({ type: 'digit', value: '7' })}>7</Btn>
        <Btn onClick={() => dispatch({ type: 'digit', value: '8' })}>8</Btn>
        <Btn onClick={() => dispatch({ type: 'digit', value: '9' })}>9</Btn>
        <Btn variant="calc__key--op" onClick={() => dispatch({ type: 'op', value: '*' })} label="Multiply"><X size={18} /></Btn>

        <Btn onClick={() => dispatch({ type: 'digit', value: '4' })}>4</Btn>
        <Btn onClick={() => dispatch({ type: 'digit', value: '5' })}>5</Btn>
        <Btn onClick={() => dispatch({ type: 'digit', value: '6' })}>6</Btn>
        <Btn variant="calc__key--op" onClick={() => dispatch({ type: 'op', value: '-' })} label="Subtract"><Minus size={18} /></Btn>

        <Btn onClick={() => dispatch({ type: 'digit', value: '1' })}>1</Btn>
        <Btn onClick={() => dispatch({ type: 'digit', value: '2' })}>2</Btn>
        <Btn onClick={() => dispatch({ type: 'digit', value: '3' })}>3</Btn>
        <Btn variant="calc__key--op" onClick={() => dispatch({ type: 'op', value: '+' })} label="Add"><Plus size={18} /></Btn>

        <Btn variant="calc__key--fn" onClick={() => dispatch({ type: 'backspace' })} label="Backspace"><Delete size={18} /></Btn>
        <Btn onClick={() => dispatch({ type: 'digit', value: '0' })}>0</Btn>
        <Btn onClick={() => dispatch({ type: 'digit', value: '.' })}>.</Btn>
        <Btn variant="calc__key--eq" onClick={() => dispatch({ type: 'equals' })} label="Equals"><Equal size={18} /></Btn>
      </div>
      <p className="tool__note">Tip: your physical keyboard works too — digits, + − × ÷, %, Enter and Backspace.</p>
    </div>
  )
}
