import { describe, it, expect } from 'vitest';
import { collectYieldsFromBoard } from '../src/inventory/collectYields';
import type { Tile } from '../src/types/game-state';

function boardFromRows(rows: string[]): Tile[][] {
  return rows.map((row) => row.split(' ') as Tile[]);
}

describe('collectYieldsFromBoard', () => {
  it('yields +1 for a horizontal match of 3', () => {
    const board = boardFromRows(['tomato tomato tomato cheese']);

    expect(collectYieldsFromBoard(board)).toEqual([
      { ingredient: 'tomato', amount: 1 },
    ]);
  });

  it('yields +2 for a horizontal match of 4', () => {
    const board = boardFromRows(['tomato tomato tomato tomato']);

    expect(collectYieldsFromBoard(board)).toEqual([
      { ingredient: 'tomato', amount: 2 },
    ]);
  });

  it('yields +2 for a 2x2 square', () => {
    const board = boardFromRows([
      'cheese cheese mushroom',
      'cheese cheese basil',
    ]);

    expect(collectYieldsFromBoard(board)).toEqual([
      { ingredient: 'cheese', amount: 2 },
    ]);
  });

  it('collects multiple ingredient groups in one step', () => {
    const board = boardFromRows([
      'tomato tomato tomato cheese cheese cheese',
      'mushroom basil pepperoni black_olive',
    ]);

    const yields = collectYieldsFromBoard(board);
    expect(yields).toContainEqual({ ingredient: 'tomato', amount: 1 });
    expect(yields).toContainEqual({ ingredient: 'cheese', amount: 1 });
  });
});
