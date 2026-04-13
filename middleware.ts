import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // For now, allow all requests through
  // Auth will be verified on the client-side via useAuth() hook
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
