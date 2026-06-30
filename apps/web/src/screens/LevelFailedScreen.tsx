import type { GameState } from '@restaurateur/game-engine';
import {
  INGREDIENT_EMOJI,
  getIncompleteLines,
  formatIngredientName,
} from '@restaurateur/game-engine';

type LevelFailedScreenProps = {
  state: GameState;
  onRetry: () => void;
  onHome: () => void;
};

export function LevelFailedScreen({ state, onRetry, onHome }: LevelFailedScreenProps) {
  const remaining = getIncompleteLines(state.customers);

  return (
    <main className="screen">
      <h1>Order incomplete!</h1>
      <p className="level-label">Level {state.levelId}</p>
      <p>You ran out of moves before every customer was served.</p>

      {remaining.length > 0 ? (
        <>
          <p>Still needed:</p>
          <ul className="summary-list">
            {remaining.map((line) => (
              <li key={`${line.customerName}-${line.ingredient}`}>
                {line.customerName} ({line.dish}): {INGREDIENT_EMOJI[line.ingredient]}{' '}
                {formatIngredientName(line.ingredient)} {line.delivered}/{line.required}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <button type="button" onClick={onRetry}>
        Retry
      </button>
      <button type="button" onClick={onHome}>
        Home
      </button>
    </main>
  );
}
