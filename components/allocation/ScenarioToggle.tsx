"use client";

import { useAppStore, Scenario as ScenarioId } from "@/lib/store";
import { scenarios, scenarioOrder } from "@/data/scenarios";

export default function ScenarioToggle() {
  const scenario = useAppStore((s) => s.scenario);
  const setScenario = useAppStore((s) => s.setScenario);
  return (
    <div className="inline-flex items-center rounded-full border border-navy-200 bg-white p-1 shadow-sm">
      {scenarioOrder.map((id) => {
        const active = scenario === id;
        return (
          <button
            key={id}
            onClick={() => setScenario(id as ScenarioId)}
            className={
              "rounded-full px-3 py-1.5 text-xs font-medium transition " +
              (active
                ? "bg-navy-600 text-white shadow-sm"
                : "text-navy-500 hover:text-navy-600")
            }
          >
            {scenarios[id].label}
          </button>
        );
      })}
    </div>
  );
}
