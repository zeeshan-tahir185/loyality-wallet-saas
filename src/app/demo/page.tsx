"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Camera,
  Check,
  Gift,
  LayoutDashboard,
  Loader2,
  QrCode,
  RotateCcw,
  ScanLine,
  Sparkles,
  Stamp,
  Store,
  UserRound,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { Loading } from "@/components/ui";
import { ApplePass, BizMark, GooglePass } from "@/components/pass";
import { Phone, type Toast, WalletStack } from "@/components/phone";
import { addVisit, redeemReward, resetDemo, useDB } from "@/lib/store";
import { counterCode, timeAgo, useNow } from "@/lib/hooks";
import type { Activity, Business, Customer } from "@/lib/types";

const DEMO_BIZ = ["biz_0", "biz_1", "biz_2", "biz_3"];

export default function DemoPage() {
  const db = useDB();
  const now = useNow(1000);
  const [bizId, setBizId] = useState("biz_0");
  const [mode, setMode] = useState<"staff" | "self">("staff");
  const [platform, setPlatform] = useState<"apple" | "google">("apple");
  const [phase, setPhase] = useState<"idle" | "scanning" | "found">("idle");
  const [phoneScreen, setPhoneScreen] = useState<"wallet" | "camera" | "reading">("wallet");
  const [spend, setSpend] = useState(25);
  const [toast, setToast] = useState<Toast>(null);
  const [highlight, setHighlight] = useState(-1);
  const [origin, setOrigin] = useState("");
  const phoneRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  if (!db) return <Loading />;

  const business = db.businesses.find((b) => b.id === bizId)!;
  const customer = db.customers.find((c) => c.businessId === bizId)!;
  const p = business.program;
  const available = customer.rewardsEarned - customer.rewardsRedeemed;
  const feed = db.activity.filter((a) => a.businessId === bizId).slice(0, 7);

  const celebrate = () => {
    const r = phoneRef.current?.getBoundingClientRect();
    const origin = r ? { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height * 0.35) / window.innerHeight } : { x: 0.7, y: 0.4 };
    confetti({ particleCount: 140, spread: 80, origin, colors: [p.accent, "#c6f36b", p.fg, "#ffffff"] });
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin, colors: [p.accent, "#c6f36b"] }), 250);
  };

  const applyVisit = (method: "staff" | "self") => {
    const res = addVisit(customer.id, method, p.type === "points" ? spend : 0);
    if (!res) return;
    const c = res.customer;
    if (res.rewardUnlocked) {
      setHighlight(-1);
      setToast({ id: Date.now(), title: business.name, body: p.type === "stamps" ? `Card complete! ${p.stampReward} unlocked 🎉` : `New reward unlocked 🎉`, icon: <Gift size={18} /> });
      celebrate();
    } else if (p.type === "stamps") {
      setHighlight(c.stamps - 1);
      const left = p.stampsRequired - c.stamps;
      setToast({ id: Date.now(), title: business.name, body: `You collected a stamp! ${c.stamps}/${p.stampsRequired}. ${left} more for ${p.stampReward.toLowerCase()}.`, icon: <Stamp size={18} /> });
    } else {
      setToast({ id: Date.now(), title: business.name, body: `+${p.pointsPerVisit + Math.round(spend * p.pointsPerEuro)} points! You now have ${c.points} points.`, icon: <Sparkles size={18} /> });
    }
  };

  const startScan = () => {
    setPhase("scanning");
    later(() => setPhase("found"), 1300);
  };

  const staffAdd = () => {
    applyVisit("staff");
  };

  const customerScan = () => {
    setPhoneScreen("reading");
    later(() => {
      setPhoneScreen("wallet");
      later(() => applyVisit("self"), 350);
    }, 1200);
  };

  const switchBiz = (id: string) => {
    clearTimers();
    setBizId(id);
    setPhase("idle");
    setHighlight(-1);
    setPhoneScreen(mode === "self" ? "camera" : "wallet");
  };

  const switchMode = (m: "staff" | "self") => {
    clearTimers();
    setMode(m);
    setPhase("idle");
    setPhoneScreen(m === "self" ? "camera" : "wallet");
  };

  const code = counterCode(business.id, Math.floor(now / 30_000));
  const secondsLeft = 30 - (Math.floor(now / 1000) % 30);
  const counterUrl = `${origin}/c/${business.slug}?t=${code}`;

  return (
    <div className="min-h-screen bg-[#ececE6]">
      <header className="border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-lime sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-lime" /> LIVE DEMO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { resetDemo(); switchBiz(bizId); }} className="btn-ghost hidden px-3.5 py-2 sm:inline-flex" title="Reset demo data">
              <RotateCcw size={15} /> Reset
            </button>
            <Link href="/dashboard" className="btn-ink px-4 py-2">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft size={14} /> Back to site</Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Watch a stamp land in the <em className="font-display font-normal italic">wallet</em>, live.
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-600">Left is the business. Right is the customer&apos;s phone. Pick a business type and a stamping method, then try it.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_BIZ.map((id) => {
              const b = db.businesses.find((x) => x.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => switchBiz(id)}
                  className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-medium transition ${bizId === id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-zinc-400"}`}
                >
                  <BizMark program={b.program} size={26} />
                  {b.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Segmented
            value={mode}
            onChange={(v) => switchMode(v as "staff" | "self")}
            options={[
              { v: "staff", label: "Staff scans customer", icon: <ScanLine size={15} /> },
              { v: "self", label: "Customer scans counter QR", icon: <QrCode size={15} /> },
            ]}
          />
          <Segmented
            value={platform}
            onChange={(v) => setPlatform(v as "apple" | "google")}
            options={[
              { v: "apple", label: "Apple Wallet" },
              { v: "google", label: "Google Wallet" },
            ]}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-6">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <Store size={18} />
                  <span className="font-semibold">{mode === "staff" ? "Staff scanner" : "Counter display"}</span>
                  <span className="text-sm text-muted">· {business.name}</span>
                </div>
                <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-muted">{p.type === "stamps" ? `Stamp card · ${p.stampsRequired} stamps` : "Points program"}</span>
              </div>

              {mode === "staff" ? (
                <StaffScanner
                  phase={phase}
                  business={business}
                  customer={customer}
                  available={available}
                  spend={spend}
                  setSpend={setSpend}
                  onScan={startScan}
                  onAdd={staffAdd}
                  onRedeem={() => {
                    redeemReward(customer.id, p.type === "points" ? p.tiers.find((t) => t.points <= customer.points)?.points : undefined);
                    setToast({ id: Date.now(), title: business.name, body: "Reward redeemed. Enjoy! 🙌", icon: <Check size={18} /> });
                  }}
                  onReset={() => setPhase("idle")}
                />
              ) : (
                <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
                  <div className="mx-auto flex w-[230px] flex-col items-center rounded-3xl p-5 text-center" style={{ background: p.bg, color: p.fg }}>
                    <BizMark program={p} size={44} />
                    <div className="mt-2 font-semibold">{business.name}</div>
                    <div className="text-xs opacity-70">Scan to collect your {p.type === "stamps" ? "stamp" : "points"}</div>
                    <div className="mt-4 rounded-2xl bg-white p-3">
                      {origin && <QRCodeSVG value={counterUrl} size={160} level="M" />}
                    </div>
                    <div className="mt-3 flex items-center gap-2 font-mono text-xs">
                      <span className="rounded bg-white/15 px-1.5 py-0.5 tracking-widest">{code}</span>
                      <span className="opacity-70">new code in {secondsLeft}s</span>
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/15">
                      <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${(secondsLeft / 30) * 100}%`, background: p.accent }} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold tracking-tight">Customers stamp themselves.</h3>
                    <p className="mt-2 text-zinc-600">
                      Put this QR on the counter or a tablet. The code refreshes every 30 seconds, so a photo of it can&apos;t be reused at home.
                    </p>
                    <ol className="mt-5 space-y-2.5 text-sm">
                      <li className="flex gap-3"><Num n={1} /> Tap <b>Scan counter QR</b> on the phone →</li>
                      <li className="flex gap-3"><Num n={2} /> The camera reads the rotating code</li>
                      <li className="flex gap-3"><Num n={3} /> The stamp appears on the wallet card</li>
                    </ol>
                    <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-paper p-4 text-sm">
                      <div className="flex items-center gap-2 font-semibold"><Camera size={16} /> Try it with your real phone</div>
                      <div className="mt-1 text-muted">Point your phone camera at this QR. It opens the customer card for {business.name} in your browser.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <ActivityFeed feed={feed} customers={db.customers} now={now} />
              <CustomerSummary business={business} customer={customer} available={available} />
            </div>
          </div>

          <div ref={phoneRef} className="flex flex-col items-center gap-3 lg:sticky lg:top-6 lg:self-start">
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <UserRound size={15} /> {customer.name}&apos;s phone
            </div>
            <Phone toast={toast}>
              <AnimatePresence mode="wait">
                {phoneScreen === "wallet" ? (
                  <motion.div key={`w-${platform}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-full">
                    <WalletStack platform={platform}>
                      {platform === "apple" ? (
                        <ApplePass business={business} customer={customer} highlight={highlight} />
                      ) : (
                        <GooglePass business={business} customer={customer} highlight={highlight} />
                      )}
                      {mode === "self" && (
                        <button onClick={() => setPhoneScreen("camera")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-sm font-semibold">
                          <Camera size={16} /> Open camera to scan again
                        </button>
                      )}
                    </WalletStack>
                  </motion.div>
                ) : (
                  <motion.div key="cam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex min-h-full flex-col items-center bg-zinc-900 px-6 pt-6">
                    <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">Photo · QR</div>
                    <div className="relative mt-6 grid size-[230px] place-items-center rounded-3xl bg-gradient-to-br from-zinc-700 to-zinc-800">
                      <div className="rounded-xl bg-white p-2 opacity-90" style={{ transform: "perspective(400px) rotateX(12deg) rotateZ(-4deg)" }}>
                        {origin && <QRCodeSVG value={counterUrl} size={120} />}
                      </div>
                      <Corners active={phoneScreen === "reading"} />
                    </div>
                    <div className="mt-5 h-12 text-center text-sm">
                      {phoneScreen === "reading" ? (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 font-semibold text-black">
                          <Loader2 size={15} className="animate-spin" /> {business.slug}.loopwallet.app
                        </motion.div>
                      ) : (
                        <span className="text-white/70">Point the camera at the counter QR</span>
                      )}
                    </div>
                    <button
                      onClick={customerScan}
                      disabled={phoneScreen === "reading"}
                      className="mt-6 grid size-[74px] place-items-center rounded-full border-4 border-white/90 transition active:scale-95"
                      aria-label="Scan counter QR"
                    >
                      <span className="grid size-[58px] place-items-center rounded-full bg-white text-black"><QrCode size={24} /></span>
                    </button>
                    <div className="mt-3 text-xs font-semibold">Scan counter QR</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Phone>
            <div className="text-xs text-muted">The card updates the moment the business adds a stamp.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffScanner({
  phase,
  business,
  customer,
  available,
  spend,
  setSpend,
  onScan,
  onAdd,
  onRedeem,
  onReset,
}: {
  phase: "idle" | "scanning" | "found";
  business: Business;
  customer: Customer;
  available: number;
  spend: number;
  setSpend: (n: number) => void;
  onScan: () => void;
  onAdd: () => void;
  onRedeem: () => void;
  onReset: () => void;
}) {
  const p = business.program;
  return (
    <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
      <div className="relative mx-auto size-[230px] overflow-hidden rounded-3xl bg-ink">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 30%, #444, transparent 60%)" }} />
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            animate={phase === "scanning" ? { scale: [0.9, 1, 0.95], rotate: [-6, -2, -4] } : { scale: 0.92, rotate: -4 }}
            transition={{ duration: 1.3 }}
            className="rounded-xl bg-white p-2"
          >
            <QRCodeSVG value={`LW1:${customer.id}`} size={110} />
          </motion.div>
        </div>
        <Corners active={phase !== "idle"} />
        {phase === "scanning" && <div className="scanline absolute inset-x-4 top-4 h-0.5 rounded bg-lime shadow-[0_0_14px_3px_rgba(198,243,107,.8)]" />}
        <AnimatePresence>
          {phase === "found" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-lime/90">
              <motion.div initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="grid size-16 place-items-center rounded-full bg-ink text-lime">
                <Check size={34} strokeWidth={3} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {phase !== "found" ? (
            <motion.div key="scan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h3 className="text-2xl font-semibold tracking-tight">Scan the customer&apos;s card</h3>
              <p className="mt-2 text-zinc-600">The customer opens the pass in Apple or Google Wallet and shows the QR. Staff scan it with this page on any phone or tablet.</p>
              <button onClick={onScan} disabled={phase === "scanning"} className="btn-ink mt-6 px-6 py-3.5 text-base">
                {phase === "scanning" ? <><Loader2 size={18} className="animate-spin" /> Scanning…</> : <><ScanLine size={18} /> Scan customer QR</>}
              </button>
            </motion.div>
          ) : (
            <motion.div key="found" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-paper text-lg font-semibold">{customer.name.split(" ").map((x) => x[0]).join("")}</div>
                <div>
                  <div className="text-lg font-semibold">{customer.name}</div>
                  <div className="text-sm text-muted">
                    {customer.visits} visits · {p.type === "stamps" ? `${customer.stamps}/${p.stampsRequired} stamps` : `${customer.points} points`}
                  </div>
                </div>
              </div>

              {p.type === "points" && (
                <div className="mt-5">
                  <label className="text-sm font-medium">Purchase amount</label>
                  <div className="mt-1.5 flex items-center gap-2">
                    {[10, 25, 50].map((v) => (
                      <button key={v} onClick={() => setSpend(v)} className={`rounded-xl border px-3.5 py-2 text-sm font-semibold ${spend === v ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>€{v}</button>
                    ))}
                    <span className="text-sm text-muted">= +{p.pointsPerVisit + spend * p.pointsPerEuro} pts</span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={onAdd} className="btn-lime px-6 py-3.5 text-base">
                  <Zap size={18} /> {p.type === "stamps" ? "Add stamp" : "Add points"}
                </button>
                {available > 0 && (
                  <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={onRedeem} className="btn-ink px-5 py-3.5 text-base">
                    <Gift size={18} /> Redeem reward ({available})
                  </motion.button>
                )}
                <button onClick={onReset} className="btn-ghost px-5 py-3.5 text-base">Next customer</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Corners({ active }: { active: boolean }) {
  const c = active ? "border-lime" : "border-white/70";
  return (
    <div className="pointer-events-none absolute inset-4">
      <span className={`absolute left-0 top-0 size-7 rounded-tl-xl border-l-4 border-t-4 ${c}`} />
      <span className={`absolute right-0 top-0 size-7 rounded-tr-xl border-r-4 border-t-4 ${c}`} />
      <span className={`absolute bottom-0 left-0 size-7 rounded-bl-xl border-b-4 border-l-4 ${c}`} />
      <span className={`absolute bottom-0 right-0 size-7 rounded-br-xl border-b-4 border-r-4 ${c}`} />
    </div>
  );
}

const KIND: Record<Activity["kind"], [string, string]> = {
  stamp: ["Stamp added", "bg-lime text-ink"],
  points: ["Points added", "bg-sky-100 text-sky-800"],
  reward: ["Reward unlocked", "bg-amber-100 text-amber-800"],
  redeem: ["Reward redeemed", "bg-ink text-white"],
  join: ["Joined program", "bg-violet-100 text-violet-800"],
  review: ["Left a Google review", "bg-yellow-100 text-yellow-800"],
  wallet: ["Saved to wallet", "bg-zinc-100 text-zinc-800"],
};

function ActivityFeed({ feed, customers, now }: { feed: Activity[]; customers: Customer[]; now: number }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Live activity</div>
        <span className="flex items-center gap-1.5 text-xs text-muted"><span className="size-1.5 animate-pulse rounded-full bg-green-500" /> real-time</span>
      </div>
      {feed.length === 0 && <div className="mt-6 rounded-xl bg-paper p-6 text-center text-sm text-muted">Scan a card and the activity shows up here instantly.</div>}
      <ul className="mt-3 divide-y divide-line">
        <AnimatePresence initial={false}>
          {feed.map((a) => {
            const c = customers.find((x) => x.id === a.customerId);
            const [label, cls] = KIND[a.kind];
            return (
              <motion.li key={a.id} layout initial={{ opacity: 0, backgroundColor: "#f3fde0" }} animate={{ opacity: 1, backgroundColor: "#ffffff" }} transition={{ duration: 1 }} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{label}{a.kind === "points" ? ` +${a.amount}` : ""}</span>
                  <span className="truncate">{c?.name}</span>
                </div>
                <span className="shrink-0 text-xs text-muted">{a.method === "staff" ? "by staff · " : a.method === "self" ? "self-scan · " : ""}{timeAgo(a.at, now)}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function CustomerSummary({ business, customer, available }: { business: Business; customer: Customer; available: number }) {
  const p = business.program;
  const rows: [string, string][] = [
    ["Total visits", `${customer.visits}`],
    [p.type === "stamps" ? "Stamps on card" : "Points balance", p.type === "stamps" ? `${customer.stamps} / ${p.stampsRequired}` : `${customer.points}`],
    ["Rewards earned", `${customer.rewardsEarned}`],
    ["Ready to redeem", `${available}`],
    ["Wallet", customer.wallet === "apple" ? "Apple Wallet" : customer.wallet === "google" ? "Google Wallet" : "Not added"],
  ];
  return (
    <div className="card p-5">
      <div className="font-semibold">Customer profile</div>
      <dl className="mt-3 space-y-2.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <dt className="text-muted">{k}</dt>
            <dd className="font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <Link href={`/c/${business.slug}`} target="_blank" className="btn-ghost mt-4 w-full">Open customer card page ↗</Link>
    </div>
  );
}

function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; label: string; icon?: React.ReactNode }[] }) {
  return (
    <div className="inline-flex rounded-full border border-line bg-white p-1">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${value === o.v ? "text-white" : "text-zinc-600 hover:text-ink"}`}>
          {value === o.v && <motion.span layoutId={`seg-${options[0].v}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
          <span className="relative flex items-center gap-1.5">{o.icon}{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function Num({ n }: { n: number }) {
  return <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-lime">{n}</span>;
}
