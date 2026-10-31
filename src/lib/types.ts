export type ProgramType = "stamps" | "points";

export type IndustryKey =
  | "cafe"
  | "barber"
  | "gym"
  | "salon"
  | "clothing"
  | "perfume"
  | "restaurant"
  | "carwash";

export type RewardTier = { id: string; points: number; name: string };

export type Program = {
  type: ProgramType;
  stampsRequired: number;
  stampReward: string;
  pointsPerVisit: number;
  pointsPerEuro: number;
  tiers: RewardTier[];
  bg: string;
  fg: string;
  accent: string;
  icon: IndustryKey;
  welcomeBonus: number;
  terms: string;
};

export type Business = {
  id: string;
  slug: string;
  name: string;
  industry: IndustryKey;
  city: string;
  owner: string;
  email: string;
  program: Program;
  googleReviewUrl: string;
  plan: "active" | "trialing" | "past_due" | "canceled";
  createdAt: string;
};

export type Customer = {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  stamps: number;
  points: number;
  visits: number;
  rewardsEarned: number;
  rewardsRedeemed: number;
  wallet: "apple" | "google" | "none";
  joinedAt: string;
  lastVisit: string;
  reviewed: boolean;
};

export type ActivityKind =
  | "stamp"
  | "points"
  | "reward"
  | "redeem"
  | "join"
  | "review"
  | "wallet";

export type Activity = {
  id: string;
  businessId: string;
  customerId: string;
  kind: ActivityKind;
  amount: number;
  method: "staff" | "self" | "system";
  at: string;
};

export type DB = {
  version: number;
  businesses: Business[];
  customers: Customer[];
  activity: Activity[];
};
