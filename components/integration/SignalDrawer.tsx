"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Chip from "@/components/shared/Chip";
import { Freshness } from "@/data/signals";

export type DrawerPayload = {
  title: string;
  side: "internal" | "external";
  type: string;
  freshness: Freshness;
  connector: string;
  cadence: string;
  owner: string;
  lastSync: string;
  sampleEventName: string;
  samplePayload: string;
  rate: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  payload: DrawerPayload | null;
};

const TONE: Record<Freshness, "success" | "amber" | "danger"> = {
  green: "success",
  amber: "amber",
  red: "danger",
};

export default function SignalDrawer({ open, onClose, payload }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={
          "fixed inset-0 z-40 bg-navy-900/30 transition-opacity " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      <aside
        className={
          "fixed right-0 top-0 z-50 h-full w-[420px] max-w-[90vw] border-l border-navy-100 bg-white shadow-2xl transition-transform duration-300 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        {payload ? (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b border-navy-100 p-5">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-navy-400">
                  {payload.side === "external" ? "External signal" : "Internal system"}
                </div>
                <h2 className="mt-1 text-lg font-semibold text-navy-600">
                  {payload.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Chip tone={TONE[payload.freshness]} dot>
                    {payload.freshness}
                  </Chip>
                  <Chip>{payload.type}</Chip>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-navy-400">
                    Connector
                  </dt>
                  <dd className="mt-0.5 font-medium text-navy-600">
                    {payload.connector}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-navy-400">
                    Refresh cadence
                  </dt>
                  <dd className="mt-0.5 font-medium text-navy-600">
                    {payload.cadence}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-navy-400">
                    Data owner
                  </dt>
                  <dd className="mt-0.5 font-medium text-navy-600">
                    {payload.owner}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-navy-400">
                    Last sync
                  </dt>
                  <dd className="mt-0.5 font-medium text-navy-600">
                    {payload.lastSync}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[11px] uppercase tracking-wide text-navy-400">
                    Volume
                  </dt>
                  <dd className="mt-0.5 font-mono font-medium text-navy-600 kpi-number">
                    {payload.rate}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-navy-600">
                    Webhook contract
                  </h3>
                  <Chip tone="teal">{payload.sampleEventName}</Chip>
                </div>
                <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-navy-100 bg-navy-50 p-3 font-mono text-[11px] leading-relaxed text-navy-600 scrollbar-thin">
{payload.samplePayload}
                </pre>
              </div>

              <div className="mt-6 rounded-lg border border-teal/30 bg-teal/5 p-3 text-xs text-navy-600">
                <span className="font-semibold text-teal-dark">Read-only by default.</span>{" "}
                Write-back is gated behind merchandiser approval (see Allocation).
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
