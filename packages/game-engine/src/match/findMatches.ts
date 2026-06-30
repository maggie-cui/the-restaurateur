import type { IngredientId } from '../types';
import type { Tile } from '../types/game-state';
import { coordKey, type Coord } from '../board/coords';

export interface MatchGroup {
  ingredient: IngredientId;
  cells: Coord[];
}

function addRun(
  board: Tile[][],
  row: number,
  col: number,
  length: number,
  horizontal: boolean,
  matched: Map<string, IngredientId>,
): void {
  for (let i = 0; i < length; i += 1) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    const tile = board[r]?.[c];
    if (tile) {
      matched.set(coordKey({ row: r, col: c }), tile);
    }
  }
}

function addSquareMatches(board: Tile[][], matched: Map<string, IngredientId>): void {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let row = 0; row < rows - 1; row += 1) {
    for (let col = 0; col < cols - 1; col += 1) {
      const topLeft = board[row]?.[col];
      if (!topLeft) {
        continue;
      }

      if (
        board[row]?.[col + 1] === topLeft &&
        board[row + 1]?.[col] === topLeft &&
        board[row + 1]?.[col + 1] === topLeft
      ) {
        matched.set(coordKey({ row, col }), topLeft);
        matched.set(coordKey({ row, col: col + 1 }), topLeft);
        matched.set(coordKey({ row: row + 1, col }), topLeft);
        matched.set(coordKey({ row: row + 1, col: col + 1 }), topLeft);
      }
    }
  }
}

/** Returns all cells in a horizontal/vertical line of 3+ or a 2×2 square match. */
export function findMatchedCells(board: Tile[][]): Map<string, IngredientId> {
  const matched = new Map<string, IngredientId>();
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let row = 0; row < rows; row += 1) {
    let col = 0;
    while (col < cols) {
      const tile = board[row]?.[col];
      if (!tile) {
        col += 1;
        continue;
      }

      let runLength = 1;
      while (col + runLength < cols && board[row]?.[col + runLength] === tile) {
        runLength += 1;
      }

      if (runLength >= 3) {
        addRun(board, row, col, runLength, true, matched);
      }

      col += runLength;
    }
  }

  for (let col = 0; col < cols; col += 1) {
    let row = 0;
    while (row < rows) {
      const tile = board[row]?.[col];
      if (!tile) {
        row += 1;
        continue;
      }

      let runLength = 1;
      while (row + runLength < rows && board[row + runLength]?.[col] === tile) {
        runLength += 1;
      }

      if (runLength >= 3) {
        addRun(board, row, col, runLength, false, matched);
      }

      row += runLength;
    }
  }

  addSquareMatches(board, matched);

  return matched;
}

export function hasMatches(board: Tile[][]): boolean {
  return findMatchedCells(board).size > 0;
}

export function findMatchGroups(board: Tile[][]): MatchGroup[] {
  const matched = findMatchedCells(board);
  const byIngredient = new Map<IngredientId, Coord[]>();

  for (const [key, ingredient] of matched) {
    const [row, col] = key.split(',').map(Number);
    const cells = byIngredient.get(ingredient) ?? [];
    cells.push({ row: row!, col: col! });
    byIngredient.set(ingredient, cells);
  }

  return [...byIngredient.entries()].map(([ingredient, cells]) => ({
    ingredient,
    cells,
  }));
}
