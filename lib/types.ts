// Type definitions for the subscription store

export interface Plan {
  id: string;
  name: string;
  planType: 'basic' | 'pro' | 'plus' | 'astro';
  description: string;
  monthlyPrice: string;
  halfYearPrice: string;
  yearlyPrice: string;
  monthlyRenewedCredits: number;
  dailyLoginRewardCredits: number;
  creditPurchaseDiscount: number;
  features?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  billingPeriod: 'monthly' | 'halfYear' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCredit {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  credits: number;
  basePrice: number;
  userPrice: number;
  userDiscountPercent: number;
  userPlanType: string;
  prices: {
    basic: number;
    pro: number;
    plus: number;
    astro: number;
  };
  isActive: boolean;
}

export interface DailyReward {
  canClaim: boolean;
  potentialReward: number;
  planType: string;
  isGuest?: boolean;
}

export interface GuestRewardInfo {
  guestMessage: string;
  rewardTiers: Array<{
    planType: string;
    planName: string;
    dailyReward: number;
  }>;
}

export interface UserSubscriptionData {
  subscription: {
    subscription: Subscription | null;
    plan: Plan | null;
  };
}

export interface CreateSubscriptionRequest {
  userId: string;
  planId: string;
  billingPeriod: 'monthly' | 'halfYear' | 'yearly';
}

export interface CreateSubscriptionResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface PurchaseCreditsResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ClaimRewardResponse {
  success: boolean;
  creditsAwarded?: number;
  error?: string;
}

// Mock session types to replace next-auth
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Session {
  user?: User;
  expires: string;
}

export interface SessionContextValue {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  update: (data?: any) => Promise<Session | null>;
}