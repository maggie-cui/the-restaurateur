import { describe, it, expect } from 'vitest';
import {
  getDeliveredTotals,
  getIncompleteLines,
  countServedCustomers,
  formatIngredientName,
} from '../src/orders/orderSummary';
import type { CustomerProgress } from '../src/types';

const CUSTOMERS: CustomerProgress[] = [
  {
    id: 'maria',
    name: 'Maria',
    dish: 'Pizza',
    served: false,
    lines: [
      { ingredient: 'tomato', required: 5, delivered: 5, complete: true },
      { ingredient: 'cheese', required: 3, delivered: 1, complete: false },
    ],
  },
];

describe('orderSummary', () => {
  it('summarizes delivered ingredient totals', () => {
    expect(getDeliveredTotals(CUSTOMERS)).toEqual([
      { ingredient: 'tomato', amount: 5 },
      { ingredient: 'cheese', amount: 1 },
    ]);
  });

  it('lists incomplete order lines', () => {
    expect(getIncompleteLines(CUSTOMERS)).toEqual([
      {
        customerName: 'Maria',
        dish: 'Pizza',
        ingredient: 'cheese',
        delivered: 1,
        required: 3,
      },
    ]);
  });

  it('formats ingredient ids for display', () => {
    expect(formatIngredientName('black_olive')).toBe('black olive');
  });

  it('counts served customers', () => {
    expect(countServedCustomers(CUSTOMERS)).toBe(0);

    const served = [{ ...CUSTOMERS[0]!, served: true, lines: CUSTOMERS[0]!.lines.map((line) => ({ ...line, complete: true, delivered: line.required })) }];
    expect(countServedCustomers(served)).toBe(1);
  });
});
