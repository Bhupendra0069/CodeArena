# 🚀 Skyrocket — Confetti Celebration System

> A complete guide to what Skyrocket is, how it works, what was implemented, and how every piece fits together in CodeArena.

---

## 1. What is "Skyrocket"?

**Skyrocket** is the name for the **confetti / fireworks celebration effect** that fires when a player wins (or draws) a live coding battle in CodeArena.

It is powered by a tiny npm library called **`canvas-confetti`** — the most popular confetti library for the web. It draws colorful particles on an invisible `<canvas>` element that it creates automatically on top of your page. No DOM changes needed. It cleans itself up after the animation finishes.

```
Player wins battle
      ↓
socket event / page load
      ↓
useSkyrocket() hook
      ↓
canvas-confetti fires bursts
      ↓
particles animate on screen
      ↓
canvas removes itself automatically
```

---

## 2. The Library — `canvas-confetti`

| Property | Detail |
|---|---|
| **Package** | `canvas-confetti` |
| **Version installed** | latest (1.x) |
| **Size** | ~7 KB minified — zero performance impact |
| **How it works** | Creates a full-screen `<canvas>` over your page, draws particle physics, then removes itself |
| **No dependencies** | Pure vanilla JS — works with any framework |
| **Docs** | https://github.com/catdad/canvas-confetti |

### What you can control per burst

```js
confetti({
  particleCount: 120,          // how many particles to shoot
  spread: 70,                  // angle spread in degrees (wider = more scatter)
  startVelocity: 55,           // how fast particles launch upward
  origin: { x: 0.5, y: 0.6 }, // where on screen (0–1 from top-left)
  colors: ['#a855f7', '#facc15'],  // array of hex colors
  scalar: 1.2,                 // size multiplier for particles
  gravity: 1,                  // how fast they fall (1 = normal gravity)
  ticks: 300,                  // how long the animation lasts (frames)
  angle: 90,                   // direction to shoot (90 = straight up)
})
```

---

## 3. What Was Built — File by File

### 3.1 — The Hook: `useSkyrocket.js`

**Location:** `client/src/hooks/useSkyrocket.js`

This is the **central piece**. It is a React custom hook that wraps `canvas-confetti` and exposes two ready-made effects:

```
useSkyrocket()
├── fireWin()     ← 4-stage fireworks for a WINNER
├── fireDraw()    ← dual-side golden confetti for a DRAW
└── fireRocket()  ← low-level: single burst at any (x, y) position
```

#### How `fireWin()` works — step by step

```
Time 0ms   → Center burst   (x: 0.5, y: 0.6)   120 particles, spread 70°
Time 300ms → Left burst     (x: 0.25, y: 0.65)  120 particles, spread 70°
Time 600ms → Right burst    (x: 0.75, y: 0.65)  120 particles, spread 70°
Time 900ms → Grand Finale   (x: 0.5, y: 0.55)   200 particles, spread 120°
```

This creates a dramatic 4-beat effect — like real fireworks launching from different spots.

**Colors used** (match CodeArena's purple theme):

| Hex | Color |
|---|---|
| `#a855f7` | Purple (primary brand) |
| `#c084fc` | Light purple |
| `#e879f9` | Fuchsia / pink |
| `#facc15` | Gold / yellow |
| `#34d399` | Green (accepted verdict) |
| `#60a5fa` | Blue |
| `#f87171` | Red |
| `#ffffff` | White (grand finale only) |

#### How `fireDraw()` works

Two simultaneous bursts shoot **inward from both sides** of the screen:

```
Left side (angle: 60°)   → shoots toward center-right
Right side (angle: 120°) → shoots toward center-left
```

Both use **golden/amber colors** (`#facc15`, `#fbbf24`, `#d97706`) — different from the purple win effect so the user can immediately tell it's a draw.

---

### 3.2 — BattleRoom Integration

**File:** `client/src/pages/BattleRoom.jsx`

The skyrocket fires here **the moment the battle ends** — while the player is still in the battle room, before being redirected to results.

#### What was changed

**Import added:**
```js
import { useSkyrocket } from '../hooks/useSkyrocket'
```

**Hook destructured inside the component:**
```js
const { fireWin, fireDraw } = useSkyrocket()
```

**`battle_finished` socket handler updated:**
```js
battle_finished: (data) => {
  setStatus('finished')
  setResult(data)

  // 🚀 Skyrocket celebration
  if (data.result === 'draw') {
    fireDraw()                          // golden dual-side confetti
  } else if (data.winner) {
    const winnerId = data.winner?._id?.toString() || data.winner?.toString()
    if (winnerId === user?._id?.toString()) {
      fireWin()                         // full 4-burst fireworks
    }
  }

  setTimeout(() => navigate(`/results/${id}`), 3000)  // redirect after 3s (was 2s)
},
```

> **Why 3 seconds now instead of 2?**
> The grand finale burst fires at 900ms. Having 3 seconds gives the player time to see the full fireworks sequence before being redirected.

#### Trigger Flow in BattleRoom

```
Player submits Accepted solution
         ↓
Server: submissionController calls emitBattleResult()
         ↓
Socket emits 'battle_finished' { winner, result, match }
         ↓
Client: battle_finished handler fires
         ↓
         ├── is draw?      → fireDraw()
         └── am I winner?  → fireWin()
         ↓
3 seconds of fireworks
         ↓
navigate('/results/:id')
```

---

### 3.3 — Results Page Integration

**File:** `client/src/pages/Results.jsx`

The skyrocket also fires on the **Results page** when it loads. This covers two cases:
1. The player was redirected from BattleRoom (they already saw it once — that's fine, double celebration!)
2. The player **directly opens** the results URL from a link/history

#### What was changed

**Import added:**
```js
import { useSkyrocket } from '../hooks/useSkyrocket'
```

**Hook destructured:**
```js
const { fireWin, fireDraw } = useSkyrocket()
```

**New `useEffect` added after the data-fetch effect:**
```js
// 🚀 Fire skyrocket when results are loaded
useEffect(() => {
  if (!match || !user) return          // wait for data

  const winnerId = match.winner?._id?.toString() || match.winner?.toString()
  const isWinner = winnerId === user._id?.toString()
  const isDraw   = match.result === 'draw'

  if (isDraw) {
    const t = setTimeout(() => fireDraw(), 400)  // 400ms delay
    return () => clearTimeout(t)                  // cleanup on unmount
  } else if (isWinner) {
    const t = setTimeout(() => fireWin(), 400)
    return () => clearTimeout(t)
  }
}, [match, user, fireWin, fireDraw])
```

> **Why 400ms delay?**
> React renders the page first, then the effect fires. Without a delay, the confetti can appear before the result banner is visible. 400ms gives just enough time for the UI to paint fully.

#### Trigger Flow in Results Page

```
Page loads / user navigates to /results/:id
         ↓
API call: battleService.getBattleById(id)
         ↓
setMatch(data) → triggers useEffect
         ↓
         ├── match.result === 'draw' → fireDraw() after 400ms
         └── user is winner         → fireWin() after 400ms
         ↓
Fireworks play
         ↓
Timer cleanup runs on unmount (no memory leaks)
```

---

## 4. The Full Architecture — Visual

```
canvas-confetti (npm)
        │
        ▼
useSkyrocket.js (custom React hook)
  ├── fireRocket(x, y)   ← primitive burst at any screen position
  ├── fireWin()          ← 4 staged calls to fireRocket + 1 grand finale
  └── fireDraw()         ← 2 simultaneous inward golden bursts

        │                        │
        ▼                        ▼
BattleRoom.jsx           Results.jsx
(fires on socket event)  (fires on page load)
battle_finished handler  useEffect([match, user])
```

---

## 5. When Does Each Effect Fire?

| Scenario | Page | Effect | Timing |
|---|---|---|---|
| You submit Accepted in a battle | BattleRoom | `fireWin()` | Instant on socket event |
| Battle ends by timeout (draw) | BattleRoom | `fireDraw()` | Instant on socket event |
| Battle ends — opponent won | BattleRoom | Nothing | — |
| You open /results/:id as winner | Results | `fireWin()` | 400ms after page loads |
| You open /results/:id as loser | Results | Nothing | — |
| You open /results/:id as draw | Results | `fireDraw()` | 400ms after page loads |

---

## 6. How the Hook is Reusable

The `useSkyrocket` hook is **not tied to any specific page**. You can import and use it anywhere:

```js
import { useSkyrocket } from '../hooks/useSkyrocket'

function AnyComponent() {
  const { fireWin, fireDraw, fireRocket } = useSkyrocket()

  // Fire at a custom position (x and y are 0.0 to 1.0 of screen)
  fireRocket(0.5, 0.3)   // top-center burst

  // Full win celebration
  fireWin()

  // Draw celebration
  fireDraw()
}
```

If you add more features later (e.g. tournament wins, achievement unlocks, streak milestones), just call `fireWin()` from anywhere.

---

## 7. No Server Changes Needed

This is **100% client-side**. The server already emits `battle_finished` with the `winner` and `result` fields. We just listen to that existing data and trigger the visual effect. Zero backend changes were required.

---

## 8. Summary of All Changed/Created Files

```
client/
├── package.json              ← canvas-confetti added as dependency
└── src/
    ├── hooks/
    │   └── useSkyrocket.js   ← NEW — the confetti hook
    └── pages/
        ├── BattleRoom.jsx    ← UPDATED — fires on battle_finished socket event
        └── Results.jsx       ← UPDATED — fires on page load if user won/drew
```

---

## 9. Quick Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Confetti doesn't fire | `canvas-confetti` not installed | Run `npm install canvas-confetti` in `/client` |
| Fires for loser too | Winner ID comparison wrong | Check `user._id` vs `data.winner._id` are both `.toString()` |
| Fires twice on win | BattleRoom redirects to Results | Expected — double celebration is intentional |
| Confetti appears behind UI | z-index issue | `canvas-confetti` auto-sets `z-index: 999` — usually fine |
| Confetti on wrong person's screen | Socket sends to both players | The hook checks `winnerId === user._id` — only triggers for winner |
