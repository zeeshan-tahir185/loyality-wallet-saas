"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronsUpDown,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Palette,
  QrCode,
  ScanLine,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { BizMark } from "@/components/pass";
import { Loading } from "@/components/ui";
import { setCurrentBusiness, useCurrentBusiness } from "@/lib/hooks";
import { LangSwitch, useT } from "@/lib/i18n";

const NAV = [
  { href: "/dashboard", label: ["Overview", "Resumen"], icon: LayoutDashboard },
  { href: "/dashboard/scanner", label: ["Scanner", "Escáner"], icon: ScanLine },
  { href: "/dashboard/customers", label: ["Customers", "Clientes"], icon: Users },
  { href: "/dashboard/card", label: ["Card designer", "Diseño de tarjeta"], icon: Palette },
  { href: "/dashboard/reviews", label: ["Google Reviews", "Reseñas Google"], icon: Star },
  { href: "/dashboard/qr", label: ["QR codes", "Códigos QR"], icon: QrCode },
  { href: "/dashboard/billing", label: ["Billing", "Facturación"], icon: CreditCard },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const t = useT();
  const { db, business } = useCurrentBusiness();
  const [open, setOpen] = useState(false);
  const [picker, setPicker] = useState(false);

  const sidebar = business && db && (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo />
        <button className="lg:hidden" onClick={() => setOpen(false)}><X size={20} /></button>
      </div>
      <div className="relative px-3">
        <button onClick={() => setPicker(!picker)} className="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-2.5 text-left hover:border-zinc-300">
          <BizMark program={business.program} size={34} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{business.name}</div>
            <div className="text-xs text-muted">{business.city}</div>
          </div>
          <ChevronsUpDown size={16} className="text-muted" />
        </button>
        {picker && (
          <div className="absolute inset-x-3 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-xl">
            <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{t("Switch business (demo)", "Cambiar de negocio (demo)")}</div>
            {db.businesses.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setCurrentBusiness(b.id);
                  setPicker(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-paper ${b.id === business.id ? "bg-paper font-semibold" : ""}`}
              >
                <BizMark program={b.program} size={24} /> <span className="truncate">{b.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <nav className="mt-4 flex-1 space-y-0.5 px-3">
        {NAV.map((n) => {
          const active = n.href === "/dashboard" ? path === n.href : path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-ink text-white" : "text-zinc-600 hover:bg-white hover:text-ink"}`}
            >
              <n.icon size={18} className={active ? "text-lime" : ""} /> {t(n.label[0], n.label[1])}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 p-3">
        <div className="flex items-center justify-between px-3 pb-2 text-sm text-zinc-600">
          {t("Language", "Idioma")} <LangSwitch />
        </div>
        <Link href={`/c/${business.slug}`} target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-white">
          <ExternalLink size={18} /> {t("Customer card page", "Página del cliente")}
        </Link>
        <Link href="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-white">
          <Shield size={18} /> {t("Platform admin", "Admin de la plataforma")}
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white p-3">
          <div className="grid size-9 place-items-center rounded-full bg-lime text-sm font-bold">{business.owner.split(" ").map((x) => x[0]).join("")}</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{business.owner}</div>
            <div className="truncate text-xs text-muted">{business.email}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-[#f0f0ea] lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#f0f0ea]">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)}><Menu /></button>
          <Logo />
          <span className="w-6" />
        </div>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{business ? children : <Loading />}</main>
      </div>
    </div>
  );
}
