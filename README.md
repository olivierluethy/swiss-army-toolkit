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
| 💰 | **Currency** | Convert between 16 currencies using a bundled, editable rate table. |
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

## Offline currency rates

The exchange rates are **static**, bundled in
[`src/data/currency.js`](src/data/currency.js) and clearly labelled with their
date. They are **not live**. You can override any rate inside the tool
(**Edit rates**) and your changes are saved locally; **Reset** restores the
bundled values. To refresh the defaults, edit the constants in that file.

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
  tools/                  # one file per tool
```
