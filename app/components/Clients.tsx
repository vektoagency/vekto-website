import AnimateIn from "./AnimateIn";

type Client = { name: string; logo: string; circular?: boolean; invert?: boolean };

const clients: Client[] = [
  { name: "ISOSPORT", logo: "/images/logo-isosport.png" },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", circular: true },
  { name: "PARFEN", logo: "/images/logo-parfen.png", invert: true },
  { name: "BIOTICA", logo: "/images/logo-biotica.png", circular: true, invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.png" },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.png" },
  { name: "GIFTO", logo: "/images/logo-gifto2.png" },
  { name: "ADVENTURES BG", logo: "/images/logo-adventuresbg.png" },
];

function LogoCell({ c, idx }: { c: Client; idx: number }) {
  const invert = c.invert ? "brightness(0) invert(1)" : undefined;
  // Stagger fade-in when section enters viewport — feels orchestrated.
  const stagger = `${idx * 60}ms`;
  return (
    <div
      className="group relative flex items-center justify-center h-[64px] md:h-[96px] px-3 md:px-4 border-r border-b border-[#161616] last:border-r-0 lg:[&:nth-child(4n)]:border-r-0 [&:nth-child(7)]:border-b-0 [&:nth-child(8)]:border-b-0 lg:[&:nth-child(5)]:border-b-0 lg:[&:nth-child(6)]:border-b-0 lg:[&:nth-child(7)]:border-b-0 lg:[&:nth-child(8)]:border-b-0 transition-colors hover:bg-[#c8ff00]/[0.03]"
      style={{
        animation: `clientCellIn 0.7s cubic-bezier(0.25,0.8,0.3,1) ${stagger} both`,
      }}
    >
      {/* Lime glow on hover — phosphor sweep matches the CRT brand */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,255,0,0.18) 0%, transparent 70%)",
        }}
      />
      {c.circular ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.logo}
            alt={c.name}
            className="md:hidden opacity-55 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
            style={{ height: "40px", width: "40px", objectFit: "contain", filter: invert }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.logo}
            alt={c.name}
            className="hidden md:block opacity-55 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
            style={{ height: "62px", width: "62px", objectFit: "contain", filter: invert }}
          />
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.logo}
            alt={c.name}
            className="md:hidden opacity-55 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
            style={{ height: "26px", width: "auto", maxWidth: "82px", objectFit: "contain", filter: invert }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.logo}
            alt={c.name}
            className="hidden md:block opacity-55 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
            style={{ height: "44px", width: "auto", maxWidth: "150px", objectFit: "contain", filter: invert }}
          />
        </>
      )}
    </div>
  );
}

export default function Clients() {
  return (
    <section
      className="py-8 md:py-14 border-y border-[#1e1e1c] relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      {/* Top + bottom phosphor edge — subtle lime hint on the borders */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/35 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <AnimateIn>
          <p className="text-center text-xs text-[#c8ff00] uppercase tracking-widest mb-12">
            Trusted by forward-thinking brands
          </p>

          {/* Grid — bordered cells, 4 columns desktop, 4 columns mobile (smaller). */}
          <div className="grid grid-cols-4 border-l border-t border-[#161616] rounded-sm overflow-hidden bg-[#080808]/40 backdrop-blur-[1px]">
            {clients.map((c, i) => (
              <LogoCell key={c.name} c={c} idx={i} />
            ))}
          </div>
        </AnimateIn>
      </div>

      <style>{`
        @keyframes clientCellIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
