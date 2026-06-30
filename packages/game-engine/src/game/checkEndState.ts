import type { CustomerProgress, GameState } from '../types';

export function areAllOrdersComplete(customers: CustomerProgress[]): boolean {
  return customers.every((customer) => customer.lines.every((line) => line.complete));
}

export function applyWinOrLoss(state: GameState): GameState {
  if (areAllOrdersComplete(state.customers)) {
    return { ...state, phase: 'won' };
  }

  if (state.movesRemaining <= 0) {
    return { ...state, phase: 'lost' };
  }

  return state;
}
