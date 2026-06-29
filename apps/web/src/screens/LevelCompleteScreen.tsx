import type { GameState } from '@restaurateur/game-engine';
import { INGREDIENT_EMOJI, INGREDIENT_IDS } from '@restaurateur/game-engine';

type LevelCompleteScreenProps = {
  pantry: GameState['pantry'];
  onNext: () => void;
  onReplay: () => void;
};

export function LevelCompleteScreen({
  pantry,
  onNext,
  onReplay,
}: LevelCompleteScreenProps) {
  const collected = INGREDIENT_IDS.filter((id) => pantry[id] > 0);

  return (
    <main className="screen">
      <h1>Kitchen Complete! 🎉</h1>
      <p>Ingredients collected:</p>
      {collected.length === 0 ? (
        <p className="muted">None yet (mock state)</p>
      ) : (
        <ul className="summary-list">
          {collected.map((id) => (
            <li key={id}>
              {INGREDIENT_EMOJI[id]} {id}: {pantry[id]}
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
