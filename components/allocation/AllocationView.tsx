"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Factory as FactoryIcon,
  Leaf,
  ShieldCheck,
  Truck,
} from "lucide-react";
import KpiTile from "@/components/shared/KpiTile";
import Chip from "@/components/shared/Chip";
import ScenarioToggle from "./ScenarioToggle";
import AnimatedNumber from "./AnimatedNumber";
import { useAppStore } from "@/lib/store";
import { factories } from "@/data/factories";
import { styleById, Style } from "@/data/styles";
import { scenarios } from "@/data/scenarios";
import { allocateForStyle } from "@/lib/allocator";
import { formatUSDCompact, formatUnitsCompact } from "@/lib/format";

export default function AllocationView() {
  const selectedIds = useAppStore((s) => s.selectedStyleIds);
  const scenario = useAppStore((s) => s.scenario);
  const poStatuses = useAppStore((s) => s.poStatuses);
  const poNumbers = useAppStore((s) => s.poNumbers);
  const setPoStatus = useAppStore((s) => s.setPoStatus);

  const queueStyles = useMemo(
    () => selectedIds.map((id) => styleById(id)).filter(Boolean) as Style[],
    [selectedIds],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    if (queueStyles.length > 0 && !activeId) setActiveId(queueStyles[0].id);
    if (activeId && !queueStyles.find((s) => s.id === activeId)) {
      setActiveId(queueStyles[0]?.id ?? null);
    }
  }, [queueStyles, activeId]);

  const activeStyle = queueStyles.find((s) => s.id === activeId) ?? null;
  const allocation = useMemo(
    () => (activeStyle ? allocateForStyle(activeStyle) : null),
    [activeStyle],
  );

  const sc = scenarios[scenario];

  function approve(styleId: string) {
    setApprovingId(styleId);
    setPoStatus(styleId, "In Review");
    setTimeout(() => {
      const poNumber = "PO-" + Math.floor(100000 + Math.random() * 900000).toString();
      setPoStatus(styleId, "Approved", poNumber);
      setApprovingId(null);
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-navy-600">
            Allocation, Wastage & Factory PO
          </h1>
          <p className="mt-1 text-sm text-navy-400">
            Routes reorder calls into capacity-aware factory POs. Scenarios from {scenarios.current.label.toLowerCase()} → AI-optimized.
          </p>
        </div>
        <ScenarioToggle />
      </div>

      {/* Top KPI banner */}
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <KpiTile
          label="Residual units"
          value={
            <AnimatedNumber value={sc.residualUnits} format={formatUnitsCompact} />
          }
          delta={
            scenario === "optimized"
              ? "-38% vs current"
              : scenario === "aggressive"
              ? "+18% vs current"
              : "baseline"
          }
          deltaTone={
            scenario === "optimized"
              ? "success"
              : scenario === "aggressive"
              ? "danger"
              : "neutral"
          }
          hint="end-of-season carryover"
        />
        <KpiTile
          label="Markdown exposure"
          value={
            <AnimatedNumber
              value={sc.markdownExposureUSD}
              format={formatUSDCompact}
            />
          }
          delta={
            scenario === "optimized"
              ? "-$510K vs current"
              : scenario === "aggressive"
              ? "-$180K vs current"
              : "baseline"
          }
          deltaTone={scenario === "current" ? "neutral" : "success"}
          hint="forecast price-down at week 12"
        />
        <KpiTile
          label="CO₂ kg"
          value={<AnimatedNumber value={sc.co2Kg} format={formatUnitsCompact} />}
          delta={
            scenario === "optimized"
              ? "-12% vs current"
              : scenario === "aggressive"
              ? "+4% vs current"
              : "baseline"
          }
          deltaTone={
            scenario === "optimized"
              ? "success"
              : scenario === "aggressive"
              ? "danger"
              : "neutral"
          }
          hint="manufacturing + logistics"
        />
      </div>

      {/* Comparison bar */}
      <div className="mt-4 rounded-xl border border-navy-100 bg-white p-3 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-navy-600">
            Scenario comparison
          </h3>
          <span className="text-[11px] text-navy-400">{sc.description}</span>
        </div>
        <div className="mt-2 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  metric: "Residual units",
                  current: scenarios.current.residualUnits,
                  optimized: scenarios.optimized.residualUnits,
                  aggressive: scenarios.aggressive.residualUnits,
                },
                {
                  metric: "Markdown $",
                  current: scenarios.current.markdownExposureUSD,
                  optimized: scenarios.optimized.markdownExposureUSD,
                  aggressive: scenarios.aggressive.markdownExposureUSD,
                },
                {
                  metric: "CO₂ kg",
                  current: scenarios.current.co2Kg,
                  optimized: scenarios.optimized.co2Kg,
                  aggressive: scenarios.aggressive.co2Kg,
                },
              ]}
              margin={{ top: 10, right: 16, left: 0, bottom: 4 }}
            >
              <XAxis dataKey="metric" tick={{ fontSize: 11 }} stroke="#9CA8C5" />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "#F4F6FA" }}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(value: number, _name: string, item: { payload?: { metric?: string } }) => {
                  if (item?.payload?.metric === "Markdown $")
                    return formatUSDCompact(value);
                  return formatUnitsCompact(value);
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="current" fill="#9CA8C5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="optimized" fill="#0EA5A4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="aggressive" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-column body */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Reorder queue */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-xl border border-navy-100 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-navy-100 p-3">
              <h3 className="text-sm font-semibold text-navy-600">
                Reorder queue ({queueStyles.length})
              </h3>
              <Link
                href="/forecast"
                className="text-xs text-teal-dark hover:underline"
              >
                + add from Forecast
              </Link>
            </div>
            {queueStyles.length === 0 ? (
              <EmptyQueue />
            ) : (
              <ul className="divide-y divide-navy-100">
                {queueStyles.map((s) => {
                  const status = poStatuses[s.id] ?? "Draft";
                  const poNumber = poNumbers[s.id];
                  const tone =
                    status === "Approved"
                      ? "success"
                      : status === "In Review"
                      ? "amber"
                      : status === "Rejected"
                      ? "danger"
                      : "neutral";
                  const isActive = activeId === s.id;
                  return (
                    <li
                      key={s.id}
                      className={
                        "flex cursor-pointer items-center gap-3 p-3 transition hover:bg-navy-50/60 " +
                        (isActive ? "bg-teal/5" : "")
                      }
                      onClick={() => setActiveId(s.id)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt=""
                        className="h-12 w-9 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-navy-400">
                            {s.id}
                          </span>
                          <Chip tone={tone}>{status}</Chip>
                        </div>
                        <div className="truncate text-sm font-medium text-navy-600">
                          {s.name}
                        </div>
                        <div className="mt-0.5 flex items-center justify-between text-[11px] text-navy-400">
                          <span>{s.category}</span>
                          <span className="font-mono text-navy-600">
                            {(s.recommendedAction.qty ?? 0).toLocaleString()} u
                          </span>
                        </div>
                        {poNumber ? (
                          <div className="mt-0.5 font-mono text-[10px] text-teal-dark">
                            {poNumber}
                          </div>
                        ) : null}
                      </div>
                      <button
                        disabled={status === "Approved" || approvingId === s.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          approve(s.id);
                        }}
                        className={
                          "rounded-md px-2.5 py-1.5 text-xs font-semibold transition " +
                          (status === "Approved"
                            ? "bg-success/10 text-success cursor-default"
                            : approvingId === s.id
                            ? "bg-navy-100 text-navy-400"
                            : "bg-navy-600 text-white hover:bg-navy-700")
                        }
                      >
                        {status === "Approved"
                          ? "Approved"
                          : approvingId === s.id
                          ? "Writing…"
                          : "Approve"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Allocation panel */}
        <div className="col-span-12 lg:col-span-7">
          {activeStyle && allocation ? (
            <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-navy-400">
                    AI factory recommendation for
                  </div>
                  <h3 className="mt-0.5 text-base font-semibold text-navy-600">
                    {activeStyle.id} · {activeStyle.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Chip tone="teal">
                      {(activeStyle.recommendedAction.qty ?? 0).toLocaleString()} units
                    </Chip>
                    <Chip>{activeStyle.category}</Chip>
                  </div>
                </div>
                <Chip tone="navy">
                  {allocation.chosen.factory.id}
                </Chip>
              </div>

              <div className="mt-3 grid grid-cols-12 gap-4">
                <div className="col-span-7">
                  <FactoryScoreBars score={allocation.chosen} />
                  <ul className="mt-3 space-y-1 text-[12px] text-navy-500">
                    {allocation.rationale.map((r, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle2
                          size={13}
                          className="mt-0.5 shrink-0 text-teal"
                        />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-5 rounded-lg border border-navy-100 bg-navy-50 p-3">
                  <div className="flex items-center gap-2">
                    <FactoryIcon size={14} className="text-navy-500" />
                    <span className="text-sm font-semibold text-navy-600">
                      {allocation.chosen.factory.name}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <Spec
                      icon={<Truck size={12} />}
                      label="Lead time"
                      value={`${allocation.chosen.factory.leadTimeDays}d`}
                    />
                    <Spec
                      icon={<ShieldCheck size={12} />}
                      label="Type"
                      value={allocation.chosen.factory.type}
                    />
                    <Spec
                      label="Cost index"
                      value={allocation.chosen.factory.costIndex.toFixed(2)}
                    />
                    <Spec
                      icon={<Leaf size={12} />}
                      label="Sustainability"
                      value={`${allocation.chosen.factory.sustainabilityScore}/100`}
                    />
                    <Spec
                      label="Capacity"
                      value={`${allocation.chosen.factory.capacityUnitsPerWeek.toLocaleString()}/wk`}
                    />
                    <Spec
                      label="Utilization"
                      value={`${Math.round(allocation.chosen.factory.currentUtilization * 100)}%`}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAlternatives((v) => !v)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-teal-dark hover:underline"
              >
                {showAlternatives ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                Alternatives considered ({allocation.alternatives.length})
              </button>
              {showAlternatives ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {allocation.alternatives.map((a) => (
                    <div
                      key={a.factory.id}
                      className="rounded-lg border border-navy-100 bg-white p-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-navy-600">
                          {a.factory.name}
                        </span>
                        <Chip>{(a.score * 100).toFixed(0)}</Chip>
                      </div>
                      <div className="mt-1 text-[10px] text-navy-400">
                        {a.factory.country} · {a.factory.leadTimeDays}d ·{" "}
                        {Math.round(a.factory.currentUtilization * 100)}% util
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-navy-200 bg-white p-10 text-center text-sm text-navy-400 shadow-card">
              Select a PO from the queue to see the AI factory recommendation.
            </div>
          )}
        </div>
      </div>

      {/* Factory list */}
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-navy-600">Factory network</h3>
        <p className="text-[11px] text-navy-400">
          10 factories across IN · BD · VN · TR. Hover-ready capacity gauges.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {factories.map((f) => {
            const u = Math.round(f.currentUtilization * 100);
            const tone =
              u > 85 ? "danger" : u > 70 ? "amber" : "success";
            return (
              <div
                key={f.id}
                className="rounded-xl border border-navy-100 bg-white p-3 shadow-card"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-navy-400">
                      {f.id}
                    </div>
                    <div className="truncate text-sm font-semibold text-navy-600">
                      {f.name}
                    </div>
                    <div className="text-[11px] text-navy-400">
                      {f.country} · {f.type}
                    </div>
                  </div>
                  <span className="h-12 w-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        data={[{ value: u, fill: toneColor(tone) }]}
                      >
                        <RadialBar
                          dataKey="value"
                          background={{ fill: "#E5E9F2" }}
                          cornerRadius={6}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-navy-400">Utilization</span>
                  <Chip tone={tone}>{u}%</Chip>
                </div>
                <div className="mt-2 text-[11px] text-navy-500">
                  {f.capacityUnitsPerWeek.toLocaleString()} u/wk · {f.leadTimeDays}d
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {f.categories.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-navy-50 px-1.5 py-0.5 text-[10px] text-navy-500"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approve overlay */}
      {approvingId ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-900/30 backdrop-blur-sm">
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-teal" />
              <div>
                <div className="text-sm font-semibold text-navy-600">
                  Writing back to SAP & Centric PLM…
                </div>
                <div className="text-[11px] text-navy-400">
                  PO is being committed to the system of record.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-navy-400">
        {icon} {label}
      </div>
      <div className="font-mono text-sm text-navy-600">{value}</div>
    </div>
  );
}

function FactoryScoreBars({
  score,
}: {
  score: ReturnType<typeof allocateForStyle>["chosen"];
}) {
  const data = [
    {
      name: "Capacity available",
      value: Math.round(score.components.capacityAvailable * 100),
      fill: "#0EA5A4",
    },
    {
      name: "Lead time fit",
      value: Math.round(score.components.leadTimeFit * 100),
      fill: "#1F2A44",
    },
    {
      name: "Cost rank",
      value: Math.round(score.components.costRank * 100),
      fill: "#F59E0B",
    },
    {
      name: "Sustainability",
      value: Math.round(score.components.sustainabilityRank * 100),
      fill: "#10B981",
    },
  ];
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 11, fill: "#5C6B92" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "#F4F6FA" }}
            contentStyle={{ fontSize: 11, borderRadius: 8 }}
            formatter={(v: number) => `${v}/100`}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyQueue() {
  return (
    <div className="grid place-items-center px-6 py-12 text-center">
      <div className="text-sm font-medium text-navy-600">
        No styles in the queue
      </div>
      <p className="mt-1 max-w-xs text-xs text-navy-400">
        Pick styles in Forecast and click <em>Generate factory PO draft</em> to
        seed the queue.
      </p>
      <Link
        href="/forecast"
        className="mt-3 inline-flex items-center gap-1 rounded-md bg-navy-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-700"
      >
        Open Forecast
      </Link>
    </div>
  );
}

function toneColor(tone: "success" | "amber" | "danger") {
  if (tone === "success") return "#10B981";
  if (tone === "amber") return "#F59E0B";
  return "#EF4444";
}
