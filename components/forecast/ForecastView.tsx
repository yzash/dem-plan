"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Send } from "lucide-react";
import StyleRow from "./StyleRow";
import NewStyleModal from "./NewStyleModal";
import { styles, Region } from "@/data/styles";
import { useAppStore } from "@/lib/store";

const REGIONS: Region[] = ["IN", "AE", "SG", "UK"];
const CATEGORIES = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Knitwear",
  "Activewear",
];
const ACTIONS = ["All", "REORDER", "HOLD", "MARKDOWN", "PULL_FORWARD", "INVESTIGATE"];

export default function ForecastView() {
  const router = useRouter();
  const filterRegions = useAppStore((s) => s.filterRegions);
  const setFilterRegions = useAppStore((s) => s.setFilterRegions);
  const filterCategory = useAppStore((s) => s.filterCategory);
  const setFilterCategory = useAppStore((s) => s.setFilterCategory);
  const filterAction = useAppStore((s) => s.filterAction);
  const setFilterAction = useAppStore((s) => s.setFilterAction);
  const setSelectedForPO = useAppStore((s) => s.setSelectedForPO);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return styles
      .filter((s) =>
        filterCategory === "All" ? true : s.category === filterCategory,
      )
      .filter((s) =>
        filterAction === "All"
          ? true
          : s.recommendedAction.type === (filterAction as typeof s.recommendedAction.type),
      )
      .filter((s) =>
        filterRegions.length === 0
          ? true
          : s.regions.some((r) => filterRegions.includes(r)),
      )
      .sort((a, b) => b.trendScore - a.trendScore);
  }, [filterCategory, filterAction, filterRegions]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleRegion(r: Region) {
    if (filterRegions.includes(r)) {
      setFilterRegions(filterRegions.filter((x) => x !== r));
    } else {
      setFilterRegions([...filterRegions, r]);
    }
  }

  function generatePO() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setSelectedForPO(ids);
    router.push("/allocation");
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-600">
            Forecast, Reorder & Style Lookalike
          </h1>
          <p className="mt-1 text-sm text-navy-400">
            {filtered.length} of {styles.length} styles · sorted by trend score
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-navy-200 bg-white px-3 py-2 text-sm font-medium text-navy-600 shadow-sm hover:border-teal hover:text-teal-dark"
        >
          <Plus size={15} /> New Style
        </button>
      </div>

      {/* Filter bar */}
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-navy-100 bg-white p-3 shadow-card">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-navy-400">
            Region
          </span>
          <div className="flex gap-1">
            {REGIONS.map((r) => {
              const active = filterRegions.includes(r);
              return (
                <button
                  key={r}
                  onClick={() => toggleRegion(r)}
                  className={
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition " +
                    (active
                      ? "border-teal bg-teal/10 text-teal-dark"
                      : "border-navy-200 text-navy-500 hover:border-navy-300")
                  }
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-navy-400">
            Category
          </span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-md border border-navy-200 bg-white px-2.5 py-1 text-xs text-navy-600"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-navy-400">
            Action
          </span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="rounded-md border border-navy-200 bg-white px-2.5 py-1 text-xs text-navy-600"
          >
            {ACTIONS.map((a) => (
              <option key={a}>{a.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          <button
            onClick={generatePO}
            disabled={selected.size === 0}
            className={
              "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition " +
              (selected.size === 0
                ? "cursor-not-allowed bg-navy-100 text-navy-400"
                : "bg-navy-600 text-white hover:bg-navy-700")
            }
          >
            <Send size={14} /> Generate factory PO draft ({selected.size})
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4 overflow-hidden rounded-xl border border-navy-100 bg-white shadow-card">
        <table className="w-full text-left">
          <thead className="border-b border-navy-100 bg-navy-50 text-[10px] uppercase tracking-wider text-navy-400">
            <tr>
              <th className="w-10 pl-4 py-2"></th>
              <th className="py-2">Style</th>
              <th className="px-2 py-2">Code · Name</th>
              <th className="px-2 py-2">Regions</th>
              <th className="px-2 py-2">On hand</th>
              <th className="px-2 py-2">WoC</th>
              <th className="px-2 py-2">4w forecast</th>
              <th className="px-2 py-2">Trend</th>
              <th className="px-2 py-2">Action</th>
              <th className="w-10 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <StyleRow
                key={s.id}
                style={s}
                selected={selected.has(s.id)}
                onToggleSelect={() => toggle(s.id)}
              />
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-10 text-center text-sm text-navy-400">
                  No styles match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <NewStyleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
