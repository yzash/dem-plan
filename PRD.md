# TrendPulse — Product Requirements Document

**AI-Native Demand Forecasting & Trend-to-Production Platform for Global Fast Fashion Manufacturing**

| Field | Value |
|---|---|
| Audience | Supply Chain & Merchandising leadership |
| Build approach | **Phased build — 6 phases, one Claude Code turn each** |
| Format | Web app — three connected modules |
| Stack | Next.js 14 + Tailwind + Recharts + Zustand + react-flow |
| Prepared by | DevX Labs |

---

## ⚠️ HOW TO BUILD THIS — READ FIRST

This PRD is intentionally split into **6 build phases**. Do **not** ask Claude Code to build everything in one turn — it will hit stream timeouts because the output exceeds what a single response can stream.

**Workflow:**

1. Place this `PRD.md` at the root of an empty project folder.
2. Open Claude Code in that folder.
3. Run **Phase 1** by pasting its build command. Wait for completion.
4. Verify the phase's acceptance check passes.
5. Move to the next phase. Repeat until Phase 6.

**Each phase has:**
- A scoped build command (paste verbatim)
- A bounded deliverable (≤ ~600 lines of new code)
- An acceptance check (run before moving on)

If a phase still times out, the phase command itself tells Claude Code how to subdivide further.

---

## 1. Context & Problem

A multi-country fast fashion brand operating across India, SEA, ME, and select EU markets. Designs, manufactures, and retails its own apparel.

**The pain:**
- **Trend latency** — Trends peak in 4–8 weeks; buy-to-shelf cycles run 12–20 weeks.
- **Cold-start styles** — New silhouettes have no historical sales to forecast against.
- **Wastage** — Conservative forecasts cause stockouts; aggressive ones cause markdown stockpiles.
- **Allocation lag** — Factory allocation driven by capacity calendars, not demand signals.
- **No lookalike intelligence** — Designers can't ask "what existing style is this closest to?"

**The opportunity:** A demand forecasting layer that fuses external trend signals with internal sell-through, inventory, and capacity data — and presents merchandisers with prioritized, explainable actions.

---

## 2. Demo Goals

**Objective:** Convince supply chain and merchandising leaders that an AI-native forecasting layer plugs into their existing landscape (ERP, PLM, POS, e-commerce, social listening) without replacing it, and changes Monday-morning decisions — not just dashboards.

**Success criteria:**
- A merchandiser walks through three connected screens in under 8 minutes and produces a defensible reorder + factory allocation decision.
- Every AI output is paired with a plain-English explanation and underlying signals.
- Numbers reconcile across screens.
- Runs offline once built.

**Anti-goals:** No real ML, no auth, no admin panels, no settings, no mobile responsiveness beyond graceful degradation.

---

## 3. Personas

| Persona | Role | Primary screen |
|---|---|---|
| Priya — Head of Merchandising | Owns reorder calls. Decision-maker. | Module 2 |
| Arjun — Supply Chain Lead | Owns factory allocation. Approves Priya's calls. | Module 3 |
| Maya — Design Lead | Wants lookalike intelligence at design-brief stage. | Module 2 (sub-view) |
| Rohan — CIO (audience plant) | Asks the integration question. | Module 1 |

---

## 4. The Three Modules

> **Architecture in one line:** TrendPulse sits as an intelligence layer between source systems and the merchandiser. It reads from systems of record, runs four AI workloads, and writes back recommendations that humans approve.

### Module 1 — Integration & Signal Map
Visualizes how TrendPulse plugs into the customer's existing landscape, with live (simulated) signal counters. Credibility screen.

### Module 2 — Forecast, Reorder & Style Lookalike
Merchandiser's working screen. Style grid with AI forecast, confidence, recommended action, explanation. Includes lookalike sub-view for new styles.

### Module 3 — Allocation, Wastage & Factory PO
Supply chain's screen. Reorder requests → factory POs, with wastage prediction and capacity-aware allocation.

---

## 5. AI Use-Cases (all simulated)

| # | Use case | Inputs (simulated) | Output | Demo trick |
|---|---|---|---|---|
| 1 | SKU demand forecast | 52w sell-through, on-hand, price, weather, trend score | Weekly P10/P50/P90 for next 4–12w | Pre-computed in seed JSON |
| 2 | Wastage prediction | Forecast, PO pipeline, return rate | Residual units, $ markdown, kg waste under 3 scenarios | 3 pre-baked scenarios toggle |
| 3 | Factory allocation | Reorder requests, capacity, lead time, cost, sustainability | Per-PO factory + reasoning | In-browser greedy allocator |
| 4 | Style lookalike | New style attributes | Top 3 historical lookalikes + synthesized forecast | Cosine similarity in browser |

All values in **USD**. Format as `$510K`, `$4.2M` — no thousand-separator commas in headline KPIs.

---

## 6. Visual Design Tokens

- Navy primary `#1F2A44`, teal accent `#0EA5A4`, amber `#F59E0B`, green `#10B981`, red `#EF4444`.
- Typography: Inter for UI, JetBrains Mono for data labels.
- Density: information-rich. Real merchandisers will judge it.
- Brand mark: 'TrendPulse' wordmark top-left, 'powered by DevX Labs' bottom-right of every screen.

---

## 7. Demo Flow Script (8 minutes)

The build must support this exact walkthrough end-to-end after Phase 6.

| Time | Screen | Action | Result |
|---|---|---|---|
| 0:00 | M1 | Open integration map | Animated flows from SAP, PLM, POS, social into TrendPulse — counters tick |
| 0:45 | M1 | Click 'Instagram Hashtag Velocity' | Drawer: webhook contract, sample payload, 18,400 signals/day |
| 1:30 | M1 | Click 'Centric PLM' (amber) | Drawer: last sync 4h ago — what stale looks like |
| 2:15 | M2 | Filter Region: India, Category: Tops | Grid renders 12 styles, sorted by trend score |
| 2:45 | M2 | Expand top row | Top 3 signals: IG +24%, weather +11%, price elasticity -3%; Reorder 1,800 units |
| 3:30 | M2 | Sensitivity slider 'IG -20%' | Forecast and qty drop to 1,200 in real time |
| 4:15 | M2 | New Style → oversized cotton tee | Returns 3 lookalikes + synthesized forecast |
| 5:00 | M2 | Select 4 styles → 'Generate factory PO draft' | Routes to M3 with selections |
| 5:30 | M3 | Land on allocation view | 4 POs, AI-suggested factory per PO with reasoning |
| 6:00 | M3 | Toggle Current → AI-Optimized | KPIs shift: residual -38%, markdown exposure -$510K, CO₂ -12% |
| 6:45 | M3 | Expand a PO | 4-bar comparison: chosen factory wins on capacity + lead time |
| 7:15 | M3 | Approve top PO | 2s 'writing back to SAP & Centric PLM' animation, status flips to Approved |
| 7:45 | M1 | Close on integration map | Anchor: 'this is the loop, end-to-end, on your existing stack' |

---

# 🛠️ BUILD PHASES

Each phase below is a separate Claude Code turn. Run them in order.

---

## Phase 1 — Scaffold & Design System

**Goal:** Working Next.js app with navigation, design tokens, layout shell, and three empty module pages.

**Build command (paste verbatim into Claude Code):**

> Build Phase 1 of the TrendPulse PRD. Create a Next.js 14 (App Router) + TypeScript + Tailwind project. Install: `recharts`, `zustand`, `lucide-react`, `reactflow`. Set up `tailwind.config.ts` with the color tokens from PRD section 6. Create `app/layout.tsx` with a top nav (TrendPulse wordmark left, three module tabs centered: Integration / Forecast / Allocation, "powered by DevX Labs" bottom-right of viewport via fixed footer). Create three empty pages: `app/integration/page.tsx`, `app/forecast/page.tsx`, `app/allocation/page.tsx`, each rendering an `<h1>` placeholder. Set `app/page.tsx` to redirect to `/integration`. Create `lib/store.ts` with an empty Zustand store scaffold (no state yet — just the file). Create `components/shared/Card.tsx`, `components/shared/Chip.tsx`, `components/shared/KpiTile.tsx` as styled primitives. Use Inter from `next/font`. Run `npm run build` to verify it compiles. Do not build any module content yet — that's Phase 2 onward.

**Acceptance check:**
- `npm run dev` starts without errors
- All three nav tabs route to placeholder pages
- TrendPulse wordmark and DevX footer visible on every page
- No TypeScript errors

---

## Phase 2 — Seed Data

**Goal:** All TypeScript seed files, fully populated, ready for modules to consume.

**Build command:**

> Build Phase 2 of the TrendPulse PRD. Create the following seed files under `/data`. **Generate everything inline — do not leave placeholder arrays. Use deterministic procedural generation so values are realistic but reproducible.**
>
> **`data/styles.ts`** — Export an array of exactly 40 style objects spanning 6 categories (Tops, Bottoms, Dresses, Outerwear, Knitwear, Activewear). Each style:
> ```ts
> {
>   id: string;          // "ST-1001" through "ST-1040"
>   name: string;
>   category: string;
>   subcategory: string;
>   attributes: { silhouette, color, print, fabric, priceBand };
>   priceUSD: number;    // 19–149
>   image: string;       // `https://picsum.photos/seed/ST-1001/300/400`
>   regions: ("IN"|"AE"|"SG"|"UK")[];
>   onHand: Record<string, number>;
>   weeklySales52: number[];   // 52 numbers, smoothed seasonal curve + noise
>   trendScore: number;        // 0–100
>   forecast4w: { p10: number[], p50: number[], p90: number[] };  // 4 numbers each
>   recommendedAction: { type: "REORDER"|"HOLD"|"MARKDOWN"|"PULL_FORWARD"|"INVESTIGATE", qty?: number, rationale: string[] };
>   topSignals: { name: string, impact: number }[];  // 3 items, impact in %
> }
> ```
> Use a seedable PRNG (e.g., `mulberry32`) keyed off the style id so values are deterministic. Make at least 8 styles have REORDER action with qty 800–2400.
>
> **`data/factories.ts`** — Export 10 factory objects across IN, BD, VN, TR. Fields: `id, name, country, type ("owned"|"contract"), capacityUnitsPerWeek, currentUtilization (0–1), leadTimeDays, costIndex (0.7–1.2), sustainabilityScore (0–100), categories[]`.
>
> **`data/signals.ts`** — Export `{ internal: [...], external: [...] }`. 8 internal systems (SAP S/4HANA, Centric PLM, Oracle POS, Manhattan WMS, Shopify Plus, Salesforce CRM, Loyalty, OMS) each with `{ system, type, eventsPerHour, freshness ("green"|"amber"|"red"), connector, sampleEventName }`. 7 external signals (Instagram Hashtag Velocity, TikTok Trends, Google Trends, Pinterest Boards, Vogue Runway, WGSN, Competitor Pricing) each with `{ source, type, signalsPerDay, freshness, connector, sampleEventName }`. Make exactly one internal amber (Centric PLM, last sync 4h ago) and one external amber (Vogue Runway). All others green.
>
> **`data/scenarios.ts`** — Export 3 wastage scenarios (`current`, `optimized`, `aggressive`) each with `{ residualUnits, markdownExposureUSD, co2Kg }`. Numbers must show optimized ~38% better residual, $510K less markdown, 12% less CO₂ vs current. Aggressive should be worse than current on residual but cheaper short-term.
>
> **`data/lookalikes.ts`** — Export a function `findLookalikes(attributes) => Array<{ styleId, similarity, drivingAttributes[] }>` that runs cosine similarity over the 40 styles' attributes and returns top 3.
>
> No UI in this phase — just data. Run `npm run build` to verify it compiles.

**Acceptance check:**
- All 5 files compile with no TypeScript errors
- Importing `styles` returns exactly 40 items
- `findLookalikes({ category: "Tops", silhouette: "oversized", color: "sage", print: "solid", fabric: "cotton", priceBand: "mid" })` returns 3 results

---

## Phase 3 — Module 1: Integration & Signal Map

**Goal:** Module 1 fully working: animated diagram, live counters, click-to-drawer.

**Build command:**

> Build Phase 3 of the TrendPulse PRD: Module 1 only. Use `reactflow` for the diagram in `app/integration/page.tsx`.
>
> Layout: TrendPulse hub node in the center (large, navy fill, teal border). Internal systems from `data/signals.ts` as nodes on the left. External signals as nodes on the right. Edges from each side node to the hub.
>
> Each node: shows system/source name, current event count, freshness dot (green/amber/red). Edges: animated dashed lines using reactflow's built-in animation, color-coded by freshness.
>
> Top of page: 4 aggregate KPI tiles — Total events/hr, Total signals/day, Freshness SLA %, AI workloads running (hardcoded "4").
>
> Counter animation: every 2 seconds, increment each node's `eventsPerHour` / `signalsPerDay` by a small random delta (use `useEffect` + `setInterval`). Use `useState` per node.
>
> Click any node → opens a right-side drawer (fixed position, 420px wide, slides in). Drawer content: connector type, refresh cadence (e.g., "Realtime", "Every 15 min", "Daily"), data owner (made up — e.g., "Supply Chain IT"), last sync timestamp, sample payload as a `<pre>` block with 6–10 lines of mock JSON specific to that source.
>
> Build only Module 1 in this phase. Other modules stay placeholders.

**Acceptance check:**
- `/integration` shows hub + ~15 surrounding nodes
- Counters tick visibly (no freezes)
- Clicking Centric PLM shows amber, "last sync 4h ago"
- Drawer closes via X or clicking outside

---

## Phase 4 — Module 2: Forecast Grid

**Goal:** Style grid with expand-row explanations and the sensitivity slider.

**Build command:**

> Build Phase 4 of the TrendPulse PRD: Module 2 grid view (skip "New Style" — that's Phase 5). All in `app/forecast/page.tsx` plus components under `components/forecast/`.
>
> Top filter bar: Region multi-select (IN/AE/SG/UK), Category dropdown, Action filter dropdown. Filters update the grid live.
>
> Style grid as a table. One row per style from `data/styles.ts`. Columns: thumbnail (60×80, from picsum URL), style code, name, category, on-hand (sum across regions), weeks-of-cover (calculated from p50 forecast), 4-week sparkline (Recharts AreaChart with p10/p90 band + p50 line), trend score chip (color-coded by band), recommended action chip, expand caret.
>
> Click expand caret → row expands inline showing: top 3 signals as horizontal bars (impact %), 3 lookalike styles as small cards (call `findLookalikes` with this style's attributes, exclude self), sensitivity slider labeled "Instagram velocity ±%" (range -50 to +50, default 0). Moving the slider updates the row's displayed forecast qty and recommended qty proportionally (multiplier = 1 + (sliderValue/100) × 0.6 applied to the recommendedAction.qty). The sparkline also rescales.
>
> Bulk select via checkboxes on each row. Top action button "Generate factory PO draft (N)" — clicking it calls a Zustand action `setSelectedForPO(styleIds)` and routes via `next/navigation` to `/allocation`.
>
> Update `lib/store.ts` to add `selectedStyleIds: string[]`, `setSelectedForPO(ids)`.

**Acceptance check:**
- Grid renders 40 styles, filters narrow correctly
- Sparkline shows confidence band
- Expanding a row shows 3 bars + 3 lookalikes + slider
- Slider changes recommended qty in real time
- Selecting 2+ styles enables the PO button; clicking it routes to /allocation

---

## Phase 5 — Module 2: New Style + Module 3: Allocation

**Goal:** New Style modal + full Module 3 (allocation queue, scenario toggle, approve flow).

**Build command:**

> Build Phase 5 of the TrendPulse PRD: New Style modal in Module 2, plus all of Module 3.
>
> **New Style modal** (`components/forecast/NewStyleModal.tsx`): triggered by a "+ New Style" button top-right of `/forecast`. Form fields: category (select), silhouette (select), color (select), print (select), fabric (select), priceBand (select). Submit → calls `findLookalikes(attributes)` → renders 3 lookalike cards with their sell-through curves (small Recharts LineChart of `weeklySales52`) and a synthesized forecast (average of top 3 lookalikes' p50). Show similarity % per match and which attributes drove the match.
>
> **Module 3** (`app/allocation/page.tsx`):
>
> Top banner: 3 KPI tiles — Residual units, Markdown exposure (USD), CO₂ kg. Values pulled from `data/scenarios.ts` based on active scenario.
>
> Scenario toggle (segmented control, 3 buttons): Current Plan / AI-Optimized / Aggressive. Updates KPIs and a comparison bar chart below.
>
> Two-column body. **Left: Reorder Queue** — read `selectedStyleIds` from Zustand store. For each, render a card with style info, quantity (from styles.recommendedAction.qty), and status badge (Draft / In Review / Approved / Rejected — start all as Draft). If queue is empty, show empty state with link back to /forecast.
>
> **Right: Allocation Panel** — for the currently-selected PO from the queue (default first), run an in-browser greedy allocator: pick the factory with highest score = `0.4 × (1 - utilization) + 0.3 × (1 - leadTimeDays/40) + 0.2 × (1 - costIndex/1.2) + 0.1 × (sustainabilityScore/100)` among factories whose `categories` include the style's category. Show chosen factory + 4-bar mini chart (capacity available, lead time fit, cost rank, sustainability rank) + expandable "alternatives considered" showing top 3 with scores.
>
> Approve button on each PO: triggers a 2-second overlay "Writing back to SAP & Centric PLM…" then sets status to Approved with synthetic PO# (`PO-` + random 6 digits).
>
> Below the columns: Factory list — all 10 factories as compact cards with capacity utilization gauges (Recharts RadialBarChart or simple progress bar).

**Acceptance check:**
- New Style form returns 3 lookalikes + synthesized forecast
- /allocation shows queue from selected styles in /forecast
- Scenario toggle changes all 3 KPIs in <500ms
- Approve action runs animation and updates badge
- Factory list renders 10 factories

---

## Phase 6 — Polish & Demo Readiness

**Goal:** Smooth out animations, fix consistency bugs, run full demo flow.

**Build command:**

> Build Phase 6 of the TrendPulse PRD: polish only, no new features.
>
> Walk through the demo flow script in PRD section 7 step by step. For each step that doesn't work or feels rough, fix it. Specifically check:
>
> 1. Module 1 counters never freeze and never show negative values
> 2. Module 1 drawer closes on outside click and Escape key
> 3. Module 2 sensitivity slider is debounced (50ms) so it feels smooth
> 4. Module 2 → Module 3 navigation preserves selected styles via Zustand
> 5. Module 3 scenario toggle has a smooth transition (CSS transition on KPI numbers if possible — use `useState` with intermediate values)
> 6. Module 3 approve animation is exactly 2 seconds and is non-blocking
> 7. All currency formatted as `$510K` / `$4.2M` style — no `1,000,000`
> 8. No console errors anywhere in the demo flow
> 9. Page transitions are instant (no loading states between modules)
>
> Run `npm run build` and report any warnings or errors. List any items you couldn't fix and why.

**Acceptance check:**
- Run the entire 8-minute demo flow from section 7 — every step works
- Disable wifi, refresh, demo still works
- Zero console errors
- `npm run build` succeeds with no errors

---

## 8. If a Phase Still Times Out

If any single phase times out:

1. **Phase 2 most likely culprit** — the 40 styles are the largest output. If it times out, ask Claude Code to: "Generate `data/styles.ts` in two halves — write 20 styles, save, then append 20 more in a second file edit."
2. **Phase 3** — if reactflow setup is heavy, ask: "Skip the drawer for now, just get the diagram + counters working. Drawer in a follow-up turn."
3. **Phase 5** — split into 5a (New Style modal only) and 5b (Module 3) as separate turns.

The general rule: if a phase is ~600+ lines of new code, split it. Claude Code's stream timeout hits around continuous output of that length.

---

## 9. Out of Scope

- Auth, user management, multi-tenancy
- Real ML, real API calls, real model serving
- Settings, dark mode, mobile layouts
- Tests beyond Next.js defaults

---

## 10. Production Path (post-demo, do not build)

| Stage | Duration | What gets real |
|---|---|---|
| Demo | 1 session | Simulated AI, all UI working |
| Pilot — single category, single region | 8–12 weeks | Real ERP/PLM/POS read connectors; baseline forecast model |
| Pilot expansion | 4–6 weeks | Trend ingestion, wastage model, approval workflow live |
| Production | 12–16 weeks | Multi-region, write-back to ERP, closed-loop learning |

---

## 11. Open Questions for the Customer (post-demo)

- Which ERP and PLM are you on, and what's the realistic read-access path?
- Who owns the merchandising forecast process today?
- Current wastage / markdown leak as a % of inventory cost?
- Tagged historical catalog available, or built in pilot?
- Pilot region and category?
- Executive sponsor and their definition of pilot success?
