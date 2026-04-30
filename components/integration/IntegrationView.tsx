"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Node,
  Edge,
  ReactFlowProvider,
  NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import KpiTile from "@/components/shared/KpiTile";
import SignalNode, { SignalNodeData } from "./SignalNode";
import SignalDrawer, { DrawerPayload } from "./SignalDrawer";
import { Activity, Database, Radio, Workflow } from "lucide-react";
import {
  signals as seedSignals,
  Freshness,
  InternalSignal,
  ExternalSignal,
} from "@/data/signals";

const nodeTypes = { signal: SignalNode };

const FRESH_EDGE: Record<Freshness, string> = {
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
};

type LiveState = {
  internal: InternalSignal[];
  external: ExternalSignal[];
};

function jitter(base: number, max: number) {
  const delta = Math.round((Math.random() - 0.35) * max);
  return Math.max(1, base + delta);
}

export default function IntegrationView() {
  return (
    <ReactFlowProvider>
      <IntegrationInner />
    </ReactFlowProvider>
  );
}

function IntegrationInner() {
  const [state, setState] = useState<LiveState>(() => ({
    internal: seedSignals.internal.map((s) => ({ ...s })),
    external: seedSignals.external.map((s) => ({ ...s })),
  }));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Counter ticking
  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => ({
        internal: prev.internal.map((s) => ({
          ...s,
          eventsPerHour: jitter(s.eventsPerHour, Math.max(8, Math.round(s.eventsPerHour * 0.04))),
        })),
        external: prev.external.map((s) => ({
          ...s,
          signalsPerDay: jitter(s.signalsPerDay, Math.max(6, Math.round(s.signalsPerDay * 0.05))),
        })),
      }));
      lastTickRef.current = Date.now();
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Build nodes and edges from current state
  const { nodes, edges } = useMemo(() => {
    const ns: Node<SignalNodeData>[] = [];
    const es: Edge[] = [];

    const HUB_X = 0;
    const HUB_Y = 0;
    ns.push({
      id: "hub",
      type: "signal",
      position: { x: HUB_X, y: HUB_Y },
      data: {
        label: "TrendPulse",
        metric: "hub",
        value: 0,
        freshness: "green",
        side: "hub",
      },
      draggable: false,
    });

    const internalCount = state.internal.length;
    const externalCount = state.external.length;
    const SPACING = 90;
    const internalStart = -((internalCount - 1) * SPACING) / 2;
    const externalStart = -((externalCount - 1) * SPACING) / 2;

    state.internal.forEach((s, i) => {
      const id = `int-${s.system}`;
      ns.push({
        id,
        type: "signal",
        position: { x: -540, y: internalStart + i * SPACING },
        data: {
          label: s.system,
          metric: "events/hr",
          value: s.eventsPerHour,
          freshness: s.freshness,
          side: "internal",
        },
        draggable: false,
      });
      es.push({
        id: `e-${id}`,
        source: id,
        target: "hub",
        animated: true,
        style: { stroke: FRESH_EDGE[s.freshness], strokeWidth: 1.6, strokeDasharray: "5 4" },
        markerEnd: { type: MarkerType.ArrowClosed, color: FRESH_EDGE[s.freshness] },
      });
    });

    state.external.forEach((s, i) => {
      const id = `ext-${s.source}`;
      ns.push({
        id,
        type: "signal",
        position: { x: 540, y: externalStart + i * SPACING },
        data: {
          label: s.source,
          metric: "signals/day",
          value: s.signalsPerDay,
          freshness: s.freshness,
          side: "external",
        },
        draggable: false,
      });
      es.push({
        id: `e-${id}`,
        source: "hub",
        target: id,
        animated: true,
        style: { stroke: FRESH_EDGE[s.freshness], strokeWidth: 1.6, strokeDasharray: "5 4" },
        markerEnd: { type: MarkerType.ArrowClosed, color: FRESH_EDGE[s.freshness] },
      });
    });

    return { nodes: ns, edges: es };
  }, [state]);

  // Aggregates
  const totalEventsHr = useMemo(
    () => state.internal.reduce((a, s) => a + s.eventsPerHour, 0),
    [state.internal],
  );
  const totalSignalsDay = useMemo(
    () => state.external.reduce((a, s) => a + s.signalsPerDay, 0),
    [state.external],
  );
  const freshnessSLA = useMemo(() => {
    const all = [...state.internal, ...state.external];
    const green = all.filter((s) => s.freshness === "green").length;
    return Math.round((green / all.length) * 100);
  }, [state]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_e, node) => {
      if (node.id === "hub") return;
      const isInternal = node.id.startsWith("int-");
      if (isInternal) {
        const s = state.internal.find((x) => `int-${x.system}` === node.id);
        if (!s) return;
        setDrawerPayload({
          title: s.system,
          side: "internal",
          type: s.type,
          freshness: s.freshness,
          connector: s.connector,
          cadence: s.cadence,
          owner: s.owner,
          lastSync: s.lastSync,
          sampleEventName: s.sampleEventName,
          samplePayload: s.samplePayload,
          rate: `${s.eventsPerHour.toLocaleString()} events / hour`,
        });
      } else {
        const s = state.external.find((x) => `ext-${x.source}` === node.id);
        if (!s) return;
        setDrawerPayload({
          title: s.source,
          side: "external",
          type: s.type,
          freshness: s.freshness,
          connector: s.connector,
          cadence: s.cadence,
          owner: s.owner,
          lastSync: s.lastSync,
          sampleEventName: s.sampleEventName,
          samplePayload: s.samplePayload,
          rate: `${s.signalsPerDay.toLocaleString()} signals / day`,
        });
      }
      setDrawerOpen(true);
    },
    [state],
  );

  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-600">
            Integration & Signal Map
          </h1>
          <p className="mt-1 text-sm text-navy-400">
            Read-only intelligence layer over your existing systems and external trend signals.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiTile
          label="Total events / hr"
          value={totalEventsHr.toLocaleString()}
          hint="across 8 internal systems"
          icon={<Database size={16} />}
        />
        <KpiTile
          label="Total signals / day"
          value={totalSignalsDay.toLocaleString()}
          hint="7 external sources"
          icon={<Radio size={16} />}
        />
        <KpiTile
          label="Freshness SLA"
          value={`${freshnessSLA}%`}
          delta={freshnessSLA >= 85 ? "within target" : "monitor"}
          deltaTone={freshnessSLA >= 85 ? "success" : "danger"}
          icon={<Activity size={16} />}
        />
        <KpiTile
          label="AI workloads running"
          value="4"
          hint="forecast · wastage · allocation · lookalike"
          icon={<Workflow size={16} />}
        />
      </div>

      <div className="mt-5 h-[640px] overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          panOnDrag
          zoomOnScroll
          onNodeClick={onNodeClick}
          proOptions={{ hideAttribution: true }}
          minZoom={0.4}
          maxZoom={1.4}
        >
          <Background color="#E5E9F2" gap={28} />
          <Controls position="bottom-right" showInteractive={false} />
        </ReactFlow>
      </div>

      <p className="mt-3 text-[11px] text-navy-400">
        Click any node to inspect the connector, cadence, and a sample webhook payload. Counters tick every 2s as new events flow.
      </p>

      <SignalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        payload={drawerPayload}
      />
    </div>
  );
}
