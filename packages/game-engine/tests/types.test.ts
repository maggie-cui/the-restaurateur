import { describe, it, expect } from 'vitest';
import { INGREDIENT_IDS } from '../src/types';
import { createMockGameState } from '../src/game/mockState';
import type { LevelConfig } from '../src/types';

const LEVEL_1: LevelConfig = {
  id: 1,
  moves: 20,
  boardSize: 8,
  customers: [
    {
      id: 'maria',
      name: 'Maria',
      dish: 'Pizza',
      requirements: [
        { ingredient: 'tomato', amount: 5 },
        { ingredient: 'cheese', amount: 3 },
      ],
    },
  ],
};

describe('ingredients', () => {
  it('has six pizza ingredients', () => {
    expect(INGREDIENT_IDS).toHaveLength(6);
  });
});

describe('createMockGameState', () => {
  it('builds state from level config', () => {
    const state = createMockGameState(LEVEL_1);

    expect(state.levelId).toBe(1);
    expect(state.movesRemaining).toBe(20);
    expect(state.board).toHaveLength(8);
    expect(state.customers[0]?.name).toBe('Maria');
    expect(state.customers[0]?.lines[0]).toMatchObject({
      ingredient: 'tomato',
      required: 5,
      delivered: 0,
      complete: false,
    });
  });
});
