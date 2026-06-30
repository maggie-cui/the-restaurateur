import { describe, it, expect } from 'vitest';
import { createBoard, hasValidMove } from '../src/board/createBoard';
import { createSeededRng } from '../src/rng/seededRng';
import { hasMatches } from '../src/match/findMatches';

describe('createBoard', () => {
  it('generates an 8x8 board without starting matches', () => {
    const rng = createSeededRng(42);
    const board = createBoard(8, rng);

    expect(board).toHaveLength(8);
    expect(board.every((row) => row.length === 8)).toBe(true);
    expect(hasMatches(board)).toBe(false);
  });

  it('guarantees at least one valid swap', () => {
    const rng = createSeededRng(99);
    const board = createBoard(8, rng);

    expect(hasValidMove(board)).toBe(true);
  });

  it('is deterministic for the same seed', () => {
    const first = createBoard(8, createSeededRng(7));
    const second = createBoard(8, createSeededRng(7));

    expect(first).toEqual(second);
  });
});
