import { describe, it, expect } from 'vitest';
import { findMatchedCells, hasMatches } from '../src/match/findMatches';
import type { Tile } from '../src/types/game-state';

function boardFromRows(rows: string[]): Tile[][] {
  return rows.map((row) => row.split(' ') as Tile[]);
}

describe('findMatches', () => {
  it('detects a horizontal match of 3', () => {
    const board = boardFromRows([
      'tomato tomato tomato cheese',
      'cheese mushroom basil pepperoni',
    ]);

    const matched = findMatchedCells(board);
    expect(matched.size).toBe(3);
    expect(hasMatches(board)).toBe(true);
  });

  it('detects a vertical match of 3', () => {
    const board = boardFromRows([
      'tomato cheese',
      'tomato mushroom',
      'tomato basil',
    ]);

    expect(findMatchedCells(board).size).toBe(3);
  });

  it('returns false when there are no matches', () => {
    const board = boardFromRows([
      'tomato cheese',
      'mushroom basil',
    ]);

    expect(hasMatches(board)).toBe(false);
  });
});
