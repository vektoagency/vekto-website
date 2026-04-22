"use client";

import Link from "next/link";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function SeeOurWorkButton({ className = "", children }: Props) {
  return (
    <Link href="/work" prefetch className={className}>
      {children}
    </Link>
  );
}
