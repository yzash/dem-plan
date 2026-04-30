// Deterministic procedurally-generated style catalog.
// 40 styles, 6 categories, with seasonal sell-through curves and
// pre-computed forecast bands & recommended actions.

export type Region = "IN" | "AE" | "SG" | "UK";

export type RecommendedActionType =
  | "REORDER"
  | "HOLD"
  | "MARKDOWN"
  | "PULL_FORWARD"
  | "INVESTIGATE";

export type StyleAttributes = {
  silhouette: string;
  color: string;
  print: string;
  fabric: string;
  priceBand: "value" | "mid" | "premium";
};

export type Style = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  attributes: StyleAttributes;
  priceUSD: number;
  image: string;
  regions: Region[];
  onHand: Record<string, number>;
  weeklySales52: number[];
  trendScore: number;
  forecast4w: { p10: number[]; p50: number[]; p90: number[] };
  recommendedAction: {
    type: RecommendedActionType;
    qty?: number;
    rationale: string[];
  };
  topSignals: { name: string; impact: number }[];
};

// Mulberry32 — seedable PRNG
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const CATEGORIES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Knitwear",
  "Activewear",
] as const;

const SUBCATEGORY: Record<string, string[]> = {
  Tops: ["T-Shirt", "Blouse", "Crop Top", "Tank"],
  Bottoms: ["Jean", "Trouser", "Skirt", "Short"],
  Dresses: ["Mini", "Midi", "Maxi", "Slip"],
  Outerwear: ["Trench", "Bomber", "Puffer", "Blazer"],
  Knitwear: ["Cardigan", "Pullover", "Vest", "Hoodie"],
  Activewear: ["Legging", "Bra Top", "Track", "Tee"],
};

const SILHOUETTES = [
  "oversized",
  "fitted",
  "relaxed",
  "cropped",
  "longline",
  "tailored",
  "boxy",
];

const COLORS = [
  "sage",
  "ecru",
  "indigo",
  "obsidian",
  "rust",
  "blush",
  "ivory",
  "olive",
  "lilac",
  "navy",
];

const PRINTS = ["solid", "stripe", "floral", "tile", "abstract", "marble"];

const FABRICS = [
  "cotton",
  "linen",
  "denim",
  "wool blend",
  "fleece",
  "ribbed knit",
  "twill",
  "modal",
];

const NAME_PREFIX: Record<string, string[]> = {
  Tops: ["Aurora", "Marlow", "Suri", "Kite", "Florence", "Linen"],
  Bottoms: ["Hawthorn", "River", "Coast", "Hudson", "Maple", "Ridge"],
  Dresses: ["Indra", "Mira", "Velvet", "Lila", "Selene", "Iris"],
  Outerwear: ["Storm", "Rover", "Atlas", "Beacon", "Anchor", "North"],
  Knitwear: ["Frost", "Ember", "Cable", "Lodge", "Wisp", "Cove"],
  Activewear: ["Pulse", "Stride", "Aero", "Trail", "Drift", "Crest"],
};

const REGIONS: Region[] = ["IN", "AE", "SG", "UK"];

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function priceBandFor(price: number): StyleAttributes["priceBand"] {
  if (price < 40) return "value";
  if (price < 90) return "mid";
  return "premium";
}

// Approx 8 styles get REORDER (indexes guaranteed by id seeding); the rest
// distribute across HOLD / MARKDOWN / PULL_FORWARD / INVESTIGATE.
const FORCED_REORDER_INDEXES = new Set([0, 3, 7, 11, 14, 18, 22, 27]);

function buildSales52(seed: number, baseline: number): number[] {
  const rng = mulberry32(seed);
  const phase = rng() * Math.PI * 2;
  const seasonAmp = 0.35 + rng() * 0.4;
  const trend = (rng() - 0.4) * 0.6;
  const out: number[] = [];
  for (let w = 0; w < 52; w++) {
    const seasonal = 1 + seasonAmp * Math.sin((w / 52) * Math.PI * 2 + phase);
    const trendComp = 1 + (w / 52) * trend;
    const noise = 1 + (rng() - 0.5) * 0.18;
    const v = baseline * seasonal * trendComp * noise;
    out.push(Math.max(2, Math.round(v)));
  }
  return out;
}

function makeForecast(sales52: number[], rng: () => number, momentum: number) {
  const last4 = sales52.slice(-4);
  const avg = last4.reduce((a, b) => a + b, 0) / 4;
  const p50: number[] = [];
  const p10: number[] = [];
  const p90: number[] = [];
  for (let w = 0; w < 4; w++) {
    const m = avg * (1 + momentum * (w + 1) * 0.04) * (1 + (rng() - 0.5) * 0.05);
    const center = Math.max(3, Math.round(m));
    const spread = Math.max(2, Math.round(center * 0.18));
    p50.push(center);
    p10.push(Math.max(1, center - spread));
    p90.push(center + spread);
  }
  return { p10, p50, p90 };
}

function actionFor(
  i: number,
  category: string,
  trendScore: number,
  weeksOfCover: number,
  rng: () => number,
): Style["recommendedAction"] {
  if (FORCED_REORDER_INDEXES.has(i)) {
    const qty = Math.round((800 + rng() * 1600) / 50) * 50;
    return {
      type: "REORDER",
      qty,
      rationale: [
        `Trend score ${trendScore} sits in top quartile across ${category}`,
        `Weeks of cover ${weeksOfCover.toFixed(1)} below safety threshold of 3.0`,
        "Lookalike cohorts converted +18% sell-through last 4 weeks",
      ],
    };
  }
  if (trendScore >= 70 && weeksOfCover < 4) {
    const qty = Math.round((600 + rng() * 1200) / 50) * 50;
    return {
      type: "REORDER",
      qty,
      rationale: [
        `Trend score ${trendScore} accelerating week-over-week`,
        `On-hand cover ${weeksOfCover.toFixed(1)}w under 4w guardrail`,
        "Social velocity outpacing assortment",
      ],
    };
  }
  if (trendScore < 35 && weeksOfCover > 8) {
    return {
      type: "MARKDOWN",
      qty: Math.round((300 + rng() * 700) / 50) * 50,
      rationale: [
        `Trend score ${trendScore} bottom decile`,
        `${weeksOfCover.toFixed(1)} weeks of cover — markdown to clear`,
        "Forecast P50 trending below cost recovery",
      ],
    };
  }
  if (trendScore >= 60 && weeksOfCover < 2.5) {
    return {
      type: "PULL_FORWARD",
      qty: Math.round((400 + rng() * 800) / 50) * 50,
      rationale: [
        "Demand pulled forward by 2 weeks vs plan",
        "Pre-book replenishment at top capacity factory",
        `Trend score ${trendScore} stable in top tercile`,
      ],
    };
  }
  if (weeksOfCover < 1.5) {
    return {
      type: "INVESTIGATE",
      rationale: [
        "Sell-through volatile vs forecast band",
        "Region split skew exceeds 35% — likely localized",
        "Recommend manual review before reorder",
      ],
    };
  }
  return {
    type: "HOLD",
    rationale: [
      "Forecast within P10–P90 band",
      `Cover ${weeksOfCover.toFixed(1)}w within 3–6w corridor`,
      "No external signal acceleration",
    ],
  };
}

function buildStyle(i: number): Style {
  const id = `ST-${1001 + i}`;
  const seed = hashSeed(id);
  const rng = mulberry32(seed);
  const category = CATEGORIES[i % CATEGORIES.length];
  const subcategory = pick(SUBCATEGORY[category], rng);
  const silhouette = pick(SILHOUETTES, rng);
  const color = pick(COLORS, rng);
  const print = pick(PRINTS, rng);
  const fabric = pick(FABRICS, rng);
  const priceUSD = Math.round(19 + rng() * 130);
  const priceBand = priceBandFor(priceUSD);
  const namePrefix = pick(NAME_PREFIX[category], rng);
  const name = `${namePrefix} ${silhouette[0].toUpperCase() + silhouette.slice(1)} ${subcategory}`;

  const regionCount = 2 + Math.floor(rng() * 3); // 2–4 regions
  const regions: Region[] = [];
  const pool = [...REGIONS];
  for (let r = 0; r < regionCount; r++) {
    const idx = Math.floor(rng() * pool.length);
    regions.push(pool.splice(idx, 1)[0]);
  }

  const onHand: Record<string, number> = {};
  for (const r of regions) {
    onHand[r] = Math.round(40 + rng() * 1200);
  }

  const baselineWeekly = 30 + rng() * 220;
  const weeklySales52 = buildSales52(seed, baselineWeekly);

  const trendScore = Math.max(1, Math.min(99, Math.round(rng() * 100)));
  const momentum =
    trendScore > 70 ? 0.4 + rng() * 0.3 : trendScore < 30 ? -0.2 - rng() * 0.3 : (rng() - 0.5) * 0.2;
  const forecast4w = makeForecast(weeklySales52, rng, momentum);

  const totalOnHand = Object.values(onHand).reduce((a, b) => a + b, 0);
  const avgWeeklyP50 = forecast4w.p50.reduce((a, b) => a + b, 0) / 4;
  const weeksOfCover = totalOnHand / Math.max(1, avgWeeklyP50);

  const recommendedAction = actionFor(i, category, trendScore, weeksOfCover, rng);

  // Top signals — three salient drivers
  const igImpact =
    trendScore > 60 ? Math.round(15 + rng() * 18) : -Math.round(2 + rng() * 12);
  const weatherImpact = Math.round((rng() - 0.4) * 22);
  const elasticityImpact = -Math.round(1 + rng() * 8);
  const topSignals = [
    { name: "Instagram Hashtag Velocity", impact: igImpact },
    { name: "Weather (Heat/Rain Index)", impact: weatherImpact },
    { name: "Price Elasticity", impact: elasticityImpact },
  ];

  return {
    id,
    name,
    category,
    subcategory,
    attributes: { silhouette, color, print, fabric, priceBand },
    priceUSD,
    image: `https://picsum.photos/seed/${id}/300/400`,
    regions,
    onHand,
    weeklySales52,
    trendScore,
    forecast4w,
    recommendedAction,
    topSignals,
  };
}

export const styles: Style[] = Array.from({ length: 40 }, (_, i) => buildStyle(i));

export function styleById(id: string): Style | undefined {
  return styles.find((s) => s.id === id);
}
