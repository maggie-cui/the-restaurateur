import type { IngredientId } from './ingredient';

export interface Requirement {
  ingredient: IngredientId;
  amount: number;
}

export interface CustomerConfig {
  id: string;
  name: string;
  dish: string;
  requirements: Requirement[];
}

export interface LevelConfig {
  id: number;
  moves: number;
  boardSize: number;
  customers: CustomerConfig[];
}
