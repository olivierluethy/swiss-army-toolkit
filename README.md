# Swiss Army Toolkit 🔴✚

A modern, animated single-page web app themed as a **Swiss Army knife**. The
handle holds 15 blades — each one a genuinely useful everyday tool that
**folds out** with a springy Framer Motion animation. Open as many as you like;
they all keep working side by side.

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
browser. No server needed.

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
    Knife.jsx             # the red handle + blade tray
    BladeButton.jsx       # one folded blade
    ToolPanel.jsx         # the fold-out card wrapper (the signature animation)
    ui.jsx                # shared inputs, segmented control, copy button
  data/
    tools.js              # the blade registry (icon, accent, component)
    currency.js           # static exchange-rate table
  hooks/
    useLocalStorage.js
    useMediaQuery.js      # sizes the fanned blade rows responsively
  utils/
    formatDate.js         # shared "15th of January 2026" formatter
    fetchRates.js         # live FX rates with a 3-endpoint fallback chain
  tools/                  # one file per tool
```
