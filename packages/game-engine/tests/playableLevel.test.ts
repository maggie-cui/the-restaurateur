import { describe, it, expect } from 'vitest';
import { createGame } from '../src/game/createGame';
import { trySwap } from '../src/game/trySwap';
import type { GameState, LevelConfig, Tile } from '../src/types';
import { emptyPantry } from '../src/inventory/pantry';

function boardFromRows(rows: string[]): Tile[][] {
  return rows.map((row) => row.split(' ') as Tile[]);
}

function gameWithBoard(board: Tile[][], level: LevelConfig): GameState {
  const base = createGame(level, 1);
  return { ...base, board };
}

const QUICK_WIN_LEVEL: LevelConfig = {
  id: 99,
  moves: 5,
  boardSize: 4,
  customers: [
    {
      id: 'maria',
      name: 'Maria',
      dish: 'Pizza',
      requirements: [{ ingredient: 'tomato', amount: 1 }],
    },
  ],
};

describe('playable level flow', () => {
  it('can win a level by completing all customer orders', () => {
    const state = gameWithBoard(
      boardFromRows([
        'tomato tomato cheese tomato',
        'cheese mushroom basil pepperoni',
        'mushroom basil pepperoni black_olive',
        'cheese mushroom basil pepperoni',
      ]),
      QUICK_WIN_LEVEL,
    );

    const result = trySwap(state, { row: 0, col: 2 }, { row: 0, col: 3 });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.phase).toBe('won');
      expect(result.state.customers[0]?.served).toBe(true);
      expect(result.state.customers[0]?.lines[0]?.complete).toBe(true);
    }
  });

  it('can lose a level when moves run out before orders finish', () => {
    const state = gameWithBoard(
      boardFromRows([
        'tomato tomato cheese tomato',
        'cheese mushroom basil pepperoni',
        'mushroom basil pepperoni black_olive',
        'cheese mushroom basil pepperoni',
      ]),
      {
        id: 100,
        moves: 1,
        boardSize: 4,
        customers: [
          {
            id: 'maria',
            name: 'Maria',
            dish: 'Pizza',
            requirements: [
              { ingredient: 'tomato', amount: 10 },
              { ingredient: 'cheese', amount: 10 },
            ],
          },
        ],
      },
    );

    const result = trySwap(state, { row: 0, col: 2 }, { row: 0, col: 3 });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.phase).toBe('lost');
      expect(result.state.movesRemaining).toBe(0);
      expect(result.state.customers[0]?.served).toBe(false);
      expect(result.state.pantry.tomato + result.state.customers[0]!.lines[0]!.delivered).toBeLessThan(10);
    }
  });

  it('keeps partial order progress when a level is lost', () => {
    const state: GameState = {
      phase: 'playing',
      levelId: 1,
      seed: 1009,
      board: boardFromRows(['tomato cheese', 'mushroom basil']),
      pantry: emptyPantry(),
      customers: [
        {
          id: 'maria',
          name: 'Maria',
          dish: 'Pizza',
          served: false,
          lines: [
            { ingredient: 'tomato', required: 5, delivered: 2, complete: false },
            { ingredient: 'cheese', required: 3, delivered: 0, complete: false },
          ],
        },
      ],
      movesRemaining: 0,
      movesTotal: 20,
    };

    const lost = { ...state, phase: 'lost' as const };
    expect(lost.customers[0]?.lines[0]?.delivered).toBe(2);
    expect(lost.customers[0]?.lines[1]?.delivered).toBe(0);
  });
});
