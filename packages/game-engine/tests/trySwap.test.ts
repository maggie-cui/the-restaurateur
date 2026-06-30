import { describe, it, expect } from 'vitest';
import { trySwap } from '../src/game/trySwap';
import type { GameState, Tile } from '../src/types';
import { emptyPantry } from '../src/inventory/pantry';

function boardFromRows(rows: string[]): Tile[][] {
  return rows.map((row) => row.split(' ') as Tile[]);
}

function makeState(board: Tile[][], movesRemaining = 20): GameState {
  return {
    phase: 'playing',
    levelId: 1,
    seed: 1009,
    board,
    pantry: emptyPantry(),
    customers: [
      {
        id: 'maria',
        name: 'Maria',
        dish: 'Pizza',
        served: false,
        lines: [
          { ingredient: 'tomato', required: 5, delivered: 0, complete: false },
          { ingredient: 'cheese', required: 3, delivered: 0, complete: false },
        ],
      },
    ],
    movesRemaining,
    movesTotal: 20,
  };
}

describe('trySwap', () => {
  it('accepts a swap that creates a horizontal match and decrements moves', () => {
    const state = makeState(
      boardFromRows([
        'tomato tomato cheese tomato',
        'cheese mushroom basil pepperoni',
        'mushroom basil pepperoni black_olive',
        'cheese mushroom basil pepperoni',
      ]),
    );

    const result = trySwap(state, { row: 0, col: 2 }, { row: 0, col: 3 });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.movesRemaining).toBe(19);
    }
  });

  it('adds collected tomato to the order after a match', () => {
    const state = makeState(
      boardFromRows([
        'tomato tomato cheese tomato',
        'cheese mushroom basil pepperoni',
        'mushroom basil pepperoni black_olive',
        'cheese mushroom basil pepperoni',
      ]),
    );

    const result = trySwap(state, { row: 0, col: 2 }, { row: 0, col: 3 });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.customers[0]?.lines[0]?.delivered).toBeGreaterThanOrEqual(1);
    }
  });

  it('rejects a swap that does not create a match', () => {
    const state = makeState(
      boardFromRows([
        'tomato cheese mushroom basil',
        'pepperoni black_olive tomato cheese',
        'mushroom basil pepperoni black_olive',
        'tomato cheese mushroom basil',
      ]),
    );

    const result = trySwap(state, { row: 0, col: 0 }, { row: 0, col: 1 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('no_match');
      expect(result.state.movesRemaining).toBe(20);
      expect(result.state.board).toEqual(state.board);
    }
  });

  it('rejects non-adjacent swaps', () => {
    const state = makeState(boardFromRows(['tomato cheese', 'mushroom basil']));
    const result = trySwap(state, { row: 0, col: 0 }, { row: 1, col: 1 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('not_adjacent');
    }
  });

  it('rejects swaps when no moves remain', () => {
    const state = makeState(
      boardFromRows([
        'tomato tomato cheese tomato',
        'cheese mushroom basil pepperoni',
      ]),
      0,
    );

    const result = trySwap(state, { row: 0, col: 2 }, { row: 0, col: 3 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('no_moves');
    }
  });
});
