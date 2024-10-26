import { NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

import { NextRequest, NextFetchEvent } from 'next/server';


export function middleware( req: NextRequest, event: NextFetchEvent) {
  console.log('Request URL:', req.url);
  console.log('NEXT_RUNTIME:', process.env.NEXT_RUNTIME);

  // Ensure Clerk middleware only runs in environments that support it
  if (process.env.NEXT_RUNTIME !== 'edge') {
    // Run Clerk middleware in non-edge environments
    return clerkMiddleware(req, event);
  } else {
    // Edge-compatible middleware logic (if needed)
    return NextResponse.next(); // For Edge environments, simply continue the request
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
