import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import ReceiptHomepage from "./ReceiptHomepage";

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-receipt-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Spec Sheet",
  robots: { index: false, follow: false },
};

export default function PreviewReceiptPage() {
  return (
    <div className={mono.variable}>
      <ReceiptHomepage />
    </div>
  );
}
