// Static exchange rates — NOT live. Values are units of each currency per 1 USD.
// Bundled so the app works fully offline. Rates are editable in the tool and
// your overrides are saved on this device. Update the constants below to refresh.
export const RATES_DATE = '2026-01-15'
export const BASE = 'USD'

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', perUsd: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', perUsd: 0.92 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr.', perUsd: 0.88 },
  { code: 'GBP', name: 'British Pound', symbol: '£', perUsd: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', perUsd: 156.0 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', perUsd: 7.24 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$', perUsd: 1.42 },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', perUsd: 1.55 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', perUsd: 85.5 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', perUsd: 6.1 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', perUsd: 11.0 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', perUsd: 11.3 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', perUsd: 20.5 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', perUsd: 18.7 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', perUsd: 3.67 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$', perUsd: 1.35 },
]

export const DEFAULT_RATES = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c.perUsd]),
)
