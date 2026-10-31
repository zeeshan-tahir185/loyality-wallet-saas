"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Stamp } from "lucide-react";
import { ApplePass, GooglePass } from "./pass";
import { Phone, type Toast, WalletStack } from "./phone";
import { industry } from "@/lib/industries";

const biz = { name: "Bloom Coffee House", program: industry("cafe").program };

export function HeroPhone() {
  const [stamps, setStamps] = useState(5);
  const [rewards, setRewards] = useState(0);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    let s = 5;
    const req = biz.program.stampsRequired;
    const id = setInterval(() => {
      s += 1;
      if (s >= req) {
        s = 0;
        setStamps(0);
        setRewards(1);
        setToast({ id: Date.now(), title: biz.name, body: "Your free coffee is ready to redeem!", icon: <span>🎁</span> });
        confetti({ particleCount: 80, spread: 70, origin: { x: 0.72, y: 0.4 }, colors: ["#f59e0b", "#c6f36b", "#fff7ed"] });
        setTimeout(() => setRewards(0), 2600);
        return;
      }
      setStamps(s);
      setToast({ id: Date.now(), title: biz.name, body: `Stamp added — ${s}/${req}. ${req - s} to go!`, icon: <Stamp size={18} /> });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const customer = { id: "cus_demo_hero", name: "Lucía García", stamps, points: 0, rewardsEarned: rewards, rewardsRedeemed: 0 };

  return (
    <div className="relative flex justify-center">
      <div className="floaty absolute -left-6 top-24 hidden w-[260px] [--r:-8deg] lg:block xl:-left-16">
        <GooglePass business={{ name: "Iron Temple Gym", program: industry("gym").program }} customer={{ ...customer, id: "cus_g", name: "Mateo Ruiz", points: 180 }} showQR={false} />
      </div>
      <div className="floaty absolute -right-4 bottom-16 hidden w-[230px] [--r:7deg] [animation-delay:-3s] lg:block xl:-right-12">
        <ApplePass business={{ name: "Fade Republic", program: industry("barber").program }} customer={{ ...customer, id: "cus_b", name: "Hugo Martín", stamps: 4 }} showQR={false} />
      </div>
      <Phone toast={toast} className="relative z-10">
        <WalletStack>
          <ApplePass business={biz} customer={customer} highlight={stamps - 1} />
        </WalletStack>
      </Phone>
    </div>
  );
}
