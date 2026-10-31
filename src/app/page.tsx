import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CreditCard,
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
import { INDUSTRIES } from "@/lib/industries";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <QRMethods />
      <section id="industries" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHead eyebrow="Built for every business" title={<>One platform, <em className="font-display italic">any</em> industry.</>} sub="Gyms, barbershops, salons, cafés, clothing and perfume stores — each business picks stamps or points and sets its own rewards." />
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
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-700 md:flex">
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#industries" className="hover:text-ink">Industries</a>
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden px-3 text-sm font-semibold sm:block">Log in</Link>
          <Link href="/demo" className="btn-ink">Live demo <ArrowRight size={16} /></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="grain relative">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold">
            <span className="size-2 rounded-full bg-lime-deep" /> Apple Wallet & Google Wallet ready
          </div>
          <h1 className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[76px]">
            Loyalty cards that live in your customers&apos; <em className="font-display font-normal italic">wallet.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
            Replace paper punch cards with digital stamps, points and rewards. Customers join with one QR scan, no app to download — and every visit brings them closer to their next reward.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/demo" className="btn-ink px-6 py-3.5 text-base">Try the live demo <ArrowRight size={18} /></Link>
            <Link href="/dashboard" className="btn-ghost px-6 py-3.5 text-base">
              <LayoutDashboard size={18} /> Business dashboard
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <AppleWalletBadge small />
            <GoogleWalletBadge small />
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["2 min", "to launch a card"],
              ["0 apps", "to download"],
              ["2 ways", "to collect stamps"],
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
  const items = [...INDUSTRIES, ...INDUSTRIES];
  return (
    <div className="overflow-hidden border-y border-line bg-ink py-5 text-white">
      <div className="marquee flex w-max gap-12">
        {items.map((i, k) => (
          <span key={k} className="flex items-center gap-3 text-lg font-medium text-white/80">
            <i.icon size={20} className="text-lime" /> {i.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: React.ReactNode; sub: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{eyebrow}</div>
      <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{title}</h2>
      <p className="mt-4 text-lg text-zinc-600">{sub}</p>
    </div>
  );
}

function QRMethods() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead center eyebrow="How it works" title={<>Two ways to stamp. <em className="font-display italic">Zero</em> friction.</>} sub="Every business can use both methods — whatever fits the counter, the queue and the staff." />
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="card relative overflow-hidden p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-ink text-lime"><ScanLine size={22} /></span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted">Method 1</div>
              <h3 className="text-xl font-semibold">Staff scans the customer</h3>
            </div>
          </div>
          <p className="mt-4 text-zinc-600">The customer opens the card in their wallet. Staff scan the QR with any phone or tablet and tap <b>Add stamp</b>. Done in two seconds.</p>
          <Steps items={["Customer shows wallet card", "Staff scans with the scanner page", "Stamp lands on the card instantly"]} />
        </div>
        <div className="card relative overflow-hidden bg-ink p-8 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-lime text-ink"><QrCode size={22} /></span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/50">Method 2</div>
              <h3 className="text-xl font-semibold">Customer scans the business</h3>
            </div>
          </div>
          <p className="mt-4 text-white/70">Print the counter QR or show it on a tablet. Customers scan it with their camera and collect their stamp — perfect for busy hours.</p>
          <Steps dark items={["Counter QR at the till", "Customer scans with their camera", "Fresh one-time code stops repeat scans"]} />
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          [Smartphone, "No app needed", "Cards save straight into Apple Wallet or Google Wallet."],
          [Users, "One-tap sign up", "Name and phone — that’s it. Joined in under 20 seconds."],
          [ShieldCheck, "Fraud-safe", "Rotating codes and per-day limits prevent stamp abuse."],
        ].map(([Icon, t, d]) => {
          const I = Icon as typeof Smartphone;
          return (
            <div key={t as string} className="flex gap-4 rounded-2xl border border-line bg-white/60 p-5">
              <I size={22} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">{t as string}</div>
                <div className="text-sm text-muted">{d as string}</div>
              </div>
            </div>
          );
        })}
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
  const f = [
    [Palette, "Card designer", "Colours, icon, stamp count, rewards — with a live wallet preview as you edit."],
    [Star, "Stamps & points", "Classic punch cards or points per visit and per € spent with reward tiers."],
    [ScanLine, "Staff scanner", "A scanner page that runs in the browser on any phone or tablet."],
    [Users, "Customer CRM", "See every member, their visits, rewards and last visit at a glance."],
    [BarChart3, "Insights", "Visits, returning customers and redemptions — know what is working."],
    [CreditCard, "Simple billing", "One monthly plan, paid by card through Stripe. Cancel anytime."],
  ] as const;
  return (
    <section id="features" className="bg-ink py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Everything in one dashboard</div>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            Your loyalty program, <em className="font-display italic text-lime">running itself.</em>
          </h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {f.map(([Icon, t, d]) => (
            <div key={t} className="bg-ink p-8 transition hover:bg-white/[.03]">
              <Icon className="text-lime" size={26} />
              <div className="mt-5 text-lg font-semibold">{t}</div>
              <div className="mt-2 text-white/60">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="card grid overflow-hidden lg:grid-cols-2">
        <div className="p-8 sm:p-12">
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={12} fill="currentColor" />)} Google Reviews booster
          </div>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em]">Turn happy regulars into <em className="font-display italic">5-star</em> reviews.</h2>
          <p className="mt-4 text-lg text-zinc-600">
            Each business gets a review QR code and link that opens its Google review page directly. Show it at the till, on the receipt, or on the wallet card itself.
          </p>
          <ul className="mt-6 space-y-2 text-zinc-700">
            {["Review link on every wallet card", "Printable review QR for the counter", "Track how many members leave a review"].map((x) => (
              <li key={x} className="flex items-center gap-2"><Check size={18} className="text-lime-deep" /> {x}</li>
            ))}
          </ul>
        </div>
        <div className="grain relative flex items-center justify-center bg-paper p-10">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-[#3b2417] text-amber-400">☕</div>
              <div>
                <div className="font-semibold">Bloom Coffee House</div>
                <div className="flex items-center gap-1 text-sm text-muted">4.9 {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={12} className="text-amber-500" fill="currentColor" />)} (412)</div>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-paper p-4 text-sm leading-relaxed">“Best flat white in town and I love that my stamp card is in my phone now. Never lose it again!”</div>
            <div className="mt-3 text-xs text-muted">Lucía G. · Local Guide · 2 days ago</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <SectionHead center eyebrow="Pricing" title={<>One plan. <em className="font-display italic">Everything</em> included.</>} sub="No setup fees, no per-customer charges. Cancel anytime." />
      <div className="mx-auto mt-12 max-w-md rounded-[28px] bg-ink p-2 text-white shadow-2xl">
        <div className="rounded-[22px] border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{BRAND} Business</span>
            <span className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-bold text-ink">Most popular</span>
          </div>
          <div className="mt-6 flex items-end gap-1">
            <span className="text-6xl font-semibold tracking-tight">€29.99</span>
            <span className="pb-2 text-white/60">/month</span>
          </div>
          <ul className="mt-8 space-y-3 text-white/85">
            {[
              "Unlimited customers & wallet cards",
              "Apple Wallet + Google Wallet",
              "Stamps, points & reward tiers",
              "Staff scanner + counter QR",
              "Google Reviews QR & link",
              "Customer list & insights",
            ].map((x) => (
              <li key={x} className="flex items-center gap-3"><Check size={18} className="text-lime" /> {x}</li>
            ))}
          </ul>
          <Link href="/dashboard/billing" className="btn-lime mt-8 w-full py-3.5 text-base">Start now <ArrowRight size={18} /></Link>
          <div className="mt-3 text-center text-xs text-white/40">Secure payments by Stripe</div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[32px] bg-lime px-8 py-16 text-center sm:px-16">
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
          See it work in <em className="font-display italic">30 seconds.</em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink/70">Scan as the staff, watch the stamp land on the customer&apos;s phone, unlock a reward. All live.</p>
        <Link href="/demo" className="btn-ink mt-8 px-7 py-4 text-base">Open live demo <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:px-6">
        <Logo />
        <div className="flex gap-6">
          <Link href="/demo">Live demo</Link>
          <Link href="/dashboard">Business dashboard</Link>
          <Link href="/admin">Admin</Link>
        </div>
        <div>© 2026 {BRAND}</div>
      </div>
    </footer>
  );
}
