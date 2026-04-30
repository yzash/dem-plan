"use client";

import { Area, AreaChart, Line, ResponsiveContainer, YAxis } from "recharts";

type Props = {
  p10: number[];
  p50: number[];
  p90: number[];
  multiplier?: number;
  height?: number;
};

export default function Sparkline({ p10, p50, p90, multiplier = 1, height = 56 }: Props) {
  const data = p50.map((_, i) => ({
    w: i,
    p10: p10[i] * multiplier,
    p50: p50[i] * multiplier,
    p90: p90[i] * multiplier,
    band: (p90[i] - p10[i]) * multiplier,
    base: p10[i] * multiplier,
  }));
  return (
    <div style={{ height, width: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          <Area
            type="monotone"
            dataKey="base"
            stackId="1"
            stroke="none"
            fill="transparent"
          />
          <Area
            type="monotone"
            dataKey="band"
            stackId="1"
            stroke="none"
            fill="#0EA5A4"
            fillOpacity={0.18}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="p50"
            stroke="#0EA5A4"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
