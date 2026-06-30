import type { IngredientId } from './ingredient';

export type GamePhase = 'playing' | 'won' | 'lost';

export type Tile = IngredientId | null;

export interface OrderLineProgress {
  ingredient: IngredientId;
  required: number;
  delivered: number;
  complete: boolean;
}

export interface CustomerProgress {
  id: string;
  name: string;
  dish: string;
  lines: OrderLineProgress[];
  served: boolean;
}

export interface GameState {
  phase: GamePhase;
  levelId: number;
  /** Seed for deterministic board refills during a level. */
  seed: number;
  board: Tile[][];
  pantry: Record<IngredientId, number>;
  customers: CustomerProgress[];
  movesRemaining: number;
  /** Starting move limit for this level (used on end screens). */
  movesTotal: number;
}
