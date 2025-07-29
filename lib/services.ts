// Service functions to simulate database operations using local mock data

import { 
  Plan, 
  Subscription, 
  UserCredit, 
  CreditPackage, 
  DailyReward, 
  GuestRewardInfo, 
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  PurchaseCreditsResponse,
  ClaimRewardResponse,
  UserSubscriptionData
} from './types';

import {
  MOCK_PLANS,
  MOCK_SUBSCRIPTIONS,
  MOCK_USER_CREDITS,
  MOCK_GUEST_CREDIT_PACKAGES,
  MOCK_GUEST_REWARD_INFO,
  getCreditPackagesForPlanType,
  getLastClaimDate
} from './mock-data';

import { DAILY_REWARDS, ERROR_MESSAGES } from './constants';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Plan services
export async function getAllPlans(): Promise<Plan[]> {
  await delay();
  return MOCK_PLANS.filter(plan => plan.isActive);
}

export async function getPlanById(planId: string): Promise<Plan | null> {
  await delay();
  return MOCK_PLANS.find(plan => plan.id === planId) || null;
}

// Subscription services
export async function getUserSubscription(userId: string): Promise<UserSubscriptionData> {
  await delay();
  
  const subscription = MOCK_SUBSCRIPTIONS.find(sub => 
    sub.userId === userId && sub.status === 'active'
  );
  
  if (!subscription) {
    return {
      subscription: {
        subscription: null,
        plan: null
      }
    };
  }
  
  const plan = MOCK_PLANS.find(p => p.id === subscription.planId);
  
  return {
    subscription: {
      subscription,
      plan: plan || null
    }
  };
}

export async function createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
  await delay(1000); // Simulate payment processing delay
  
  // Simulate success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1;
  
  if (!isSuccess) {
    return {
      success: false,
      error: ERROR_MESSAGES.PAYMENT_FAILED
    };
  }
  
  // In a real app, this would create a Stripe checkout session
  return {
    success: true,
    url: `https://checkout.stripe.com/c/pay/mock_session_${Date.now()}`
  };
}

// Credit services
export async function getUserCredits(userId: string): Promise<UserCredit | null> {
  await delay();
  return MOCK_USER_CREDITS.find(credit => credit.userId === userId) || null;
}

export async function getCreditPackagesForGuests(): Promise<CreditPackage[]> {
  await delay();
  return MOCK_GUEST_CREDIT_PACKAGES;
}

export async function getCreditPackagesWithDiscounts(userId: string): Promise<CreditPackage[]> {
  await delay();
  
  // Get user's current subscription to determine discount level
  const subscriptionData = await getUserSubscription(userId);
  const planType = subscriptionData.subscription.plan?.planType || 'basic';
  
  return getCreditPackagesForPlanType(planType);
}

export async function purchaseCredits(
  userId: string, 
  planType: string, 
  packageId: string
): Promise<PurchaseCreditsResponse> {
  await delay(1000); // Simulate payment processing delay
  
  // Simulate success/failure (95% success rate)
  const isSuccess = Math.random() > 0.05;
  
  if (!isSuccess) {
    return {
      success: false,
      error: ERROR_MESSAGES.CREDIT_PURCHASE_FAILED
    };
  }
  
  return {
    success: true,
    url: `https://checkout.stripe.com/c/pay/credits_${packageId}_${Date.now()}`
  };
}

// Reward services
export async function checkDailyRewardEligibility(userId: string): Promise<DailyReward> {
  await delay();
  
  // Get user's subscription to determine reward amount
  const subscriptionData = await getUserSubscription(userId);
  const planType = subscriptionData.subscription.plan?.planType || 'basic';
  
  // Check if user has already claimed today
  const lastClaimDate = getLastClaimDate(userId);
  const today = new Date().toDateString();
  const lastClaimToday = lastClaimDate ? new Date(lastClaimDate).toDateString() === today : false;
  
  const potentialReward = DAILY_REWARDS[planType as keyof typeof DAILY_REWARDS] || DAILY_REWARDS.basic;
  
  return {
    canClaim: !lastClaimToday,
    potentialReward,
    planType,
    isGuest: false
  };
}

export async function claimDailyReward(userId: string): Promise<ClaimRewardResponse> {
  await delay(500);
  
  // Check if user can claim
  const eligibility = await checkDailyRewardEligibility(userId);
  
  if (!eligibility.canClaim) {
    return {
      success: false,
      error: 'You have already claimed your daily reward today'
    };
  }
  
  // Simulate updating user credits (in a real app, this would update the database)
  const userCredits = MOCK_USER_CREDITS.find(credit => credit.userId === userId);
  if (userCredits) {
    userCredits.balance += eligibility.potentialReward;
    userCredits.totalEarned += eligibility.potentialReward;
    userCredits.lastUpdated = new Date().toISOString();
  }
  
  return {
    success: true,
    creditsAwarded: eligibility.potentialReward
  };
}

export async function getRewardInfoForGuests(): Promise<GuestRewardInfo> {
  await delay();
  return MOCK_GUEST_REWARD_INFO;
}

// Utility functions for testing different user states
export function switchMockUser(userId: string): void {
  // This would be used for testing different user scenarios
  console.log(`Switched to mock user: ${userId}`);
}

// Export for testing purposes
export const testUtils = {
  getAllMockData: () => ({
    plans: MOCK_PLANS,
    subscriptions: MOCK_SUBSCRIPTIONS,
    credits: MOCK_USER_CREDITS,
    guestCreditPackages: MOCK_GUEST_CREDIT_PACKAGES,
    guestRewardInfo: MOCK_GUEST_REWARD_INFO
  }),
  resetMockData: () => {
    // Reset any modified mock data
    console.log('Mock data reset');
  }
};