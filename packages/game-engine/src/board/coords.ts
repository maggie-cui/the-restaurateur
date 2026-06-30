export interface Coord {
  row: number;
  col: number;
}

export function coordKey(coord: Coord): string {
  return `${coord.row},${coord.col}`;
}

export function areAdjacent(a: Coord, b: Coord): boolean {
  const rowDelta = Math.abs(a.row - b.row);
  const colDelta = Math.abs(a.col - b.col);
  return (rowDelta === 1 && colDelta === 0) || (rowDelta === 0 && colDelta === 1);
}

export function cloneBoard<T>(board: T[][]): T[][] {
  return board.map((row) => [...row]);
}
