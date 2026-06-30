import type { GameState } from '../types';
import { areAdjacent, cloneBoard, type Coord } from '../board/coords';
import { swapCells } from '../board/createBoard';
import { hasMatches, resolveBoard } from '../board/gravity';
import { addToPantry } from '../inventory/pantry';
import { fulfillOrders } from '../orders/fulfillOrders';
import { createSeededRng } from '../rng/seededRng';
import { applyWinOrLoss } from './checkEndState';

export type SwapResult =
  | { ok: true; state: GameState; reason: 'matched' }
  | { ok: false; state: GameState; reason: 'not_adjacent' | 'not_playing' | 'no_moves' | 'no_match' };

function nextRngSeed(state: GameState): number {
  return state.seed + state.levelId * 1000 + state.movesRemaining * 17;
}

export function trySwap(state: GameState, from: Coord, to: Coord): SwapResult {
  if (state.phase !== 'playing') {
    return { ok: false, state, reason: 'not_playing' };
  }

  if (state.movesRemaining <= 0) {
    return { ok: false, state, reason: 'no_moves' };
  }

  if (!areAdjacent(from, to)) {
    return { ok: false, state, reason: 'not_adjacent' };
  }

  const board = cloneBoard(state.board);
  swapCells(board, from, to);

  if (!hasMatches(board)) {
    return { ok: false, state, reason: 'no_match' };
  }

  const rng = createSeededRng(nextRngSeed(state));
  const pantryDelta = resolveBoard(board, rng);
  const pantryAfterCollection = addToPantry(state.pantry, pantryDelta);
  const { pantry, customers } = fulfillOrders(pantryAfterCollection, state.customers);

  let nextState: GameState = {
    ...state,
    board,
    pantry,
    customers,
    movesRemaining: state.movesRemaining - 1,
  };

  nextState = applyWinOrLoss(nextState);

  return { ok: true, state: nextState, reason: 'matched' };
}
