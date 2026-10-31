"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CreditCard,
  Globe,
  LayoutDashboard,
  Palette,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { HeroPhone } from "@/components/hero-phone";
import { IndustryShowcase } from "@/components/industry-showcase";
import { AppleWalletBadge, BRAND, GoogleWalletBadge, Logo } from "@/components/brand";
import { INDUSTRIES, industryLabel } from "@/lib/industries";
import { LangSwitch, useLang, useT } from "@/lib/i18n";

export default function Home() {
  const t = useT();
  return (
    <main className="overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <QRMethods />
      <section id="industries" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHead
          eyebrow={t("Built for every business", "Para cualquier negocio")}
          title={t("One platform, any industry.", "Una plataforma, cualquier sector.")}
          sub={t(
            "Gyms, barbershops, salons, cafés, clothing and perfume stores. Each business picks stamps or points and sets its own rewards.",
            "Gimnasios, barberías, salones de belleza, cafeterías, tiendas de ropa y perfumerías. Cada negocio elige sellos o puntos y define sus propias recompensas.",
          )}
        />
        <div className="mt-14">
          <IndustryShowcase />
        </div>
      </section>
      <Features />
      <Reviews />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}

function Nav() {
  const t = useT();
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-700 md:flex">
          <a href="#how" className="hover:text-ink">{t("How it works", "Cómo funciona")}</a>
          <a href="#industries" className="hover:text-ink">{t("Industries", "Sectores")}</a>
          <a href="#reviews" className="hover:text-ink">{t("Google Reviews", "Reseñas Google")}</a>
          <a href="#pricing" className="hover:text-ink">{t("Pricing", "Precio")}</a>
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <Link href="/dashboard" className="hidden px-3 text-sm font-semibold sm:block">{t("Log in", "Entrar")}</Link>
          <Link href="/demo" className="btn-ink hidden sm:inline-flex">{t("Live demo", "Demo en vivo")} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const t = useT();
  return (
    <section className="grain relative">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold">
            <span className="size-2 rounded-full bg-lime-deep" /> {t("Apple Wallet & Google Wallet ready", "Compatible con Apple Wallet y Google Wallet")}
          </div>
          <h1 className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[72px]">
            {t("Loyalty cards that live in your customers'", "Tarjetas de fidelidad en la")}{" "}
            <em className="font-display font-normal italic">{t("wallet.", "cartera de tus clientes.")}</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
            {t(
              "Replace paper punch cards with digital stamps, points and rewards. Customers join with one QR scan, no app to download, and every visit brings them closer to their next reward.",
              "Sustituye las tarjetas de papel por sellos, puntos y recompensas digitales. Tus clientes se unen escaneando un QR, sin descargar ninguna app, y cada visita les acerca a su próxima recompensa.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/demo" className="btn-ink px-6 py-3.5 text-base">{t("Try the live demo", "Probar la demo")} <ArrowRight size={18} /></Link>
            <Link href="/dashboard" className="btn-ghost px-6 py-3.5 text-base">
              <LayoutDashboard size={18} /> {t("Business dashboard", "Panel del negocio")}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <AppleWalletBadge small />
            <GoogleWalletBadge small />
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["2 min", t("to launch a card", "para lanzar tu tarjeta")],
              ["0 apps", t("to download", "que descargar")],
              [t("2 ways", "2 formas"), t("to collect stamps", "de sumar sellos")],
            ].map(([a, b]) => (
              <div key={a}>
                <div className="text-2xl font-semibold tracking-tight">{a}</div>
                <div className="text-sm text-muted">{b}</div>
              </div>
            ))}
          </div>
        </div>
        <HeroPhone />
      </div>
    </section>
  );
}

function Marquee() {
  const lang = useLang();
  const items = [...INDUSTRIES, ...INDUSTRIES];
  return (
    <div className="overflow-hidden border-y border-line bg-ink py-5 text-white">
      <div className="marquee flex w-max gap-12">
        {items.map((i, k) => (
          <span key={k} className="flex items-center gap-3 text-lg font-medium text-white/80">
            <i.icon size={20} className="text-lime" /> {industryLabel(i.key, lang)}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: string; sub: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{eyebrow}</div>
      <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{title}</h2>
      <p className="mt-4 text-lg text-zinc-600">{sub}</p>
    </div>
  );
}

function QRMethods() {
  const t = useT();
  const perks: [typeof Smartphone, string, string][] = [
    [Smartphone, t("No app needed", "Sin descargar apps"), t("Cards save straight into Apple Wallet or Google Wallet.", "La tarjeta se guarda directamente en Apple Wallet o Google Wallet.")],
    [Users, t("One-tap sign up", "Alta en segundos"), t("Just a name and phone number. Joined in under 20 seconds.", "Solo nombre y teléfono. Dentro en menos de 20 segundos.")],
    [ShieldCheck, t("Fraud-safe", "Antifraude"), t("Rotating codes and per-day limits prevent stamp abuse.", "Códigos rotativos y límites diarios evitan el abuso de sellos.")],
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead
        center
        eyebrow={t("How it works", "Cómo funciona")}
        title={t("Two ways to stamp. Zero friction.", "Dos formas de sellar. Cero fricción.")}
        sub={t("Every business can use both methods, whichever fits the counter, the queue and the staff.", "Cada negocio puede usar los dos métodos, según su mostrador, sus colas y su equipo.")}
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="card relative overflow-hidden p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-ink text-lime"><ScanLine size={22} /></span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted">{t("Method 1", "Método 1")}</div>
              <h3 className="text-xl font-semibold">{t("Staff scans the customer", "El personal escanea al cliente")}</h3>
            </div>
          </div>
          <p className="mt-4 text-zinc-600">
            {t(
              "The customer opens the card in their wallet. Staff scan the QR with any phone or tablet and tap Add stamp. Done in two seconds.",
              "El cliente abre la tarjeta en su cartera. El personal escanea el QR con cualquier móvil o tablet y pulsa Añadir sello. Listo en dos segundos.",
            )}
          </p>
          <Steps items={[t("Customer shows wallet card", "El cliente muestra su tarjeta"), t("Staff scans with the scanner page", "El personal la escanea desde el panel"), t("Stamp lands on the card instantly", "El sello aparece al instante")]} />
        </div>
        <div className="card relative overflow-hidden bg-ink p-8 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-lime text-ink"><QrCode size={22} /></span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/50">{t("Method 2", "Método 2")}</div>
              <h3 className="text-xl font-semibold">{t("Customer scans the business", "El cliente escanea el negocio")}</h3>
            </div>
          </div>
          <p className="mt-4 text-white/70">
            {t(
              "Print the counter QR or show it on a tablet. Customers scan it with their camera and collect their stamp. Perfect for busy hours.",
              "Imprime el QR del mostrador o muéstralo en una tablet. El cliente lo escanea con la cámara y suma su sello. Ideal para horas punta.",
            )}
          </p>
          <Steps dark items={[t("Counter QR at the till", "QR en el mostrador"), t("Customer scans with their camera", "El cliente lo escanea con la cámara"), t("Fresh one-time code stops repeat scans", "El código cambia y evita escaneos repetidos")]} />
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {perks.map(([I, title, d]) => (
          <div key={title} className="flex gap-4 rounded-2xl border border-line bg-white/60 p-5">
            <I size={22} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold">{title}</div>
              <div className="text-sm text-muted">{d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Steps({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ol className="mt-8 space-y-3">
      {items.map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${dark ? "bg-white/10 text-lime" : "bg-paper"}`}>{i + 1}</span>
          <span className={dark ? "text-white/90" : ""}>{s}</span>
        </li>
      ))}
    </ol>
  );
}

function Features() {
  const t = useT();
  const f: [typeof Palette, string, string][] = [
    [Palette, t("Card designer", "Diseñador de tarjetas"), t("Colours, icon, stamp count, rewards, with a live wallet preview as you edit.", "Colores, icono, número de sellos y recompensas, con vista previa en vivo.")],
    [Star, t("Stamps & points", "Sellos y puntos"), t("Classic punch cards or points per visit and per € spent with reward tiers.", "Tarjeta de sellos clásica o puntos por visita y por € gastado, con niveles de recompensa.")],
    [ScanLine, t("Staff scanner", "Escáner para el personal"), t("A scanner page that runs in the browser on any phone or tablet.", "Un escáner que funciona en el navegador de cualquier móvil o tablet.")],
    [Users, t("Customer CRM", "Clientes"), t("See every member, their visits, rewards and last visit at a glance.", "Consulta cada cliente, sus visitas, recompensas y última visita de un vistazo.")],
    [Globe, t("Spanish & English", "Español e inglés"), t("Dashboard, customer pages and wallet cards in Spanish and English.", "Panel, páginas de cliente y tarjetas de wallet en español e inglés.")],
    [CreditCard, t("Simple billing", "Pago sencillo"), t("One monthly plan, paid by card through Stripe. Cancel anytime.", "Un único plan mensual, pago con tarjeta mediante Stripe. Cancela cuando quieras.")],
  ];
  return (
    <section id="features" className="bg-ink py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">{t("Everything in one dashboard", "Todo en un solo panel")}</div>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            {t("Your loyalty program,", "Tu programa de fidelidad,")} <em className="font-display italic text-lime">{t("running itself.", "en piloto automático.")}</em>
          </h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {f.map(([Icon, title, d]) => (
            <div key={title} className="bg-ink p-8 transition hover:bg-white/[.03]">
              <Icon className="text-lime" size={26} />
              <div className="mt-5 text-lg font-semibold">{title}</div>
              <div className="mt-2 text-white/60">{d}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
          <BarChart3 size={16} /> {t("Plus insights on visits, returning customers and redemptions.", "Además, estadísticas de visitas, clientes recurrentes y canjes.")}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const t = useT();
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="card grid overflow-hidden lg:grid-cols-2">
        <div className="p-8 sm:p-12">
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={12} fill="currentColor" />)} {t("Loyalty + reputation", "Fidelización + reputación")}
          </div>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em]">
            {t("Turn happy regulars into", "Convierte a tus clientes fieles en")} <em className="font-display italic">{t("5-star reviews.", "reseñas de 5 estrellas.")}</em>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            {t(
              "Each business gets a Google review QR code and link. Show it at the till, on the receipt, or on the wallet card itself, and track how many customers leave a review.",
              "Cada negocio tiene su QR y enlace de reseñas de Google. Muéstralo en el mostrador, en el ticket o en la propia tarjeta de wallet, y mide cuántos clientes dejan su reseña.",
            )}
          </p>
          <ul className="mt-6 space-y-2 text-zinc-700">
            {[
              t("Review link on every wallet card", "Enlace de reseña en cada tarjeta"),
              t("Printable review QR for the counter", "QR de reseñas imprimible para el mostrador"),
              t("Review activity and statistics", "Actividad y estadísticas de reseñas"),
              t("Follows Google's policy: no rewards for reviews", "Cumple la política de Google: sin recompensas por reseñas"),
            ].map((x) => (
              <li key={x} className="flex items-center gap-2"><Check size={18} className="shrink-0 text-lime-deep" /> {x}</li>
            ))}
          </ul>
        </div>
        <div className="grain relative flex items-center justify-center bg-paper p-10">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-[#3b2417] text-amber-400">☕</div>
              <div>
                <div className="font-semibold">Bloom Coffee House</div>
                <div className="flex items-center gap-1 text-sm text-muted">
                  {t("4.9", "4,9")} {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={12} className="text-amber-500" fill="currentColor" />)} (412)
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-paper p-4 text-sm leading-relaxed">
              {t(
                "“Best flat white in town and I love that my stamp card is in my phone now. Never lose it again!”",
                "“El mejor flat white de Madrid y me encanta tener la tarjeta de sellos en el móvil. ¡Ya no se me pierde!”",
              )}
            </div>
            <div className="mt-3 text-xs text-muted">Lucía G. · Local Guide · {t("2 days ago", "hace 2 días")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const t = useT();
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <SectionHead
        center
        eyebrow={t("Pricing", "Precio")}
        title={t("One plan. Everything included.", "Un plan. Todo incluido.")}
        sub={t("No setup fees, no per-customer charges. Cancel anytime.", "Sin costes de alta ni cargos por cliente. Cancela cuando quieras.")}
      />
      <div className="mx-auto mt-12 max-w-md rounded-[28px] bg-ink p-2 text-white shadow-2xl">
        <div className="rounded-[22px] border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{BRAND} Business</span>
            <span className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-bold text-ink">{t("Most popular", "El más elegido")}</span>
          </div>
          <div className="mt-6 flex items-end gap-1">
            <span className="text-6xl font-semibold tracking-tight">{t("€29.99", "29,99 €")}</span>
            <span className="pb-2 text-white/60">/{t("month", "mes")}</span>
          </div>
          <ul className="mt-8 space-y-3 text-white/85">
            {[
              t("Unlimited customers & wallet cards", "Clientes y tarjetas ilimitados"),
              "Apple Wallet + Google Wallet",
              t("Stamps, points & reward tiers", "Sellos, puntos y niveles de recompensa"),
              t("Staff scanner + counter QR", "Escáner para el personal + QR de mostrador"),
              t("Google Reviews QR & link", "QR y enlace de reseñas de Google"),
              t("Spanish & English", "Español e inglés"),
            ].map((x) => (
              <li key={x} className="flex items-center gap-3"><Check size={18} className="text-lime" /> {x}</li>
            ))}
          </ul>
          <Link href="/dashboard/billing" className="btn-lime mt-8 w-full py-3.5 text-base">{t("Start now", "Empezar ahora")} <ArrowRight size={18} /></Link>
          <div className="mt-3 text-center text-xs text-white/40">{t("Secure payments by Stripe", "Pagos seguros con Stripe")}</div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const t = useT();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[32px] bg-lime px-8 py-16 text-center sm:px-16">
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
          {t("See it work in", "Míralo funcionar en")} <em className="font-display italic">{t("30 seconds.", "30 segundos.")}</em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink/70">
          {t(
            "Scan as the staff, watch the stamp land on the customer's phone, unlock a reward. All live.",
            "Escanea como el personal, mira cómo llega el sello al móvil del cliente y desbloquea una recompensa. Todo en vivo.",
          )}
        </p>
        <Link href="/demo" className="btn-ink mt-8 px-7 py-4 text-base">{t("Open live demo", "Abrir la demo")} <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:px-6">
        <Logo />
        <div className="flex gap-6">
          <Link href="/demo">{t("Live demo", "Demo en vivo")}</Link>
          <Link href="/dashboard">{t("Business dashboard", "Panel del negocio")}</Link>
          <Link href="/admin">Admin</Link>
        </div>
        <div>© 2026 {BRAND}</div>
      </div>
    </footer>
  );
}
