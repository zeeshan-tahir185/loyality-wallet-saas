"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CreditCard, Download, Loader2, Lock, X } from "lucide-react";
import { Badge, PageHead } from "@/components/ui";
import { setPlan } from "@/lib/store";
import { useCurrentBusiness } from "@/lib/hooks";
import { locale, useLang, useT } from "@/lib/i18n";

const STATUS = {
  active: ["Active", "Activa", "green"],
  trialing: ["Trial", "Prueba", "sky"],
  past_due: ["Payment failed", "Pago fallido", "red"],
  canceled: ["Canceled", "Cancelada", "zinc"],
} as const;

export default function BillingPage() {
  const { business } = useCurrentBusiness();
  const [checkout, setCheckout] = useState(false);
  const t = useT();
  const lang = useLang();
  if (!business) return null;
  const loc = locale(lang);
  const [en, es, tone] = STATUS[business.plan];
  const label = lang === "es" ? es : en;
  const price = t("€29.99", "29,99 €");
  const paying = business.plan === "active";
  const next = new Date();
  next.setMonth(next.getMonth() + 1, 1);

  const invoices = paying
    ? Array.from({ length: 4 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        return { id: `INV-${2400 + i}`, date: d.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" }) };
      })
    : [];

  return (
    <>
      <PageHead title={t("Billing", "Facturación")} sub={t("Your subscription, payment method and invoices.", "Tu suscripción, método de pago y facturas.")} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold">LoopWallet Business <Badge tone={tone}>{label}</Badge></div>
              <div className="mt-1 text-sm text-muted">{t("Everything included · billed monthly", "Todo incluido · pago mensual")}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold tracking-tight">{price}</div>
              <div className="text-xs text-muted">{t("per month", "al mes")}</div>
            </div>
          </div>
          <div className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            {[t("Unlimited customers", "Clientes ilimitados"), t("Apple & Google Wallet cards", "Tarjetas Apple y Google Wallet"), t("Stamps, points & tiers", "Sellos, puntos y niveles"), t("Staff scanner & counter QR", "Escáner y QR de mostrador"), t("Google review QR", "QR de reseñas Google"), t("Spanish & English", "Español e inglés")].map((x) => (
              <div key={x} className="flex items-center gap-2"><Check size={16} className="text-lime-deep" /> {x}</div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            {paying ? (
              <>
                <div className="text-sm text-muted">{t("Next payment of", "Próximo pago de")} <b className="text-ink">{price}</b> {t("on", "el")} {next.toLocaleDateString(loc, { day: "numeric", month: "long" })}</div>
                <button onClick={() => setPlan(business.id, "canceled")} className="btn-ghost ml-auto">{t("Cancel plan", "Cancelar plan")}</button>
              </>
            ) : (
              <>
                <div className="text-sm text-muted">{business.plan === "past_due" ? t("Your last payment failed. Update your card to keep your cards active.", "Tu último pago ha fallado. Actualiza tu tarjeta para mantener el programa activo.") : t("Subscribe to keep your loyalty program running.", "Suscríbete para mantener tu programa de fidelidad activo.")}</div>
                <button onClick={() => setCheckout(true)} className="btn-ink ml-auto"><CreditCard size={16} /> {business.plan === "past_due" ? t("Update payment", "Actualizar pago") : `${t("Subscribe", "Suscribirse")} · ${price}/${t("mo", "mes")}`}</button>
              </>
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="font-semibold">{t("Payment method", "Método de pago")}</div>
          {paying ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-line p-4">
              <div className="grid h-8 w-12 place-items-center rounded-md bg-[#1a1f71] text-[11px] font-bold italic text-white">VISA</div>
              <div className="flex-1 text-sm"><div className="font-semibold">•••• 4242</div><div className="text-muted">{t("Expires", "Caduca")} 08/28</div></div>
              <button onClick={() => setCheckout(true)} className="text-sm font-semibold">{t("Edit", "Editar")}</button>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-line p-4 text-sm text-muted">{t("No card on file", "Sin tarjeta guardada")}</div>
          )}
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted"><Lock size={12} /> {t("Payments are processed securely by Stripe.", "Los pagos se procesan de forma segura con Stripe.")}</div>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="border-b border-line p-5 font-semibold">{t("Invoices", "Facturas")}</div>
        {invoices.length ? (
          <ul className="divide-y divide-line text-sm">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between px-5 py-3.5">
                <span className="font-mono text-xs">{inv.id}</span>
                <span className="text-muted">{inv.date}</span>
                <span className="font-semibold">{price}</span>
                <Badge tone="green">{t("Paid", "Pagada")}</Badge>
                <button className="text-muted hover:text-ink"><Download size={16} /></button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-sm text-muted">{t("No invoices yet.", "Todavía no hay facturas.")}</div>
        )}
      </div>

      <AnimatePresence>{checkout && <Checkout onClose={() => setCheckout(false)} onPaid={() => { setPlan(business.id, "active"); setCheckout(false); }} email={business.email} />}</AnimatePresence>
    </>
  );
}

function Checkout({ onClose, onPaid, email }: { onClose: () => void; onPaid: () => void; email: string }) {
  const t = useT();
  const [state, setState] = useState<"form" | "paying" | "done">("form");
  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setState("paying");
    setTimeout(() => setState("done"), 1400);
    setTimeout(onPaid, 2300);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="bg-[#f7f7f9] p-8">
          <div className="text-sm text-muted">{t("Subscribe to", "Suscribirse a")}</div>
          <div className="text-lg font-semibold">LoopWallet Business</div>
          <div className="mt-3 flex items-end gap-1"><span className="text-4xl font-semibold">{t("€29.99", "29,99 €")}</span><span className="pb-1 text-sm text-muted">{t("per month", "al mes")}</span></div>
          <div className="mt-8 space-y-2 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{t("€29.99", "29,99 €")}</span></div>
            <div className="flex justify-between font-semibold"><span>{t("Total due today", "Total a pagar hoy")}</span><span>{t("€29.99", "29,99 €")}</span></div>
          </div>
          <div className="mt-10 text-xs text-muted">{t("Powered by", "Con la tecnología de")} <b className="text-[#635bff]">stripe</b> · {t("Test mode", "Modo prueba")}</div>
        </div>
        <form onSubmit={pay} className="relative p-8">
          <button type="button" onClick={onClose} className="absolute right-4 top-4 text-muted"><X size={18} /></button>
          <div className="text-sm font-medium">Email</div>
          <input className="input mt-1" defaultValue={email} />
          <div className="mt-4 text-sm font-medium">{t("Card information", "Datos de la tarjeta")}</div>
          <div className="mt-1 overflow-hidden rounded-xl border border-line">
            <input className="w-full border-b border-line px-3.5 py-2.5 text-sm outline-none" defaultValue="4242 4242 4242 4242" />
            <div className="flex">
              <input className="w-1/2 border-r border-line px-3.5 py-2.5 text-sm outline-none" defaultValue="08 / 28" />
              <input className="w-1/2 px-3.5 py-2.5 text-sm outline-none" defaultValue="123" />
            </div>
          </div>
          <div className="mt-4 text-sm font-medium">{t("Name on card", "Titular de la tarjeta")}</div>
          <input className="input mt-1" defaultValue="Carmen Ruiz" />
          <button disabled={state !== "form"} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#635bff] py-3 font-semibold text-white disabled:opacity-90">
            {state === "form" && t("Subscribe", "Suscribirse")}
            {state === "paying" && <><Loader2 size={18} className="animate-spin" /> {t("Processing…", "Procesando…")}</>}
            {state === "done" && <><Check size={18} /> {t("Payment successful", "Pago realizado")}</>}
          </button>
          <div className="mt-3 text-center text-xs text-muted">{t("Demo checkout. No real payment is taken.", "Pago de demostración. No se cobra nada.")}</div>
        </form>
      </motion.div>
    </motion.div>
  );
}
