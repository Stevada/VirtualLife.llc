// In a production app, this would be replaced with a database
// For simplicity, we're using a server-side in-memory store
// This will reset when the serverless function cold starts!

// For a production app, use Redis, MongoDB, or another database
type SessionData = {
    metadata: any;
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt?: string;
    subscriptionId?: string;
  };
  
  // This is just for demo purposes - in production use a database
  const sessions = new Map<string, SessionData>();
  
  export const sessionStore = {
    async storeSession(sessionId: string, metadata: any): Promise<void> {
      sessions.set(sessionId, {
        metadata,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    },
  
    async getSession(sessionId: string): Promise<SessionData | undefined> {
      return sessions.get(sessionId);
    },
  
    async updateSessionStatus(sessionId: string, status: 'pending' | 'completed', subscriptionId?: string): Promise<void> {
      const session = sessions.get(sessionId);
      if (session) {
        session.status = status;
        if (subscriptionId) {
          session.subscriptionId = subscriptionId;
        }
        session.updatedAt = new Date().toISOString();
        sessions.set(sessionId, session);
      }
    }
  };