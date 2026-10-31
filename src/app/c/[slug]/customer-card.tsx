"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import { Check, ExternalLink, Gift, MapPin, Star, TimerOff } from "lucide-react";
import { AppleWalletBadge, BRAND, GoogleWalletBadge } from "@/components/brand";
import { ApplePass, BizMark, GooglePass } from "@/components/pass";
import { Loading } from "@/components/ui";
import { addVisit, getMyCustomerId, joinProgram, markReviewed, setWallet, useDB } from "@/lib/store";
import { counterCode } from "@/lib/hooks";

type Banner = { kind: "stamp" | "reward" | "expired" | "used"; text: string } | null;

export function CustomerCard({ slug }: { slug: string }) {
  const db = useDB();
  const [myId, setMyId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [platform, setPlatform] = useState<"apple" | "google">("apple");
  const [sheet, setSheet] = useState<null | "apple" | "google">(null);
  const [banner, setBanner] = useState<Banner>(null);
  const [highlight, setHighlight] = useState(-1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const handled = useRef(false);

  const business = db?.businesses.find((b) => b.slug === slug);

  useEffect(() => {
    if (!business) return;
    setPlatform(/android/i.test(navigator.userAgent) ? "google" : "apple");
    setMyId(getMyCustomerId(business.id));
    setReady(true);
  }, [business?.id]);

  const me = db?.customers.find((c) => c.id === myId) ?? null;

  useEffect(() => {
    if (!business || !me || handled.current) return;
    const t = new URLSearchParams(window.location.search).get("t");
    if (!t) return;
    handled.current = true;
    window.history.replaceState(null, "", window.location.pathname);
    const slot = Math.floor(Date.now() / 30_000);
    const valid = [slot, slot - 1, slot - 2].some((s) => counterCode(business.id, s) === t);
    const usedKey = `loopwallet-used:${business.id}:${t}`;
    if (!valid) return setBanner({ kind: "expired", text: "This code has expired. Scan the QR at the counter again." });
    if (localStorage.getItem(usedKey)) return setBanner({ kind: "used", text: "You already collected a stamp with this code." });
    localStorage.setItem(usedKey, "1");
    const res = addVisit(me.id, "self");
    if (!res) return;
    if (res.rewardUnlocked) {
      setBanner({ kind: "reward", text: "Card complete! Your reward is ready." });
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.35 } });
    } else {
      setHighlight(res.customer.stamps - 1);
      setBanner({
        kind: "stamp",
        text: business.program.type === "stamps" ? `Stamp collected! ${res.customer.stamps}/${business.program.stampsRequired}` : `Points added! You have ${res.customer.points} points.`,
      });
    }
  }, [business, me]);

  if (!db || !ready) {
    if (db && !business) return <NotFound />;
    return <Loading />;
  }
  if (!business) return <NotFound />;
  const p = business.program;

  if (!me) {
    return (
      <Shell bg={p.bg} fg={p.fg}>
        <div className="flex flex-col items-center pt-10 text-center">
          <BizMark program={p} size={64} />
          <h1 className="mt-4 text-2xl font-semibold">{business.name}</h1>
          <div className="mt-1 flex items-center gap-1 text-sm opacity-70"><MapPin size={14} /> {business.city}</div>
          <div className="mt-8 w-full rounded-3xl p-5 text-left" style={{ background: `color-mix(in srgb, ${p.fg} 8%, transparent)` }}>
            <div className="text-xs font-semibold uppercase tracking-widest opacity-60">Join the loyalty club</div>
            <div className="mt-1 text-lg font-semibold">
              {p.type === "stamps" ? `Collect ${p.stampsRequired} stamps → ${p.stampReward}` : `Earn points on every visit → ${p.tiers[0].name} at ${p.tiers[0].points} pts`}
            </div>
            {p.welcomeBonus > 0 && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: p.accent, color: p.bg }}>
                <Gift size={12} /> {p.type === "stamps" ? `${p.welcomeBonus} free stamp` : `${p.welcomeBonus} bonus points`} when you join
              </div>
            )}
            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                const c = joinProgram(business.id, name.trim(), phone.trim());
                setMyId(c.id);
              }}
            >
              <input className="input text-ink" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="input text-ink" placeholder="Phone number (optional)" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <button className="w-full rounded-xl py-3 font-semibold" style={{ background: p.accent, color: p.bg }}>Get my card</button>
            </form>
            <p className="mt-3 text-[11px] opacity-50">{p.terms}</p>
          </div>
        </div>
      </Shell>
    );
  }

  const available = me.rewardsEarned - me.rewardsRedeemed;

  return (
    <Shell bg="#0c0c10" fg="#fff">
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            onClick={() => setBanner(null)}
            className={`mb-4 flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ${banner.kind === "expired" || banner.kind === "used" ? "bg-red-500/15 text-red-200" : "bg-lime text-ink"}`}
          >
            {banner.kind === "expired" || banner.kind === "used" ? <TimerOff size={18} /> : banner.kind === "reward" ? <Gift size={18} /> : <Check size={18} />}
            {banner.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-white/60">Hi {me.name.split(" ")[0]} 👋</div>
        <div className="inline-flex rounded-full bg-white/10 p-0.5 text-xs font-semibold">
          {(["apple", "google"] as const).map((x) => (
            <button key={x} onClick={() => setPlatform(x)} className={`rounded-full px-3 py-1.5 ${platform === x ? "bg-white text-ink" : "text-white/70"}`}>
              {x === "apple" ? "Apple" : "Google"}
            </button>
          ))}
        </div>
      </div>

      {platform === "apple" ? <ApplePass business={business} customer={me} highlight={highlight} /> : <GooglePass business={business} customer={me} highlight={highlight} />}

      <div className="mt-5 flex justify-center">
        {me.wallet !== "none" ? (
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm"><Check size={16} className="text-lime" /> Saved to {me.wallet === "apple" ? "Apple" : "Google"} Wallet</div>
        ) : platform === "apple" ? (
          <AppleWalletBadge onClick={() => setSheet("apple")} />
        ) : (
          <GoogleWalletBadge onClick={() => setSheet("google")} />
        )}
      </div>

      {available > 0 && (
        <div className="mt-5 rounded-2xl p-4 text-sm" style={{ background: p.accent, color: p.bg }}>
          <div className="font-semibold">🎁 You have {available} reward{available > 1 ? "s" : ""}!</div>
          <div className="opacity-80">Show your card at the counter to redeem.</div>
        </div>
      )}

      <div className="mt-5 rounded-2xl bg-white/[.06] p-4">
        <div className="flex items-center gap-1 text-amber-400">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} fill="currentColor" />)}</div>
        <div className="mt-2 font-semibold">Enjoying {business.name}?</div>
        <div className="text-sm text-white/60">A quick Google review helps a local business a lot.</div>
        {me.reviewed ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-lime"><Check size={16} /> Thanks for your review!</div>
        ) : (
          <button onClick={() => markReviewed(me.id)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink">
            Leave a review <ExternalLink size={14} />
          </button>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-white/30">
        Powered by <Link href="/" className="underline">{BRAND}</Link>
      </div>

      <AnimatePresence>
        {sheet && (
          <AddPassSheet
            platform={sheet}
            onClose={() => setSheet(null)}
            onAdd={() => {
              setWallet(me.id, sheet);
              setSheet(null);
              setBanner({ kind: "stamp", text: `Card added to ${sheet === "apple" ? "Apple" : "Google"} Wallet` });
            }}
          >
            {sheet === "apple" ? <ApplePass business={business} customer={me} /> : <GooglePass business={business} customer={me} />}
          </AddPassSheet>
        )}
      </AnimatePresence>
    </Shell>
  );
}

function AddPassSheet({ platform, children, onClose, onAdd }: { platform: "apple" | "google"; children: React.ReactNode; onClose: () => void; onAdd: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className={`mx-auto w-full max-w-md rounded-t-[28px] px-5 pb-10 pt-3 ${platform === "apple" ? "bg-[#1c1c1e]" : "bg-[#2d2f31]"} text-white`}
      >
        {platform === "apple" ? (
          <div className="flex items-center justify-between py-2 text-[17px]">
            <button onClick={onClose} className="text-[#0a84ff]">Cancel</button>
            <span className="font-semibold">Add Pass</span>
            <button onClick={onAdd} className="font-semibold text-[#0a84ff]">Add</button>
          </div>
        ) : (
          <div className="py-2 text-center">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/30" />
            <div className="text-lg">Save to Google Wallet?</div>
          </div>
        )}
        <div className="mt-4">{children}</div>
        {platform === "google" && (
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-medium text-[#a8c7fa]">Cancel</button>
            <button onClick={onAdd} className="rounded-full bg-[#a8c7fa] px-6 py-2.5 text-sm font-medium text-[#062e6f]">Save</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Shell({ children, bg, fg }: { children: React.ReactNode; bg: string; fg: string }) {
  return (
    <div className="min-h-screen" style={{ background: bg, color: fg }}>
      <div className="mx-auto max-w-md px-5 py-6">{children}</div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <div className="text-xl font-semibold">Card not found</div>
        <Link href="/demo" className="btn-ink mt-4">Open the demo</Link>
      </div>
    </div>
  );
}
