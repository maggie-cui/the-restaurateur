/** Mulberry32 — fast seeded PRNG for reproducible boards. */
export function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickIngredient<T extends readonly string[]>(
  ids: T,
  rng: () => number,
): T[number] {
  const index = Math.floor(rng() * ids.length);
  return ids[index]!;
}
