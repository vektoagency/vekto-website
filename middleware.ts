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

  // English-only routes. /hospitality is the link we put in outreach to
  // hotels and villa owners abroad — the reader is never Bulgarian, so the
  // page furniture (header, cookie banner, <html lang>) has to be English
  // too, whatever this visitor's saved preference is. A request header is
  // the only way to tell the root layout which path it is rendering; it
  // deliberately does NOT touch the vekto-lang2 cookie, so the visitor's own
  // choice survives for the rest of the site.
  const requestHeaders = new Headers(req.headers);
  if (/^\/hospitality(\/|$)/.test(url.pathname)) {
    requestHeaders.set("x-vekto-lang-pin", "en");
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  // No geo language any more: the site opens in English for everyone.
  // Bulgarian is one tap away on the header toggle, and that choice is the
  // only thing that writes the language cookie (vekto-lang2, see
  // LangProvider). The old geo-set "vekto-lang" cookie is ignored.

  return res;
}
