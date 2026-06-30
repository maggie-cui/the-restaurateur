# The Restaurateur

Match-3 restaurant puzzle game — Phase 1 MVP.

## Commands

```bash
npm install
npm run dev      # start web app at http://localhost:5173
npm test         # run game-engine tests
npm run typecheck
npm run build
```

## Project structure

- `packages/game-engine` — pure TypeScript game logic
- `apps/web` — React + Vite UI
- `content/levels` — level JSON definitions
- `docs/PRD.md` — product requirements

## Milestone 4 status

Level 1 is playable start to finish. Complete Maria's pizza order to win; run out of moves first and you lose. End screens show real order stats (no mock buttons).

Run `npm run dev` → **Start Cooking** → match ingredients until Maria is served or moves run out.
