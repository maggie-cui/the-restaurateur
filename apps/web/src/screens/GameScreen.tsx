import { useState } from 'react';
import type { GameState, Coord } from '@restaurateur/game-engine';
import { trySwap } from '@restaurateur/game-engine';
import { OrderPanel } from '../components/OrderPanel';
import { BoardCanvas } from '../components/BoardCanvas';

type GameScreenProps = {
  state: GameState;
  onStateChange: (state: GameState) => void;
  onWin: () => void;
  onLose: () => void;
  onHome: () => void;
};

export function GameScreen({
  state,
  onStateChange,
  onWin,
  onLose,
  onHome,
}: GameScreenProps) {
  const [message, setMessage] = useState<string | null>(null);

  const handleSwap = (from: Coord, to: Coord) => {
    if (state.phase !== 'playing') {
      return;
    }

    const result = trySwap(state, from, to);

    if (!result.ok) {
      if (result.reason === 'no_match') {
        setMessage('No match — try another swap');
      }
      return;
    }

    setMessage(null);
    onStateChange(result.state);

    if (result.state.phase === 'won') {
      onWin();
      return;
    }

    if (result.state.phase === 'lost') {
      onLose();
    }
  };

  return (
    <main className="screen game-screen">
      <div className="game-header">
        <button type="button" className="text-button" onClick={onHome}>
          ← Home
        </button>
        <p className="level-label">Level {state.levelId}</p>
      </div>

      <OrderPanel customers={state.customers} />

      <BoardCanvas board={state.board} onSwap={handleSwap} />

      {message ? <p className="game-message">{message}</p> : null}

      <p className="moves">Moves remaining: {state.movesRemaining}</p>
    </main>
  );
}
