export const INGREDIENT_IDS = [
  'tomato',
  'cheese',
  'mushroom',
  'basil',
  'pepperoni',
  'black_olive',
] as const;

export type IngredientId = (typeof INGREDIENT_IDS)[number];

export const INGREDIENT_EMOJI: Record<IngredientId, string> = {
  tomato: '🍅',
  cheese: '🧀',
  mushroom: '🍄',
  basil: '🌿',
  pepperoni: '🍕',
  black_olive: '🫒',
};
