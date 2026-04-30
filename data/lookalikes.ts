import { Style, StyleAttributes, styles } from "./styles";

export type LookalikeMatch = {
  styleId: string;
  similarity: number; // 0–1
  drivingAttributes: string[];
};

// Build a sparse one-hot vector for an attribute set across the universe of
// distinct values seen in the seed catalog.
const ATTR_KEYS: (keyof StyleAttributes)[] = [
  "silhouette",
  "color",
  "print",
  "fabric",
  "priceBand",
];

function buildVocab() {
  const vocab: Record<string, string[]> = {};
  for (const k of ATTR_KEYS) vocab[k] = [];
  for (const k of ATTR_KEYS) {
    const seen = new Set<string>();
    for (const s of styles) {
      const v = s.attributes[k];
      if (!seen.has(v)) {
        seen.add(v);
        vocab[k].push(v);
      }
    }
  }
  return vocab;
}

const VOCAB = buildVocab();

// Per-attribute weight to bias which dimensions matter most for "lookalike".
const WEIGHT: Record<keyof StyleAttributes, number> = {
  silhouette: 1.4,
  color: 0.8,
  print: 0.9,
  fabric: 1.2,
  priceBand: 0.6,
};

function vectorize(attrs: Partial<StyleAttributes> & { category?: string }) {
  const vec: number[] = [];
  for (const k of ATTR_KEYS) {
    const v = attrs[k];
    for (const term of VOCAB[k]) {
      vec.push(v && v === term ? WEIGHT[k] : 0);
    }
  }
  return vec;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function drivers(
  query: Partial<StyleAttributes>,
  candidate: Style,
): string[] {
  const out: string[] = [];
  for (const k of ATTR_KEYS) {
    if (query[k] && query[k] === candidate.attributes[k]) {
      out.push(`${k}: ${candidate.attributes[k]}`);
    }
  }
  return out;
}

export type LookalikeQuery = Partial<StyleAttributes> & {
  category?: string;
  excludeStyleId?: string;
};

export function findLookalikes(query: LookalikeQuery): LookalikeMatch[] {
  const queryVec = vectorize(query);
  const pool = query.category
    ? styles.filter((s) => s.category === query.category)
    : styles;
  const filtered = query.excludeStyleId
    ? pool.filter((s) => s.id !== query.excludeStyleId)
    : pool;

  const ranked = filtered
    .map((s) => ({
      styleId: s.id,
      similarity: cosine(queryVec, vectorize(s.attributes)),
      drivingAttributes: drivers(query, s),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  // If category filter starves the pool below 3, fall back to global pool.
  if (ranked.length < 3) {
    const globalQ: LookalikeQuery = { ...query, category: undefined };
    return findLookalikes(globalQ);
  }
  return ranked;
}
