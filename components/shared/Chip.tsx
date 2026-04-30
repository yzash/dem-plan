import { HTMLAttributes, ReactNode } from "react";

type Tone = "neutral" | "teal" | "amber" | "success" | "danger" | "navy";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-navy-100 text-navy-600 border-navy-200",
  teal: "bg-teal/10 text-teal-dark border-teal/30",
  amber: "bg-amber/10 text-amber border-amber/30",
  success: "bg-success/10 text-success border-success/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  navy: "bg-navy-600 text-white border-navy-700",
};

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
};

export default function Chip({
  tone = "neutral",
  children,
  className = "",
  dot = false,
  ...rest
}: ChipProps) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide " +
        toneClasses[tone] +
        " " +
        className
      }
      {...rest}
    >
      {dot ? (
        <span
          className={
            "inline-block h-1.5 w-1.5 rounded-full " +
            (tone === "amber"
              ? "bg-amber"
              : tone === "danger"
              ? "bg-danger"
              : tone === "success" || tone === "teal"
              ? "bg-success"
              : "bg-navy-400")
          }
        />
      ) : null}
      {children}
    </span>
  );
}
