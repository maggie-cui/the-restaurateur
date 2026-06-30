import { INGREDIENT_IDS } from '../types';
import type { GameState, LevelConfig } from '../types';
import { emptyPantry } from '../inventory/pantry';

function emptyPantryState(): GameState['pantry'] {
  return emptyPantry();
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
    seed: level.id * 1009,
    board,
    pantry: emptyPantryState(),
    customers,
    movesRemaining: level.moves,
    movesTotal: level.moves,
  };
}
