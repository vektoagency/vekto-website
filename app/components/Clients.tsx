import AnimateIn from "./AnimateIn";

const clients = [
  { name: "ISOSPORT", logo: "/images/logo-isosport.png" },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", circular: true },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.png" },
  { name: "GIFTO", logo: "/images/logo-gifto2.png" },
  { name: "ADVENTURES BG", logo: "/images/logo-adventuresbg.png" },
];

export default function Clients() {
  return (
    <section className="py-8 md:py-16 px-0 md:px-6 border-y border-[#1e1e1c]" style={{ background: "#070707" }}>
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <p className="text-center text-xs text-[#c8ff00] uppercase tracking-widest mb-12">
            Trusted by forward-thinking brands
          </p>
          <div className="overflow-hidden relative">
            <div className="scroll-left flex gap-12 md:gap-24 items-center" style={{ width: "max-content" }}>
              {[...clients, ...clients, ...clients, ...clients].map((c, i) => (
                <div key={i} className="flex-shrink-0 px-2 md:px-8 opacity-70 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center md:h-[100px] h-[60px]">
                  {c.circular ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.logo} alt={c.name} className="md:hidden" style={{ height: "56px", width: "56px", objectFit: "contain" }} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.logo} alt={c.name} className="hidden md:block" style={{ height: "96px", width: "96px", objectFit: "contain" }} />
                    </>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.logo} alt={c.name} className="md:hidden" style={{ height: "36px", width: "auto", maxWidth: "110px", objectFit: "contain" }} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.logo} alt={c.name} className="hidden md:block" style={{ height: "70px", width: "auto", maxWidth: "260px", objectFit: "contain" }} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
