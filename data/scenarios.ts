export type Scenario = {
  id: "current" | "optimized" | "aggressive";
  label: string;
  description: string;
  residualUnits: number;
  markdownExposureUSD: number; // dollars
  co2Kg: number;
};

// "current" baseline; "optimized" is ~38% better residual, $510K less markdown,
// 12% less CO₂. "aggressive" worse on residual but cheaper short term.
const CURRENT_RESIDUAL = 184_000;
const CURRENT_MARKDOWN = 4_200_000;
const CURRENT_CO2 = 96_400;

export const scenarios: Record<Scenario["id"], Scenario> = {
  current: {
    id: "current",
    label: "Current Plan",
    description: "Locked merchandising plan — uses last-cycle assumptions.",
    residualUnits: CURRENT_RESIDUAL,
    markdownExposureUSD: CURRENT_MARKDOWN,
    co2Kg: CURRENT_CO2,
  },
  optimized: {
    id: "optimized",
    label: "AI-Optimized",
    description: "Trend-aware reorder + capacity-aware allocation.",
    residualUnits: Math.round(CURRENT_RESIDUAL * (1 - 0.38)),
    markdownExposureUSD: CURRENT_MARKDOWN - 510_000,
    co2Kg: Math.round(CURRENT_CO2 * (1 - 0.12)),
  },
  aggressive: {
    id: "aggressive",
    label: "Aggressive Buy",
    description: "Larger upfront buys to chase trend; cheap factories.",
    residualUnits: Math.round(CURRENT_RESIDUAL * 1.18),
    markdownExposureUSD: CURRENT_MARKDOWN - 180_000,
    co2Kg: Math.round(CURRENT_CO2 * 1.04),
  },
};

export const scenarioOrder: Scenario["id"][] = ["current", "optimized", "aggressive"];
