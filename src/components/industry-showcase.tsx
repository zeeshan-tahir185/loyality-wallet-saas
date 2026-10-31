"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { INDUSTRIES, industryExample, industryLabel, programFor } from "@/lib/industries";
import { useLang, useT } from "@/lib/i18n";
import { ApplePass } from "./pass";

const NAMES: Record<string, [string, string]> = {
  cafe: ["Bloom Coffee House", "Lucía García"],
  barber: ["Fade Republic", "Hugo Martín"],
  gym: ["Iron Temple Gym", "Mateo Ruiz"],
  salon: ["Glow Beauty Studio", "Sofía López"],
  clothing: ["Atelier Nord", "Camille Moreau"],
  perfume: ["Maison Oud", "Aisha Haddad"],
  restaurant: ["La Brasa", "Pablo Torres"],
  carwash: ["Shine Car Spa", "Iker Navarro"],
};

export function IndustryShowcase() {
  const lang = useLang();
  const t = useT();
  const [active, setActive] = useState(INDUSTRIES[0].key);
  const ind = { ...INDUSTRIES.find((i) => i.key === active)!, program: programFor(active, lang) };
  const [biz, person] = NAMES[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((i) => (
            <button
              key={i.key}
              onClick={() => setActive(i.key)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                active === i.key ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-zinc-400"
              }`}
            >
              <i.icon size={16} /> {industryLabel(i.key, lang)}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8">
            <div className="text-sm font-medium uppercase tracking-widest text-muted">{ind.program.type === "stamps" ? t("Stamp card", "Tarjeta de sellos") : t("Points program", "Programa de puntos")}</div>
            <h3 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">“{industryExample(active, lang)}”</h3>
            <div className="mt-6 grid max-w-lg grid-cols-3 gap-3 text-sm">
              {ind.program.type === "stamps" ? (
                <>
                  <Stat k={t("Stamps", "Sellos")} v={`${ind.program.stampsRequired}`} />
                  <Stat k={t("Reward", "Recompensa")} v={ind.program.stampReward} />
                  <Stat k={t("Welcome", "Bienvenida")} v={ind.program.welcomeBonus ? t(`${ind.program.welcomeBonus} free stamp`, `${ind.program.welcomeBonus} sello gratis`) : t("None", "Ninguno")} />
                </>
              ) : (
                <>
                  <Stat k={t("Per visit", "Por visita")} v={ind.program.pointsPerVisit ? `${ind.program.pointsPerVisit} pts` : t("None", "Ninguno")} />
                  <Stat k={t("Per €1", "Por 1 €")} v={`${ind.program.pointsPerEuro} pts`} />
                  <Stat k={t("Top reward", "Mejor recompensa")} v={ind.program.tiers[2].name} />
                </>
              )}
            </div>
            <p className="mt-6 max-w-lg text-muted">
              {t(
                "Start from a ready-made template, then change colours, rules and rewards from the dashboard in a couple of clicks.",
                "Empieza con una plantilla lista y cambia colores, reglas y recompensas desde el panel en un par de clics.",
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative">
        <div className="absolute inset-6 -z-10 rounded-full blur-3xl" style={{ background: ind.program.accent, opacity: 0.35 }} />
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, rotateY: -30, scale: 0.95 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: 30, scale: 0.95 }} transition={{ duration: 0.35 }}>
            <ApplePass
              business={{ name: biz, program: ind.program }}
              customer={{ id: `cus_${active}`, name: person, stamps: Math.ceil(ind.program.stampsRequired * 0.6), points: 180, rewardsEarned: 0, rewardsRedeemed: 0 }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="card p-3">
      <div className="text-xs text-muted">{k}</div>
      <div className="mt-1 font-semibold leading-snug">{v}</div>
    </div>
  );
}
