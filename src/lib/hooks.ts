"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { DEMO_BUSINESS_ID, useDB } from "./store";
import { type Lang, locale } from "./i18n";

const CUR = "loopwallet-current-biz";
const subs = new Set<() => void>();

export function setCurrentBusiness(id: string) {
  try {
    localStorage.setItem(CUR, id);
  } catch {}
  subs.forEach((s) => s());
}

function currentId() {
  try {
    return localStorage.getItem(CUR) ?? DEMO_BUSINESS_ID;
  } catch {
    return DEMO_BUSINESS_ID;
  }
}

export function useCurrentBusiness() {
  const db = useDB();
  const id = useSyncExternalStore(
    (l) => {
      subs.add(l);
      return () => subs.delete(l);
    },
    currentId,
    () => DEMO_BUSINESS_ID,
  );
  const business = db?.businesses.find((b) => b.id === id) ?? db?.businesses[0] ?? null;
  return { db, business };
}

export function useNow(interval = 30_000) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

export function timeAgo(iso: string, now = Date.now(), lang: Lang = "es") {
  const es = lang === "es";
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 45) return es ? "ahora mismo" : "just now";
  const m = Math.round(s / 60);
  if (m < 60) return es ? `hace ${m} min` : `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return es ? `hace ${h} h` : `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return es ? `hace ${d} d` : `${d}d ago`;
  return new Date(iso).toLocaleDateString(locale(lang));
}

export function counterCode(businessId: string, slot = Math.floor(Date.now() / 30_000)) {
  let h = 2166136261;
  for (const ch of `${businessId}:${slot}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(36).slice(0, 6).toUpperCase();
}
