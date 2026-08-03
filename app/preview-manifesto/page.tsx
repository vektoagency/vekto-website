import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import ManifestoHomepage from "./ManifestoHomepage";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-manifesto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO",
  robots: { index: false, follow: false },
};

export default function PreviewManifestoPage() {
  return (
    <div className={fraunces.variable}>
      <ManifestoHomepage />
    </div>
  );
}
