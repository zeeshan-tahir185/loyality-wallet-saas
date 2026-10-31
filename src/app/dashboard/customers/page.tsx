"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Gift, Search, Star, X, Zap } from "lucide-react";
import { ApplePass } from "@/components/pass";
import { Badge, PageHead } from "@/components/ui";
import { addVisit, redeemReward } from "@/lib/store";
import { timeAgo, useCurrentBusiness, useNow } from "@/lib/hooks";
import type { Customer } from "@/lib/types";

const FILTERS = ["All", "Reward ready", "Inactive 14d+", "Apple Wallet", "Google Wallet"] as const;
const DAY = 86_400_000;

export default function CustomersPage() {
  const { db, business } = useCurrentBusiness();
  const now = useNow();
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const [sel, setSel] = useState<string | null>(null);
  if (!db || !business) return null;
  const p = business.program;

  const all = db.customers.filter((c) => c.businessId === business.id);
  const match = (c: Customer) => {
    if (q && !`${c.name} ${c.phone}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (f === "Reward ready") return c.rewardsEarned > c.rewardsRedeemed;
    if (f === "Inactive 14d+") return now - new Date(c.lastVisit).getTime() > 14 * DAY;
    if (f === "Apple Wallet") return c.wallet === "apple";
    if (f === "Google Wallet") return c.wallet === "google";
    return true;
  };
  const rows = all.filter(match).sort((a, b) => (a.lastVisit < b.lastVisit ? 1 : -1));
  const cust = all.find((c) => c.id === sel);

  const exportCsv = () => {
    const head = ["Name", "Phone", "Visits", p.type === "stamps" ? "Stamps" : "Points", "Rewards earned", "Rewards redeemed", "Wallet", "Joined", "Last visit"];
    const lines = rows.map((c) => [c.name, c.phone, c.visits, p.type === "stamps" ? c.stamps : c.points, c.rewardsEarned, c.rewardsRedeemed, c.wallet, c.joinedAt.slice(0, 10), c.lastVisit.slice(0, 10)].map((x) => `"${x}"`).join(","));
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${business.slug}-customers.csv`;
    a.click();
  };

  return (
    <>
      <PageHead title="Customers" sub={`${all.length} members in your loyalty program`} actions={<button onClick={exportCsv} className="btn-ghost"><Download size={16} /> Export CSV</button>} />

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input pl-10" placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {FILTERS.map((x) => (
              <button key={x} onClick={() => setF(x)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${f === x ? "bg-ink text-white" : "bg-paper text-zinc-600 hover:text-ink"}`}>{x}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 text-right font-medium">Visits</th>
                <th className="px-4 py-3 font-medium">Rewards</th>
                <th className="px-4 py-3 font-medium">Wallet</th>
                <th className="px-4 py-3 font-medium">Last visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((c) => {
                const ready = c.rewardsEarned - c.rewardsRedeemed;
                const pct = p.type === "stamps" ? (c.stamps / p.stampsRequired) * 100 : Math.min(100, (c.points / p.tiers[p.tiers.length - 1].points) * 100);
                return (
                  <tr key={c.id} onClick={() => setSel(c.id)} className="cursor-pointer transition hover:bg-paper">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full bg-paper text-xs font-semibold">{c.name.split(" ").map((x) => x[0]).join("")}</span>
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold">{c.name} {c.reviewed && <Star size={12} className="text-amber-500" fill="currentColor" />}</div>
                          <div className="text-xs text-muted">{c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100">
                          <div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs tabular-nums text-muted">{p.type === "stamps" ? `${c.stamps}/${p.stampsRequired}` : `${c.points} pts`}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.visits}</td>
                    <td className="px-4 py-3">{ready > 0 ? <Badge tone="lime"><Gift size={11} /> {ready} ready</Badge> : <span className="text-muted">{c.rewardsRedeemed} redeemed</span>}</td>
                    <td className="px-4 py-3">{c.wallet === "apple" ? <Badge>Apple</Badge> : c.wallet === "google" ? <Badge tone="sky">Google</Badge> : <span className="text-muted">Not added</span>}</td>
                    <td className="px-4 py-3 text-muted">{timeAgo(c.lastVisit, now)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <div className="p-10 text-center text-muted">No customers match this filter.</div>}
        </div>
      </div>

      <AnimatePresence>
        {cust && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30" onClick={() => setSel(null)}>
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-paper p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-semibold">{cust.name}</div>
                  <div className="text-sm text-muted">{cust.phone} · member since {new Date(cust.joinedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}</div>
                </div>
                <button onClick={() => setSel(null)}><X /></button>
              </div>
              <div className="mt-5">
                <ApplePass business={business} customer={cust} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[["Visits", cust.visits], ["Earned", cust.rewardsEarned], ["Redeemed", cust.rewardsRedeemed]].map(([k, v]) => (
                  <div key={k} className="card p-3 text-center">
                    <div className="text-xl font-semibold tabular-nums">{v}</div>
                    <div className="text-xs text-muted">{k}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <button onClick={() => addVisit(cust.id, "staff", 20)} className="btn-lime flex-1"><Zap size={16} /> {p.type === "stamps" ? "Add stamp" : "Add points"}</button>
                {cust.rewardsEarned > cust.rewardsRedeemed && (
                  <button onClick={() => redeemReward(cust.id)} className="btn-ink flex-1"><Gift size={16} /> Redeem</button>
                )}
              </div>
              <div className="mt-6 text-sm font-semibold">History</div>
              <ul className="mt-2 space-y-2">
                {db.activity.filter((a) => a.customerId === cust.id).slice(0, 12).map((a) => (
                  <li key={a.id} className="flex justify-between rounded-xl bg-white px-3 py-2 text-sm">
                    <span className="capitalize">{a.kind === "points" ? `+${a.amount} points` : a.kind}</span>
                    <span className="text-muted">{timeAgo(a.at, now)}</span>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
