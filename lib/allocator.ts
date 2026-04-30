import { Factory, factories } from "@/data/factories";
import { Style } from "@/data/styles";

export type AllocationScore = {
  factory: Factory;
  score: number;
  components: {
    capacityAvailable: number;
    leadTimeFit: number;
    costRank: number;
    sustainabilityRank: number;
  };
};

export type AllocationResult = {
  chosen: AllocationScore;
  alternatives: AllocationScore[];
  rationale: string[];
};

function scoreFactoryFor(style: Style, factory: Factory): AllocationScore {
  const capacityAvailable = 1 - factory.currentUtilization;
  const leadTimeFit = 1 - factory.leadTimeDays / 40;
  const costRank = 1 - factory.costIndex / 1.2;
  const sustainabilityRank = factory.sustainabilityScore / 100;
  const score =
    0.4 * capacityAvailable +
    0.3 * leadTimeFit +
    0.2 * costRank +
    0.1 * sustainabilityRank;
  return {
    factory,
    score,
    components: {
      capacityAvailable,
      leadTimeFit,
      costRank,
      sustainabilityRank,
    },
  };
}

export function allocateForStyle(style: Style): AllocationResult {
  const eligible = factories.filter((f) => f.categories.includes(style.category));
  const pool = eligible.length > 0 ? eligible : factories;
  const ranked = pool
    .map((f) => scoreFactoryFor(style, f))
    .sort((a, b) => b.score - a.score);

  const chosen = ranked[0];
  const alternatives = ranked.slice(1, 4);
  const rationale: string[] = [
    `${chosen.factory.name} (${chosen.factory.country}) wins on weighted score ${(chosen.score * 100).toFixed(0)}/100`,
    `Capacity headroom ${Math.round(chosen.components.capacityAvailable * 100)}% · lead time ${chosen.factory.leadTimeDays}d · cost index ${chosen.factory.costIndex.toFixed(2)}`,
    `Sustainability ${chosen.factory.sustainabilityScore}/100 — ${chosen.factory.type === "owned" ? "owned plant, full traceability" : "contract partner with audited program"}`,
  ];
  return { chosen, alternatives, rationale };
}
