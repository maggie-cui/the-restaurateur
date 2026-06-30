import { describe, it, expect } from 'vitest';
import { applyWinOrLoss, areAllOrdersComplete } from '../src/game/checkEndState';
import type { CustomerProgress, GameState } from '../src/types';
import { emptyPantry } from '../src/inventory/pantry';

const COMPLETE_CUSTOMER: CustomerProgress[] = [
  {
    id: 'maria',
    name: 'Maria',
    dish: 'Pizza',
    served: true,
    lines: [
      { ingredient: 'tomato', required: 5, delivered: 5, complete: true },
      { ingredient: 'cheese', required: 3, delivered: 3, complete: true },
    ],
  },
];

const INCOMPLETE_CUSTOMER: CustomerProgress[] = [
  {
    id: 'maria',
    name: 'Maria',
    dish: 'Pizza',
    served: false,
    lines: [
      { ingredient: 'tomato', required: 5, delivered: 3, complete: false },
      { ingredient: 'cheese', required: 3, delivered: 0, complete: false },
    ],
  },
];

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    levelId: 1,
    seed: 1009,
    board: [],
    pantry: emptyPantry(),
    customers: INCOMPLETE_CUSTOMER,
    movesRemaining: 10,
    movesTotal: 20,
    ...overrides,
  };
}

describe('areAllOrdersComplete', () => {
  it('returns true when every line is complete', () => {
    expect(areAllOrdersComplete(COMPLETE_CUSTOMER)).toBe(true);
  });

  it('returns false when any line is incomplete', () => {
    expect(areAllOrdersComplete(INCOMPLETE_CUSTOMER)).toBe(false);
  });
});

describe('applyWinOrLoss', () => {
  it('marks the level won when all orders are complete', () => {
    const result = applyWinOrLoss(
      baseState({ customers: COMPLETE_CUSTOMER, movesRemaining: 5 }),
    );

    expect(result.phase).toBe('won');
  });

  it('marks the level lost when moves reach zero with open orders', () => {
    const result = applyWinOrLoss(baseState({ movesRemaining: 0 }));

    expect(result.phase).toBe('lost');
  });

  it('prefers win over loss when the final move completes all orders', () => {
    const result = applyWinOrLoss(
      baseState({ customers: COMPLETE_CUSTOMER, movesRemaining: 0 }),
    );

    expect(result.phase).toBe('won');
  });

  it('stays playing while orders are open and moves remain', () => {
    const result = applyWinOrLoss(baseState({ movesRemaining: 4 }));

    expect(result.phase).toBe('playing');
  });
});
