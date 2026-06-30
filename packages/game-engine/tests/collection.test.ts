import { describe, it, expect } from 'vitest';
import { resolveBoard } from '../src/board/gravity';
import { createSeededRng } from '../src/rng/seededRng';
import type { Tile } from '../src/types/game-state';

function boardFromRows(rows: string[]): Tile[][] {
  return rows.map((row) => row.split(' ') as Tile[]);
}

describe('resolveBoard collection', () => {
  it('returns pantry delta for a single clearing step', () => {
    const board = boardFromRows([
      'tomato tomato tomato cheese',
      'cheese mushroom basil pepperoni',
      'mushroom basil pepperoni black_olive',
      'cheese mushroom basil pepperoni',
    ]);

    const rng = createSeededRng(1);
    const delta = resolveBoard(board, rng);

    expect(delta.tomato).toBeGreaterThanOrEqual(1);
    expect(board.every((row) => row.every((tile) => tile !== null))).toBe(true);
  });

  it('accumulates yields across cascade steps', () => {
    const board = boardFromRows([
      'tomato tomato tomato tomato',
      'tomato mushroom basil pepperoni',
      'mushroom basil pepperoni black_olive',
      'cheese mushroom basil pepperoni',
    ]);

    const rng = createSeededRng(99);
    const delta = resolveBoard(board, rng);

    expect(delta.tomato).toBeGreaterThanOrEqual(2);
  });
});
