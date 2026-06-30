import type { Tile } from '../types/game-state';
import { findMatchedCells } from '../match/findMatches';
import { INGREDIENT_IDS } from '../types';
import { pickIngredient } from '../rng/seededRng';
import { collectYieldsFromBoard } from '../inventory/collectYields';
import { addToPantry, emptyPantry, type Pantry } from '../inventory/pantry';

export function clearMatches(board: Tile[][]): boolean {
  const matched = findMatchedCells(board);
  if (matched.size === 0) {
    return false;
  }

  for (const key of matched.keys()) {
    const [row, col] = key.split(',').map(Number);
    board[row]![col] = null;
  }

  return true;
}

/**
 * Drop tiles down within each column. Empty cells end up at the top.
 * Uses a two-pass per-column stack to avoid in-place copy bugs.
 */
export function applyGravity(board: Tile[][]): void {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let col = 0; col < cols; col += 1) {
    const stack: Tile[] = [];

    for (let row = rows - 1; row >= 0; row -= 1) {
      const tile = board[row]?.[col];
      if (tile) {
        stack.push(tile);
      }
    }

    for (let row = rows - 1; row >= 0; row -= 1) {
      const stackIndex = rows - 1 - row;
      board[row]![col] = stack[stackIndex] ?? null;
    }
  }
}

export function refillBoard(board: Tile[][], rng: () => number): void {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (board[row]?.[col] === null) {
        board[row]![col] = pickIngredient(INGREDIENT_IDS, rng);
      }
    }
  }
}

/**
 * Clear matches, collect yields, apply gravity, refill — repeat until stable.
 * Returns total pantry delta across all cascade steps.
 */
export function resolveBoard(board: Tile[][], rng: () => number): Pantry {
  let totalDelta = emptyPantry();
  let safety = 0;

  while (safety < 100) {
    if (!findMatchedCells(board).size) {
      return totalDelta;
    }

    const stepYields = collectYieldsFromBoard(board);
    const stepDelta = emptyPantry();
    for (const { ingredient, amount } of stepYields) {
      stepDelta[ingredient] += amount;
    }
    totalDelta = addToPantry(totalDelta, stepDelta);

    clearMatches(board);
    applyGravity(board);
    refillBoard(board, rng);
    safety += 1;
  }

  return totalDelta;
}

export { hasMatches } from '../match/findMatches';
