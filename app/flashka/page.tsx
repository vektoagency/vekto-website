import type { Metadata } from "next";
import FlashkaClient from "./FlashkaClient";

// Dedicated landing for the 'векто адс' Meta paid-traffic campaign.
// Direct-response copy framed around the $1M / USB-stick / system-
// access promise from the ads. Application form (not 'lead' form) —
// reuses /start's server action with source: 'flashka' for inbox +
// CAPI event segmentation.
export const metadata: Metadata = {
  title: "VEKTO · Кандидатствай за флашката",
  description:
    "На тази флашка е кодът зад $1,000,000 оборот. Системата работи в САЩ с 30+ бранда. Сега я носим в България — за първите 5.",
  robots: {
    // Paid-traffic LP — no organic indexing wanted; keeps it from
    // diluting the main domain rank or showing up to non-ad visitors.
    index: false,
    follow: false,
  },
  openGraph: {
    title: "VEKTO · $1M оборот. Системата зад растежа. Вече в БГ.",
    description:
      "Кодът е в тази флашка. 30+ бранда я ползват в САЩ. Първите 5 спота за България.",
    type: "website",
  },
};

export default function FlashkaPage() {
  return <FlashkaClient />;
}
