import { ReactNode } from "react";

type KpiTileProps = {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaTone?: "success" | "danger" | "neutral";
  hint?: string;
  icon?: ReactNode;
};

export default function KpiTile({
  label,
  value,
  delta,
  deltaTone = "neutral",
  hint,
  icon,
}: KpiTileProps) {
  const deltaClass =
    deltaTone === "success"
      ? "text-success"
      : deltaTone === "danger"
      ? "text-danger"
      : "text-navy-400";
  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy-400">
          {label}
        </span>
        {icon ? <span className="text-navy-300">{icon}</span> : null}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold text-navy-600 kpi-number transition-colors">
        {value}
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta ? <span className={deltaClass + " font-medium"}>{delta}</span> : null}
        {hint ? <span className="text-navy-400">{hint}</span> : null}
      </div>
    </div>
  );
}
