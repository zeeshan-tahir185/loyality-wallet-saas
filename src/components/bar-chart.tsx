"use client";

import { useState } from "react";

export type Bar = { label: string; value: number; sub?: string };

export function BarChart({ data, height = 200, color = "#0c0c10", format = (v: number) => `${v}` }: { data: Bar[]; height?: number; color?: string; format?: (v: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const nice = max > 10 ? Math.ceil(max / 10) * 10 : Math.ceil(max / 2) * 2;
  const ticks = [0, nice / 2, nice];

  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 bottom-6 left-8">
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-dashed border-zinc-200" style={{ bottom: `${(t / nice) * 100}%` }}>
            <span className="absolute -left-8 -translate-y-1/2 text-[10px] tabular-nums text-muted">{format(t)}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end gap-[2px]">
          {data.map((d, i) => (
            <div
              key={i}
              className="relative flex h-full flex-1 items-end justify-center"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div
                className="w-full max-w-[26px] rounded-t-[4px] transition-all duration-500"
                style={{ height: `${(d.value / nice) * 100}%`, background: color, opacity: hover === null || hover === i ? 1 : 0.35, minHeight: d.value ? 2 : 0 }}
              />
              {hover === i && (
                <div className="pointer-events-none absolute bottom-full z-10 mb-1 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow-lg" style={{ bottom: `${(d.value / nice) * 100}%` }}>
                  <div className="font-semibold tabular-nums">{format(d.value)}</div>
                  <div className="text-white/60">{d.sub ?? d.label}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 left-8 flex gap-[2px]">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-muted">
            {data.length > 10 && i % 2 ? "" : d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
