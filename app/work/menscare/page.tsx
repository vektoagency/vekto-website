import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import SiteHeader from "../../components/SiteHeader";

const copy = {
  bg: {
    back: "Назад",
    eyebrow: "Case Study",
    h1: ["Издигане на бранд и", "стратегия за съдържание"],
    sub: "Как изградихме поток от криейтиви и преструктурирахме рекламите на премиум grooming бизнес.",
    stats: [
      { value: "Криейтиви", label: "Видео и статики в поток" },
      { value: "Реклами", label: "Преструктуриран Meta акаунт" },
      { value: "AI", label: "Сценарии и монтаж" },
      { value: "Стратегия", label: "Ъгли, куки, оферта" },
    ],
    brandEyebrow: "Бизнесът",
    brandH2: ["Премиум grooming,", "движен от природата"],
    brandP1:
      "Men's Care е премиум grooming бизнес, специализиран в продукти за растеж на брада и коса с натурални съставки.",
    brandP2:
      "Те дойдоха при нас с една цел: агресивен, но устойчив ръст на онлайн продажбите за 6 месеца — достигайки по-широка аудитория и максимизирайки обема поръчки, без да вдигат разхода за привличане на клиент.",
    approachEyebrow: "Нашият подход",
    approachH2: ["Тестване на креатив", "в мащаб"],
    approachP1:
      "Произведохме и тествахме много рекламни ъгли с AI за сценарии и монтаж, докато открием кои куки задържат вниманието.",
    approachP2:
      "Освен криейтива, преструктурирахме рекламния им акаунт — отделни кампании за привличане и за връщане на посетители, вместо всичко в едно.",
    servicesEyebrow: "Използвани услуги",
    services: ["Кратки видеа за социалните мрежи", "AI продуктови визуализации", "AI автоматизация на съдържание", "Кинематографичен стил"],
    ctaEyebrow: "Готов ли си за ръст?",
    ctaH2: ["Хайде да изградим", "твоята успешна история"],
    ctaBtn: "Започни",
  },
  en: {
    back: "Back",
    eyebrow: "Case Study",
    h1: ["Brand Elevation &", "Content Strategy"],
    sub: "How we built a creative pipeline and restructured the ad account of a premium grooming business.",
    stats: [
      { value: "Creative", label: "Video and statics in flow" },
      { value: "Ads", label: "Meta account restructured" },
      { value: "AI", label: "Scripts and editing" },
      { value: "Strategy", label: "Angles, hooks, offer" },
    ],
    brandEyebrow: "The Brand",
    brandH2: ["Premium grooming,", "powered by nature"],
    brandP1:
      "Men's Care is a premium grooming business specialising in beard and hair growth products made with natural ingredients.",
    brandP2:
      "They came to us with one goal: aggressive yet sustainable scaling of online sales over a 6-month period — reaching a broader audience and maximizing order volume without spiking their Cost Per Acquisition.",
    approachEyebrow: "Our Approach",
    approachH2: ["Creative testing", "at scale"],
    approachP1:
      "We rapidly produced and tested a massive variety of marketing angles using AI-enhanced tools for script generation and dynamic editing — identifying viral hooks and pain points that resonated.",
    approachP2:
      "Alongside the creative output, we restructured their Meta Ads setup with proper top-of-funnel prospecting and bottom-of-funnel retargeting — enabling efficient scaling without wasted spend.",
    servicesEyebrow: "Services Used",
    services: ["Short-Form Authority Series", "AI Product Visuals", "AI Content Automation", "Cinematic Styling"],
    ctaEyebrow: "Ready to scale?",
    ctaH2: ["Let's build your", "success story"],
    ctaBtn: "Let's Talk",
  },
};

export default async function MensCarePage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("vekto-lang")?.value === "bg" ? "bg" : "en") as "bg" | "en";
  const t = copy[lang];

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Shared site header — same as the homepage */}
      <SiteHeader />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end px-6 pb-16 pt-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/work-menscare.webp" alt="Men's Care" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto w-full">
          <div className="mb-4">
            <div style={{ position: "relative", width: "80px", height: "80px" }}>
              <Image src="/images/logo-menscare.png" alt="Men's Care" fill className="object-contain" />
            </div>
          </div>
          <p className="text-xs text-[#f4f4f4] uppercase tracking-widest mb-3">{t.eyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t.h1[0]}<br />{t.h1[1]}</h1>
          <p className="text-[#a0a0a0] max-w-xl text-lg">{t.sub}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 border-y border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {t.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#f4f4f4] mb-2">{s.value}</div>
              <div className="text-sm text-[#a0a0a0]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs text-[#f4f4f4] uppercase tracking-widest mb-4">{t.brandEyebrow}</p>
            <h2 className="text-3xl font-bold mb-6">{t.brandH2[0]}<br />{t.brandH2[1]}</h2>
            <p className="text-[#a0a0a0] leading-relaxed mb-4">{t.brandP1}</p>
            <p className="text-[#a0a0a0] leading-relaxed">{t.brandP2}</p>
          </div>
          <div>
            <p className="text-xs text-[#f4f4f4] uppercase tracking-widest mb-4">{t.approachEyebrow}</p>
            <h2 className="text-3xl font-bold mb-6">{t.approachH2[0]}<br />{t.approachH2[1]}</h2>
            <div className="space-y-4 text-[#a0a0a0] leading-relaxed">
              <p>{t.approachP1}</p>
              <p>{t.approachP2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services used */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[#f4f4f4] uppercase tracking-widest mb-6">{t.servicesEyebrow}</p>
          <div className="flex flex-wrap gap-3">
            {t.services.map((s) => (
              <span key={s} className="border border-[#222] text-[#a0a0a0] px-4 py-2 rounded-full text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center border-t border-[#1a1a1a]">
        <p className="text-xs text-[#f4f4f4] uppercase tracking-widest mb-4">{t.ctaEyebrow}</p>
        <h2 className="text-4xl font-bold mb-6">{t.ctaH2[0]}<br /><span className="text-[#f4f4f4]">{t.ctaH2[1]}</span></h2>
        <Link
          href="/start"
          className="inline-block bg-[#f4f4f4] text-black font-semibold px-10 py-4 rounded-full hover:bg-[#ffffff] transition-colors"
        >
          {t.ctaBtn}
        </Link>
      </section>

    </div>
  );
}
