"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { openContactModal } from "./ContactModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Services", href: "#services" },
    { label: "Why VEKTO", href: "#why" },
    { label: "Our Work", href: "#work" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#080808]/95 backdrop-blur border-b border-[#1e1e1c]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center h-10 w-[120px]">
          <Image src="/images/logo.png" alt="VEKTO" width={120} height={40} className="object-contain" priority />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#9a958e] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => openContactModal("call")}
          className="hidden md:inline-flex items-center gap-2 bg-[#c8ff00] text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#d4ff33] transition-colors cursor-pointer"
        >
          Let&apos;s Talk
        </button>

        {/* Mobile burger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111110] border-t border-[#1e1e1c] px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#9a958e] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openContactModal("call"); }}
            className="bg-[#c8ff00] text-black font-semibold px-5 py-2.5 rounded-full text-center hover:bg-[#d4ff33] transition-colors cursor-pointer"
          >
            Let&apos;s Talk
          </button>
        </div>
      )}
    </header>
  );
}
