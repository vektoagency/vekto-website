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

  const res = NextResponse.next();

  // Geo-based language preference — only set the cookie if it's not already
  // present (so a user's manual toggle override stays sticky). Country is
  // provided by Vercel via x-vercel-ip-country (also a backup geo.country).
  const existing = req.cookies.get("vekto-lang")?.value;
  if (!existing || (existing !== "bg" && existing !== "en")) {
    const country = (req.headers.get("x-vercel-ip-country") ?? "").toUpperCase();
    const lang = country === "BG" ? "bg" : "en";
    res.cookies.set("vekto-lang", lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return res;
}
