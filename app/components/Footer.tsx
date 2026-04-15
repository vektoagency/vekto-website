import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1e1e1c] py-12 px-6" style={{ background: "#060606" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image src="/images/logo.png" alt="VEKTO" width={100} height={34} className="object-contain mb-3" />
            <p className="text-sm text-[#9a958e] leading-relaxed max-w-xs">
              AI-Driven Vision for the Future of Brands. Creating visual ecosystems built to scale.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs text-[#4a4540] uppercase tracking-widest mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-[#9a958e]">
              {[
                "Short-Form Authority Series",
                "AI Digital Avatars",
                "Cinematic Brand Films",
                "AI Product Visuals",
                "AI Content Automation",
              ].map((s) => (
                <li key={s}>
                  <a href="#services" className="hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs text-[#4a4540] uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-[#9a958e]">
              {[
                { label: "Our Work", href: "#work" },
                { label: "Why VEKTO", href: "#why" },
                { label: "Contact", href: "#contact" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e1e1c] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4a4540]">© {year} VEKTO. All rights reserved.</p>
          <p className="text-xs text-[#4a4540]">Bulgaria · vektoagency.com</p>
        </div>
      </div>
    </footer>
  );
}
