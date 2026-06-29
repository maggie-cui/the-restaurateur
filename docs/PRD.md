# The Restaurateur — Product Requirements Document

**Version:** 1.1 (Phase 1 MVP)  
**Status:** Approved for development  
**Last updated:** June 28, 2026

---

## 1. Product Overview

### Product Name (working title)

**The Restaurateur**

### Product Concept

A match-3 puzzle game where players operate a restaurant kitchen. Instead of matching abstract candies, players match cooking ingredients to collect resources needed to fulfill customer orders.

Players must strategically create ingredient matches to complete dishes before running out of moves.

### Core Gameplay Loop

```
Customer places order
        ↓
Player matches ingredients on the board
        ↓
Matched ingredients collected into shared pantry
        ↓
Pantry auto-fills customer order requirements
        ↓
All orders completed → level won
        ↓
Next level unlocked
```

### Differentiation

Unlike score-only match-3 games, every match has a clear purpose: **feed the customers**. The restaurant theme provides intuitive art direction, copy, and progression without requiring a separate fictional world.

---

## 2. Goals

### Primary Goal

Create a fun and intuitive match-3 gameplay prototype.

The player should understand within **30 seconds**:

- "I swap ingredients to make matches"
- "Matching gives me ingredients"
- "Customers need those ingredients"
- "I win by completing all orders before moves run out"

### Success Metrics (Phase 1 Prototype)

| Metric | Definition |
|--------|------------|
| Completable level | Player can finish at least level 1 start to finish |
| Match detection | Horizontal, vertical, 4-line, and 2×2 square matches resolve correctly |
| Inventory accuracy | Pantry counts update correctly after every cascade |
| Order fulfillment | Order lines update dynamically; auto-complete when thresholds met |
| Progression | Difficulty increases measurably across levels 1, 5, and 11 |

---

## 3. Target User

**Casual mobile puzzle game players** (prototype delivered in browser first).

| Trait | Detail |
|-------|--------|
| Session length | Short (5–15 minutes) |
| Motivation | Progression, satisfying feedback, clear goals |
| Theme affinity | Cooking / restaurant settings |
| Reference games | Candy Crush, Cooking Fever, similar casual puzzlers |

---

## 4. Platform & Technology

### Phase 1 — Browser Prototype

| Reason | Detail |
|--------|--------|
| Faster iteration | Hot reload, browser DevTools |
| Easier debugging | Visual inspection, unit tests |
| No app store gate | Ship and playtest immediately |

### Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript | Type safety; shared with future mobile |
| App shell | React + Vite | Fast dev, widely documented |
| Board rendering | HTML Canvas | Smooth tile animations; upgrade to PixiJS later if needed |
| Game logic | Pure TypeScript package (`@restaurateur/game-engine`) | No React/DOM in core; reusable on mobile |
| Tests | Vitest | Unit-test match, gravity, orders, win/lose |
| Persistence | `localStorage` | Current level, completed levels |
| Level data | JSON files | Authorable without code changes |

### Future — Mobile

- **Capacitor** (wrap web app) or **React Native** (import shared game-engine package)
- Touch drag-to-swap on the same engine API
- PWA as optional intermediate step

---

## 5. Core Gameplay

### 5.1 Game Board

| Property | Phase 1 value |
|----------|---------------|
| Grid size | 8 × 8 |
| Tile types | 6 ingredient types (see §5.2) |
| Initial state | No matches on board; at least one valid swap guaranteed |
| Dead board | If no valid swaps remain, reshuffle board (preserve order progress) |

### 5.2 Ingredient Types

Phase 1 focuses on **pizza orders**. All six ingredients appear on the board regardless of current order needs (creates strategic tension).

| ID | Ingredient | Emoji (prototype) |
|----|------------|-------------------|
| `tomato` | Tomato | 🍅 |
| `cheese` | Cheese | 🧀 |
| `mushroom` | Mushroom | 🍄 |
| `basil` | Basil | 🌿 |
| `pepperoni` | Pepperoni | 🍕 |
| `black_olive` | Black olive | 🫒 |

**Dish labels** (Pizza, Pasta) are display-only in Phase 1 — they group requirements but do not introduce new tile types. Pasta orders use the same ingredient pool.

---

## 6. Match Rules

### 6.1 Basic Match

- Player swaps two **adjacent** ingredients (horizontal or vertical neighbor).
- Swap is **reverted** if it produces zero matches.
- **Move counter decrements** only on swaps that produce at least one match.
- Cascades (chain reactions after gravity) do **not** cost additional moves.

### 6.2 Supported Patterns (Phase 1)

| Pattern | Detection | Phase 1 |
|---------|-----------|---------|
| 3+ in a row (horizontal) | ✓ | ✓ |
| 3+ in a row (vertical) | ✓ | ✓ |
| 4 in a straight line | ✓ | ✓ |
| 2×2 square (identical ingredient) | ✓ | ✓ |
| L-shape | — | **Out of scope** |
| T-shape | — | **Out of scope** |
| Color bombs / wrapped tiles | — | **Out of scope** |
| Special combo interactions | — | **Out of scope** |

### 6.3 Overlap Resolution

When a tile belongs to multiple patterns simultaneously (e.g. part of both a 4-line and a 3-line):

1. Partition matched tiles into **connected components** (tiles linked by adjacency within the match set).
2. For each component, assign the **single highest-yield pattern** that describes it:
   - 2×2 square → 4-square yield
   - 4 in a straight line → 4-line yield
   - 3+ line → standard yield
3. Each tile is cleared **once** (no double-clear, no double-yield).

### 6.4 Cascade Resolution

After a match:

1. Clear matched tiles
2. Apply collection yields to pantry (see §7)
3. Apply gravity (tiles fall)
4. Refill empty cells from top (random, seeded)
5. Detect new matches → repeat until board is stable
6. If one swap triggers multiple ingredient types, **collect all** in order of resolution

---

## 7. Ingredient Collection System

### 7.1 Pantry Model

- **One shared pantry** per level (all customers draw from the same inventory).
- Pantry is a count map: `{ tomato: 0, cheese: 0, … }`.

### 7.2 Yield Rules

| Pattern | Tiles cleared | Pantry yield |
|---------|---------------|--------------|
| 3+ line (horizontal or vertical) | All tiles in match group(s) | **+1** of that ingredient **per match group** |
| 4 in a straight line | 4 tiles | **+2** of that ingredient |
| 2×2 square | 4 tiles | **+2** of that ingredient |

**Example — standard match:**

```
Player matches:  🍅 🍅 🍅

Pantry before:   Tomato: 0
Pantry after:    Tomato: 1
```

**Example — multi-match swap:**

```
One swap clears a tomato line AND a cheese line
→ Tomato +1 (or +2 if 4-line), Cheese +1 (or +2 if applicable)
```

### 7.3 Order Consumption

When a pantry count reaches an order line's required amount:

1. **Auto-consume**: deduct required amount from pantry immediately
2. Mark that order line **complete** (✅)
3. No manual "Serve" button in Phase 1

---

## 8. Customer Order System

### 8.1 Order Structure

Each customer has:

- Display name (e.g. Maria)
- Dish label (e.g. Pizza, Pasta) — cosmetic in Phase 1
- One or more requirement lines: `{ ingredient, amount }`

### 8.2 Order UI

```
Customer: Maria
Dish: Pizza

  🍅 Tomato    8 / 8  ✅
  🧀 Cheese    5 / 5  ✅
  🌿 Basil     1 / 3
```

- Show **delivered / required** per line
- Show ✅ when line is complete
- When all lines for a customer are complete, show customer as **served**
- When all customers are served → trigger **Level Complete**

### 8.3 Level Scope

| Phase | Customers per level | Orders per customer |
|-------|---------------------|---------------------|
| Levels 1–5 | 1 | 1 dish, 2–3 ingredients |
| Levels 6–10 | 1 | 1 dish, higher quantities, more ingredient types |
| Levels 11+ | 2+ | 1 dish each, shared pantry |

---

## 9. Win, Lose & Game States

### 9.1 Win Condition

**All order lines for all customers are complete** (regardless of remaining moves).

### 9.2 Lose Condition

**Moves remaining = 0** and at least one order line is still incomplete.

- No extra player swaps after the last move
- Cascades triggered by the final swap may still resolve

### 9.3 State Machine

```
START / HOME
      ↓  [Start Cooking]
   PLAYING
      ↓                    ↓
LEVEL COMPLETE         LEVEL FAILED
      ↓                    ↓
  NEXT LEVEL            RETRY
      ↓
  LEVEL SELECT (or HOME with updated current level)
```

Phase 1 collapses **Start** and **Level Select**: Home screen shows current level and a single **Start Cooking** button.

---

## 10. Level Structure

### 10.1 Level Config (JSON)

Each level is defined by a JSON file:

```json
{
  "id": 1,
  "moves": 20,
  "boardSize": 8,
  "customers": [
    {
      "id": "maria",
      "name": "Maria",
      "dish": "Pizza",
      "requirements": [
        { "ingredient": "tomato", "amount": 5 },
        { "ingredient": "cheese", "amount": 3 }
      ]
    }
  ]
}
```

### 10.2 Example Levels

**Level 1**

| Property | Value |
|----------|-------|
| Moves | 20 |
| Customers | Maria — Pizza: Tomato ×5, Cheese ×3 |

**Level 5**

| Property | Value |
|----------|-------|
| Moves | 35 |
| Customers | Andrew — Pizza: Tomato ×10, Cheese ×8 |

**Level 11**

| Property | Value |
|----------|-------|
| Moves | 40 |
| Customers | Andrew — Pizza: Tomato ×10, Cheese ×10; Katie — Pasta: Basil ×5, Mushroom ×8 |

### 10.3 Content Target

Ship **15 hand-authored levels** for Phase 1 (levels 1–15).

---

## 11. Difficulty Progression

| Level range | Characteristics |
|-------------|-----------------|
| **1–5** | Single customer; simple orders (2 ingredients, low counts) |
| **6–10** | Single customer; higher quantities; 3–4 ingredient types |
| **11–15** | Multiple customers; shared pantry; competing ingredient needs |

Difficulty knobs (Phase 1):

- Move limit
- Required quantities
- Number of ingredient types in orders
- Number of customers

---

## 12. Screens

### Screen 1 — Home

```
The Restaurateur

Level 3

[ Start Cooking ]
```

- Show current level (highest unlocked)
- **Start Cooking** loads the current level
- Persist progress in `localStorage`

### Screen 2 — Game

```
┌─────────────────────────────────┐
│  Customer Orders (scroll if 2+) │
│  Maria — Pizza                  │
│    🍅 3/5   🧀 2/3              │
├─────────────────────────────────┤
│                                 │
│         8 × 8 BOARD             │
│                                 │
├─────────────────────────────────┤
│  Moves remaining: 15            │
└─────────────────────────────────┘
```

### Screen 3 — Level Complete

```
Kitchen Complete! 🎉

Ingredients collected:
  🍅 15   🧀 8   🌿 4

[ Next Level ]   [ Replay ]
```

### Screen 4 — Level Failed (Phase 1)

```
Order incomplete!

[ Retry ]   [ Home ]
```

---

## 13. Architecture

### 13.1 Design Principles

1. **Pure game engine** — no React, DOM, or Canvas inside `@restaurateur/game-engine`
2. **Single source of truth** — one `GameState` per active level
3. **Deterministic simulation** — seeded RNG for board generation and replay/debug
4. **Animation decoupled from logic** — engine resolves instantly; renderer animates a script

### 13.2 System Diagram

```
┌─────────────────────────────────────────────────────────┐
│  apps/web (React + Vite)                                │
│  ├── screens/     Home, Game, LevelComplete, Failed     │
│  ├── components/  OrderPanel, MovesCounter              │
│  └── render/      Canvas board + animation queue        │
└──────────────────────────┬──────────────────────────────┘
                           │ dispatch(actions) / getState()
┌──────────────────────────▼──────────────────────────────┐
│  packages/game-engine (Pure TypeScript)                 │
│  ├── board/       grid, swap, gravity, refill           │
│  ├── match/       detect lines, squares, overlaps       │
│  ├── inventory/   pantry add / consume                  │
│  ├── orders/      requirement tracking, fulfillment    │
│  ├── level/       load JSON config                      │
│  ├── game/        orchestration, win/lose, state machine│
│  └── rng/         seeded random                         │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  content/levels/*.json    localStorage progress         │
└─────────────────────────────────────────────────────────┘
```

### 13.3 Repository Layout

```
the-restaurateur/
├── packages/
│   └── game-engine/
│       ├── src/
│       │   ├── board/
│       │   ├── match/
│       │   ├── inventory/
│       │   ├── orders/
│       │   ├── level/
│       │   ├── game/
│       │   └── index.ts
│       └── tests/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── screens/
│       │   ├── components/
│       │   ├── render/
│       │   └── hooks/
│       └── public/
├── content/
│   └── levels/
├── docs/
│   └── PRD.md
└── package.json
```

### 13.4 Animation Pipeline

1. Player input → `gameEngine.dispatch({ type: 'SWAP', from, to })`
2. Engine runs full cascade internally → produces `ResolutionScript` (ordered steps: swap, clear, fall, refill, …)
3. Renderer animates script at human speed
4. UI updates pantry and order panel after cascade completes (or step-by-step in Phase 2 polish)

### 13.5 Engine Events (for UI)

| Event | When |
|-------|------|
| `SwapStarted` | Valid swap accepted |
| `SwapReverted` | Invalid swap |
| `MatchCleared` | Tiles removed, yield applied |
| `InventoryChanged` | Pantry updated |
| `OrderLineCompleted` | Requirement fulfilled |
| `CustomerServed` | All lines for one customer done |
| `LevelWon` | All customers served |
| `LevelLost` | Moves exhausted |

---

## 14. Development Plan

Estimates assume ~10–15 hours/week part-time (~6–8 weeks total). Full-time: ~3–4 weeks.

### Milestone 0 — Project Skeleton (2–3 days)

- [ ] Monorepo: `game-engine` + `web`
- [ ] TypeScript, Vite, React, Vitest wired up
- [ ] Ingredient types + level JSON schema defined
- [ ] Static screen navigation: Home → Game → Complete (mock data)

**Exit criteria:** App runs locally; can navigate all screens with placeholder state.

---

### Milestone 1 — Board & Swap (1 week)

- [ ] 8×8 board generation (no initial matches, ≥1 valid swap)
- [ ] Adjacent swap with revert on no-match
- [ ] Move counter (decrement only on productive swaps)
- [ ] Canvas: draw grid, click/tap to select and swap

**Exit criteria:** Player can swap tiles; invalid swaps revert; moves count down correctly.

---

### Milestone 2 — Match, Gravity & Cascade (1 week)

- [ ] Detect 3+ horizontal and vertical lines
- [ ] Clear → gravity → refill → repeat until stable
- [ ] Unit tests for cascades and chain reactions

**Exit criteria:** Matches clear and cascade correctly with no orphaned tiles.

---

### Milestone 3 — Ingredient Collection (3–4 days)

- [ ] Yield rules: +1 per group, +2 for 4-line and 2×2 square
- [ ] Pantry updates after each cascade step
- [ ] Order panel shows delivered / required counts

**Exit criteria:** Matching updates pantry; multi-ingredient swaps collect all types.

---

### Milestone 4 — Customer Orders & Win/Lose (1 week)

- [ ] Order model with auto-consume at threshold
- [ ] Win when all lines complete; lose at 0 moves
- [ ] Level Complete and Level Failed screens
- [ ] Unit tests: partial delivery, full win, lose edge cases

**Exit criteria:** One hardcoded level playable start to finish with orders.

---

### Milestone 5 — Special Matches (4–5 days)

- [ ] 4-in-a-row → +2 yield
- [ ] 2×2 square → +2 yield
- [ ] Overlap resolution per §6.3
- [ ] Comprehensive match overlap tests

**Exit criteria:** All Phase 1 match patterns implemented and tested.

---

### Milestone 6 — Levels & Progression (1 week)

- [ ] Load levels from `content/levels/*.json`
- [ ] Author levels 1–15 per §11
- [ ] Home: show current level, unlock next on win
- [ ] Persist progress in `localStorage`

**Exit criteria:** Full level curve playable from level 1 through 15.

---

### Milestone 7 — Polish & Playtest (3–5 days)

- [ ] Animations: swap, pop, fall
- [ ] Order line ✅ and customer-served feedback
- [ ] Dead-board reshuffle
- [ ] Playtest against §2 success metrics
- [ ] Optional: sound effects

**Exit criteria:** Phase 1 prototype ready for user feedback.

---

## 15. Testing Strategy

| Area | Test type | Key cases |
|------|-----------|-----------|
| Match detection | Unit | 3-line, 4-line, 2×2, overlaps, simultaneous H+V |
| Gravity / refill | Unit | Single column, multi-column, full cascade |
| Inventory | Unit | Yield amounts, multi-match swap |
| Orders | Unit | Auto-consume, partial progress, shared pantry across customers |
| Win / lose | Unit | Win with moves left; lose at 0 moves; mid-cascade on final move |
| Levels | Integration | Load JSON, complete level 1 programmatically |
| Progression | Manual | Playtest levels 1, 5, 11 for difficulty curve |

Priority test files: `match.test.ts`, `resolve.test.ts`, `orders.test.ts`, `game.test.ts`.

---

## 16. Out of Scope — Phase 1

- L-shape and T-shape matches
- Special tiles (striped, wrapped, color bomb)
- Special tile combo interactions
- Manual "Serve" button
- Per-customer separate pantries
- Backend, accounts, leaderboards
- In-app purchases, lives/energy system
- Star ratings (optional stretch; not required for prototype)
- Level map / world map UI (simple level number on Home is sufficient)
- Native mobile build
- Pasta-specific tile types (Pasta is a dish label only)
- Sound/music (optional polish)

---

## 17. Phase 2 Preview (Not in Scope Now)

- Star ratings per level (1–3 based on moves remaining or score)
- Blockers: ice layers, stone tiles
- Power-ups: hammer, shuffle
- Level map / restaurant upgrade meta
- Capacitor or React Native mobile shell
- Rich art assets replacing emoji placeholders
- Additional dish types with unique ingredients

---

## Appendix A — Runtime GameState Shape

```typescript
interface GameState {
  phase: 'playing' | 'won' | 'lost';
  levelId: number;
  board: Tile[][];
  pantry: Record<IngredientId, number>;
  orders: OrderProgress[];
  movesRemaining: number;
}
```

## Appendix B — Ingredient ID Enum

`tomato` | `cheese` | `mushroom` | `basil` | `pepperoni` | `black_olive`
