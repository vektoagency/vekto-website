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

// Both rows show all 8 brands but offset, so any repetition the eye
// catches is across rows rather than within a single sweep — feels far
// less repetitive than splitting the set in two.
const rowA: Client[] = clients;
const rowB: Client[] = [...clients.slice(4), ...clients.slice(0, 4)]; // shift by 4 for stagger

function LogoCell({ c }: { c: Client }) {
  const invert = c.invert ? "brightness(0) invert(1)" : undefined;
  if (c.circular) {
    return (
      <div className="flex-shrink-0 flex items-center justify-center px-5 md:px-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          className="opacity-65 hover:opacity-100 transition-opacity duration-300"
          style={{ height: "44px", width: "44px", objectFit: "contain", filter: invert }}
        />
      </div>
    );
  }
  return (
    <div className="flex-shrink-0 flex items-center justify-center px-5 md:px-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={c.logo}
        alt={c.name}
        className="md:hidden opacity-65 hover:opacity-100 transition-opacity duration-300"
        style={{ height: "26px", width: "auto", maxWidth: "100px", objectFit: "contain", filter: invert }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={c.logo}
        alt={c.name}
        className="hidden md:block opacity-65 hover:opacity-100 transition-opacity duration-300"
        style={{ height: "44px", width: "auto", maxWidth: "180px", objectFit: "contain", filter: invert }}
      />
    </div>
  );
}

function Row({ items, direction, duration }: { items: Client[]; direction: "left" | "right"; duration: number }) {
  // Double exactly — keyframes go 0 → -50%, so any 2× repetition loops seamlessly.
  // Going wider (4×) just adds DOM nodes for no visual benefit.
  const looped = [...items, ...items];
  const animation = `${direction === "left" ? "scrollLeft" : "scrollRight"} ${duration}s linear infinite`;
  return (
    <div
      className="flex items-center"
      style={{
        width: "max-content",
        animation,
        // GPU layer + cheap interpolation hint — smooths the marquee on
        // weaker devices where the previous setup felt choppy.
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {looped.map((c, i) => (
        <LogoCell key={`${c.name}-${i}`} c={c} />
      ))}
    </div>
  );
}

export default function Clients() {
  return (
    <section
      className="py-7 md:py-12 border-y border-[#1e1e1c]"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AnimateIn>
          <p className="text-center text-xs text-[#c8ff00] uppercase tracking-widest mb-12">
            Trusted by forward-thinking brands
          </p>

          {/* Two rows scrolling in opposite directions, with edge masks
              so logos fade in/out at the section borders for a polished
              editorial feel. */}
          <div
            className="relative overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <div className="flex flex-col gap-1.5 md:gap-3">
              <div className="overflow-hidden h-[40px] md:h-[60px] flex items-center">
                <Row items={rowA} direction="left" duration={90} />
              </div>
              <div className="overflow-hidden h-[40px] md:h-[60px] flex items-center">
                <Row items={rowB} direction="right" duration={120} />
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
