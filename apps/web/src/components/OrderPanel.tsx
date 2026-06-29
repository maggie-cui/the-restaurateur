import type { CustomerProgress } from '@restaurateur/game-engine';
import { INGREDIENT_EMOJI } from '@restaurateur/game-engine';

type OrderPanelProps = {
  customers: CustomerProgress[];
};

export function OrderPanel({ customers }: OrderPanelProps) {
  return (
    <section className="order-panel">
      {customers.map((customer) => (
        <div key={customer.id} className="customer-order">
          <h2>
            {customer.name} — {customer.dish}
          </h2>
          <ul>
            {customer.lines.map((line) => (
              <li key={line.ingredient}>
                {INGREDIENT_EMOJI[line.ingredient]} {line.ingredient}{' '}
                {line.delivered}/{line.required} {line.complete ? '✅' : ''}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
