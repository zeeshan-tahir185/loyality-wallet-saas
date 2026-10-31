"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import jsQR from "jsqr";
import { Camera, CameraOff, Check, Gift, Search, X, Zap } from "lucide-react";
import { ApplePass } from "@/components/pass";
import { PageHead } from "@/components/ui";
import { addVisit, redeemReward } from "@/lib/store";
import { useCurrentBusiness } from "@/lib/hooks";
import { useLang, useT } from "@/lib/i18n";

export default function ScannerPage() {
  const { db, business } = useCurrentBusiness();
  const t = useT();
  const lang = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [spend, setSpend] = useState(20);
  const [flash, setFlash] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(-1);
  const [cam, setCam] = useState<"off" | "on" | "denied">("off");
  const [scanError, setScanError] = useState<string | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const customersRef = useRef<{ id: string; businessId: string }[]>([]);

  customersRef.current = db?.customers ?? [];

  const stop = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setCam("off");
  };

  useEffect(() => stop, []);

  useEffect(() => {
    if (cam !== "on" || !business) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let raf = 0;
    const tick = () => {
      const v = video.current;
      if (v && ctx && v.readyState >= 2) {
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        ctx.drawImage(v, 0, 0);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        if (code?.data) {
          const id = code.data.startsWith("LW1:") ? code.data.slice(4) : null;
          const c = id && customersRef.current.find((x) => x.id === id);
          if (c && c.businessId === business.id) {
            setSelected(c.id);
            setScanError(null);
            navigator.vibrate?.(60);
            stop();
            return;
          }
          const es = langRef.current === "es";
          setScanError(c ? (es ? "Esta tarjeta es de otro negocio." : "This card belongs to another business.") : es ? "No es un QR de tarjeta de fidelidad." : "Not a loyalty card QR.");
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cam, business]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  if (!db || !business) return null;
  const p = business.program;
  const customers = db.customers.filter((c) => c.businessId === business.id);
  const results = q
    ? customers.filter((c) => `${c.name} ${c.phone} ${c.id}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : customers.slice(0, 6);
  const cust = customers.find((c) => c.id === selected);

  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.current = s;
      setCam("on");
      setSelected(null);
      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = s;
          video.current.play();
        }
      });
    } catch {
      setCam("denied");
    }
  };

  const add = () => {
    if (!cust) return;
    const res = addVisit(cust.id, "staff", p.type === "points" ? spend : 0);
    if (!res) return;
    if (res.rewardUnlocked) {
      setFlash(t("Reward unlocked! 🎉", "¡Recompensa desbloqueada! 🎉"));
      setHighlight(-1);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } });
    } else {
      setHighlight(res.customer.stamps - 1);
      setFlash(p.type === "stamps" ? `${t("Stamp added", "Sello añadido")} · ${res.customer.stamps}/${p.stampsRequired}` : `+${p.pointsPerVisit + spend * p.pointsPerEuro} ${t("points", "puntos")}`);
    }
  };

  return (
    <>
      <PageHead title={t("Scanner", "Escáner")} sub={t("Scan a customer's wallet card to add stamps, points or redeem rewards.", "Escanea la tarjeta del cliente para añadir sellos o puntos y canjear recompensas.")} />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="relative aspect-[4/3] bg-ink sm:aspect-video">
              {cam === "on" ? (
                <>
                  <video ref={video} playsInline muted className="absolute inset-0 size-full object-cover" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative size-56">
                      <span className="absolute left-0 top-0 size-10 rounded-tl-2xl border-l-4 border-t-4 border-lime" />
                      <span className="absolute right-0 top-0 size-10 rounded-tr-2xl border-r-4 border-t-4 border-lime" />
                      <span className="absolute bottom-0 left-0 size-10 rounded-bl-2xl border-b-4 border-l-4 border-lime" />
                      <span className="absolute bottom-0 right-0 size-10 rounded-br-2xl border-b-4 border-r-4 border-lime" />
                      <div className="scanline absolute inset-x-3 top-3 h-0.5 bg-lime shadow-[0_0_14px_3px_rgba(198,243,107,.8)]" />
                    </div>
                  </div>
                  <button onClick={stop} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/60 text-white"><X size={18} /></button>
                  {scanError && <div className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white">{scanError}</div>}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                  {cam === "denied" ? <CameraOff size={36} className="text-white/60" /> : <Camera size={36} className="text-lime" />}
                  <div className="mt-3 text-lg font-semibold">{cam === "denied" ? t("Camera not available", "Cámara no disponible") : t("Scan with this device's camera", "Escanea con la cámara de este dispositivo")}</div>
                  <div className="mt-1 max-w-sm text-sm text-white/60">
                    {cam === "denied" ? t("Allow camera access in your browser, or find the customer by name below.", "Permite el acceso a la cámara en tu navegador o busca al cliente por su nombre.") : t("Works on any phone, tablet or laptop with a camera. No app needed.", "Funciona en cualquier móvil, tablet u ordenador con cámara. Sin apps.")}
                  </div>
                  <button onClick={start} className="btn-lime mt-5 px-6 py-3"><Camera size={18} /> {t("Start camera", "Activar cámara")}</button>
                </div>
              )}
            </div>
          </div>

          <div className="card p-5">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input className="input pl-10" placeholder={t("Or search by name, phone or card code…", "O busca por nombre, teléfono o código…")} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {results.map((c) => (
                <li key={c.id}>
                  <button onClick={() => { setSelected(c.id); setHighlight(-1); }} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected === c.id ? "border-ink bg-paper" : "border-line hover:border-zinc-300"}`}>
                    <span className="grid size-9 place-items-center rounded-full bg-paper text-xs font-semibold">{c.name.split(" ").map((x) => x[0]).join("")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{c.name}</span>
                      <span className="block text-xs text-muted">{p.type === "stamps" ? `${c.stamps}/${p.stampsRequired} ${t("stamps", "sellos")}` : `${c.points} pts`} · {c.phone}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <AnimatePresence mode="wait">
            {cust ? (
              <motion.div key={cust.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><Check size={16} /> {t("Customer found", "Cliente encontrado")}</div>
                  <button onClick={() => setSelected(null)} className="text-muted hover:text-ink"><X size={18} /></button>
                </div>
                <div className="mt-4">
                  <ApplePass business={business} customer={cust} highlight={highlight} showQR={false} />
                </div>
                {p.type === "points" && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-medium">{t("Spent", "Gasto")}</span>
                    {[10, 20, 50].map((v) => (
                      <button key={v} onClick={() => setSpend(v)} className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${spend === v ? "border-ink bg-ink text-white" : "border-line"}`}>€{v}</button>
                    ))}
                  </div>
                )}
                <button onClick={add} className="btn-lime mt-4 w-full py-3.5 text-base"><Zap size={18} /> {p.type === "stamps" ? t("Add stamp", "Añadir sello") : t("Add points", "Añadir puntos")}</button>
                {cust.rewardsEarned > cust.rewardsRedeemed && (
                  <button onClick={() => { redeemReward(cust.id, p.type === "points" ? [...p.tiers].reverse().find((t) => t.points <= cust.points)?.points : undefined); setFlash(t("Reward redeemed ✓", "Recompensa canjeada ✓")); }} className="btn-ink mt-2 w-full py-3.5 text-base">
                    <Gift size={18} /> {t("Redeem reward", "Canjear recompensa")} ({cust.rewardsEarned - cust.rewardsRedeemed})
                  </button>
                )}
                <AnimatePresence>
                  {flash && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-ink py-2.5 text-center text-sm font-semibold text-lime">
                      {flash}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card grid min-h-[300px] place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-paper"><Camera size={24} /></div>
                  <div className="mt-3 font-semibold">{t("No customer selected", "Ningún cliente seleccionado")}</div>
                  <div className="mt-1 text-sm text-muted">{t("Scan a wallet card or pick a customer from the list.", "Escanea una tarjeta o elige un cliente de la lista.")}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
