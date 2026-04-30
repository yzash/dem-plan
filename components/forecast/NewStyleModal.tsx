"use client";

import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { X, Sparkles } from "lucide-react";
import Chip from "@/components/shared/Chip";
import { findLookalikes } from "@/data/lookalikes";
import { styleById } from "@/data/styles";
import { StyleAttributes } from "@/data/styles";

const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Outerwear", "Knitwear", "Activewear"];
const SILHOUETTES = ["oversized", "fitted", "relaxed", "cropped", "longline", "tailored", "boxy"];
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
const PRICE_BANDS: StyleAttributes["priceBand"][] = ["value", "mid", "premium"];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NewStyleModal({ open, onClose }: Props) {
  const [category, setCategory] = useState("Tops");
  const [silhouette, setSilhouette] = useState("oversized");
  const [color, setColor] = useState("sage");
  const [print, setPrint] = useState("solid");
  const [fabric, setFabric] = useState("cotton");
  const [priceBand, setPriceBand] = useState<StyleAttributes["priceBand"]>("mid");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const matches = useMemo(() => {
    if (!submitted) return [];
    return findLookalikes({
      category,
      silhouette,
      color,
      print,
      fabric,
      priceBand,
    });
  }, [submitted, category, silhouette, color, print, fabric, priceBand]);

  const synthesized = useMemo(() => {
    if (!submitted || matches.length === 0) return null;
    const matchedStyles = matches.map((m) => styleById(m.styleId)!).filter(Boolean);
    // Average p50 of top 3 lookalikes' forecast
    const avg = [0, 1, 2, 3].map(
      (i) =>
        matchedStyles.reduce((acc, s) => acc + s.forecast4w.p50[i], 0) /
        matchedStyles.length,
    );
    const sumWeekly = avg.reduce((a, b) => a + b, 0);
    return { perWeek: avg, projected4w: Math.round(sumWeekly) };
  }, [submitted, matches]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-navy-100 p-5">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-teal-dark">
              Style lookalike intelligence
            </div>
            <h2 className="mt-1 text-lg font-semibold text-navy-600">
              New Style — find historical lookalikes
            </h2>
            <p className="text-xs text-navy-400">
              Define attributes; we synthesize a forecast from the closest existing styles.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-5 p-5">
          <form
            className="col-span-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubmitted(false);
                }}
                className="w-full rounded-md border border-navy-200 bg-white px-2 py-1.5 text-sm"
              >
                {CATEGORIES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label="Silhouette">
              <select
                value={silhouette}
                onChange={(e) => {
                  setSilhouette(e.target.value);
                  setSubmitted(false);
                }}
                className="w-full rounded-md border border-navy-200 bg-white px-2 py-1.5 text-sm"
              >
                {SILHOUETTES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Color">
                <select
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setSubmitted(false);
                  }}
                  className="w-full rounded-md border border-navy-200 bg-white px-2 py-1.5 text-sm"
                >
                  {COLORS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Print">
                <select
                  value={print}
                  onChange={(e) => {
                    setPrint(e.target.value);
                    setSubmitted(false);
                  }}
                  className="w-full rounded-md border border-navy-200 bg-white px-2 py-1.5 text-sm"
                >
                  {PRINTS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fabric">
                <select
                  value={fabric}
                  onChange={(e) => {
                    setFabric(e.target.value);
                    setSubmitted(false);
                  }}
                  className="w-full rounded-md border border-navy-200 bg-white px-2 py-1.5 text-sm"
                >
                  {FABRICS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Price band">
                <select
                  value={priceBand}
                  onChange={(e) => {
                    setPriceBand(e.target.value as StyleAttributes["priceBand"]);
                    setSubmitted(false);
                  }}
                  className="w-full rounded-md border border-navy-200 bg-white px-2 py-1.5 text-sm"
                >
                  {PRICE_BANDS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-navy-600 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-700"
            >
              <Sparkles size={14} /> Find lookalikes
            </button>
          </form>

          <div className="col-span-7 rounded-xl border border-navy-100 bg-navy-50 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-navy-600">
                {submitted ? "Top 3 lookalikes" : "Awaiting attributes…"}
              </h3>
              {synthesized ? (
                <Chip tone="teal">
                  Synth forecast 4w: {synthesized.projected4w.toLocaleString()} u
                </Chip>
              ) : null}
            </div>
            {submitted ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {matches.map((m) => {
                  const s = styleById(m.styleId);
                  if (!s) return null;
                  return (
                    <div
                      key={m.styleId}
                      className="rounded-lg border border-navy-100 bg-white p-2"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt={s.name}
                        className="h-24 w-full rounded-md object-cover"
                        loading="lazy"
                      />
                      <div className="mt-1.5 font-mono text-[10px] text-navy-400">
                        {s.id}
                      </div>
                      <div className="text-[11px] font-medium text-navy-600 leading-tight">
                        {s.name}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <Chip tone="teal">{(m.similarity * 100).toFixed(0)}%</Chip>
                        <span className="font-mono text-[10px] text-navy-400">
                          ${s.priceUSD}
                        </span>
                      </div>
                      <div className="mt-1.5 h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={s.weeklySales52.map((v, i) => ({ w: i, v }))}
                          >
                            <YAxis hide domain={["dataMin", "dataMax"]} />
                            <Line
                              type="monotone"
                              dataKey="v"
                              stroke="#1F2A44"
                              strokeWidth={1.5}
                              dot={false}
                              isAnimationActive={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      {m.drivingAttributes.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {m.drivingAttributes.slice(0, 2).map((d) => (
                            <span
                              key={d}
                              className="rounded-full bg-teal/10 px-1.5 py-0.5 text-[9px] text-teal-dark"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid h-[244px] place-items-center text-center text-xs text-navy-400">
                Configure attributes on the left and click <em>Find lookalikes</em>.
              </div>
            )}
            {synthesized ? (
              <div className="mt-3 rounded-md border border-teal/30 bg-teal/5 p-2 text-xs text-navy-600">
                Synthesized 4-week forecast:{" "}
                <span className="font-mono text-teal-dark">
                  {synthesized.perWeek.map((v) => Math.round(v)).join(" · ")}
                </span>{" "}
                units / week — averaged from the 3 lookalikes' P50.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-wide text-navy-400">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
