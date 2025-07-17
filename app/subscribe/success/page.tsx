'use client';

import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  
  // If success state, show success UI
  return (
    <div className="container max-w-md mx-auto py-8 text-center">
      <div>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
        <p className="mb-6 text-gray-600">Your subscription was successful! You now have access to Pro features.</p>
        <Link 
          href="/discover" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to chat
        </Link>
      </div>
    </div>
  );
} 