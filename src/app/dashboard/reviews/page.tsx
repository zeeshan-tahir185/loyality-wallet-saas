"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import {
  Bell,
  Check,
  Copy,
  ExternalLink,
  Link2,
  Lock,
  MousePointerClick,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";
import { BarChart } from "@/components/bar-chart";
import { BizMark } from "@/components/pass";
import { PageHead } from "@/components/ui";
import { updateBusiness } from "@/lib/store";
import { timeAgo, useCurrentBusiness, useNow } from "@/lib/hooks";
import { locale, useLang, useT } from "@/lib/i18n";

const WEEK = 7 * 86_400_000;

export default function ReviewsPage() {
  const { db, business } = useCurrentBusiness();
  const now = useNow();
  const t = useT();
  const lang = useLang();
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(business?.googleReviewUrl ?? ""), [business?.googleReviewUrl]);
  if (!db || !business || !now) return null;

  const members = db.customers.filter((c) => c.businessId === business.id);
  const clicks = db.activity.filter((a) => a.businessId === business.id && a.kind === "review");
  const clicks30 = clicks.filter((a) => now - new Date(a.at).getTime() < 30 * 86_400_000).length;
  const rate = members.length ? Math.round((members.filter((c) => c.reviewed).length / members.length) * 100) : 0;
  const weeks = Array.from({ length: 8 }).map((_, i) => {
    const end = now - (7 - i) * WEEK;
    const start = end - WEEK;
    return {
      label: new Date(start).toLocaleDateString(locale(lang), { day: "numeric", month: "short" }),
      sub: t(`Week of ${new Date(start).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`, `Semana del ${new Date(start).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`),
      value: clicks.filter((a) => {
        const at = new Date(a.at).getTime();
        return at >= start && at < end;
      }).length,
    };
  });

  const save = () => {
    updateBusiness(business.id, { googleReviewUrl: url });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <>
      <PageHead
        title={t("Google Reviews", "Reseñas de Google")}
        sub={t("Loyalty and online reputation in one place.", "Fidelización y reputación online en un solo lugar.")}
        actions={<Link href="/dashboard/qr" className="btn-ghost"><QrCode size={16} /> {t("All QR codes", "Todos los QR")}</Link>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={MousePointerClick} label={t("Review link opens", "Aperturas del enlace")} value={`${clicks.length}`} hint={t("all time", "en total")} />
        <Kpi icon={Star} label={t("Last 30 days", "Últimos 30 días")} value={`${clicks30}`} hint={t("review link opens", "aperturas del enlace")} />
        <Kpi icon={Wallet} label={t("Click rate", "Tasa de clics")} value={`${rate}%`} hint={t("of your members", "de tus clientes")} />
        <Kpi icon={ShieldCheck} label={t("Google policy", "Política de Google")} value={t("Compliant", "Cumple")} hint={t("no rewards for reviews", "sin premios por reseñas")} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <div className="font-semibold">{t("Review link opens per week", "Aperturas del enlace por semana")}</div>
          <div className="text-sm text-muted">{t("From the wallet card, the counter QR and the customer page", "Desde la tarjeta wallet, el QR del mostrador y la página del cliente")}</div>
          <div className="mt-6">
            <BarChart data={weeks} height={200} color="#b45309" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 font-semibold"><Link2 size={16} /> {t("Your Google review link", "Tu enlace de reseñas")}</div>
          <div className="mt-1 text-sm text-muted">{t("Paste the link from your Google Business Profile.", "Pega el enlace de tu Perfil de Empresa de Google.")}</div>
          <div className="mt-4 flex gap-2">
            <input className="input text-xs" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button onClick={save} className="btn-ink px-3.5">{saved ? <Check size={16} /> : t("Save", "Guardar")}</button>
          </div>
          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-amber-50 p-4">
            <div className="rounded-xl bg-white p-2">
              <QRCodeSVG value={url || "https://g.page"} size={88} />
            </div>
            <div className="min-w-0 text-sm">
              <div className="font-semibold text-amber-900">{t("Loved your visit?", "¿Te ha gustado?")}</div>
              <div className="text-amber-800/80">{t("Scan to leave us a review", "Escanea y déjanos tu reseña")}</div>
              <div className="mt-2 flex gap-1.5">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="grid size-8 place-items-center rounded-lg bg-white text-amber-900"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <a href={url} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-lg bg-white text-amber-900"><ExternalLink size={14} /></a>
              </div>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              t("Shown on every wallet card", "Visible en cada tarjeta wallet"),
              t("Printable QR for the counter and receipts", "QR imprimible para mostrador y tickets"),
              t("Every customer is invited, never only happy ones", "Se invita a todos los clientes, no solo a los satisfechos"),
              t("No stamps or points in exchange for reviews", "Sin sellos ni puntos a cambio de reseñas"),
            ].map((x) => (
              <li key={x} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-lime-deep" /> {x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <div className="font-semibold">{t("Recent review activity", "Actividad reciente de reseñas")}</div>
        <ul className="mt-3 divide-y divide-line">
          {clicks.slice(0, 6).map((a) => {
            const c = members.find((m) => m.id === a.customerId);
            return (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-600"><Star size={14} fill="currentColor" /></span>
                  <span className="truncate"><b className="font-semibold">{c?.name}</b> {t("opened your Google review page", "abrió tu página de reseñas de Google")}</span>
                </span>
                <span className="shrink-0 text-xs text-muted">{timeAgo(a.at, now, lang)}</span>
              </li>
            );
          })}
          {clicks.length === 0 && <li className="py-6 text-center text-sm text-muted">{t("No review activity yet.", "Todavía no hay actividad de reseñas.")}</li>}
        </ul>
      </div>

      <Phase2 businessName={business.name} program={business.program} />
    </>
  );
}

function Phase2({ businessName, program }: { businessName: string; program: Parameters<typeof BizMark>[0]["program"] }) {
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

function Kpi({ icon: Icon, label, value, hint }: { icon: typeof Star; label: string; value: string; hint: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-sm text-muted">{label} <Icon size={16} /></div>
      <div className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted">{hint}</div>
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
