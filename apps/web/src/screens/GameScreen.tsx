import type { GameState } from '@restaurateur/game-engine';
import { OrderPanel } from '../components/OrderPanel';

type GameScreenProps = {
  state: GameState;
  onWin: () => void;
  onLose: () => void;
  onHome: () => void;
};

export function GameScreen({ state, onWin, onLose, onHome }: GameScreenProps) {
  return (
    <main className="screen game-screen">
      <OrderPanel customers={state.customers} />

      <div className="board-placeholder">
        <p>8 × 8 board (placeholder)</p>
        <p>
          {state.board.length} × {state.board[0]?.length ?? 0} grid
        </p>
      </div>

      <p className="moves">Moves remaining: {state.movesRemaining}</p>

      <div className="dev-buttons">
        <button type="button" onClick={onWin}>
          Mock Win
        </button>
        <button type="button" onClick={onLose}>
          Mock Lose
        </button>
        <button type="button" onClick={onHome}>
          Home
        </button>
      </div>
    </main>
  );
}
