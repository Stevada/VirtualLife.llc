'use client';

import { useSession } from "@/lib/mock-session"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Coins } from "lucide-react"

// Import types
import { Plan, Subscription, UserCredit, DailyReward } from '@/lib/types';

// Import constants
import { LIMITS } from '@/lib/constants';

// Import services
import {
  getAllPlans,
  getUserSubscription,
  getUserCredits,
  checkDailyRewardEligibility,
  getCreditPackagesForGuests,
  getCreditPackagesWithDiscounts,
  getRewardInfoForGuests,
  createSubscription,
  purchaseCredits,
  claimDailyReward
} from '@/lib/services';

type BillingPeriod = 'monthly' | 'halfYear' | 'yearly';

interface UserState {
  isAuthenticated: boolean;
  isGuest: boolean;
  isBasicUser: boolean;
  isSubscribedUser: boolean;
}

// Price Comparison Component
function PriceComparison({ 
  prices, 
  userPlanType, 
}: { 
  prices: { basic: number; pro: number; plus: number; astro: number };
  userPlanType: string;
}) {
  const planNames = {
    basic: 'Basic',
    pro: 'Pro',
    plus: 'Plus',
    astro: 'Astro'
  };

  return (
    <div className="space-y-1">
      {Object.entries(prices).map(([planType, price]) => {
        const isUserPlan = planType === userPlanType;
        return (
          <div key={planType} className={`flex justify-between text-sm ${
            isUserPlan ? 'font-bold text-purple-500' : 'text-gray-600 dark:text-gray-400'
          }`}>
            <span>{planNames[planType as keyof typeof planNames]}:</span>
            <span>${price.toFixed(2)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function SubscribePage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<{subscription: any | null, plan: any | null} | null>(null);
  const [userCredits, setUserCredits] = useState<any | null>(null);
  const [creditPackages, setCreditPackages] = useState<any[]>([]);
  const [dailyReward, setDailyReward] = useState<{canClaim: boolean, potentialReward: number, planType: string, isGuest?: boolean} | null>(null);
  const [guestRewardInfo, setGuestRewardInfo] = useState<any>(null);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<BillingPeriod>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plans' | 'coins' | 'rewards'>('plans');
  const [dataLoaded, setDataLoaded] = useState(false);
  const router = useRouter();
  
  // Safe session handling with loading state
  const { data: session, status } = useSession();
  
  const userId = session?.user?.id as string;

  // Determine user state
  const userState: UserState = {
    isAuthenticated: !!session?.user,
    isGuest: !session?.user,
    isBasicUser: !!session?.user && (!currentSubscription?.subscription),
    isSubscribedUser: !!session?.user && !!currentSubscription?.subscription
  };

  // Load data immediately regardless of session state
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading data...', { session: !!session?.user, userId, status });
        
        // Always load plans first
        const plansData = await getAllPlans();
        console.log('Plans loaded:', plansData.length);
        setPlans(plansData);
        
        const isGuest = !session?.user;
        
        if (isGuest) {
          // Guest user - get public data only
          const [guestCreditPackages, guestRewards] = await Promise.all([
            getCreditPackagesForGuests(),
            getRewardInfoForGuests()
          ]);
          
          console.log('Guest data loaded:', { packages: guestCreditPackages.length });
          setCreditPackages(guestCreditPackages);
          setGuestRewardInfo(guestRewards);
          setDailyReward({ canClaim: false, potentialReward: 0, planType: 'Guest', isGuest: true });
        } else if (userId) {
          // Authenticated user - get personalized data
          const [subscriptionData, creditsData, rewardData] = await Promise.all([
            getUserSubscription(userId),
            getUserCredits(userId),
            checkDailyRewardEligibility(userId)
          ]);
          
          console.log('User data loaded:', { subscription: !!subscriptionData });
          setCurrentSubscription(subscriptionData.subscription);
          setUserCredits(creditsData);
          setDailyReward(rewardData);
          
          // Get credit packages with user's plan discount
          const packages = await getCreditPackagesWithDiscounts(userId);
          setCreditPackages(packages);
        }
        setDataLoaded(true);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load subscription data');
      }
    }
    
    loadData();
  }, [session, userId, status]);
  
  // No loading screen - render immediately

  // Handle plan subscription
  const handleSubscribe = async (planId: string) => {
    const selectedPlan = plans.find(p => p.id === planId);
    const isBasicPlan = selectedPlan?.planType === 'basic';
    
    if (isBasicPlan && userState.isGuest) {
      // For basic plan, just redirect to sign up (no subscription needed)
      router.push('/signin?callbackUrl=/');
      return;
    }
    
    if (isBasicPlan && userState.isAuthenticated) {
      // Basic plan doesn't require subscription - it's the default state
      // Could implement downgrade logic here in the future
      return;
    }

    if (!isBasicPlan && userState.isSubscribedUser) {
      // User is already subscribed - show notification
      setError('Please cancel your current subscription before subscribing to a different plan.');
      return;
    }

    if (userState.isGuest) {
      router.push('/signin?callbackUrl=/subscribe');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await createSubscription({
        userId,
        planId,
        billingPeriod: selectedBillingPeriod
      });
      if (result.success) {
        window.location.href = result.url!;
      } else {
        setError(result.error || 'Failed to process your payment. Please try again.');
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError('Unable to process your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle credit purchase
  const handleCreditPurchase = async (packageId: string) => {
    if (userState.isGuest) {
      router.push('/signin?callbackUrl=/subscribe');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await purchaseCredits(userId, currentSubscription?.plan?.planType || 'basic', packageId);
      if (result.success) {
        window.location.href = result.url!;
      } else {
        setError(result.error || 'Failed to process your credit purchase. Please try again.');
      }
    } catch (err) {
      console.error('Credit purchase error:', err);
      setError('Unable to process your credit purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle daily reward claim
  const handleClaimReward = async () => {
    if (userState.isGuest) {
      router.push('/signin?callbackUrl=/subscribe');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await claimDailyReward(userId);
      if (result.success) {
        setDailyReward(prev => prev ? { ...prev, canClaim: false } : null);
        // Refresh user credits
        const newCredits = await getUserCredits(userId);
        setUserCredits(newCredits);
      }
    } catch (err) {
      console.error('Reward claim error:', err);
      setError('Unable to claim daily reward. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanPrice = (plan: any) => {
    switch (selectedBillingPeriod) {
      case 'monthly': return Number(plan.monthlyPrice);
      case 'halfYear': return Number(plan.halfYearPrice);
      case 'yearly': return Number(plan.yearlyPrice);
      default: return Number(plan.monthlyPrice);
    }
  };

  const getBillingPeriodLabel = () => {
    switch (selectedBillingPeriod) {
      case 'monthly': return 'month';
      case 'halfYear': return '6 months';
      case 'yearly': return 'year';
      default: return 'month';
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan?.id === planId;
  };

  const getButtonText = (plan: any) => {
    const isBasicPlan = plan.planType === 'basic';
    
    if (isBasicPlan) {
      if (userState.isGuest) return 'Sign up to Start';
      if (userState.isBasicUser) return 'Current Plan';
      if (userState.isSubscribedUser) return 'Free';
      return 'Get Started Free';
    }
    
    if (userState.isGuest) return 'Sign Up to Subscribe';
    if (isCurrentPlan(plan.id)) return 'Current Plan';
    return 'Subscribe';
  };

  const getButtonDisabled = (plan: any) => {
    const isBasicPlan = plan.planType === 'basic';
    
    if (loading) return true;
    
    // Current plan is always disabled
    if (isCurrentPlan(plan.id) || (isBasicPlan && userState.isBasicUser)) {
      return true;
    }
    
    // Disable downgrade to basic for subscribed users (not implemented yet)
    if (isBasicPlan && userState.isSubscribedUser) {
      return true;
    }
    
    return false;
  };

  // No loading screen for initial data load

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="text-center mb-8">
        {userState.isGuest && (
          <h1 className="text-gray-300 text-3xl font-bold">Start free or choose a plan that fits your needs</h1>
        )}
        {userState.isAuthenticated && (
          <h1 className="text-gray-300 text-3xl font-bold">Manage your subscription and coins</h1>
        )}
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mt-3 px-4 py-2 text-sm border-purple-500 hover:border-2 transition-colors"
        >
          <Link href="/">
            Back to Discover
          </Link>
        </Button>
      </div>

      {/* Current Status - Only for authenticated users */}
      {userState.isAuthenticated && (
        <div className="mb-8 bg-white/90 dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Status</h2>
            <div className="text-right">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-md border border-yellow-200/50 dark:border-yellow-800/50">
                <Coins className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                <span className="font-semibold text-yellow-700 dark:text-yellow-300">{userCredits?.balance || 0}</span>
                <span className="text-xs text-yellow-600/80 dark:text-yellow-400/80 font-medium">coins</span>
              </div>
            </div>
          </div>
          
          {currentSubscription && currentSubscription.plan ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                  {currentSubscription.plan.name}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentSubscription.subscription ? 
                    `$${getPlanPrice(currentSubscription.plan)} per ${getBillingPeriodLabel()}` :
                    'Free plan'
                  }
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Basic Plan (Free)</p>
          )}
        </div>
      )}

      {/* Daily Reward - Enhanced for all users */}
      {(dailyReward?.canClaim || userState.isGuest) && (
        <div className="mb-8 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Daily Login Reward</h3>
              {userState.isGuest ? (
                <p className="text-gray-700 dark:text-gray-300">
                  Sign up for free and claim daily coins rewards!
                </p>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  Claim your daily {dailyReward?.potentialReward} coins!
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={userState.isGuest ? () => router.push('/signin') : handleClaimReward}
              disabled={loading}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg disabled:opacity-50"
            >
              {userState.isGuest ? 'Sign Up' : 'Claim Reward'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {['plans', 'coins', 'rewards'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div>
          {/* Billing Period Toggle - Only for paid plans */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white/90 dark:bg-gray-800 rounded-lg p-1">
              {(['monthly', 'halfYear', 'yearly'] as BillingPeriod[]).map((period) => (
                <Button
                  key={period}
                  onClick={() => setSelectedBillingPeriod(period)}
                  variant={selectedBillingPeriod === period ? "default" : "outline"}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedBillingPeriod === period
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {period === 'halfYear' ? '6 Months' : period.charAt(0).toUpperCase() + period.slice(1)}
                  {period === 'halfYear' && <span className="ml-1 text-yellow-300">(-20%)</span>}
                  {period === 'yearly' && <span className="ml-1 text-yellow-300">(-40%)</span>}
                </Button>
              ))}
            </div>
          </div>

          {/* Plans Grid - Basic plan will appear first due to plan ordering */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Loading plans... (Plans: {plans.length}, Data loaded: {dataLoaded.toString()})</p>
              </div>
            )}
            {plans.map((plan) => {
              const isBasicPlan = plan.planType === 'basic';
              const isCurrent = isCurrentPlan(plan.id) || (isBasicPlan && userState.isBasicUser);
              const price = getPlanPrice(plan);
              
              return (
                <div key={plan.id} className={`bg-white/90 dark:bg-gray-800 rounded-lg shadow-md p-6 relative ${
                  isCurrent ? 'ring-2 ring-purple-500' : ''
                } ${isBasicPlan ? 'ring-2 ring-purple-500' : ''}`}>
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Your Plan
                      </span>
                    </div>
                  )}
                  {isBasicPlan && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Free Plan
                      </span>
                    </div>
                  )}
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{plan.name}</h2>
                    <div className="flex items-baseline">
                      {userState.isAuthenticated && isCurrent ? (
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${price}
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {isBasicPlan ? 'Free' : `$${price}`}
                        </span>
                      )}
                      {!isBasicPlan && (
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          /{getBillingPeriodLabel()}
                        </span>
                      )}
                    </div>
                    {/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p> */}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-3 text-gray-900 dark:text-white">Features:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800 dark:text-gray-200">
                          {plan.monthlyRenewedCredits} coins per month
                        </span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800 dark:text-gray-200">
                          {LIMITS[plan.planType.toUpperCase() as keyof typeof LIMITS].maxCharacters === -1 ? 'Unlimited' : LIMITS[plan.planType.toUpperCase() as keyof typeof LIMITS].maxCharacters} characters
                        </span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800 dark:text-gray-200">
                          {plan.dailyLoginRewardCredits} daily login coins
                        </span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800 dark:text-gray-200">
                          {plan.creditPurchaseDiscount}% off credit purchases
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={getButtonDisabled(plan)}
                    className="w-full py-3 px-4 border-purple-500 hover:border-2 transition-colors"
                  >
                    {getButtonText(plan)}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coins Tab */}
      {activeTab === 'coins' && (
        <div>
          {userState.isGuest && (
            <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to purchase coins?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Sign up for free to buy coins and get discounts with paid plans</p>
              <Button
                variant="outline"
                onClick={() => router.push('/signin')}
                className="px-6 py-2 border-purple-500 hover:border-2 transition-colors"
              >
                Sign Up Free
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creditPackages.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Loading credit packages... (Packages: {creditPackages.length}, Data loaded: {dataLoaded.toString()})</p>
              </div>
            )}
            {creditPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white/90 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-8 w-8 text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{pkg.name}</h2>
                  </div>
                  
                  {/* Price Comparison */}
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prices by Plan:</h3>
                    <PriceComparison
                      prices={pkg.prices}
                      userPlanType={pkg.userPlanType}
                    />
                  </div>
                  
                  {/* Main Price Display */}
                  <div className="flex items-baseline">
                                      {userState.isAuthenticated && pkg.userDiscountPercent > 0 ? (
                    <div>
                      <div className="text-sm text-purple-600 font-medium">Your Price</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${pkg.userPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          ${pkg.basePrice.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${pkg.userPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {pkg.userDiscountPercent > 0 && userState.isAuthenticated && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-sm font-medium">
                        {pkg.userDiscountPercent}% OFF
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        Save ${(pkg.basePrice - pkg.userPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{pkg.description}</p>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800 dark:text-gray-200">{pkg.credits} coins</span>
                  </div>
                </div> */}
                
                <Button
                  variant="outline"
                  onClick={() => handleCreditPurchase(pkg.id)}
                  disabled={loading}
                  className="w-full py-3 px-4 border-purple-500 hover:border-2 transition-colors"
                >
                  {userState.isGuest ? 'Sign Up to Purchase' : 'Purchase Coins'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="bg-white/90 dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Daily Login Rewards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                {userState.isGuest ? 'Reward Tiers' : 'Reward Status'}
              </h3>
              {userState.isGuest ? (
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{guestRewardInfo?.guestMessage}</p>
                  {guestRewardInfo?.rewardTiers?.map((tier: any) => (
                    <div key={tier.planType} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{tier.planName}</span>
                      <span className="font-medium">{tier.dailyReward} coins</span>
                    </div>
                  ))}
                </div>
              ) : dailyReward ? (
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    Status: {dailyReward.canClaim ? 
                      <span className="text-purple-500 font-medium">Available</span> : 
                      <span className="text-gray-500">Already claimed today</span>
                    }
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your daily reward: <span className="font-medium text-purple-500">{dailyReward.potentialReward} coins</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Plan type: <span className="font-medium capitalize">{dailyReward.planType}</span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Loading reward status...</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">All Reward Tiers</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Basic Plan</span>
                  <span className="font-medium">2 coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pro Plan</span>
                  <span className="font-medium">10 coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plus Plan</span>
                  <span className="font-medium">25 coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Astro Plan</span>
                  <span className="font-medium">50 coins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-gray-300 hover:text-purple-500"
        >
          {'Maybe later'}
        </Link>
      </div>
    </div>
  );
} 