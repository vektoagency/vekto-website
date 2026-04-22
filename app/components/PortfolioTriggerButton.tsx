"use client";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function PortfolioTriggerButton({ className, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("vekto:open-portfolio"))}
      className={className}
    >
      {children}
    </button>
  );
}
