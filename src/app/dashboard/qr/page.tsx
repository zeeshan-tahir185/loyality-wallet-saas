"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Check, Copy, Download, ExternalLink, RefreshCw, Star, UserPlus } from "lucide-react";
import { BizMark } from "@/components/pass";
import { PageHead } from "@/components/ui";
import { updateBusiness } from "@/lib/store";
import { counterCode, useCurrentBusiness, useNow } from "@/lib/hooks";

export default function QrPage() {
  const { db, business } = useCurrentBusiness();
  const now = useNow(1000);
  const [origin, setOrigin] = useState("");
  const [review, setReview] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => setReview(business?.googleReviewUrl ?? ""), [business?.id]);
  if (!db || !business || !origin) return null;

  const p = business.program;
  const code = counterCode(business.id, Math.floor(now / 30_000));
  const left = 30 - (Math.floor(now / 1000) % 30);
  const joinUrl = `${origin}/c/${business.slug}`;
  const counterUrl = `${joinUrl}?t=${code}`;
  const members = db.customers.filter((c) => c.businessId === business.id);
  const reviewed = members.filter((c) => c.reviewed).length;

  return (
    <>
      <PageHead title="QR codes & Reviews" sub="Everything you need at the counter." />

      <div className="grid gap-6 lg:grid-cols-3">
        <QrCard
          id="qr-counter"
          title="Counter QR"
          sub="Customers scan it to collect a stamp themselves. The code rotates every 30 seconds."
          icon={<RefreshCw size={16} />}
          value={counterUrl}
          bg={p.bg}
          fg={p.fg}
          footer={
            <div className="w-full">
              <div className="flex items-center justify-between font-mono text-xs opacity-80"><span>{code}</span><span>{left}s</span></div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${(left / 30) * 100}%`, background: p.accent }} /></div>
            </div>
          }
          label={business.name}
          program={p}
          hint="Show it on a tablet at the till for best results."
        />
        <QrCard
          id="qr-join"
          title="Join QR"
          sub="Print it on flyers, menus or the window. New customers get their card in seconds."
          icon={<UserPlus size={16} />}
          value={joinUrl}
          bg="#ffffff"
          fg="#0c0c10"
          label="Join our loyalty club"
          program={p}
          link={joinUrl}
        />
        <QrCard
          id="qr-review"
          title="Google review QR"
          sub="Sends happy customers straight to your Google review page."
          icon={<Star size={16} />}
          value={review || "https://g.page"}
          bg="#fffbeb"
          fg="#78350f"
          label="Loved your visit? Review us"
          program={p}
          link={review}
        >
          <div className="mt-4">
            <label className="text-xs font-medium text-muted">Your Google review link</label>
            <div className="mt-1 flex gap-2">
              <input className="input text-xs" value={review} onChange={(e) => setReview(e.target.value)} />
              <button onClick={() => updateBusiness(business.id, { googleReviewUrl: review })} className="btn-ink px-3.5">Save</button>
            </div>
          </div>
        </QrCard>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Stat k="Members who left a review" v={`${reviewed}`} />
        <Stat k="Review rate" v={`${members.length ? Math.round((reviewed / members.length) * 100) : 0}%`} />
        <Stat k="Shown on every wallet card" v="Yes" />
      </div>
      <p className="mt-4 text-sm text-muted">Google&apos;s policy doesn&apos;t allow rewarding reviews, so the review prompt is kept separate from stamps and points.</p>
    </>
  );
}

function QrCard({
  id, title, sub, icon, value, bg, fg, label, program, footer, link, hint, children,
}: {
  id: string; title: string; sub: string; icon: React.ReactNode; value: string; bg: string; fg: string; label: string;
  program: Parameters<typeof BizMark>[0]["program"]; footer?: React.ReactNode; link?: string; hint?: string; children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const download = () => {
    const c = document.getElementById(id) as HTMLCanvasElement | null;
    if (!c) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = `${id}.png`;
    a.click();
  };
  return (
    <div className="card flex flex-col p-6">
      <div className="flex items-center gap-2 font-semibold">{icon} {title}</div>
      <div className="mt-1 text-sm text-muted">{sub}</div>
      <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl border border-line p-5" style={{ background: bg, color: fg }}>
        <BizMark program={program} size={36} />
        <div className="text-center text-sm font-semibold">{label}</div>
        <div className="rounded-xl bg-white p-2.5">
          <QRCodeCanvas id={id} value={value} size={512} level="M" style={{ width: 150, height: 150 }} />
        </div>
        {footer}
      </div>
      {hint && <div className="mt-3 text-xs text-muted">{hint}</div>}
      {children}
      <div className="mt-auto flex gap-2 pt-4">
        <button onClick={download} className="btn-ghost flex-1 px-3"><Download size={15} /> PNG</button>
        {link && (
          <>
            <button onClick={() => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="btn-ghost px-3">
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
            <a href={link} target="_blank" rel="noreferrer" className="btn-ghost px-3"><ExternalLink size={15} /></a>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-muted">{k}</div>
      <div className="mt-1 text-2xl font-semibold">{v}</div>
    </div>
  );
}
