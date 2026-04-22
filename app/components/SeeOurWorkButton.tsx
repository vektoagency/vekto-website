"use client";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function SeeOurWorkButton({ className = "", children }: Props) {

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      window.dispatchEvent(new CustomEvent("vekto:enter-pravec", { detail: { x, y } }));
      return;
    }
    // Mobile fallback — still let bridge handle the cover
    window.dispatchEvent(new CustomEvent("vekto:enter-pravec", { detail: { x, y } }));
  };

  return (
    <a href="/work" onClick={onClick} className={className}>
      {children}
    </a>
  );
}
