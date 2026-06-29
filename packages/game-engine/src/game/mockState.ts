import { INGREDIENT_IDS } from '../types';
import type { GameState, LevelConfig } from '../types';

function emptyPantry(): GameState['pantry'] {
  return Object.fromEntries(INGREDIENT_IDS.map((id) => [id, 0])) as GameState['pantry'];
}

export function createMockGameState(level: LevelConfig): GameState {
  const size = level.boardSize;
  const board = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => INGREDIENT_IDS[0]),
  );

  const customers = level.customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    dish: customer.dish,
    served: false,
    lines: customer.requirements.map((requirement) => ({
      ingredient: requirement.ingredient,
      required: requirement.amount,
      delivered: 0,
      complete: false,
    })),
  }));

  return {
    phase: 'playing',
    levelId: level.id,
    board,
    pantry: emptyPantry(),
    customers,
    movesRemaining: level.moves,
  };
}
