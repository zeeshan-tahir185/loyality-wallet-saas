"use client";

import Link from "next/link";
import { ArrowUpRight, Gift, Palette, QrCode, Repeat, ScanLine, Star, Users } from "lucide-react";
import { BarChart } from "@/components/bar-chart";
import { ApplePass } from "@/components/pass";
import { PageHead } from "@/components/ui";
import { timeAgo, useCurrentBusiness, useNow } from "@/lib/hooks";

const DAY = 86_400_000;

export default function Overview() {
  const { db, business } = useCurrentBusiness();
  const now = useNow();
  if (!db || !business) return null;

  const customers = db.customers.filter((c) => c.businessId === business.id);
  const acts = db.activity.filter((a) => a.businessId === business.id);
  const visits = acts.filter((a) => a.kind === "stamp" || a.kind === "points");
  const in30 = (a: { at: string }) => now - new Date(a.at).getTime() < 30 * DAY;
  const visits30 = visits.filter(in30).length;
  const redeemed30 = acts.filter((a) => a.kind === "redeem" && in30(a)).length;
  const returning = customers.filter((c) => c.visits > 1).length;
  const returnRate = customers.length ? Math.round((returning / customers.length) * 100) : 0;
  const walletSaved = customers.filter((c) => c.wallet !== "none").length;
  const reviews = customers.filter((c) => c.reviewed).length;

  const days = Array.from({ length: 14 }).map((_, i) => {
    const start = new Date(now - (13 - i) * DAY);
    start.setHours(0, 0, 0, 0);
    const end = start.getTime() + DAY;
    const v = visits.filter((a) => {
      const t = new Date(a.at).getTime();
      return t >= start.getTime() && t < end;
    }).length;
    return { label: start.toLocaleDateString("en", { day: "numeric" }), sub: start.toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" }), value: v };
  });

  const top = [...customers].sort((a, b) => b.visits - a.visits).slice(0, 5);
  const staffShare = visits.length ? Math.round((visits.filter((v) => v.method === "staff").length / visits.length) * 100) : 0;
  const apple = customers.filter((c) => c.wallet === "apple").length;
  const google = customers.filter((c) => c.wallet === "google").length;

  return (
    <>
      <PageHead
        title={`Good ${new Date(now).getHours() < 12 ? "morning" : new Date(now).getHours() < 18 ? "afternoon" : "evening"}, ${business.owner.split(" ")[0]}`}
        sub={`Here's how ${business.name} is doing.`}
        actions={
          <>
            <Link href="/dashboard/qr" className="btn-ghost"><QrCode size={16} /> Counter QR</Link>
            <Link href="/dashboard/scanner" className="btn-ink"><ScanLine size={16} /> Open scanner</Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={Users} label="Members" value={customers.length} hint={`+${customers.filter((c) => now - new Date(c.joinedAt).getTime() < 7 * DAY).length} this week`} />
        <Kpi icon={Repeat} label="Visits · 30 days" value={visits30} hint={`${staffShare}% scanned by staff`} />
        <Kpi icon={Gift} label="Rewards redeemed" value={redeemed30} hint="last 30 days" />
        <Kpi icon={Star} label="Returning rate" value={`${returnRate}%`} hint={`${returning} came back`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Visits</div>
              <div className="text-sm text-muted">Stamps and points collected per day, last 14 days</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums">{days.reduce((s, d) => s + d.value, 0)}</div>
              <div className="text-xs text-muted">total</div>
            </div>
          </div>
          <div className="mt-6">
            <BarChart data={days} height={220} format={(v) => `${Math.round(v)}`} />
          </div>
        </div>

        <div className="card p-6">
          <div className="font-semibold">Wallet adoption</div>
          <div className="text-sm text-muted">{walletSaved} of {customers.length} members saved the card</div>
          <div className="mt-5 flex h-3 gap-[2px] overflow-hidden rounded-full">
            <div className="rounded-l-full bg-ink" style={{ width: `${(apple / Math.max(1, customers.length)) * 100}%` }} />
            <div className="bg-zinc-400" style={{ width: `${(google / Math.max(1, customers.length)) * 100}%` }} />
            <div className="flex-1 rounded-r-full bg-zinc-200" />
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <Legend color="bg-ink" label="Apple Wallet" v={apple} />
            <Legend color="bg-zinc-400" label="Google Wallet" v={google} />
            <Legend color="bg-zinc-200" label="Web card only" v={customers.length - apple - google} />
          </ul>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-paper p-3 text-sm">
            <span className="flex items-center gap-2"><Star size={16} className="text-amber-500" fill="currentColor" /> Google reviews from members</span>
            <span className="font-semibold">{reviews}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Your card</div>
            <Link href="/dashboard/card" className="flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"><Palette size={14} /> Edit</Link>
          </div>
          <div className="mt-4">
            <ApplePass business={business} customer={{ id: "preview", name: "Your customer", stamps: Math.ceil(business.program.stampsRequired / 2), points: 140, rewardsEarned: 0, rewardsRedeemed: 0 }} showQR={false} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Top customers</div>
            <Link href="/dashboard/customers" className="text-sm font-medium text-muted hover:text-ink">View all</Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {top.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 py-2.5">
                <span className="w-4 text-xs text-muted">{i + 1}</span>
                <span className="grid size-8 place-items-center rounded-full bg-paper text-xs font-semibold">{c.name.split(" ").map((x) => x[0]).join("")}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</span>
                <span className="text-sm tabular-nums text-muted">{c.visits} visits</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="font-semibold">Recent activity</div>
          <ul className="mt-3 space-y-3">
            {acts.slice(0, 6).map((a) => {
              const c = customers.find((x) => x.id === a.customerId);
              const label = { stamp: "collected a stamp", points: `earned ${a.amount} points`, reward: "unlocked a reward", redeem: "redeemed a reward", join: "joined the program", review: "left a Google review", wallet: "saved the card to wallet" }[a.kind];
              return (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-lime-deep" />
                  <div className="min-w-0">
                    <span className="font-medium">{c?.name}</span> <span className="text-zinc-600">{label}</span>
                    <div className="text-xs text-muted">{timeAgo(a.at, now)}{a.method !== "system" ? ` · ${a.method === "staff" ? "staff scan" : "self-scan"}` : ""}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

function Kpi({ icon: Icon, label, value, hint }: { icon: typeof Users; label: string; value: number | string; hint: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-sm text-muted">
        {label} <Icon size={16} />
      </div>
      <div className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-1 text-xs text-muted"><ArrowUpRight size={12} className="text-emerald-600" /> {hint}</div>
    </div>
  );
}

function Legend({ color, label, v }: { color: string; label: string; v: number }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${color}`} />{label}</span>
      <span className="font-semibold tabular-nums">{v}</span>
    </li>
  );
}

