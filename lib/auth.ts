import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

// Function to validate origin
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  return origin === process.env.NEXT_PUBLIC_WEBSITE_A_URL;
}

// JWT authentication function
export async function verifyAuthToken(request: NextRequest): Promise<{ isValid: boolean; error?: string; payload?: any }> {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isValid: false, error: 'Missing or invalid authorization header' };
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return { isValid: false, error: 'No token provided' };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return { isValid: false, error: 'JWT_SECRET is not defined' };
    }
    
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, secretKey);
    return { isValid: true, payload };
  } catch (error: any) {
    return { isValid: false, error: error.message || 'Invalid token' };
  }
}

// Function to create a verification token
export async function createVerificationToken(payload: Record<string, any>, expiresIn = '1h'): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const secretKey = new TextEncoder().encode(secret);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

// Middleware for protected routes
export async function authenticate(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // First check origin through CORS
  if (!validateOrigin(request)) {
    console.log('Origin validation failed:', request.headers.get('origin'), 'Expected:', process.env.NEXT_PUBLIC_WEBSITE_A_URL);
    return NextResponse.json(
      { error: 'Unauthorized origin' },
      { status: 403 }
    );
  }

  // Then verify the JWT token
  const authResult = await verifyAuthToken(request);
  if (!authResult.isValid) {
    console.log('Auth token validation failed:', authResult.error);
    return NextResponse.json(
      { error: authResult.error || 'Authentication failed' },
      { status: 401 }
    );
  }

  // If valid, proceed with the handler
  return handler(request);
}