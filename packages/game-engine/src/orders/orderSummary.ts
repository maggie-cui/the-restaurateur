import type { IngredientId } from '../types';
import { INGREDIENT_IDS } from '../types';
import type { CustomerProgress } from '../types/game-state';

export interface IngredientSummary {
  ingredient: IngredientId;
  amount: number;
}

export interface IncompleteLine {
  customerName: string;
  dish: string;
  ingredient: IngredientId;
  delivered: number;
  required: number;
}

export function getDeliveredTotals(customers: CustomerProgress[]): IngredientSummary[] {
  const totals = emptyTotals();

  for (const customer of customers) {
    for (const line of customer.lines) {
      if (line.delivered > 0) {
        totals[line.ingredient] += line.delivered;
      }
    }
  }

  return toSummaryList(totals);
}

export function getIncompleteLines(customers: CustomerProgress[]): IncompleteLine[] {
  const incomplete: IncompleteLine[] = [];

  for (const customer of customers) {
    for (const line of customer.lines) {
      if (line.complete) {
        continue;
      }

      incomplete.push({
        customerName: customer.name,
        dish: customer.dish,
        ingredient: line.ingredient,
        delivered: line.delivered,
        required: line.required,
      });
    }
  }

  return incomplete;
}

export function countServedCustomers(customers: CustomerProgress[]): number {
  return customers.filter((customer) => customer.served).length;
}

function emptyTotals(): Record<IngredientId, number> {
  return Object.fromEntries(INGREDIENT_IDS.map((id) => [id, 0])) as Record<IngredientId, number>;
}

function toSummaryList(totals: Record<IngredientId, number>): IngredientSummary[] {
  return INGREDIENT_IDS.filter((id) => totals[id] > 0).map((ingredient) => ({
    ingredient,
    amount: totals[ingredient],
  }));
}

export function formatIngredientName(ingredient: IngredientId): string {
  return ingredient.replace(/_/g, ' ');
}
