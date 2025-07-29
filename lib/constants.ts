// Application constants for the subscription store

// Plan limits and restrictions
export const LIMITS = {
  BASIC: {
    maxCharacters: 5000,
    maxPersonas: 2,
    monthlyCredits: 50,
    dailyReward: 2,
    creditDiscount: 0,
  },
  PRO: {
    maxCharacters: 15000,
    maxPersonas: 10,
    monthlyCredits: 500,
    dailyReward: 10,
    creditDiscount: 10,
  },
  PLUS: {
    maxCharacters: 50000,
    maxPersonas: 25,
    monthlyCredits: 1500,
    dailyReward: 25,
    creditDiscount: 20,
  },
  ASTRO: {
    maxCharacters: -1, // Unlimited
    maxPersonas: -1, // Unlimited
    monthlyCredits: 5000,
    dailyReward: 50,
    creditDiscount: 30,
  },
} as const;

// Billing period multipliers for discounts
export const BILLING_PERIOD_DISCOUNTS = {
  monthly: 1.0,
  halfYear: 0.8, // 20% discount
  yearly: 0.6,   // 40% discount
} as const;

// Credit costs for different actions
export const CREDIT_COSTS = {
  MESSAGE: 1,
  IMAGE_GENERATION: 10,
  VOICE_MESSAGE: 5,
  PREMIUM_FEATURE: 25,
} as const;

// Daily reward base amounts by plan type
export const DAILY_REWARDS = {
  basic: 2,
  pro: 10,
  plus: 25,
  astro: 50,
} as const;

// Plan display order
export const PLAN_ORDER = ['basic', 'pro', 'plus', 'astro'] as const;

// Feature descriptions
export const PLAN_FEATURES = {
  basic: [
    '50 coins per month',
    '5,000 character limit',
    '2 personas max',
    '2 daily login coins',
    'Basic message queue'
  ],
  pro: [
    '500 coins per month',
    '15,000 character limit',
    '10 personas max',
    '10 daily login coins',
    '10% off credit purchases',
    'Priority message queue'
  ],
  plus: [
    '1,500 coins per month',
    '50,000 character limit',
    '25 personas max',
    '25 daily login coins',
    '20% off credit purchases',
    'High priority message queue'
  ],
  astro: [
    '5,000 coins per month',
    'Unlimited characters',
    'Unlimited personas',
    '50 daily login coins',
    '30% off credit purchases',
    'Highest priority message queue'
  ]
} as const;

// Error messages
export const ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: 'Please sign in to continue',
  SUBSCRIPTION_ACTIVE: 'Please cancel your current subscription before subscribing to a different plan',
  PAYMENT_FAILED: 'Payment failed. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  INVALID_PLAN: 'Selected plan is not available',
  CREDIT_PURCHASE_FAILED: 'Credit purchase failed. Please try again',
  REWARD_CLAIM_FAILED: 'Failed to claim daily reward. Please try again',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SUBSCRIPTION_CREATED: 'Subscription created successfully!',
  CREDITS_PURCHASED: 'Credits purchased successfully!',
  REWARD_CLAIMED: 'Daily reward claimed successfully!',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',
} as const;