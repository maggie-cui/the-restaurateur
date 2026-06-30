import { describe, it, expect } from 'vitest';
import { clearMatches, applyGravity, refillBoard } from '../src/board/gravity';
import { findMatchedCells } from '../src/match/findMatches';
import { createSeededRng } from '../src/rng/seededRng';
import type { Tile } from '../src/types/game-state';

function boardFromRows(rows: (string | null)[][]): Tile[][] {
  return rows.map((row) => row.map((value) => (value === '.' ? null : (value as Tile))));
}

describe('applyGravity', () => {
  it('packs tiles to the bottom of each column with gaps at the top', () => {
    const board = boardFromRows([
      ['tomato', '.', 'cheese'],
      ['.', 'mushroom', '.'],
      ['basil', '.', 'pepperoni'],
    ]);

    applyGravity(board);

    expect(board).toEqual(
      boardFromRows([
        ['.', '.', '.'],
        ['tomato', '.', 'cheese'],
        ['basil', 'mushroom', 'pepperoni'],
      ]),
    );
  });

  it('leaves side columns unchanged when a middle horizontal match is cleared', () => {
    const board = boardFromRows([
      ['A1', 'B1', 'C1', 'D1', 'E1'],
      ['A2', 'B2', 'C2', 'D2', 'E2'],
      ['A3', 'B3', 'C3', 'D3', 'E3'],
    ]);

    board[1]![1] = null;
    board[1]![2] = null;
    board[1]![3] = null;

    applyGravity(board);

    expect(board.map((row) => row[0])).toEqual(['A1', 'A2', 'A3']);
    expect(board.map((row) => row[4])).toEqual(['E1', 'E2', 'E3']);
    expect(board[1]).toEqual(['A2', 'B1', 'C1', 'D1', 'E2']);
    expect(board[0]).toEqual(['A1', null, null, null, 'E1']);
  });
});

describe('clear + gravity + refill', () => {
  it('clears a horizontal match, drops tiles in those columns, and refills only the top', () => {
    const board = boardFromRows([
      ['cheese', 'mushroom', 'basil', 'pepperoni'],
      ['tomato', 'tomato', 'tomato', 'black_olive'],
      ['cheese', 'mushroom', 'basil', 'pepperoni'],
      ['cheese', 'mushroom', 'basil', 'pepperoni'],
    ]);

    const matched = findMatchedCells(board);
    expect(matched.size).toBe(3);

    clearMatches(board);
    applyGravity(board);

    expect(board[3]).toEqual(['cheese', 'mushroom', 'basil', 'pepperoni']);
    expect(board[2]).toEqual(['cheese', 'mushroom', 'basil', 'pepperoni']);
    expect(board[1]).toEqual(['cheese', 'mushroom', 'basil', 'black_olive']);
    expect(board[0]).toEqual([null, null, null, 'pepperoni']);

    refillBoard(board, createSeededRng(42));

    expect(board[3]).toEqual(['cheese', 'mushroom', 'basil', 'pepperoni']);
    expect(board[2]).toEqual(['cheese', 'mushroom', 'basil', 'pepperoni']);
    expect(board[1]).toEqual(['cheese', 'mushroom', 'basil', 'black_olive']);
    expect(board[0]![0]).not.toBeNull();
    expect(board[0]![1]).not.toBeNull();
    expect(board[0]![2]).not.toBeNull();
    expect(board[0]![3]).toBe('pepperoni');
  });
});
