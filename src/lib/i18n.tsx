"use client";

import { useSyncExternalStore } from "react";

export type Lang = "es" | "en";

const KEY = "loopwallet-lang";
const subs = new Set<() => void>();

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

export function setLang(l: Lang) {
  try {
    localStorage.setItem(KEY, l);
  } catch {}
  document.documentElement.lang = l;
  subs.forEach((s) => s());
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    read,
    () => "es",
  );
}

export function useT() {
  const lang = useLang();
  return (en: string, es: string) => (lang === "es" ? es : en);
}

export const locale = (l: Lang) => (l === "es" ? "es-ES" : "en-GB");

export function LangSwitch({ dark = false }: { dark?: boolean }) {
  const lang = useLang();
  return (
    <div className={`inline-flex rounded-full p-0.5 text-xs font-bold ${dark ? "bg-white/10" : "border border-line bg-white"}`}>
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 uppercase transition ${lang === l ? (dark ? "bg-white text-ink" : "bg-ink text-white") : dark ? "text-white/60" : "text-zinc-500"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
