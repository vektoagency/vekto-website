import { NextRequest, NextResponse } from "next/server";

// On dashboard.vektoagency.com — rewrite all paths to /dashboard/* internally,
// so the user sees clean URLs (dashboard.vektoagency.com/login) but the
// content is served from /dashboard/login route.

export const config = {
  matcher: [
    // Match all paths except API routes, _next internals, and static files
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)",
  ],
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl.clone();

  if (host.startsWith("dashboard.")) {
    // If path doesn't already start with /dashboard, prepend it
    if (!url.pathname.startsWith("/dashboard")) {
      url.pathname = `/dashboard${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
