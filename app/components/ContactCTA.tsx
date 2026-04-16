"use client";

import { openContactModal } from "./ContactModal";

type Mode = "call" | "message";

type Props = {
  children: React.ReactNode;
  className?: string;
  mode?: Mode;
  onClick?: () => void;
};

export default function ContactCTA({ children, className, mode = "call", onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        openContactModal(mode);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
