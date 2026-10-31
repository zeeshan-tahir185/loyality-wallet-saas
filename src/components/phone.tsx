"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";
import { useT } from "@/lib/i18n";

function Clock() {
  const [t, setT] = useState("9:41");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false }));
    f();
    const id = setInterval(f, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span>{t}</span>;
}

export type Toast = { id: number; title: string; body: string; icon?: React.ReactNode } | null;

export function Phone({
  children,
  dark = true,
  toast,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  toast?: Toast;
  className?: string;
}) {
  const now = useT()("now", "ahora");
  return (
    <div className={`relative mx-auto w-[300px] shrink-0 sm:w-[320px] ${className}`}>
      <div className="rounded-[52px] bg-[#1a1a1d] p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,.5),inset_0_0_0_2px_#3a3a3f]">
        <div
          className={`relative h-[620px] overflow-hidden rounded-[42px] sm:h-[660px] ${dark ? "bg-black text-white" : "bg-[#f2f2f7] text-black"}`}
        >
          <div className="absolute left-1/2 top-[10px] z-30 h-[30px] w-[100px] -translate-x-1/2 rounded-full bg-black" />
          <div className="relative z-20 flex h-[50px] items-center justify-between px-7 pt-1 text-[14px] font-semibold">
            <Clock />
            <span className="flex items-center gap-1">
              <Signal size={14} />
              <Wifi size={14} />
              <BatteryFull size={18} />
            </span>
          </div>
          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast.id}
                initial={{ y: -90, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -90, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="absolute inset-x-2.5 top-2.5 z-40 flex items-center gap-3 rounded-[22px] bg-white/80 p-3 text-black shadow-xl backdrop-blur-xl"
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-black text-white">{toast.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-[13px] font-semibold">
                    <span className="truncate">{toast.title}</span>
                    <span className="text-[11px] font-normal text-black/50">{now}</span>
                  </div>
                  <div className="text-[13px] leading-snug text-black/75">{toast.body}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="no-scrollbar absolute inset-x-0 bottom-0 top-[50px] overflow-y-auto">{children}</div>
          <div className={`absolute bottom-2 left-1/2 z-30 h-[5px] w-[120px] -translate-x-1/2 rounded-full ${dark ? "bg-white/70" : "bg-black/70"}`} />
        </div>
      </div>
    </div>
  );
}

export function WalletStack({ children, platform = "apple" }: { children: React.ReactNode; platform?: "apple" | "google" }) {
  const t = useT();
  if (platform === "google") {
    return (
      <div className="min-h-full bg-[#1f1f1f] px-4 pb-10">
        <div className="flex items-center justify-between py-2">
          <span className="text-[20px] font-normal">Wallet</span>
          <span className="grid size-8 place-items-center rounded-full bg-[#a8c7fa] text-[13px] font-semibold text-[#062e6f]">L</span>
        </div>
        <div className="mb-3 h-11 rounded-2xl bg-gradient-to-r from-[#0f3b8c] to-[#1a73e8] px-4 pt-2.5 text-[12px] text-white/90">{t("Debit", "Débito")} •••• 4021</div>
        {children}
      </div>
    );
  }
  return (
    <div className="min-h-full px-3.5 pb-10">
      <div className="flex items-center justify-between py-1.5">
        <span className="text-[30px] font-bold tracking-tight">Wallet</span>
        <span className="grid size-8 place-items-center rounded-full bg-white/15 text-xl leading-none">+</span>
      </div>
      <div className="relative mt-2">
        <div className="h-12 rounded-t-[14px] bg-gradient-to-br from-zinc-600 to-zinc-800 px-4 pt-2.5 text-[12px] font-semibold text-white/80">Apple Card</div>
        <div className="-mt-4 h-12 rounded-t-[14px] bg-gradient-to-br from-sky-700 to-indigo-800 px-4 pt-2.5 text-[12px] font-semibold text-white/80">{t("Boarding pass", "Tarjeta de embarque")} · MAD → CDG</div>
        <div className="-mt-4">{children}</div>
      </div>
    </div>
  );
}
