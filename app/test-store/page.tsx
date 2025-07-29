'use client';

import { SessionProvider } from '@/lib/mock-session';
import StorePage from '../store/page';

// Test wrapper for the store page with session provider
export default function TestStorePage() {
  return (
    <SessionProvider>
      <StorePage />
    </SessionProvider>
  );
}