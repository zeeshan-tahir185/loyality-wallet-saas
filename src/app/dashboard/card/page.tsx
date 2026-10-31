"use client";

import { useState } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import { ApplePass, GooglePass } from "@/components/pass";
import { PageHead } from "@/components/ui";
import { INDUSTRIES } from "@/lib/industries";
import { updateBusiness } from "@/lib/store";
import { useCurrentBusiness } from "@/lib/hooks";
import type { Business, Program } from "@/lib/types";

const THEMES: Array<Pick<Program, "bg" | "fg" | "accent">> = [
  { bg: "#0c0c10", fg: "#ffffff", accent: "#c6f36b" },
  { bg: "#3b2417", fg: "#fff7ed", accent: "#f59e0b" },
  { bg: "#0b1f3a", fg: "#f0f9ff", accent: "#38bdf8" },
  { bg: "#4a1d3f", fg: "#fdf2f8", accent: "#f9a8d4" },
  { bg: "#f4f1ea", fg: "#1c1917", accent: "#1c1917" },
  { bg: "#064e3b", fg: "#ecfdf5", accent: "#6ee7b7" },
  { bg: "#7f1d1d", fg: "#fef2f2", accent: "#fbbf24" },
  { bg: "#1e1b2e", fg: "#f5f3ff", accent: "#c4b5fd" },
  { bg: "#ffffff", fg: "#111111", accent: "#ef4444" },
  { bg: "#111111", fg: "#fafafa", accent: "#d4a373" },
];

export default function CardPage() {
  const { business } = useCurrentBusiness();
  if (!business) return null;
  return <Designer key={business.id} business={business} />;
}

function Designer({ business }: { business: Business }) {
  const [name, setName] = useState(business.name);
  const [prog, setProg] = useState<Program>(business.program);
  const [platform, setPlatform] = useState<"apple" | "google">("apple");
  const [saved, setSaved] = useState(false);
  const dirty = name !== business.name || JSON.stringify(prog) !== JSON.stringify(business.program);
  const set = (patch: Partial<Program>) => setProg((p) => ({ ...p, ...patch }));

  const save = () => {
    updateBusiness(business.id, { name, program: prog });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const preview = {
    id: "cus_preview",
    name: "Lucía García",
    stamps: Math.min(prog.stampsRequired - 1, Math.ceil(prog.stampsRequired * 0.6)),
    points: Math.round(prog.tiers[1].points * 0.7),
    rewardsEarned: 0,
    rewardsRedeemed: 0,
  };

  return (
    <>
      <PageHead
        title="Card designer"
        sub="Design the loyalty card your customers save to their wallet."
        actions={
          <>
            <button disabled={!dirty} onClick={() => { setName(business.name); setProg(business.program); }} className="btn-ghost"><RotateCcw size={16} /> Discard</button>
            <button disabled={!dirty && !saved} onClick={save} className="btn-ink">{saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save & publish</>}</button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Section title="Start from a template" sub="Pre-filled rules and colours for your industry.">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {INDUSTRIES.map((i) => (
                <button
                  key={i.key}
                  onClick={() => setProg({ ...i.program })}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium transition hover:border-zinc-400 ${prog.icon === i.key ? "border-ink ring-2 ring-ink/10" : "border-line"}`}
                >
                  <span className="grid size-8 place-items-center rounded-lg" style={{ background: i.program.bg, color: i.program.accent }}><i.icon size={16} /></span>
                  {i.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Program">
            <div className="grid gap-4">
              <Field label="Business name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="Program type">
                <div className="grid grid-cols-2 gap-2">
                  {(["stamps", "points"] as const).map((t) => (
                    <button key={t} onClick={() => set({ type: t })} className={`rounded-xl border p-3 text-left ${prog.type === t ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>
                      <div className="font-semibold capitalize">{t === "stamps" ? "Stamp card" : "Points"}</div>
                      <div className={`text-xs ${prog.type === t ? "text-white/60" : "text-muted"}`}>{t === "stamps" ? "Collect X stamps, get a reward" : "Points per visit / € with reward tiers"}</div>
                    </button>
                  ))}
                </div>
              </Field>

              {prog.type === "stamps" ? (
                <>
                  <Field label={`Stamps needed for reward · ${prog.stampsRequired}`}>
                    <input type="range" min={3} max={15} value={prog.stampsRequired} onChange={(e) => set({ stampsRequired: +e.target.value })} className="w-full accent-[#0c0c10]" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Reward"><input className="input" value={prog.stampReward} onChange={(e) => set({ stampReward: e.target.value })} /></Field>
                    <Field label="Welcome stamps">
                      <input type="number" min={0} max={3} className="input" value={prog.welcomeBonus} onChange={(e) => set({ welcomeBonus: Math.max(0, Math.min(3, +e.target.value)) })} />
                    </Field>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Points per visit"><input type="number" min={0} className="input" value={prog.pointsPerVisit} onChange={(e) => set({ pointsPerVisit: +e.target.value })} /></Field>
                    <Field label="Points per €1"><input type="number" min={0} className="input" value={prog.pointsPerEuro} onChange={(e) => set({ pointsPerEuro: +e.target.value })} /></Field>
                    <Field label="Welcome points"><input type="number" min={0} className="input" value={prog.welcomeBonus} onChange={(e) => set({ welcomeBonus: +e.target.value })} /></Field>
                  </div>
                  <Field label="Reward tiers">
                    <div className="space-y-2">
                      {prog.tiers.map((t, i) => (
                        <div key={t.id} className="flex gap-2">
                          <input type="number" className="input w-28" value={t.points} onChange={(e) => set({ tiers: prog.tiers.map((x, j) => (j === i ? { ...x, points: +e.target.value } : x)) })} />
                          <input className="input" value={t.name} onChange={(e) => set({ tiers: prog.tiers.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })} />
                        </div>
                      ))}
                    </div>
                  </Field>
                </>
              )}
              <Field label="Terms shown on the card"><input className="input" value={prog.terms} onChange={(e) => set({ terms: e.target.value })} /></Field>
            </div>
          </Section>

          <Section title="Design">
            <Field label="Colour theme">
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t, i) => {
                  const on = t.bg === prog.bg && t.accent === prog.accent;
                  return (
                    <button key={i} onClick={() => set(t)} className={`relative size-11 overflow-hidden rounded-full ring-offset-2 transition ${on ? "ring-2 ring-ink" : "ring-1 ring-line"}`} style={{ background: t.bg }}>
                      <span className="absolute bottom-1.5 right-1.5 size-3.5 rounded-full" style={{ background: t.accent }} />
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {([["bg", "Background"], ["fg", "Text"], ["accent", "Stamp colour"]] as const).map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 rounded-xl border border-line bg-white p-2 text-sm">
                  <input type="color" value={prog[k]} onChange={(e) => set({ [k]: e.target.value })} className="size-8 cursor-pointer rounded-lg border-0 bg-transparent" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{l}</span>
                    <span className="block font-mono text-[11px] uppercase text-muted">{prog[k]}</span>
                  </span>
                </label>
              ))}
            </div>
            <Field label="Stamp icon" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((i) => (
                  <button key={i.key} onClick={() => set({ icon: i.key })} className={`grid size-11 place-items-center rounded-xl border ${prog.icon === i.key ? "border-ink bg-ink text-lime" : "border-line bg-white"}`} title={i.label}>
                    <i.icon size={18} />
                  </button>
                ))}
              </div>
            </Field>
          </Section>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-[28px] bg-ink p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Live preview</span>
              <div className="inline-flex rounded-full bg-white/10 p-0.5 text-xs font-semibold">
                {(["apple", "google"] as const).map((x) => (
                  <button key={x} onClick={() => setPlatform(x)} className={`rounded-full px-3 py-1.5 ${platform === x ? "bg-white text-ink" : "text-white/70"}`}>{x === "apple" ? "Apple" : "Google"}</button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              {platform === "apple" ? <ApplePass business={{ name, program: prog }} customer={preview} /> : <GooglePass business={{ name, program: prog }} customer={preview} />}
            </div>
            <p className="mt-4 text-center text-xs text-white/40">{prog.terms}</p>
          </div>
          {dirty && <div className="mt-3 text-center text-sm text-amber-700">You have unsaved changes</div>}
        </div>
      </div>
    </>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <div className="font-semibold">{title}</div>
      {sub && <div className="text-sm text-muted">{sub}</div>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      {children}
    </div>
  );
}
