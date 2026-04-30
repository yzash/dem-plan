"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { Freshness } from "@/data/signals";

export type SignalNodeData = {
  label: string;
  metric: string;
  value: number;
  freshness: Freshness;
  side: "internal" | "external" | "hub";
};

const FRESH_COLORS: Record<Freshness, { dot: string; ring: string; chip: string }> = {
  green: { dot: "bg-success", ring: "ring-success/30", chip: "bg-success/10 text-success" },
  amber: { dot: "bg-amber", ring: "ring-amber/30", chip: "bg-amber/10 text-amber" },
  red: { dot: "bg-danger", ring: "ring-danger/30", chip: "bg-danger/10 text-danger" },
};

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return Math.round(n).toString();
}

export default function SignalNode({ data, selected }: NodeProps<SignalNodeData>) {
  if (data.side === "hub") {
    return (
      <div
        className={
          "relative grid h-32 w-44 place-items-center rounded-2xl bg-navy-600 text-white shadow-lg " +
          "ring-4 ring-teal/40 transition " +
          (selected ? "scale-[1.02]" : "")
        }
      >
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.18em] text-teal-light">
            Intelligence Layer
          </div>
          <div className="mt-1 text-xl font-semibold">
            Trend<span className="text-teal-light">Pulse</span>
          </div>
          <div className="mt-1 text-[10px] text-navy-200">4 AI workloads · live</div>
        </div>
        <Handle type="target" position={Position.Left} className="!bg-teal !border-teal" />
        <Handle type="source" position={Position.Right} className="!bg-teal !border-teal" />
      </div>
    );
  }

  const c = FRESH_COLORS[data.freshness];
  const isExternal = data.side === "external";
  return (
    <div
      className={
        "w-56 rounded-xl border border-navy-100 bg-white p-3 shadow-card transition cursor-pointer hover:shadow-soft " +
        (selected ? "ring-2 ring-teal " : "")
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-navy-400">
            {isExternal ? "External" : "Internal"}
          </div>
          <div className="text-sm font-semibold text-navy-600 leading-tight">
            {data.label}
          </div>
        </div>
        <span className={"inline-block h-2.5 w-2.5 rounded-full " + c.dot} />
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-mono text-base font-semibold text-navy-600 kpi-number">
          {fmt(data.value)}
        </span>
        <span className="text-[10px] text-navy-400">{data.metric}</span>
      </div>
      {isExternal ? (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-navy-300 !border-navy-300"
        />
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-navy-300 !border-navy-300"
        />
      )}
    </div>
  );
}
