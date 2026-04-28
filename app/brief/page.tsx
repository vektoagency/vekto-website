import type { Metadata } from "next";
import BriefClient from "./BriefClient";

export const metadata: Metadata = {
  title: "Project Brief — VEKTO",
  description:
    "Submit your project brief — we'll send back a preliminary strategy + 3 hook angles within 24h.",
  openGraph: {
    title: "Project Brief — VEKTO",
    description:
      "Submit your project brief — we'll send back a preliminary strategy + 3 hook angles within 24h.",
  },
};

export default function BriefPage() {
  return <BriefClient />;
}
