import { INGREDIENT_IDS } from '../types';
import type { Tile } from '../types/game-state';
import { pickIngredient } from '../rng/seededRng';
import { cloneBoard, type Coord } from './coords';
import { hasMatches } from '../match/findMatches';

function swapCells(board: Tile[][], a: Coord, b: Coord): void {
  const temp = board[a.row]![a.col]!;
  board[a.row]![a.col] = board[b.row]![b.col]!;
  board[b.row]![b.col] = temp;
}

function fillRandomBoard(size: number, rng: () => number): Tile[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => pickIngredient(INGREDIENT_IDS, rng)),
  );
}

export function hasValidMove(board: Tile[][]): boolean {
  const size = board.length;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const candidates: Coord[] = [
        { row: row + 1, col },
        { row, col: col + 1 },
      ];

      for (const target of candidates) {
        if (target.row >= size || target.col >= size) {
          continue;
        }

        const trial = cloneBoard(board);
        swapCells(trial, { row, col }, target);
        if (hasMatches(trial)) {
          return true;
        }
      }
    }
  }

  return false;
}

/** Creates a board with no starting matches and at least one valid swap. */
export function createBoard(size: number, rng: () => number): Tile[][] {
  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const board = fillRandomBoard(size, rng);
    if (!hasMatches(board) && hasValidMove(board)) {
      return board;
    }
  }

  throw new Error(`Failed to generate a valid ${size}x${size} board`);
}

export { swapCells };
