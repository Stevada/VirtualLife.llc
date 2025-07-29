// Mock data for local development - simulates database data

import { Plan, Subscription, UserCredit, CreditPackage, User } from './types';
import { BILLING_PERIOD_DISCOUNTS } from './constants';

// Mock plans data
export const MOCK_PLANS: Plan[] = [
  {
    id: 'plan_basic',
    name: 'Basic',
    planType: 'basic',
    description: 'Perfect for getting started with AI conversations',
    monthlyPrice: '0',
    halfYearPrice: '0',
    yearlyPrice: '0',
    monthlyRenewedCredits: 50,
    dailyLoginRewardCredits: 2,
    creditPurchaseDiscount: 0,
    features: [
      '50 coins per month',
      '5,000 character limit',
      '2 personas max',
      '2 daily login coins',
      'Basic message queue'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    planType: 'pro',
    description: 'Enhanced features for regular users',
    monthlyPrice: '9.99',
    halfYearPrice: (parseFloat('9.99') * 6 * BILLING_PERIOD_DISCOUNTS.halfYear).toFixed(2),
    yearlyPrice: (parseFloat('9.99') * 12 * BILLING_PERIOD_DISCOUNTS.yearly).toFixed(2),
    monthlyRenewedCredits: 500,
    dailyLoginRewardCredits: 10,
    creditPurchaseDiscount: 10,
    features: [
      '500 coins per month',
      '15,000 character limit',
      '10 personas max',
      '10 daily login coins',
      '10% off credit purchases',
      'Priority message queue'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'plan_plus',
    name: 'Plus',
    planType: 'plus',
    description: 'Advanced features for power users',
    monthlyPrice: '19.99',
    halfYearPrice: (parseFloat('19.99') * 6 * BILLING_PERIOD_DISCOUNTS.halfYear).toFixed(2),
    yearlyPrice: (parseFloat('19.99') * 12 * BILLING_PERIOD_DISCOUNTS.yearly).toFixed(2),
    monthlyRenewedCredits: 1500,
    dailyLoginRewardCredits: 25,
    creditPurchaseDiscount: 20,
    features: [
      '1,500 coins per month',
      '50,000 character limit',
      '25 personas max',
      '25 daily login coins',
      '20% off credit purchases',
      'High priority message queue'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'plan_astro',
    name: 'Astro',
    planType: 'astro',
    description: 'Ultimate experience with unlimited access',
    monthlyPrice: '39.99',
    halfYearPrice: (parseFloat('39.99') * 6 * BILLING_PERIOD_DISCOUNTS.halfYear).toFixed(2),
    yearlyPrice: (parseFloat('39.99') * 12 * BILLING_PERIOD_DISCOUNTS.yearly).toFixed(2),
    monthlyRenewedCredits: 3500,
    dailyLoginRewardCredits: 50,
    creditPurchaseDiscount: 30,
    features: [
      '5,000 coins per month',
      'Unlimited characters',
      'Unlimited personas',
      '50 daily login coins',
      '30% off credit purchases',
      'Highest priority message queue'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock users data
export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://avatar.vercel.sh/john'
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://avatar.vercel.sh/jane'
  },
  {
    id: 'user_3',
    name: 'Guest User',
    email: 'guest@example.com',
    image: null
  }
];

// Mock subscriptions data
export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1',
    userId: 'user_1',
    planId: 'plan_pro',
    stripeSubscriptionId: 'sub_stripe_1',
    status: 'active',
    billingPeriod: 'monthly',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-02-01T00:00:00Z',
    cancelAtPeriodEnd: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'sub_2',
    userId: 'user_2',
    planId: 'plan_plus',
    stripeSubscriptionId: 'sub_stripe_2',
    status: 'active',
    billingPeriod: 'yearly',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2025-01-01T00:00:00Z',
    cancelAtPeriodEnd: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock user credits data
export const MOCK_USER_CREDITS: UserCredit[] = [
  {
    id: 'credits_1',
    userId: 'user_1',
    balance: 450,
    totalEarned: 500,
    totalSpent: 50,
    lastUpdated: '2024-01-15T00:00:00Z'
  },
  {
    id: 'credits_2',
    userId: 'user_2',
    balance: 1200,
    totalEarned: 1500,
    totalSpent: 300,
    lastUpdated: '2024-01-15T00:00:00Z'
  },
  {
    id: 'credits_3',
    userId: 'user_3',
    balance: 15,
    totalEarned: 25,
    totalSpent: 10,
    lastUpdated: '2024-01-15T00:00:00Z'
  }
];

// Base credit packages
const BASE_CREDIT_PACKAGES = [
  {
    id: 'credits_small',
    name: '500 Coins',
    description: 'Perfect for occasional use',
    credits: 100,
    basePrice: 4.99
  },
  {
    id: 'credits_medium',
    name: '1,500 Coins',
    description: 'Great value for regular users',
    credits: 500,
    basePrice: 19.99
  },
  {
    id: 'credits_large',
    name: '3,500 Coins',
    description: 'Maximum value for heavy users',
    credits: 1500,
    basePrice: 49.99
  }
];

// Function to calculate credit packages with discounts for different plan types
export const getCreditPackagesForPlanType = (planType: string): CreditPackage[] => {
  const discountMap = {
    basic: 0,
    pro: 10,
    plus: 20,
    astro: 30
  };

  const discount = discountMap[planType as keyof typeof discountMap] || 0;

  return BASE_CREDIT_PACKAGES.map(pkg => {
    const userPrice = pkg.basePrice * (1 - discount / 100);
    
    return {
      ...pkg,
      userPrice: parseFloat(userPrice.toFixed(2)),
      userDiscountPercent: discount,
      userPlanType: planType,
      prices: {
        basic: pkg.basePrice,
        pro: parseFloat((pkg.basePrice * 0.9).toFixed(2)),
        plus: parseFloat((pkg.basePrice * 0.8).toFixed(2)),
        astro: parseFloat((pkg.basePrice * 0.7).toFixed(2))
      },
      isActive: true
    };
  });
};

// Mock guest credit packages (no discounts)
export const MOCK_GUEST_CREDIT_PACKAGES = getCreditPackagesForPlanType('basic');

// Mock guest reward info
export const MOCK_GUEST_REWARD_INFO = {
  guestMessage: "Sign up for free to start claiming daily login rewards! Higher tier plans get better rewards.",
  rewardTiers: [
    { planType: 'basic', planName: 'Basic', dailyReward: 2 },
    { planType: 'pro', planName: 'Pro', dailyReward: 10 },
    { planType: 'plus', planName: 'Plus', dailyReward: 25 },
    { planType: 'astro', planName: 'Astro', dailyReward: 50 }
  ]
};

// Helper function to simulate daily reward eligibility
export const getLastClaimDate = (userId: string): string | null => {
  const claimDates = {
    'user_1': '2024-01-14T00:00:00Z', // Can claim today
    'user_2': new Date().toISOString(), // Already claimed today
    'user_3': '2024-01-13T00:00:00Z'  // Can claim today
  };
  
  return claimDates[userId as keyof typeof claimDates] || null;
};

// Current user for demo purposes (can be changed)
export const CURRENT_USER_ID = 'user_1'; // Change this to test different user states

// Mock session for demo
export const MOCK_SESSION = {
  user: MOCK_USERS.find(u => u.id === CURRENT_USER_ID),
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
};