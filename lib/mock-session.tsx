'use client';

// Mock session provider to replace next-auth for local development

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, SessionContextValue, User } from './types';
import { MOCK_SESSION, MOCK_USERS } from './mock-data';

// Create session context
const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "loading",
  update: async () => null,
});

// Session provider component
interface SessionProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export function SessionProvider({ children, session: initialSession }: SessionProviderProps) {
  // Initialize immediately with mock session (no loading state)
  const mockSession = MOCK_SESSION;
  const [session, setSession] = useState<Session | null>(mockSession.user ? mockSession : null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">(
    mockSession.user ? "authenticated" : "unauthenticated"
  );

  const update = async (data?: any): Promise<Session | null> => {
    // Mock update function
    if (data?.user) {
      const newSession = {
        user: data.user,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      setSession(newSession);
      setStatus("authenticated");
      return newSession;
    }
    return session;
  };

  return (
    <SessionContext.Provider value={{ data: session, status, update }}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use session
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Mock sign in/out functions
export const signIn = async (providerId?: string, options?: any) => {
  // Simulate sign in - you can change CURRENT_USER_ID in mock-data.ts to test different users
  console.log('Mock sign in called');
  window.location.href = options?.callbackUrl || '/discover';
};

export const signOut = async (options?: any) => {
  console.log('Mock sign out called');
  window.location.href = options?.callbackUrl || '/';
};

// Mock session utilities for testing
export const mockSessionUtils = {
  // Switch to different mock users for testing
  switchUser: (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      // This would trigger a re-render in a real implementation
      console.log(`Switched to user: ${user.name} (${user.id})`);
    }
  },
  
  // Sign out (set to guest mode)
  signOutMock: () => {
    console.log('Switched to guest mode');
  },
  
  // Get available test users
  getAvailableUsers: () => MOCK_USERS
};

// Export everything that next-auth/react would export
export { SessionProvider as default };