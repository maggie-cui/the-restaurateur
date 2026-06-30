import type { IngredientId } from '../types';
import type { CustomerProgress } from '../types/game-state';
import type { Pantry } from '../inventory/pantry';
import { clonePantry } from '../inventory/pantry';

function cloneCustomers(customers: CustomerProgress[]): CustomerProgress[] {
  return customers.map((customer) => ({
    ...customer,
    lines: customer.lines.map((line) => ({ ...line })),
  }));
}

/**
 * Moves ingredients from the shared pantry into open order lines.
 * Customers are processed in list order; partial delivery is supported.
 */
export function fulfillOrders(
  pantry: Pantry,
  customers: CustomerProgress[],
): { pantry: Pantry; customers: CustomerProgress[] } {
  const nextPantry = clonePantry(pantry);
  const nextCustomers = cloneCustomers(customers);

  for (const customer of nextCustomers) {
    for (const line of customer.lines) {
      if (line.complete) {
        continue;
      }

      const remaining = line.required - line.delivered;
      const available = nextPantry[line.ingredient] ?? 0;
      const transfer = Math.min(remaining, available);

      if (transfer <= 0) {
        continue;
      }

      nextPantry[line.ingredient] -= transfer;
      line.delivered += transfer;

      if (line.delivered >= line.required) {
        line.complete = true;
      }
    }

    customer.served = customer.lines.every((line) => line.complete);
  }

  return { pantry: nextPantry, customers: nextCustomers };
}

export function countPantryIngredient(pantry: Pantry, ingredient: IngredientId): number {
  return pantry[ingredient] ?? 0;
}
