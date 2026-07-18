import {
  Calculator,
  Coins,
  Ruler,
  TimerReset,
  Globe2,
  StickyNote,
  ListChecks,
  KeyRound,
  QrCode,
  Receipt,
  Percent,
  CalendarClock,
  Dices,
  Palette,
  Type,
} from 'lucide-react'

import CalculatorTool from '../tools/Calculator.jsx'
import CurrencyConverter from '../tools/CurrencyConverter.jsx'
import UnitConverter from '../tools/UnitConverter.jsx'
import TimerStopwatch from '../tools/TimerStopwatch.jsx'
import WorldClock from '../tools/WorldClock.jsx'
import Notes from '../tools/Notes.jsx'
import Checklist from '../tools/Checklist.jsx'
import PasswordGenerator from '../tools/PasswordGenerator.jsx'
import QrCodeTool from '../tools/QrCode.jsx'
import TipSplitter from '../tools/TipSplitter.jsx'
import PercentCalculator from '../tools/PercentCalculator.jsx'
import DateCalculator from '../tools/DateCalculator.jsx'
import RandomTools from '../tools/RandomTools.jsx'
import ColorPicker from '../tools/ColorPicker.jsx'
import TextTools from '../tools/TextTools.jsx'

/**
 * The blades of the knife. Order defines their layout in the handle.
 * `accent` themes each tool's panel and its open-blade glow.
 */
export const TOOLS = [
  { id: 'calc', name: 'Calculator', short: 'Calculator', icon: Calculator, accent: '#4ea1ff', Component: CalculatorTool },
  { id: 'currency', name: 'Currency', short: 'Currency', icon: Coins, accent: '#f5b301', Component: CurrencyConverter },
  { id: 'unit', name: 'Units', short: 'Units', icon: Ruler, accent: '#3ecf8e', Component: UnitConverter },
  { id: 'timer', name: 'Timer & Stopwatch', short: 'Timer', icon: TimerReset, accent: '#ff7a45', Component: TimerStopwatch },
  { id: 'clock', name: 'World Clock', short: 'Clock', icon: Globe2, accent: '#5b8def', Component: WorldClock },
  { id: 'notes', name: 'Notes', short: 'Notes', icon: StickyNote, accent: '#ffd23f', Component: Notes },
  { id: 'todo', name: 'Checklist', short: 'Checklist', icon: ListChecks, accent: '#2ec4b6', Component: Checklist },
  { id: 'password', name: 'Password Generator', short: 'Password', icon: KeyRound, accent: '#9b6dff', Component: PasswordGenerator },
  { id: 'qr', name: 'QR Code', short: 'QR Code', icon: QrCode, accent: '#e6e9ee', Component: QrCodeTool },
  { id: 'tip', name: 'Tip & Split', short: 'Tip Split', icon: Receipt, accent: '#43c6ac', Component: TipSplitter },
  { id: 'percent', name: 'Percentages', short: 'Percent', icon: Percent, accent: '#ff5d8f', Component: PercentCalculator },
  { id: 'date', name: 'Date & Countdown', short: 'Dates', icon: CalendarClock, accent: '#f78fb3', Component: DateCalculator },
  { id: 'random', name: 'Dice & Random', short: 'Random', icon: Dices, accent: '#ff6b6b', Component: RandomTools },
  { id: 'color', name: 'Color Picker', short: 'Color', icon: Palette, accent: '#c77dff', Component: ColorPicker },
  { id: 'text', name: 'Text Tools', short: 'Text', icon: Type, accent: '#4dd4ff', Component: TextTools },
]

export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.id, t]))
