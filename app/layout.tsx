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

export const metadata: Metadata = {
  metadataBase: new URL("https://vektoagency.com"),
  title: "VEKTO — AI-Driven Vision for the Future of Companies",
  description:
    "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
  openGraph: {
    title: "VEKTO — AI-Driven Vision for the Future of Companies",
    description:
      "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
    url: "https://vektoagency.com",
    siteName: "VEKTO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEKTO — AI-Driven Vision for the Future of Companies",
    description:
      "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
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
