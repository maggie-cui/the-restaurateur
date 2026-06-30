import type { IngredientId } from '../types';
import { coordKey, type Coord } from '../board/coords';
import { findMatchedCells } from '../match/findMatches';
import type { Tile } from '../types/game-state';

const NEIGHBORS: Coord[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

function parseCoord(key: string): Coord {
  const [row, col] = key.split(',').map(Number);
  return { row: row!, col: col! };
}

function connectedComponents(
  matched: Map<string, IngredientId>,
): Array<{ ingredient: IngredientId; cells: Set<string> }> {
  const visited = new Set<string>();
  const components: Array<{ ingredient: IngredientId; cells: Set<string> }> = [];

  for (const [startKey, ingredient] of matched) {
    if (visited.has(startKey)) {
      continue;
    }

    const cells = new Set<string>();
    const queue = [startKey];
    visited.add(startKey);
    cells.add(startKey);

    while (queue.length > 0) {
      const key = queue.pop()!;
      const coord = parseCoord(key);

      for (const offset of NEIGHBORS) {
        const neighbor = coordKey({ row: coord.row + offset.row, col: coord.col + offset.col });
        if (!matched.has(neighbor) || visited.has(neighbor)) {
          continue;
        }
        if (matched.get(neighbor) !== ingredient) {
          continue;
        }

        visited.add(neighbor);
        cells.add(neighbor);
        queue.push(neighbor);
      }
    }

    components.push({ ingredient, cells });
  }

  return components;
}

function isExactSquare2x2(cells: Set<string>): boolean {
  if (cells.size !== 4) {
    return false;
  }

  const coords = [...cells].map(parseCoord);
  const rows = coords.map((c) => c.row);
  const cols = coords.map((c) => c.col);
  const minRow = Math.min(...rows);
  const minCol = Math.min(...cols);

  const expected = new Set([
    coordKey({ row: minRow, col: minCol }),
    coordKey({ row: minRow, col: minCol + 1 }),
    coordKey({ row: minRow + 1, col: minCol }),
    coordKey({ row: minRow + 1, col: minCol + 1 }),
  ]);

  for (const key of cells) {
    if (!expected.has(key)) {
      return false;
    }
  }

  return true;
}

function maxStraightRunLength(cells: Set<string>, board: Tile[][]): number {
  const coords = [...cells].map(parseCoord);
  let maxRun = 0;

  for (const { row } of coords) {
    const cols = coords
      .filter((coord) => coord.row === row)
      .map((coord) => coord.col)
      .sort((a, b) => a - b);

    maxRun = Math.max(maxRun, longestConsecutive(cols));
  }

  for (const { col } of coords) {
    const rows = coords
      .filter((coord) => coord.col === col)
      .map((coord) => coord.row)
      .sort((a, b) => a - b);

    maxRun = Math.max(maxRun, longestConsecutive(rows));
  }

  const ingredient = board[coords[0]!.row]?.[coords[0]!.col];
  if (!ingredient) {
    return maxRun;
  }

  return maxRun;
}

function longestConsecutive(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  let max = 1;
  let current = 1;

  for (let i = 1; i < values.length; i += 1) {
    if (values[i] === values[i - 1]! + 1) {
      current += 1;
      max = Math.max(max, current);
    } else if (values[i] !== values[i - 1]) {
      current = 1;
    }
  }

  return max;
}

function yieldForComponent(
  cells: Set<string>,
  board: Tile[][],
): number {
  if (isExactSquare2x2(cells)) {
    return 2;
  }

  if (maxStraightRunLength(cells, board) >= 4) {
    return 2;
  }

  return 1;
}

/** Computes pantry yield for the current matches on the board (before clearing). */
export function collectYieldsFromBoard(
  board: Tile[][],
): Array<{ ingredient: IngredientId; amount: number }> {
  const matched = findMatchedCells(board);
  if (matched.size === 0) {
    return [];
  }

  const components = connectedComponents(matched);

  return components.map(({ ingredient, cells }) => ({
    ingredient,
    amount: yieldForComponent(cells, board),
  }));
}
