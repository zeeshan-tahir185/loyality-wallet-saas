"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  MousePointerClick,
  QrCode,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import { BarChart } from "@/components/bar-chart";
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

    </>
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
