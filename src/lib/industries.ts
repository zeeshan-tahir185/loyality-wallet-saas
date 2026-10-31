import {
  Car,
  Coffee,
  Dumbbell,
  Flower2,
  type LucideIcon,
  Scissors,
  Shirt,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import type { Lang } from "./i18n";
import type { IndustryKey, Program } from "./types";

export type Industry = {
  key: IndustryKey;
  label: string;
  icon: LucideIcon;
  example: string;
  program: Program;
};

const tiers = (a: string, b: string, c: string) => [
  { id: "t1", points: 100, name: a },
  { id: "t2", points: 250, name: b },
  { id: "t3", points: 500, name: c },
];

export const INDUSTRIES: Industry[] = [
  {
    key: "cafe",
    label: "Café",
    icon: Coffee,
    example: "Buy 9 coffees, the 10th is on us",
    program: {
      type: "stamps",
      stampsRequired: 10,
      stampReward: "Free coffee of your choice",
      pointsPerVisit: 10,
      pointsPerEuro: 1,
      tiers: tiers("Free pastry", "Free coffee", "Breakfast for two"),
      bg: "#3b2417",
      fg: "#fff7ed",
      accent: "#f59e0b",
      icon: "cafe",
      welcomeBonus: 1,
      terms: "One stamp per purchase. Valid in-store only.",
    },
  },
  {
    key: "barber",
    label: "Barbershop",
    icon: Scissors,
    example: "Every 6th haircut is free",
    program: {
      type: "stamps",
      stampsRequired: 6,
      stampReward: "Free haircut",
      pointsPerVisit: 25,
      pointsPerEuro: 1,
      tiers: tiers("Free beard trim", "Free haircut", "Cut + hot towel shave"),
      bg: "#111111",
      fg: "#fafafa",
      accent: "#d4a373",
      icon: "barber",
      welcomeBonus: 0,
      terms: "One stamp per paid haircut.",
    },
  },
  {
    key: "gym",
    label: "Gym & Fitness",
    icon: Dumbbell,
    example: "Earn points for every check-in",
    program: {
      type: "points",
      stampsRequired: 12,
      stampReward: "Free personal training session",
      pointsPerVisit: 20,
      pointsPerEuro: 2,
      tiers: tiers("Protein shake", "Free PT session", "1 month free"),
      bg: "#0b1f3a",
      fg: "#f0f9ff",
      accent: "#38bdf8",
      icon: "gym",
      welcomeBonus: 50,
      terms: "Points awarded per check-in and per € spent.",
    },
  },
  {
    key: "salon",
    label: "Beauty Salon",
    icon: Sparkles,
    example: "Points on every treatment",
    program: {
      type: "points",
      stampsRequired: 8,
      stampReward: "Free manicure",
      pointsPerVisit: 15,
      pointsPerEuro: 2,
      tiers: tiers("Free nail art", "Free manicure", "Spa day"),
      bg: "#4a1d3f",
      fg: "#fdf2f8",
      accent: "#f9a8d4",
      icon: "salon",
      welcomeBonus: 30,
      terms: "Points on every treatment and product.",
    },
  },
  {
    key: "clothing",
    label: "Clothing Store",
    icon: Shirt,
    example: "€1 spent = 1 point",
    program: {
      type: "points",
      stampsRequired: 10,
      stampReward: "€20 voucher",
      pointsPerVisit: 0,
      pointsPerEuro: 1,
      tiers: tiers("€5 off", "€15 off", "€40 voucher"),
      bg: "#f4f1ea",
      fg: "#1c1917",
      accent: "#1c1917",
      icon: "clothing",
      welcomeBonus: 25,
      terms: "1 point per €1 spent. Vouchers valid 90 days.",
    },
  },
  {
    key: "perfume",
    label: "Perfume Shop",
    icon: Flower2,
    example: "Collect 5 stamps, get a free sample set",
    program: {
      type: "stamps",
      stampsRequired: 5,
      stampReward: "Luxury sample set",
      pointsPerVisit: 10,
      pointsPerEuro: 1,
      tiers: tiers("Sample vial", "Gift wrap + sample", "30ml eau de parfum"),
      bg: "#1e1b2e",
      fg: "#f5f3ff",
      accent: "#c4b5fd",
      icon: "perfume",
      welcomeBonus: 1,
      terms: "One stamp per purchase over €30.",
    },
  },
  {
    key: "restaurant",
    label: "Restaurant",
    icon: UtensilsCrossed,
    example: "8 visits = free dinner",
    program: {
      type: "stamps",
      stampsRequired: 8,
      stampReward: "Free main course",
      pointsPerVisit: 10,
      pointsPerEuro: 1,
      tiers: tiers("Free dessert", "Free starter", "Dinner for two"),
      bg: "#7f1d1d",
      fg: "#fef2f2",
      accent: "#fbbf24",
      icon: "restaurant",
      welcomeBonus: 1,
      terms: "One stamp per table visit.",
    },
  },
  {
    key: "carwash",
    label: "Car Wash",
    icon: Car,
    example: "Every 5th wash is free",
    program: {
      type: "stamps",
      stampsRequired: 5,
      stampReward: "Free premium wash",
      pointsPerVisit: 10,
      pointsPerEuro: 1,
      tiers: tiers("Free air freshener", "Free basic wash", "Full detailing"),
      bg: "#064e3b",
      fg: "#ecfdf5",
      accent: "#6ee7b7",
      icon: "carwash",
      welcomeBonus: 0,
      terms: "One stamp per wash.",
    },
  },
];

export const industry = (key: IndustryKey) =>
  INDUSTRIES.find((i) => i.key === key) ?? INDUSTRIES[0];

type EsText = { label: string; example: string; reward: string; tiers: [string, string, string]; terms: string };

const ES: Record<IndustryKey, EsText> = {
  cafe: {
    label: "Cafetería",
    example: "Compra 9 cafés y el 10º es gratis",
    reward: "Café gratis a elegir",
    tiers: ["Bollería gratis", "Café gratis", "Desayuno para dos"],
    terms: "Un sello por compra. Válido solo en tienda.",
  },
  barber: {
    label: "Barbería",
    example: "Cada 6º corte es gratis",
    reward: "Corte de pelo gratis",
    tiers: ["Arreglo de barba gratis", "Corte gratis", "Corte + afeitado con toalla caliente"],
    terms: "Un sello por corte pagado.",
  },
  gym: {
    label: "Gimnasio",
    example: "Gana puntos en cada entrenamiento",
    reward: "Sesión de entrenador personal gratis",
    tiers: ["Batido de proteínas", "Sesión de PT gratis", "1 mes gratis"],
    terms: "Puntos por cada visita y por cada € gastado.",
  },
  salon: {
    label: "Salón de belleza",
    example: "Puntos en cada tratamiento",
    reward: "Manicura gratis",
    tiers: ["Nail art gratis", "Manicura gratis", "Día de spa"],
    terms: "Puntos en cada tratamiento y producto.",
  },
  clothing: {
    label: "Tienda de ropa",
    example: "1 € gastado = 1 punto",
    reward: "Vale de 20 €",
    tiers: ["5 € de descuento", "15 € de descuento", "Vale de 40 €"],
    terms: "1 punto por cada 1 € gastado. Vales válidos 90 días.",
  },
  perfume: {
    label: "Perfumería",
    example: "Consigue 5 sellos y llévate un set de muestras",
    reward: "Set de muestras de lujo",
    tiers: ["Muestra de perfume", "Envoltorio regalo + muestra", "Eau de parfum 30 ml"],
    terms: "Un sello por compra superior a 30 €.",
  },
  restaurant: {
    label: "Restaurante",
    example: "8 visitas = cena gratis",
    reward: "Plato principal gratis",
    tiers: ["Postre gratis", "Entrante gratis", "Cena para dos"],
    terms: "Un sello por mesa y visita.",
  },
  carwash: {
    label: "Lavado de coches",
    example: "Cada 5º lavado es gratis",
    reward: "Lavado premium gratis",
    tiers: ["Ambientador gratis", "Lavado básico gratis", "Limpieza completa"],
    terms: "Un sello por lavado.",
  },
};

export const industryLabel = (key: IndustryKey, lang: Lang) => (lang === "es" ? ES[key].label : industry(key).label);

export const industryExample = (key: IndustryKey, lang: Lang) => (lang === "es" ? ES[key].example : industry(key).example);

export function programFor(key: IndustryKey, lang: Lang): Program {
  const base = structuredClone(industry(key).program);
  if (lang === "en") return base;
  const es = ES[key];
  return {
    ...base,
    stampReward: es.reward,
    terms: es.terms,
    tiers: base.tiers.map((t, i) => ({ ...t, name: es.tiers[i] })),
  };
}
