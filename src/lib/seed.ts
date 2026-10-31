import { programFor } from "./industries";
import type { Activity, Business, Customer, DB, IndustryKey } from "./types";

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = [
  "Lucía", "Mateo", "Sofía", "Hugo", "Martina", "Leo", "Valeria", "Daniel",
  "Emma", "Pablo", "Chloé", "Marco", "Aisha", "Noah", "Julia", "Adam",
  "Inès", "Lucas", "Sara", "Omar", "Elena", "Diego", "Nora", "Iván",
  "Camille", "Álvaro", "Mia", "Bruno", "Paula", "Thiago", "Alba", "Enzo",
  "Carla", "Rayan", "Laura", "Gabriel", "Irene", "Samuel", "Vera", "Marc",
];
const LAST = [
  "García", "Martín", "Rossi", "Dubois", "López", "Sánchez", "Moreau",
  "Fernández", "Bianchi", "Ruiz", "Navarro", "Müller", "Torres", "Romero",
  "Lefèvre", "Ortega", "Costa", "Silva", "Vidal", "Morales",
];

const BUSINESSES: Array<[string, IndustryKey, string, string, Business["plan"], number]> = [
  ["Bloom Coffee House", "cafe", "Madrid", "Carmen Ruiz", "active", 62],
  ["Fade Republic", "barber", "Barcelona", "Javi Ortega", "active", 48],
  ["Iron Temple Gym", "gym", "Valencia", "Marcos Vidal", "active", 120],
  ["Glow Beauty Studio", "salon", "Sevilla", "Lucía Romero", "active", 33],
  ["Atelier Nord", "clothing", "Lyon", "Claire Dubois", "trialing", 5],
  ["Maison Oud", "perfume", "Paris", "Yasmine Haddad", "active", 74],
  ["La Brasa", "restaurant", "Málaga", "Pedro Sánchez", "active", 91],
  ["Shine Car Spa", "carwash", "Bilbao", "Iker Etxeberria", "past_due", 140],
  ["Kraft Barbers", "barber", "Milano", "Luca Bianchi", "active", 27],
  ["Pura Vida Fitness", "gym", "Lisboa", "Rita Costa", "trialing", 3],
  ["Café Lumière", "cafe", "Bordeaux", "Élise Martin", "active", 105],
  ["Nail Lab", "salon", "Granada", "Paula Navarro", "canceled", 160],
  ["Trattoria Nonna", "restaurant", "Roma", "Giulia Rossi", "active", 58],
  ["Urban Threads", "clothing", "Porto", "Tiago Silva", "active", 19],
];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const DEMO_BUSINESS_ID = "biz_0";
export const DB_VERSION = 4;

export function createSeed(now = Date.now()): DB {
  const r = rng(42);
  const day = 86_400_000;
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];

  const businesses: Business[] = BUSINESSES.map(([name, ind, city, owner, plan, ageDays], i) => ({
    id: `biz_${i}`,
    slug: slugify(name),
    name,
    industry: ind,
    city,
    owner,
    email: `${slugify(owner).split("-")[0]}@${slugify(name).replace(/-/g, "")}.com`,
    program: programFor(ind, "es"),
    googleReviewUrl: `https://g.page/r/${slugify(name)}/review`,
    plan,
    createdAt: new Date(now - ageDays * day).toISOString(),
  }));

  const customers: Customer[] = [];
  const activity: Activity[] = [];
  let aid = 0;

  businesses.forEach((b, bi) => {
    const count = bi === 0 ? 46 : 18 + Math.floor(r() * 220);
    const realCount = bi === 0 ? count : Math.min(count, 25);
    for (let c = 0; c < realCount; c++) {
      const joinedDaysAgo = Math.floor(r() * 58) + 1;
      const visits = 1 + Math.floor(r() * 14);
      const req = b.program.stampsRequired;
      const rewardsEarned = b.program.type === "stamps" ? Math.floor(visits / req) : Math.floor(r() * 3);
      const lastVisitDaysAgo = Math.min(joinedDaysAgo, Math.floor(r() * 20));
      const cust: Customer = {
        id: `cus_${bi}_${c}`,
        businessId: b.id,
        name: `${pick(FIRST)} ${pick(LAST)}`,
        phone: `+34 6${Math.floor(10 + r() * 89)} ${Math.floor(100 + r() * 899)} ${Math.floor(100 + r() * 899)}`,
        stamps: visits % req,
        points: Math.floor(r() * 420),
        visits,
        rewardsEarned,
        rewardsRedeemed: Math.max(0, rewardsEarned - (r() > 0.6 ? 1 : 0)),
        wallet: r() > 0.48 ? "apple" : r() > 0.12 ? "google" : "none",
        joinedAt: new Date(now - joinedDaysAgo * day).toISOString(),
        lastVisit: new Date(now - lastVisitDaysAgo * day - Math.floor(r() * day)).toISOString(),
        reviewed: r() > 0.62,
      };
      customers.push(cust);

      if (bi === 0) {
        activity.push({ id: `act_${aid++}`, businessId: b.id, customerId: cust.id, kind: "join", amount: 0, method: "self", at: cust.joinedAt });
        for (let v = 0; v < visits; v++) {
          const at = now - Math.floor(r() * joinedDaysAgo * day);
          activity.push({
            id: `act_${aid++}`,
            businessId: b.id,
            customerId: cust.id,
            kind: "stamp",
            amount: 1,
            method: r() > 0.45 ? "staff" : "self",
            at: new Date(at).toISOString(),
          });
        }
        for (let k = 0; k < cust.rewardsRedeemed; k++) {
          activity.push({
            id: `act_${aid++}`, businessId: b.id, customerId: cust.id, kind: "redeem", amount: 1, method: "staff",
            at: new Date(now - Math.floor(r() * joinedDaysAgo * day)).toISOString(),
          });
        }
        if (cust.reviewed) {
          activity.push({
            id: `act_${aid++}`, businessId: b.id, customerId: cust.id, kind: "review", amount: 0, method: "self",
            at: new Date(now - Math.floor(r() * joinedDaysAgo * day)).toISOString(),
          });
        }
      }
    }
  });

  const hero = customers[0];
  hero.name = "Lucía García";
  hero.stamps = 7;
  hero.wallet = "apple";

  activity.sort((a, b) => (a.at < b.at ? 1 : -1));
  return { version: DB_VERSION, businesses, customers, activity };
}

export const DISPLAY_CUSTOMER_COUNT: Record<string, number> = Object.fromEntries(
  BUSINESSES.map((b, i) => [`biz_${i}`, [46, 312, 1240, 186, 22, 408, 655, 930, 141, 38, 777, 210, 389, 97][i]]),
);
