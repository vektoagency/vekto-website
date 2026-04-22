"use client";

import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function SeeOurWorkButton({ className = "", children }: Props) {
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // On desktop (lg breakpoint), if the Pravec canvas is mounted, trigger the 3D transition
    const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("vekto:enter-pravec"));
      return;
    }
    // Mobile → prefetch + standard navigation with bridge flash (no 3D)
    try { sessionStorage.setItem("vekto-entering-pravec", "1"); } catch {}
    e.preventDefault();
    router.push("/work");
  };

  return (
    <a href="/work" onClick={onClick} className={className}>
      {children}
    </a>
  );
}
