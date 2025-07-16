import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip origin check for webhook routes (Stripe webhooks)
  if (request.nextUrl.pathname.startsWith('/api/webhook')) {
    return NextResponse.next();
  }

  // Get origin from request headers
  const origin = request.headers.get('origin');
  
  // Only allow requests from Website A for non-webhook routes
  if (origin !== process.env.NEXT_PUBLIC_WEBSITE_A_URL) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_WEBSITE_A_URL as string,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Set CORS headers for all routes
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_WEBSITE_A_URL as string);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/_next/static/:path*'],
};