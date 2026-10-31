"use client";

import { useSyncExternalStore } from "react";
import { createSeed, DB_VERSION, DEMO_BUSINESS_ID } from "./seed";
import type { Activity, Business, Customer, DB, Program } from "./types";

const KEY = "loopwallet-demo-db";
const CURRENT_CUSTOMER_KEY = "loopwallet-me";

let db: DB | null = null;
const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed.version === DB_VERSION) return parsed;
    }
  } catch {}
  return createSeed();
}

function ensure(): DB {
  if (!db) {
    db = load();
    try {
      channel = new BroadcastChannel(KEY);
      channel.onmessage = () => {
        db = load();
        listeners.forEach((l) => l());
      };
    } catch {}
    window.addEventListener("storage", (e) => {
      if (e.key === KEY) {
        db = load();
        listeners.forEach((l) => l());
      }
    });
  }
  return db;
}

function commit(next: DB) {
  db = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  channel?.postMessage("sync");
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useDB(): DB | null {
  return useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => null,
  );
}

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

function log(d: DB, a: Omit<Activity, "id" | "at">): Activity {
  const act = { ...a, id: uid("act"), at: new Date().toISOString() };
  d.activity = [act, ...d.activity];
  return act;
}

function mutate(fn: (d: DB) => void) {
  const d = structuredClone(ensure());
  fn(d);
  commit(d);
}

export type StampResult = { rewardUnlocked: boolean; customer: Customer };

export function addVisit(customerId: string, method: "staff" | "self", spend = 0): StampResult | null {
  let result: StampResult | null = null;
  mutate((d) => {
    const c = d.customers.find((x) => x.id === customerId);
    const b = c && d.businesses.find((x) => x.id === c.businessId);
    if (!c || !b) return;
    const p = b.program;
    c.visits += 1;
    c.lastVisit = new Date().toISOString();
    let unlocked = false;
    if (p.type === "stamps") {
      c.stamps += 1;
      log(d, { businessId: b.id, customerId: c.id, kind: "stamp", amount: 1, method });
      if (c.stamps >= p.stampsRequired) {
        c.stamps = 0;
        c.rewardsEarned += 1;
        unlocked = true;
        log(d, { businessId: b.id, customerId: c.id, kind: "reward", amount: 1, method: "system" });
      }
    } else {
      const before = c.points;
      const gained = p.pointsPerVisit + Math.round(spend * p.pointsPerEuro);
      c.points += gained;
      log(d, { businessId: b.id, customerId: c.id, kind: "points", amount: gained, method });
      unlocked = p.tiers.some((t) => before < t.points && c.points >= t.points);
      if (unlocked) {
        c.rewardsEarned += 1;
        log(d, { businessId: b.id, customerId: c.id, kind: "reward", amount: 1, method: "system" });
      }
    }
    result = { rewardUnlocked: unlocked, customer: { ...c } };
  });
  return result;
}

export function redeemReward(customerId: string, tierPoints?: number) {
  mutate((d) => {
    const c = d.customers.find((x) => x.id === customerId);
    if (!c || c.rewardsEarned <= c.rewardsRedeemed) return;
    c.rewardsRedeemed += 1;
    if (tierPoints) c.points = Math.max(0, c.points - tierPoints);
    log(d, { businessId: c.businessId, customerId: c.id, kind: "redeem", amount: 1, method: "staff" });
  });
}

export function joinProgram(businessId: string, name: string, phone: string): Customer {
  const id = uid("cus");
  mutate((d) => {
    const b = d.businesses.find((x) => x.id === businessId)!;
    const p = b.program;
    const c: Customer = {
      id,
      businessId,
      name,
      phone,
      stamps: p.type === "stamps" ? p.welcomeBonus : 0,
      points: p.type === "points" ? p.welcomeBonus : 0,
      visits: 0,
      rewardsEarned: 0,
      rewardsRedeemed: 0,
      wallet: "none",
      joinedAt: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      reviewed: false,
    };
    d.customers = [c, ...d.customers];
    log(d, { businessId, customerId: id, kind: "join", amount: 0, method: "self" });
  });
  try {
    localStorage.setItem(`${CURRENT_CUSTOMER_KEY}:${businessId}`, id);
  } catch {}
  return ensure().customers.find((c) => c.id === id)!;
}

export function getMyCustomerId(businessId: string): string | null {
  try {
    return localStorage.getItem(`${CURRENT_CUSTOMER_KEY}:${businessId}`);
  } catch {
    return null;
  }
}

export function setWallet(customerId: string, wallet: "apple" | "google") {
  mutate((d) => {
    const c = d.customers.find((x) => x.id === customerId);
    if (!c) return;
    c.wallet = wallet;
    log(d, { businessId: c.businessId, customerId, kind: "wallet", amount: 0, method: "self" });
  });
}

export function markReviewed(customerId: string) {
  mutate((d) => {
    const c = d.customers.find((x) => x.id === customerId);
    if (!c || c.reviewed) return;
    c.reviewed = true;
    log(d, { businessId: c.businessId, customerId, kind: "review", amount: 0, method: "self" });
  });
}

export function updateBusiness(businessId: string, patch: Partial<Omit<Business, "program">> & { program?: Partial<Program> }) {
  mutate((d) => {
    const b = d.businesses.find((x) => x.id === businessId);
    if (!b) return;
    const { program, ...rest } = patch;
    Object.assign(b, rest);
    if (program) b.program = { ...b.program, ...program };
  });
}

export function setPlan(businessId: string, plan: Business["plan"]) {
  updateBusiness(businessId, { plan });
}

export function resetDemo() {
  commit(createSeed());
}

export { DEMO_BUSINESS_ID };
