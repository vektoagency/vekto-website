import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import TransitionBridge from "./components/TransitionBridge";
import MetaPixel from "./components/MetaPixel";
import CookieBanner from "./components/CookieBanner";
import { LangProvider, type Lang } from "./i18n/LangProvider";
import bunnyData from "./data/bunny-clips.json";
import { heroFeaturedClipIds } from "./data/hero-featured-clips";

// Resolve the URL of the first clip that will appear in the mobile hero
// cinematic background, so we can preload it from <head> — the browser
// starts the fetch during initial HTML parse, before React even hydrates
// the HeroCinematicBg client component. By the time the <video> tag
// mounts, the bytes are usually already in cache → first frame paints
// essentially instantly.
const firstHeroClipUrl: string | null = (() => {
  const firstId = heroFeaturedClipIds[0];
  if (!firstId) return null;
  const clip = (bunnyData.clips as Array<{ id: string; previewMp4: string | null }>).find(
    (c) => c.id === firstId
  );
  const src = clip?.previewMp4;
  if (!src) return null;
  if (src.startsWith("/")) return src;
  return src.replace("play_1080p.mp4", "play_480p.mp4");
})();

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
            Event Measurement priority across ad accounts. */}
        <meta name="facebook-domain-verification" content="vjkn3pxyadgj004wiu2vslghpbxq77" />
        {/* Preload the first mobile-hero cinematic clip — fetch starts
            during HTML parse, before React hydrates, so the first frame
            paints almost instantly when HeroCinematicBg mounts. */}
        {firstHeroClipUrl && (
          <link
            rel="preload"
            as="video"
            href={firstHeroClipUrl}
            crossOrigin="anonymous"
          />
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
      </body>
    </html>
  );
}
