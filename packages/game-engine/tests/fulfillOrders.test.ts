import { describe, it, expect } from 'vitest';
import { fulfillOrders } from '../src/orders/fulfillOrders';
import { emptyPantry } from '../src/inventory/pantry';
import type { CustomerProgress } from '../src/types';

const MARIA_ORDER: CustomerProgress[] = [
  {
    id: 'maria',
    name: 'Maria',
    dish: 'Pizza',
    served: false,
    lines: [
      { ingredient: 'tomato', required: 5, delivered: 0, complete: false },
      { ingredient: 'cheese', required: 3, delivered: 0, complete: false },
    ],
  },
];

describe('fulfillOrders', () => {
  it('delivers partial progress from the pantry', () => {
    const pantry = emptyPantry();
    pantry.tomato = 2;

    const result = fulfillOrders(pantry, MARIA_ORDER);

    expect(result.customers[0]?.lines[0]?.delivered).toBe(2);
    expect(result.customers[0]?.lines[0]?.complete).toBe(false);
    expect(result.pantry.tomato).toBe(0);
  });

  it('marks a line complete and deducts the pantry when enough is collected', () => {
    const pantry = emptyPantry();
    pantry.tomato = 5;
    pantry.cheese = 1;

    const result = fulfillOrders(pantry, MARIA_ORDER);

    expect(result.customers[0]?.lines[0]).toMatchObject({
      delivered: 5,
      complete: true,
    });
    expect(result.customers[0]?.lines[1]).toMatchObject({
      delivered: 1,
      complete: false,
    });
    expect(result.pantry.tomato).toBe(0);
    expect(result.pantry.cheese).toBe(0);
    expect(result.customers[0]?.served).toBe(false);
  });

  it('marks the customer served when all lines are complete', () => {
    const pantry = emptyPantry();
    pantry.tomato = 5;
    pantry.cheese = 3;

    const result = fulfillOrders(pantry, MARIA_ORDER);

    expect(result.customers[0]?.served).toBe(true);
    expect(result.customers[0]?.lines.every((line) => line.complete)).toBe(true);
  });
});
