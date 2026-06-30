import type { LevelConfig, GameState } from '../types';
import { createBoard } from '../board/createBoard';
import { createSeededRng } from '../rng/seededRng';
import { emptyPantry } from '../inventory/pantry';

function buildCustomers(level: LevelConfig): GameState['customers'] {
  return level.customers.map((customer) => ({
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
}

export function createGame(level: LevelConfig, seed = level.id * 1009): GameState {
  const rng = createSeededRng(seed);

  return {
    phase: 'playing',
    levelId: level.id,
    seed,
    board: createBoard(level.boardSize, rng),
    pantry: emptyPantry(),
    customers: buildCustomers(level),
    movesRemaining: level.moves,
    movesTotal: level.moves,
  };
}
