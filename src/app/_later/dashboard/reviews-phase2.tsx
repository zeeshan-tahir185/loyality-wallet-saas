"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Lock, Sparkles, Star } from "lucide-react";
import { BizMark } from "@/components/pass";
import { useLang, useT } from "@/lib/i18n";

export function Phase2({ businessName, program }: { businessName: string; program: Parameters<typeof BizMark>[0]["program"] }) {
  const t = useT();
  const lang = useLang();
  const reviews = [
    {
      name: "Marta R.",
      stars: 5,
      text: t(
        "Amazing coffee and lovely staff. Having the loyalty card on my phone is so convenient.",
        "Café buenísimo y el personal encantador. Tener la tarjeta en el móvil es comodísimo.",
      ),
      reply: t(
        `Thank you so much, Marta! We're really happy you enjoy the coffee and the card on your phone. See you soon at ${businessName}!`,
        `¡Muchísimas gracias, Marta! Nos alegra mucho que disfrutes del café y de la tarjeta en el móvil. ¡Te esperamos pronto en ${businessName}!`,
      ),
    },
    {
      name: "Javier P.",
      stars: 3,
      text: t("Good coffee, but on Saturday we had to wait 20 minutes.", "El café está bien, pero el sábado tuvimos que esperar 20 minutos."),
      reply: t(
        "Thanks for your feedback, Javier, and sorry about the wait on Saturday. We're adding more staff at weekends so it doesn't happen again. We hope to see you soon!",
        "Gracias por tu comentario, Javier, y perdona la espera del sábado. Estamos reforzando el equipo los fines de semana para que no vuelva a pasar. ¡Esperamos verte pronto!",
      ),
    },
  ];

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{t("Reputation automation", "Automatización de reputación")}</h2>
        <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-lime">{t("PHASE 2 · PREVIEW", "FASE 2 · VISTA PREVIA")}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{t("A look at what comes next once the core platform is live.", "Un adelanto de lo que llegará cuando la plataforma principal esté en marcha.")}</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6">
          <div className="flex items-center gap-2 font-semibold"><GoogleG /> {t("Google Business Profile", "Perfil de Empresa de Google")}</div>
          <div className="mt-1 text-sm text-muted">{t("Connect once to see your rating and every new review here.", "Conéctalo una vez y verás tu valoración y cada nueva reseña aquí.")}</div>
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-paper p-4">
            <BizMark program={program} size={38} />
            <div>
              <div className="text-sm font-semibold">{businessName}</div>
              <div className="flex items-center gap-1 text-sm">
                <b>{lang === "es" ? "4,8" : "4.8"}</b>
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={12} className="text-amber-500" fill="currentColor" />)}
                <span className="text-muted">(412)</span>
              </div>
            </div>
          </div>
          <button disabled className="btn-ghost mt-4 w-full cursor-not-allowed opacity-60"><Lock size={14} /> {t("Connect with Google", "Conectar con Google")}</button>
        </div>

        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6">
          <div className="flex items-center gap-2 font-semibold"><Bell size={16} /> {t("Automatic invitations", "Invitaciones automáticas")}</div>
          <div className="mt-1 text-sm text-muted">{t("Invite every customer after a visit, where supported.", "Invita a cada cliente después de su visita, donde esté disponible.")}</div>
          <div className="mt-5 space-y-2 text-sm">
            <Row k={t("Send", "Enviar")} v={t("2 hours after the visit", "2 horas después de la visita")} />
            <Row k={t("Channel", "Canal")} v={t("Email · wallet notification", "Email · notificación wallet")} />
            <Row k={t("Frequency", "Frecuencia")} v={t("Max. once every 90 days", "Máx. una vez cada 90 días")} />
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-ink p-3 text-white">
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10"><Star size={15} className="text-amber-400" /></div>
            <div className="text-[13px] leading-snug">
              <div className="font-semibold">{businessName}</div>
              <div className="text-white/70">{t("Thanks for visiting today! Would you share your experience on Google?", "¡Gracias por tu visita de hoy! ¿Nos cuentas tu experiencia en Google?")}</div>
            </div>
          </div>
        </div>

        <AiReplies reviews={reviews} />
      </div>
    </section>
  );
}

function AiReplies({ reviews }: { reviews: { name: string; stars: number; text: string; reply: string }[] }) {
  const t = useT();
  const [active, setActive] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const full = active === null ? "" : reviews[active].reply;

  useEffect(() => {
    if (!full) return;
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i += 3;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [full]);

  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6">
      <div className="flex items-center gap-2 font-semibold"><Sparkles size={16} /> {t("AI review replies", "Respuestas con IA")}</div>
      <div className="mt-1 text-sm text-muted">{t("A suggested reply in seconds. You review it before posting.", "Una respuesta sugerida en segundos. Tú la revisas antes de publicarla.")}</div>
      <div className="mt-4 space-y-3">
        {reviews.map((r, i) => (
          <div key={r.name} className="rounded-xl bg-paper p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{r.name}</span>
              <span className="flex">
                {[0, 1, 2, 3, 4].map((s) => <Star key={s} size={12} className={s < r.stars ? "text-amber-500" : "text-zinc-300"} fill="currentColor" />)}
              </span>
            </div>
            <p className="mt-1 text-zinc-600">{r.text}</p>
            <AnimatePresence>
              {active === i ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 rounded-lg border border-lime-deep/40 bg-white p-2.5 text-[13px] leading-snug">
                  <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-lime-deep"><Sparkles size={11} /> {t("Suggested reply", "Respuesta sugerida")}</div>
                  {typed}
                  {typed.length < r.reply.length && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-ink align-middle" />}
                </motion.div>
              ) : (
                <button onClick={() => setActive(i)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-lime">
                  <Sparkles size={12} /> {t("Suggest reply", "Sugerir respuesta")}
                </button>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-lg bg-paper px-3 py-2">
      <span className="text-muted">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}
