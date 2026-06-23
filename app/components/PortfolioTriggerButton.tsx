"use client";

import Link from "next/link";

type Props = {
  className?: string;
  children: React.ReactNode;
};

// Thin wrapper around <Link> so existing call sites don't have to import
// Link individually. Was previously a custom-event dispatcher that opened
// a modal overlay; now portfolio is a real route so navigation is direct.
export default function PortfolioTriggerButton({ className, children }: Props) {
  return (
    <Link href="/portfolio" className={className}>
      {children}
    </Link>
  );
}
