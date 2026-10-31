"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Building2, Euro, MoreHorizontal, Search, TrendingDown, Users } from "lucide-react";
import { Logo } from "@/components/brand";
import { BarChart } from "@/components/bar-chart";
import { BizMark } from "@/components/pass";
import { Badge, Loading } from "@/components/ui";
import { industry } from "@/lib/industries";
import { DISPLAY_CUSTOMER_COUNT } from "@/lib/seed";
import { setPlan, useDB } from "@/lib/store";
import { setCurrentBusiness } from "@/lib/hooks";
import type { Business } from "@/lib/types";

const PRICE = 29.99;
const STATUS: Record<Business["plan"], [string, "green" | "sky" | "red" | "zinc"]> = {
  active: ["Active", "green"],
  trialing: ["Trial", "sky"],
  past_due: ["Past due", "red"],
  canceled: ["Canceled", "zinc"],
};
const eur = (n: number) => `€${n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminPage() {
  const db = useDB();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Business["plan"]>("all");
  const [menu, setMenu] = useState<string | null>(null);
  if (!db) return <Loading />;

  const biz = db.businesses;
  const active = biz.filter((b) => b.plan === "active").length;
  const mrr = active * PRICE;
  const members = biz.reduce((s, b) => s + DISPLAY_CUSTOMER_COUNT[b.id], 0);
  const canceled = biz.filter((b) => b.plan === "canceled").length;

  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
    const count = biz.filter((b) => new Date(b.createdAt).getTime() < end && b.plan !== "trialing" && (b.plan !== "canceled" || i < 4)).length;
    return { label: d.toLocaleDateString("en", { month: "short" }), sub: d.toLocaleDateString("en", { month: "long", year: "numeric" }), value: i === 5 ? mrr : count * PRICE };
  });

  const rows = biz.filter((b) => (status === "all" || b.plan === status) && `${b.name} ${b.owner} ${b.city}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo dark />
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white/70">ADMIN</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-white/70 hover:text-white">Business view</Link>
            <span className="grid size-8 place-items-center rounded-full bg-lime text-xs font-bold text-ink">FA</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">Platform overview</h1>
        <p className="mt-1 text-muted">All businesses and subscriptions on LoopWallet.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Kpi icon={Euro} label="MRR" value={eur(mrr)} hint={`${active} paying × €29.99`} />
          <Kpi icon={Building2} label="Businesses" value={`${biz.length}`} hint={`${biz.filter((b) => b.plan === "trialing").length} on trial`} />
          <Kpi icon={Users} label="End customers" value={members.toLocaleString("en")} hint="across all programs" />
          <Kpi icon={TrendingDown} label="Churn" value={`${Math.round((canceled / biz.length) * 100)}%`} hint={`${canceled} canceled`} down />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="card p-6">
            <div className="font-semibold">Monthly recurring revenue</div>
            <div className="text-sm text-muted">Last 6 months</div>
            <div className="mt-6"><BarChart data={months} height={220} format={(v) => `€${Math.round(v)}`} /></div>
          </div>
          <div className="card p-6">
            <div className="font-semibold">By industry</div>
            <ul className="mt-4 space-y-3">
              {Object.entries(biz.reduce<Record<string, number>>((m, b) => ({ ...m, [b.industry]: (m[b.industry] ?? 0) + 1 }), {}))
                .sort((a, b) => b[1] - a[1])
                .map(([k, n]) => {
                  const ind = industry(k as Business["industry"]);
                  return (
                    <li key={k} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><ind.icon size={15} /> {ind.label}</span>
                        <span className="font-semibold tabular-nums">{n}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-ink" style={{ width: `${(n / biz.length) * 100 * 2.5}%` }} /></div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>

        <div className="card mt-6 overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center md:justify-between">
            <div className="font-semibold">Businesses & subscriptions</div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input className="input pl-10 sm:w-64" placeholder="Search businesses" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="input sm:w-40">
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="trialing">Trial</option>
                <option value="past_due">Past due</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Program</th>
                  <th className="px-4 py-3 text-right font-medium">Customers</th>
                  <th className="px-4 py-3 font-medium">Subscription</th>
                  <th className="px-4 py-3 font-medium">Since</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((b) => {
                  const [l, t] = STATUS[b.plan];
                  return (
                    <tr key={b.id} className="hover:bg-paper">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <BizMark program={b.program} size={34} />
                          <div>
                            <div className="font-semibold">{b.name}</div>
                            <div className="text-xs text-muted">{industry(b.industry).label} · {b.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><div>{b.owner}</div><div className="text-xs text-muted">{b.email}</div></td>
                      <td className="px-4 py-3 text-muted">{b.program.type === "stamps" ? `${b.program.stampsRequired} stamps` : "Points"}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{DISPLAY_CUSTOMER_COUNT[b.id].toLocaleString("en")}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><Badge tone={t}>{l}</Badge>{b.plan === "active" && <span className="text-xs text-muted">€29.99/mo</span>}</div></td>
                      <td className="px-4 py-3 text-muted">{new Date(b.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}</td>
                      <td className="relative px-4 py-3 text-right">
                        <button onClick={() => setMenu(menu === b.id ? null : b.id)} className="rounded-lg p-1.5 hover:bg-zinc-100"><MoreHorizontal size={18} /></button>
                        {menu === b.id && (
                          <div className="absolute right-4 top-11 z-20 w-48 rounded-xl border border-line bg-white p-1 text-left shadow-xl">
                            <MenuItem onClick={() => { setCurrentBusiness(b.id); router.push("/dashboard"); }}>Open dashboard</MenuItem>
                            <MenuItem onClick={() => window.open(`/c/${b.slug}`, "_blank")}>View customer card</MenuItem>
                            {b.plan !== "active" ? (
                              <MenuItem onClick={() => { setPlan(b.id, "active"); setMenu(null); }}>Activate subscription</MenuItem>
                            ) : (
                              <MenuItem danger onClick={() => { setPlan(b.id, "canceled"); setMenu(null); }}>Cancel subscription</MenuItem>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return <button onClick={onClick} className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-paper ${danger ? "text-red-600" : ""}`}>{children}</button>;
}

function Kpi({ icon: Icon, label, value, hint, down }: { icon: typeof Users; label: string; value: string; hint: string; down?: boolean }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-sm text-muted">{label} <Icon size={16} /></div>
      <div className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-1 text-xs text-muted">{!down && <ArrowUpRight size={12} className="text-emerald-600" />} {hint}</div>
    </div>
  );
}
