"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  format: (n: number) => string;
  duration?: number;
};

export default function AnimatedNumber({ value, format, duration = 420 }: Props) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = shown;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const target = value;
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setShown(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <>{format(shown)}</>;
}
