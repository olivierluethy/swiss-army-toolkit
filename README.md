# Swiss Army Toolkit 🔴✚

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)

A modern, animated single-page web app themed as a **Swiss Army knife**. A tall
red handle holds 15 blades — 8 folding out of the left side, 7 out of the right,
like a real one. Each blade is a genuinely useful everyday tool that **folds
out** with a springy Framer Motion animation, its panel opening on that blade's
own side of the handle. Open as many as you like; both sides stay usable at
once. On phones the two columns collapse into a single full-width stack.

Built to run **fully offline**, straight from the file system — no server, no
network calls.

## The blades

| | Tool | What it does |
|---|---|---|
| 🧮 | **Calculator** | Arithmetic with `%`, `±`, and memory (MC/MR/M+/M−). Keyboard-friendly. |
| 💰 | **Currency** | Convert 16 currencies — fetch live rates from free public APIs, edit them by hand, or fall back to the bundled table offline. |
| 📏 | **Units** | Length, weight, volume, speed and temperature. |
| ⏱️ | **Timer & Stopwatch** | Stopwatch with laps + countdown timer with a beep. |
| 🌍 | **World Clock** | Live times across cities, plus a timezone converter. |
| 📝 | **Notes** | An auto-saving scratchpad. |
| ✅ | **Checklist** | A quick to-do list. |
| 🔑 | **Password Generator** | Length, character sets, strength meter — cryptographically random. |
| ▦ | **QR Code** | Turn any text or link into a downloadable QR code. |
| 🧾 | **Tip & Split** | Tip and per-person totals for the table. |
| ％ | **Percentages** | The three everyday percentage cases. |
| 📅 | **Date & Countdown** | Days between dates, add/subtract, and live countdowns. |
| 🎲 | **Dice & Random** | Dice, coin flip, random number. |
| 🎨 | **Color Picker** | HEX ↔ RGB ↔ HSL with copy buttons. |
| 🔤 | **Text Tools** | Word/character counts and case transforms. |

Notes, checklists, world-clock cities and currency-rate edits are saved in your
browser's `localStorage`, so they stick around on this device.

## Tech stack

- **React** + **Vite**
- **Framer Motion** for the fold-out / fold-in animations
- **Lucide React** for icons
- **qrcode** for offline QR generation
- Plain CSS (no framework), mobile-first

## Build & run

```bash
npm install
npm run build
```

Then just **open `dist/index.html`** — double-click it, or drag it into your
browser. No server needed. It's a single self-contained file (JS, CSS and icon
all inlined), so you can move or copy it anywhere and it still works.

> ⚠️ Open **`dist/index.html`**, not the `index.html` in the project root. The
> root file is Vite's dev entry — it references `./src/main.jsx`, which the
> browser blocks over `file://` (a CORS error). Only the built `dist` file is
> meant to be opened directly.

> The build is bundled into a **single self-contained `index.html`** (via
> `vite-plugin-singlefile`) with `base: './'`. This sidesteps the browser
> `file://` CORS restriction on ES-module scripts, which is the usual cause of a
> blank page when opening a Vite build directly from disk.

### Develop

```bash
npm run dev
```

## Currency rates

The app ships with a **static, bundled** rate table in
[`src/data/currency.js`](src/data/currency.js) so it always works offline. On
top of that:

- **Get latest rates** (and a best-effort auto-fetch when you first open the
  tool) pulls current rates from free, no-key, CORS-enabled public APIs, tried
  in order: **Frankfurter → open.er-api.com → currency-api (jsDelivr)**. The
  last successful result is cached locally with its timestamp and source
  (`Updated 18th of July 2026, 14:32 · Frankfurter`).
- **Edit rates** lets you override any value by hand; **Reset** restores the
  bundled table.
- If every fetch fails (offline, or `file://` blocked the request), it silently
  keeps the last cached rates — or the bundled table — and shows a small
  *offline — using saved rates* note. The rest of the app is never blocked.

The live fetch is an online-only enhancement: the build still opens and runs
straight from `dist/index.html` over `file://` with no server.

## Project structure

```
src/
  App.jsx                 # app state: which blades are open
  components/
    Knife.jsx             # the vertical handle + left/right blade rails
    BladeButton.jsx       # one side-mounted blade that swings out
    ToolPanel.jsx         # the fold-out card, opening on its blade's side
    ui.jsx                # shared inputs, segmented control, copy button
  data/
    tools.js              # the blade registry (icon, accent, component) + left/right split
    currency.js           # static exchange-rate table
  hooks/
    useLocalStorage.js
    useMediaQuery.js      # sizes the fanned blade rows responsively
  utils/
    formatDate.js         # shared "15th of January 2026" formatter
    fetchRates.js         # live FX rates with a 3-endpoint fallback chain
  tools/                  # one file per tool
```

## License

Released under the [MIT License](LICENSE) © 2026 Olivier Lüthy. You're free to use, modify and distribute this
software, including commercially, as long as the copyright notice and license are included.

## Author

Built by **Olivier Lüthy** — [GitHub](https://github.com/olivierluethy).
