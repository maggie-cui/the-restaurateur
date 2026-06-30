import { useCallback, useEffect, useRef, useState } from 'react';
import type { Coord, Tile } from '@restaurateur/game-engine';
import { INGREDIENT_EMOJI } from '@restaurateur/game-engine';

const TILE_COLORS: Record<string, string> = {
  tomato: '#e74c3c',
  cheese: '#f1c40f',
  mushroom: '#c39bd3',
  basil: '#2ecc71',
  pepperoni: '#e67e22',
  black_olive: '#34495e',
};

type BoardCanvasProps = {
  board: Tile[][];
  onSwap: (from: Coord, to: Coord) => void;
};

export function BoardCanvas({ board, onSwap }: BoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<Coord | null>(null);
  const size = board.length;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const cellSize = canvas.width / size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const x = col * cellSize;
        const y = row * cellSize;
        const tile = board[row]?.[col];
        const isSelected = selected?.row === row && selected?.col === col;

        ctx.fillStyle = isSelected ? '#0f3460' : '#16213e';
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

        if (tile) {
          ctx.fillStyle = TILE_COLORS[tile] ?? '#555';
          ctx.beginPath();
          ctx.roundRect(
            x + cellSize * 0.12,
            y + cellSize * 0.12,
            cellSize * 0.76,
            cellSize * 0.76,
            8,
          );
          ctx.fill();

          ctx.font = `${cellSize * 0.45}px system-ui`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            INGREDIENT_EMOJI[tile],
            x + cellSize / 2,
            y + cellSize / 2 + 2,
          );
        }
      }
    }
  }, [board, selected, size]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const cellSize = canvas.width / size;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row < 0 || col < 0 || row >= size || col >= size) {
      return;
    }

    const clicked: Coord = { row, col };

    if (!selected) {
      setSelected(clicked);
      return;
    }

    if (selected.row === clicked.row && selected.col === clicked.col) {
      setSelected(null);
      return;
    }

    onSwap(selected, clicked);
    setSelected(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="game-board"
      width={400}
      height={400}
      onClick={handleClick}
      aria-label="Ingredient match board"
    />
  );
}
