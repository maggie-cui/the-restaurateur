import type { GameState } from '@restaurateur/game-engine';
import {
  INGREDIENT_EMOJI,
  getDeliveredTotals,
  countServedCustomers,
  formatIngredientName,
} from '@restaurateur/game-engine';

type LevelCompleteScreenProps = {
  state: GameState;
  onNext: () => void;
  onReplay: () => void;
};

export function LevelCompleteScreen({
  state,
  onNext,
  onReplay,
}: LevelCompleteScreenProps) {
  const delivered = getDeliveredTotals(state.customers);
  const movesUsed = state.movesTotal - state.movesRemaining;

  return (
    <main className="screen">
      <h1>Kitchen Complete! 🎉</h1>
      <p className="level-label">Level {state.levelId}</p>
      <p>
        {countServedCustomers(state.customers)} customer(s) served with {movesUsed} move
        {movesUsed === 1 ? '' : 's'} used
        {state.movesRemaining > 0 ? ` (${state.movesRemaining} remaining)` : ''}.
      </p>

      <p>Ingredients delivered:</p>
      {delivered.length === 0 ? (
        <p className="muted">No ingredients delivered.</p>
      ) : (
        <ul className="summary-list">
          {delivered.map(({ ingredient, amount }) => (
            <li key={ingredient}>
              {INGREDIENT_EMOJI[ingredient]} {formatIngredientName(ingredient)}: {amount}
            </li>
          ))}
        </ul>
      )}

      <button type="button" onClick={onNext}>
        Next Level
      </button>
      <button type="button" onClick={onReplay}>
        Replay
      </button>
    </main>
  );
}
