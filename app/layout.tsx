import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import TransitionBridge from "./components/TransitionBridge";
import MetaPixel from "./components/MetaPixel";
import CookieBanner from "./components/CookieBanner";
import { LangProvider, type Lang } from "./i18n/LangProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Chat-preview copy: BG-first (site defaults to BG on cookie miss) +
// punchy one-line description in the style of ROIimpact / Noble
// Graphics. Twitter card downgraded to `summary` (compact square)
// instead of `summary_large_image`, and the opengraph-image.tsx below
// serves at 800×800 → Messenger / iMessage / iOS Share Sheet all read
// this as 'compact card' rather than the tall landscape hero card.
export const metadata: Metadata = {
  metadataBase: new URL("https://vektoagency.com"),
  title: "VEKTO — AI маркетинг агенция",
  description:
    "Създаваме видеа и реклами, които продават. AI-задвижена маркетинг агенция за 30+ бранда в България и САЩ.",
  openGraph: {
    title: "VEKTO — AI маркетинг агенция",
    description:
      "Създаваме видеа и реклами, които продават. AI-задвижена маркетинг агенция за 30+ бранда в България и САЩ.",
    url: "https://vektoagency.com",
    siteName: "VEKTO",
    locale: "bg_BG",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "VEKTO — AI маркетинг агенция",
    description:
      "Създаваме видеа и реклами, които продават. AI-задвижена агенция за 30+ бранда.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("vekto-lang")?.value;
  const lang: Lang = cookieLang === "bg" ? "bg" : "en";
  return (
    <html lang={lang} className={`${geist.variable} h-full antialiased`}>
      <head>
        {/* Meta Business Manager — domain ownership verification.
            Required for iOS 14+ conversion attribution + Aggregated
            Event Measurement priority across ad accounts. Universal,
            stays in the root layout. All page-specific resource hints
            (hero video preloads, Bunny CDN preconnects) live in the
            home page server component now — keeps /start and other
            routes from pre-fetching ~2 MB of video they never use. */}
        <meta name="facebook-domain-verification" content="bdtob8m89vuhtr9lk6kzwbiq9rb4t5" />
      </head>
      <body className="min-h-full flex flex-col bg-[#080808] text-[#f5f5f5]">
        <LangProvider initialLang={lang}>
          {children}
          <TransitionBridge />
          <CookieBanner />
        </LangProvider>
        <MetaPixel />
        {/* Vercel Web Analytics — site-wide sessions, page views, top
            referrers, countries, devices, Core Web Vitals. Privacy-first
            (no cookies, no PII), ~1 KB script. Completely independent of
            Meta Pixel / CAPI — no interference with ad attribution. */}
        <Analytics />
      </body>
    </html>
  );
}
