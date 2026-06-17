import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import TransitionBridge from "./components/TransitionBridge";
import MetaPixel from "./components/MetaPixel";
import CookieBanner from "./components/CookieBanner";
import { LangProvider, type Lang } from "./i18n/LangProvider";
import bunnyData from "./data/bunny-clips.json";
import { heroFeaturedClipIds } from "./data/hero-featured-clips";

// Resolve URLs for the hero clips that will appear in HeroCinematicBg.
// HeroCinematicBg is mobile-only (lg:hidden) so we resolve to the
// mobile-specific 480p variants for local clips — Biotica drops from
// 6.1 MB → 1.9 MB which is ~70%% less bandwidth for first frame.
// Bunny clips already use play_480p.mp4. Desktop card + portfolio
// lightbox use the full-resolution originals from JSON.
type ClipRecord = { id: string; previewMp4: string | null; thumbnail: string | null };
function resolveHeroClip(clipId: string): { videoUrl: string | null; posterUrl: string | null } {
  const clip = (bunnyData.clips as ClipRecord[]).find((c) => c.id === clipId);
  const src = clip?.previewMp4 ?? null;
  const poster = clip?.thumbnail ?? null;
  const videoUrl = !src
    ? null
    : src.startsWith("/")
      ? src.replace(/\.mp4$/, "-480p.mp4")
      : src.replace("play_1080p.mp4", "play_480p.mp4");
  return { videoUrl, posterUrl: poster };
}
const firstHero = heroFeaturedClipIds[0]
  ? resolveHeroClip(heroFeaturedClipIds[0])
  : { videoUrl: null, posterUrl: null };
const nextHeroClips: Array<{ videoUrl: string | null }> = heroFeaturedClipIds
  .slice(1, 4)
  .map((id) => resolveHeroClip(id));

// IBM Plex Sans — distinctive technical sans, designed by IBM with
// Cyrillic as a first-class subset. Sharp, professional, agency feel
// without being generic. CSS var name kept as --font-geist-sans so
// existing consumers (globals.css, components) work unchanged. Need
// explicit weights since IBM Plex Sans is not a variable font in
// next/font/google.
const fontSans = IBM_Plex_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
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
    <html lang={lang} className={`${fontSans.variable} h-full antialiased`}>
      <head>
        {/* Meta Business Manager — domain ownership verification.
            Required for iOS 14+ conversion attribution + Aggregated
            Event Measurement priority across ad accounts. */}
        <meta name="facebook-domain-verification" content="bdtob8m89vuhtr9lk6kzwbiq9rb4t5" />
        {/* Preload the first mobile-hero cinematic clip + its poster —
            fetch starts during HTML parse, before React hydrates, so
            both the still poster AND the first video frame paint almost
            instantly when HeroCinematicBg mounts. Media query gates the
            preload to mobile only — desktop uses PortfolioWindow card
            instead and doesn't need these files. */}
        {firstHero.posterUrl && (
          <link
            rel="preload"
            as="image"
            href={firstHero.posterUrl}
            fetchPriority="high"
            media="(max-width: 1023px)"
          />
        )}
        {firstHero.videoUrl && (
          <link
            rel="preload"
            as="video"
            href={firstHero.videoUrl}
            crossOrigin="anonymous"
            fetchPriority="high"
            media="(max-width: 1023px)"
          />
        )}
        {/* Prefetch the upcoming mobile clips at low priority so they're
            warm in cache by the time each crossfade swaps to them — no
            buffering pause mid-rotation. Mobile-only via media query. */}
        {nextHeroClips.map((c, i) =>
          c.videoUrl ? (
            <link
              key={i}
              rel="prefetch"
              as="video"
              href={c.videoUrl}
              crossOrigin="anonymous"
              media="(max-width: 1023px)"
            />
          ) : null
        )}
        {/* Warm up Bunny Stream connections so thumbnails + the iframe
            player don't pay DNS/TLS cost the moment the reel opens. */}
        <link rel="preconnect" href="https://vz-5279644d-ac4.b-cdn.net" crossOrigin="" />
        <link rel="preconnect" href="https://iframe.mediadelivery.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://video.bunnycdn.com" />
        {/* Draco decoder is fetched from gstatic by drei's useGLTF when the
            GLB is Draco-compressed — opening the connection early saves
            ~150ms TLS handshake on first GLB parse. */}
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="" />
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
