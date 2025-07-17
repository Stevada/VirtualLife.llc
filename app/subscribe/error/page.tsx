'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Something went wrong with your subscription.';
  
  return (
    <div>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-4">Subscription Failed</h1>
      <p className="mb-6 text-gray-600">{errorMessage}</p>
      <div className="flex space-x-4 justify-center">
        <Link 
          href="/subscribe" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </Link>
        <Link 
          href="/support" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

export default function SubscriptionErrorPage() {
  return (
    <div className="container max-w-md mx-auto py-8 text-center">
      <Suspense fallback={<p>Loading error details...</p>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
} 