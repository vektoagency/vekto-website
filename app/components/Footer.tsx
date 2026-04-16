import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  const explore = [
    { label: "Services", href: "#services" },
    { label: "Why VEKTO", href: "#why" },
    { label: "Our Work", href: "#work" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <footer className="border-t border-[#1e1e1c] py-14 px-6" style={{ background: "#060606" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-12 mb-10">
          {/* Brand */}
          <div>
            <Image src="/images/logo.png" alt="VEKTO" width={110} height={36} className="object-contain mb-4" />
            <p className="text-sm text-[#9a958e] leading-relaxed max-w-sm mb-5">
              AI-Driven Vision for the Future of Brands. Cinematic storytelling
              and AI-powered short-form systems built to scale.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#666]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              Based in Bulgaria · Working worldwide
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs text-[#4a4540] uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-[#9a958e]">
              {explore.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h4 className="text-xs text-[#4a4540] uppercase tracking-widest mb-4">Get in Touch</h4>
            <ul className="space-y-2.5 text-sm text-[#9a958e] mb-5">
              <li>
                <a href="mailto:hello@vektoagency.com" className="hover:text-white transition-colors">
                  hello@vektoagency.com
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Start a project
                </a>
              </li>
            </ul>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#c8ff00] hover:text-white transition-colors"
            >
              Book a free call
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e1e1c] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#4a4540]">© {year} VEKTO. All rights reserved.</p>
          <p className="text-xs text-[#4a4540]">vektoagency.com</p>
        </div>
      </div>
    </footer>
  );
}
