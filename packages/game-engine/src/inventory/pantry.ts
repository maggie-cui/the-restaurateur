import type { IngredientId } from '../types';
import { INGREDIENT_IDS } from '../types';

export type Pantry = Record<IngredientId, number>;

export function emptyPantry(): Pantry {
  return Object.fromEntries(INGREDIENT_IDS.map((id) => [id, 0])) as Pantry;
}

export function clonePantry(pantry: Pantry): Pantry {
  return { ...pantry };
}

export function addToPantry(pantry: Pantry, delta: Pantry): Pantry {
  const next = clonePantry(pantry);

  for (const id of INGREDIENT_IDS) {
    next[id] += delta[id] ?? 0;
  }

  return next;
}

export function pantryDeltaFromYields(
  yields: Iterable<{ ingredient: IngredientId; amount: number }>,
): Pantry {
  const delta = emptyPantry();

  for (const { ingredient, amount } of yields) {
    delta[ingredient] += amount;
  }

  return delta;
}
