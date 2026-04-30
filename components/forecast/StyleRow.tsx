"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  TrendingUp,
  CloudSun,
  DollarSign,
} from "lucide-react";
import Chip from "@/components/shared/Chip";
import Sparkline from "./Sparkline";
import { Style, RecommendedActionType } from "@/data/styles";
import { findLookalikes } from "@/data/lookalikes";
import { styleById } from "@/data/styles";
import { formatUnitsCompact } from "@/lib/format";

type Tone = "teal" | "amber" | "danger" | "navy" | "neutral" | "success";

const ACTION_TONE: Record<RecommendedActionType, Tone> = {
  REORDER: "teal",
  HOLD: "neutral",
  MARKDOWN: "danger",
  PULL_FORWARD: "navy",
  INVESTIGATE: "amber",
};

function trendTone(score: number): Tone {
  if (score >= 75) return "success";
  if (score >= 55) return "teal";
  if (score >= 35) return "amber";
  return "danger";
}

function signalIcon(name: string) {
  if (name.toLowerCase().includes("instagram")) return <TrendingUp size={12} />;
  if (name.toLowerCase().includes("weather")) return <CloudSun size={12} />;
  return <DollarSign size={12} />;
}

type Props = {
  style: Style;
  selected: boolean;
  onToggleSelect: () => void;
};

export default function StyleRow({ style, selected, onToggleSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [igSensitivity, setIgSensitivity] = useState(0); // -50..+50
  const [debounced, setDebounced] = useState(0);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setDebounced(igSensitivity), 50);
    return () => {
      if (t.current) clearTimeout(t.current);
    };
  }, [igSensitivity]);

  // multiplier = 1 + (slider/100) * 0.6
  const multiplier = 1 + (debounced / 100) * 0.6;

  const totalOnHand = useMemo(
    () => Object.values(style.onHand).reduce((a, b) => a + b, 0),
    [style.onHand],
  );
  const avgP50 = useMemo(
    () => style.forecast4w.p50.reduce((a, b) => a + b, 0) / 4,
    [style.forecast4w],
  );
  const woc = totalOnHand / Math.max(1, avgP50 * multiplier);

  const baseQty = style.recommendedAction.qty ?? 0;
  const liveQty = baseQty ? Math.round((baseQty * multiplier) / 50) * 50 : 0;

  const lookalikes = useMemo(
    () =>
      findLookalikes({
        ...style.attributes,
        category: style.category,
        excludeStyleId: style.id,
      }),
    [style],
  );

  return (
    <>
      <tr
        className={
          "border-b border-navy-100 transition hover:bg-navy-50/60 " +
          (selected ? "bg-teal/5" : "")
        }
      >
        <td className="w-10 pl-4">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-navy-200 text-teal focus:ring-teal"
            checked={selected}
            onChange={onToggleSelect}
          />
        </td>
        <td className="py-2 pr-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={style.image}
            alt={style.name}
            className="h-[80px] w-[60px] rounded-md object-cover bg-navy-100"
            loading="lazy"
          />
        </td>
        <td className="px-2 py-2 align-middle">
          <div className="font-mono text-[11px] text-navy-400">{style.id}</div>
          <div className="text-sm font-medium text-navy-600">{style.name}</div>
          <div className="mt-0.5 flex items-center gap-1">
            <Chip>{style.category}</Chip>
            <span className="text-[11px] text-navy-400">
              ${style.priceUSD} · {style.attributes.fabric}
            </span>
          </div>
        </td>
        <td className="px-2 py-2 align-middle text-sm text-navy-600">
          {style.regions.join(" · ")}
        </td>
        <td className="px-2 py-2 align-middle font-mono text-sm text-navy-600 kpi-number">
          {formatUnitsCompact(totalOnHand)}
        </td>
        <td className="px-2 py-2 align-middle font-mono text-sm text-navy-600 kpi-number">
          {woc.toFixed(1)}w
        </td>
        <td className="px-2 py-2 align-middle">
          <Sparkline
            p10={style.forecast4w.p10}
            p50={style.forecast4w.p50}
            p90={style.forecast4w.p90}
            multiplier={multiplier}
          />
        </td>
        <td className="px-2 py-2 align-middle">
          <Chip tone={trendTone(style.trendScore)}>
            <span className="font-mono">{style.trendScore}</span>
          </Chip>
        </td>
        <td className="px-2 py-2 align-middle">
          <div className="flex flex-col items-start gap-1">
            <Chip tone={ACTION_TONE[style.recommendedAction.type]}>
              {style.recommendedAction.type.replace("_", " ")}
            </Chip>
            {liveQty ? (
              <span className="font-mono text-xs text-navy-600 kpi-number">
                {liveQty.toLocaleString()} u
              </span>
            ) : null}
          </div>
        </td>
        <td className="w-10 pr-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-md p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-600"
            aria-label="Expand row"
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        </td>
      </tr>
      {expanded ? (
        <tr className="border-b border-navy-100 bg-navy-50/40">
          <td />
          <td colSpan={9} className="px-2 py-4">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <div className="text-[11px] font-medium uppercase tracking-wide text-navy-400">
                  Top signals
                </div>
                <div className="mt-2 space-y-2">
                  {style.topSignals.map((sig) => {
                    const live =
                      sig.name.toLowerCase().includes("instagram")
                        ? sig.impact + debounced * 0.5
                        : sig.impact;
                    const pct = Math.max(-40, Math.min(40, live));
                    const w = Math.min(100, Math.abs(pct) * 2.2);
                    return (
                      <div key={sig.name}>
                        <div className="flex items-center justify-between text-[11px] text-navy-500">
                          <span className="inline-flex items-center gap-1.5">
                            {signalIcon(sig.name)}
                            {sig.name}
                          </span>
                          <span
                            className={
                              "font-mono " +
                              (live >= 0 ? "text-success" : "text-danger")
                            }
                          >
                            {live >= 0 ? "+" : ""}
                            {live.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-navy-100">
                          <div
                            className={
                              "h-full rounded-full " +
                              (live >= 0 ? "bg-success/70" : "bg-danger/70")
                            }
                            style={{ width: `${w}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-[11px] leading-relaxed text-navy-500">
                  <div className="font-medium text-navy-600">Why this action</div>
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    {style.recommendedAction.rationale.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-span-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-navy-400">
                  Lookalike styles
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {lookalikes.map((l) => {
                    const s = styleById(l.styleId);
                    if (!s) return null;
                    return (
                      <div
                        key={l.styleId}
                        className="rounded-lg border border-navy-100 bg-white p-2"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-20 w-full rounded-md object-cover"
                          loading="lazy"
                        />
                        <div className="mt-1.5 font-mono text-[10px] text-navy-400">
                          {s.id}
                        </div>
                        <div className="text-[11px] font-medium text-navy-600 leading-tight">
                          {s.name}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <Chip tone="teal">
                            {(l.similarity * 100).toFixed(0)}% match
                          </Chip>
                          <span className="font-mono text-[10px] text-navy-400">
                            ${s.priceUSD}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-3">
                <div className="text-[11px] font-medium uppercase tracking-wide text-navy-400">
                  Sensitivity
                </div>
                <label className="mt-2 block text-xs text-navy-500">
                  Instagram velocity
                  <span
                    className={
                      "ml-1 font-mono " +
                      (igSensitivity === 0
                        ? "text-navy-400"
                        : igSensitivity > 0
                        ? "text-success"
                        : "text-danger")
                    }
                  >
                    {igSensitivity > 0 ? "+" : ""}
                    {igSensitivity}%
                  </span>
                </label>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={igSensitivity}
                  onChange={(e) => setIgSensitivity(Number(e.target.value))}
                  className="mt-2 w-full accent-teal"
                />
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-md bg-white p-2 text-[11px] border border-navy-100">
                  <div>
                    <div className="text-navy-400">Recommended qty</div>
                    <div className="font-mono text-navy-600 kpi-number">
                      {liveQty ? liveQty.toLocaleString() : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-navy-400">Cover (weeks)</div>
                    <div className="font-mono text-navy-600 kpi-number">
                      {woc.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] leading-relaxed text-navy-400">
                  Slide to test how a ±IG velocity shock reshapes forecast and recommended buy.
                </div>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
