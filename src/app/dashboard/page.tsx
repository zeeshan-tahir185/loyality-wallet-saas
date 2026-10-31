"use client";

import Link from "next/link";
import { ArrowUpRight, Gift, Palette, QrCode, Repeat, ScanLine, Star, Users } from "lucide-react";
import { BarChart } from "@/components/bar-chart";
import { ApplePass } from "@/components/pass";
import { PageHead } from "@/components/ui";
import { timeAgo, useCurrentBusiness, useNow } from "@/lib/hooks";
import { locale, useLang, useT } from "@/lib/i18n";

const DAY = 86_400_000;

export default function Overview() {
  const { db, business } = useCurrentBusiness();
  const now = useNow();
  const t = useT();
  const lang = useLang();
  if (!db || !business) return null;
  const loc = locale(lang);

  const customers = db.customers.filter((c) => c.businessId === business.id);
  const acts = db.activity.filter((a) => a.businessId === business.id);
  const visits = acts.filter((a) => a.kind === "stamp" || a.kind === "points");
  const in30 = (a: { at: string }) => now - new Date(a.at).getTime() < 30 * DAY;
  const visits30 = visits.filter(in30).length;
  const redeemed30 = acts.filter((a) => a.kind === "redeem" && in30(a)).length;
  const returning = customers.filter((c) => c.visits > 1).length;
  const returnRate = customers.length ? Math.round((returning / customers.length) * 100) : 0;
  const walletSaved = customers.filter((c) => c.wallet !== "none").length;
  const reviews = customers.filter((c) => c.reviewed).length;

  const days = Array.from({ length: 14 }).map((_, i) => {
    const start = new Date(now - (13 - i) * DAY);
    start.setHours(0, 0, 0, 0);
    const end = start.getTime() + DAY;
    const v = visits.filter((a) => {
      const t = new Date(a.at).getTime();
      return t >= start.getTime() && t < end;
    }).length;
    return { label: start.toLocaleDateString(loc, { day: "numeric" }), sub: start.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "short" }), value: v };
  });

  const top = [...customers].sort((a, b) => b.visits - a.visits).slice(0, 5);
  const staffShare = visits.length ? Math.round((visits.filter((v) => v.method === "staff").length / visits.length) * 100) : 0;
  const apple = customers.filter((c) => c.wallet === "apple").length;
  const google = customers.filter((c) => c.wallet === "google").length;

  return (
    <>
      <PageHead
        title={`${new Date(now).getHours() < 12 ? t("Good morning", "Buenos días") : new Date(now).getHours() < 20 ? t("Good afternoon", "Buenas tardes") : t("Good evening", "Buenas noches")}, ${business.owner.split(" ")[0]}`}
        sub={t(`Here's how ${business.name} is doing.`, `Así va ${business.name}.`)}
        actions={
          <>
            <Link href="/dashboard/qr" className="btn-ghost"><QrCode size={16} /> {t("Counter QR", "QR de mostrador")}</Link>
            <Link href="/dashboard/scanner" className="btn-ink"><ScanLine size={16} /> {t("Open scanner", "Abrir escáner")}</Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={Users} label={t("Members", "Clientes")} value={customers.length} hint={`+${customers.filter((c) => now - new Date(c.joinedAt).getTime() < 7 * DAY).length} ${t("this week", "esta semana")}`} />
        <Kpi icon={Repeat} label={t("Visits · 30 days", "Visitas · 30 días")} value={visits30} hint={t(`${staffShare}% scanned by staff`, `${staffShare}% escaneadas por el personal`)} />
        <Kpi icon={Gift} label={t("Rewards redeemed", "Recompensas canjeadas")} value={redeemed30} hint={t("last 30 days", "últimos 30 días")} />
        <Kpi icon={Star} label={t("Returning rate", "Tasa de repetición")} value={`${returnRate}%`} hint={t(`${returning} came back`, `${returning} han repetido`)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{t("Visits", "Visitas")}</div>
              <div className="text-sm text-muted">{t("Stamps and points collected per day, last 14 days", "Sellos y puntos sumados por día, últimos 14 días")}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums">{days.reduce((s, d) => s + d.value, 0)}</div>
              <div className="text-xs text-muted">{t("total", "en total")}</div>
            </div>
          </div>
          <div className="mt-6">
            <BarChart data={days} height={220} format={(v) => `${Math.round(v)}`} />
          </div>
        </div>

        <div className="card p-6">
          <div className="font-semibold">{t("Wallet adoption", "Uso de wallet")}</div>
          <div className="text-sm text-muted">{t(`${walletSaved} of ${customers.length} members saved the card`, `${walletSaved} de ${customers.length} clientes guardaron la tarjeta`)}</div>
          <div className="mt-5 flex h-3 gap-[2px] overflow-hidden rounded-full">
            <div className="rounded-l-full bg-ink" style={{ width: `${(apple / Math.max(1, customers.length)) * 100}%` }} />
            <div className="bg-zinc-400" style={{ width: `${(google / Math.max(1, customers.length)) * 100}%` }} />
            <div className="flex-1 rounded-r-full bg-zinc-200" />
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <Legend color="bg-ink" label="Apple Wallet" v={apple} />
            <Legend color="bg-zinc-400" label="Google Wallet" v={google} />
            <Legend color="bg-zinc-200" label={t("Web card only", "Solo tarjeta web")} v={customers.length - apple - google} />
          </ul>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-paper p-3 text-sm">
            <span className="flex items-center gap-2"><Star size={16} className="text-amber-500" fill="currentColor" /> {t("Google review clicks", "Clics en reseñas de Google")}</span>
            <span className="font-semibold">{reviews}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{t("Your card", "Tu tarjeta")}</div>
            <Link href="/dashboard/card" className="flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"><Palette size={14} /> {t("Edit", "Editar")}</Link>
          </div>
          <div className="mt-4">
            <ApplePass business={business} customer={{ id: "preview", name: t("Your customer", "Tu cliente"), stamps: Math.ceil(business.program.stampsRequired / 2), points: 140, rewardsEarned: 0, rewardsRedeemed: 0 }} showQR={false} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{t("Top customers", "Mejores clientes")}</div>
            <Link href="/dashboard/customers" className="text-sm font-medium text-muted hover:text-ink">{t("View all", "Ver todos")}</Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {top.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 py-2.5">
                <span className="w-4 text-xs text-muted">{i + 1}</span>
                <span className="grid size-8 place-items-center rounded-full bg-paper text-xs font-semibold">{c.name.split(" ").map((x) => x[0]).join("")}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</span>
                <span className="text-sm tabular-nums text-muted">{c.visits} {t("visits", "visitas")}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="font-semibold">{t("Recent activity", "Actividad reciente")}</div>
          <ul className="mt-3 space-y-3">
            {acts.slice(0, 6).map((a) => {
              const c = customers.find((x) => x.id === a.customerId);
              const label = {
                stamp: t("collected a stamp", "sumó un sello"),
                points: t(`earned ${a.amount} points`, `ganó ${a.amount} puntos`),
                reward: t("unlocked a reward", "desbloqueó una recompensa"),
                redeem: t("redeemed a reward", "canjeó una recompensa"),
                join: t("joined the program", "se unió al programa"),
                review: t("opened the Google review link", "abrió el enlace de reseña de Google"),
                wallet: t("saved the card to wallet", "guardó la tarjeta en su wallet"),
              }[a.kind];
              return (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-lime-deep" />
                  <div className="min-w-0">
                    <span className="font-medium">{c?.name}</span> <span className="text-zinc-600">{label}</span>
                    <div className="text-xs text-muted">{timeAgo(a.at, now, lang)}{a.method !== "system" ? ` · ${a.method === "staff" ? t("staff scan", "escaneo del personal") : t("self-scan", "autoescaneo")}` : ""}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

function Kpi({ icon: Icon, label, value, hint }: { icon: typeof Users; label: string; value: number | string; hint: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-sm text-muted">
        {label} <Icon size={16} />
      </div>
      <div className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-1 text-xs text-muted"><ArrowUpRight size={12} className="text-emerald-600" /> {hint}</div>
    </div>
  );
}

function Legend({ color, label, v }: { color: string; label: string; v: number }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${color}`} />{label}</span>
      <span className="font-semibold tabular-nums">{v}</span>
    </li>
  );
}

