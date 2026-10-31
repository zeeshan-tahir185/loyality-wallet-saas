"use client";

import { AnimatePresence, motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Gift } from "lucide-react";
import { industry } from "@/lib/industries";
import type { Business, Customer, Program } from "@/lib/types";

export const qrPayload = (c: Pick<Customer, "id">) => `LW1:${c.id}`;

export function BizIcon({ program, size = 18, className = "" }: { program: Program; size?: number; className?: string }) {
  const Icon = industry(program.icon).icon;
  return <Icon size={size} className={className} strokeWidth={2} />;
}

export function BizMark({ program, size = 36 }: { program: Program; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, background: program.accent, color: program.bg }}
    >
      <BizIcon program={program} size={size * 0.5} />
    </span>
  );
}

export function StampGrid({
  program,
  filled,
  size = "md",
  highlight = -1,
}: {
  program: Program;
  filled: number;
  size?: "sm" | "md";
  highlight?: number;
}) {
  const n = program.stampsRequired;
  const cols = n <= 5 ? n : n <= 6 ? 6 : n <= 8 ? 4 : 5;
  const dim = size === "sm" ? 26 : 34;
  return (
    <div className="grid justify-center gap-2" style={{ gridTemplateColumns: `repeat(${cols}, ${dim}px)` }}>
      {Array.from({ length: n }).map((_, i) => {
        const on = i < filled;
        const isLast = i === n - 1;
        return (
          <div key={i} className="relative" style={{ width: dim, height: dim }}>
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed"
              style={{ borderColor: `color-mix(in srgb, ${program.fg} 35%, transparent)` }}
            />
            {isLast && !on && (
              <div className="absolute inset-0 grid place-items-center" style={{ color: `color-mix(in srgb, ${program.fg} 55%, transparent)` }}>
                <Gift size={dim * 0.45} />
              </div>
            )}
            <AnimatePresence>
              {on && (
                <motion.div
                  key="on"
                  initial={i === highlight ? { scale: 2.2, opacity: 0, rotate: -25 } : false}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 16 }}
                  className="absolute inset-0 grid place-items-center rounded-full shadow-sm"
                  style={{ background: program.accent, color: program.bg }}
                >
                  <BizIcon program={program} size={dim * 0.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function nextTier(program: Program, points: number) {
  return program.tiers.find((t) => t.points > points) ?? program.tiers[program.tiers.length - 1];
}

function PointsMeter({ program, points }: { program: Program; points: number }) {
  const t = nextTier(program, points);
  const pct = Math.min(100, (points / t.points) * 100);
  return (
    <div className="px-1">
      <div className="flex items-end justify-between">
        <motion.span key={points} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-semibold tabular-nums tracking-tight">
          {points}
        </motion.span>
        <span className="pb-1 text-[11px] opacity-70">{Math.max(0, t.points - points)} pts to {t.name}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: `color-mix(in srgb, ${program.fg} 18%, transparent)` }}>
        <motion.div className="h-full rounded-full" style={{ background: program.accent }} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] opacity-60">
        {program.tiers.map((x) => (
          <span key={x.id} className="flex items-center gap-1">
            {points >= x.points && <Check size={10} />} {x.points}
          </span>
        ))}
      </div>
    </div>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[9px] font-semibold uppercase tracking-[0.12em] opacity-60">{children}</div>
);

type PassProps = {
  business: Pick<Business, "name"> & { program: Program };
  customer: Pick<Customer, "id" | "name" | "stamps" | "points" | "rewardsEarned" | "rewardsRedeemed">;
  highlight?: number;
  showQR?: boolean;
};

export function ApplePass({ business, customer, highlight, showQR = true }: PassProps) {
  const p = business.program;
  const available = customer.rewardsEarned - customer.rewardsRedeemed;
  return (
    <div
      className="relative w-full overflow-hidden rounded-[14px] p-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,.45)]"
      style={{ background: p.bg, color: p.fg }}
    >
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <BizMark program={p} size={30} />
          <span className="truncate text-[15px] font-semibold">{business.name}</span>
        </div>
        <div className="text-right">
          <Label>{p.type === "stamps" ? "Stamps" : "Points"}</Label>
          <div className="text-lg font-semibold tabular-nums leading-tight">
            {p.type === "stamps" ? `${customer.stamps}/${p.stampsRequired}` : customer.points}
          </div>
        </div>
      </div>

      <div className="-mx-4 mt-3 px-4 py-4" style={{ background: `color-mix(in srgb, ${p.fg} 7%, transparent)` }}>
        {p.type === "stamps" ? <StampGrid program={p} filled={customer.stamps} highlight={highlight} /> : <PointsMeter program={p} points={customer.points} />}
      </div>

      <div className="mt-3 flex justify-between gap-3">
        <div className="min-w-0">
          <Label>Reward</Label>
          <div className="text-[13px] font-medium leading-snug">{p.type === "stamps" ? p.stampReward : nextTier(p, customer.points).name}</div>
        </div>
        <div className="shrink-0 text-right">
          <Label>Member</Label>
          <div className="whitespace-nowrap text-[13px] font-medium">{customer.name}</div>
        </div>
      </div>

      {available > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold"
          style={{ background: p.accent, color: p.bg }}
        >
          <Gift size={14} /> {available} reward{available > 1 ? "s" : ""} ready to redeem
        </motion.div>
      )}

      {showQR && (
        <div className="mt-4 flex flex-col items-center">
          <div className="rounded-lg bg-white p-2.5">
            <QRCodeSVG value={qrPayload(customer)} size={104} level="M" />
          </div>
          <div className="mt-1.5 font-mono text-[10px] tracking-wider opacity-60">{customer.id.toUpperCase()}</div>
        </div>
      )}
    </div>
  );
}

export function GooglePass({ business, customer, highlight, showQR = true }: PassProps) {
  const p = business.program;
  const available = customer.rewardsEarned - customer.rewardsRedeemed;
  return (
    <div className="w-full overflow-hidden rounded-[22px] shadow-[0_18px_40px_-12px_rgba(0,0,0,.4)]" style={{ background: p.bg, color: p.fg }}>
      <div className="flex items-center gap-2.5 px-4 pt-4">
        <BizMark program={p} size={32} />
        <span className="truncate text-[14px] font-medium">{business.name}</span>
      </div>
      <div className="px-4 pt-3">
        <div className="text-[11px] opacity-70">Loyalty card</div>
        <div className="text-[22px] font-medium leading-tight">{customer.name}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        <div>
          <div className="text-[11px] opacity-70">{p.type === "stamps" ? "Stamps" : "Points"}</div>
          <div className="text-[15px] font-medium tabular-nums">{p.type === "stamps" ? `${customer.stamps} of ${p.stampsRequired}` : customer.points}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] opacity-70">Rewards</div>
          <div className="text-[15px] font-medium">{available > 0 ? `${available} available` : "None"}</div>
        </div>
      </div>
      {showQR && (
        <div className="flex justify-center pt-4">
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG value={qrPayload(customer)} size={112} level="M" />
          </div>
        </div>
      )}
      <div className="mt-4 px-4 py-4" style={{ background: `color-mix(in srgb, ${p.fg} 8%, transparent)` }}>
        {p.type === "stamps" ? <StampGrid program={p} filled={customer.stamps} highlight={highlight} size="sm" /> : <PointsMeter program={p} points={customer.points} />}
      </div>
    </div>
  );
}
