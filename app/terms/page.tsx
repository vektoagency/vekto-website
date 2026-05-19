import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — VEKTO",
  description: "Terms and conditions for using VEKTO services and vektoagency.com.",
};

const copy = {
  bg: {
    home: "← Към сайта",
    eyebrow: "Юридическо",
    h1: "Общи условия",
    updated: "Последно актуализирани: 19 май 2026 г.",
    intro:
      "Тези общи условия („Условията\") уреждат използването на vektoagency.com и услугите, които VEKTO предлага. С използването на сайта или подписването на проект, ти се съгласяваш с тях.",
    sections: [
      {
        title: "1. Кои сме",
        body: [
          "VEKTO е творческа агенция, базирана в България, специализирана в AI-задвижено видео съдържание, кинематографични продукции и брандиране.",
          "Имейл: vekto.agency.bg@gmail.com · Телефон: +359 88 225 1474",
        ],
      },
      {
        title: "2. Услуги",
        body: [
          "Предлагаме следните услуги:",
          "• Кратки видеа за социалните мрежи",
          "• AI аватари и виртуални говорители",
          "• Кинематографични филми за бизнеса",
          "• AI продуктови визуализации",
          "Конкретният обхват, цените и срокове се определят с отделен договор за всеки проект.",
        ],
      },
      {
        title: "3. Оферта и плащане",
        body: [
          "След попълване на /start или /brief формата, изпращаме персонална оферта в рамките на 24-48 часа.",
          "Плащанията се извършват по банков път или платформи като Stripe / Revolut. Аванс от 50% се изисква за стартиране на проекта; останалите 50% — при доставка.",
          "Цени са в евро/лева и включват ДДС когато е приложимо.",
        ],
      },
      {
        title: "4. Срокове и доставки",
        body: [
          "Сроковете се определят в договора за всеки проект. Стандартното време за доставка на първи material е 5-10 работни дни.",
          "Включени са до 2 кръга редакции в обявената цена. Допълнителни редакции се таксуват отделно.",
          "Закъснения от страна на клиента (липсващи материали, забавени одобрения) удължават срока.",
        ],
      },
      {
        title: "5. Интелектуална собственост",
        body: [
          "След пълно плащане, клиентът получава пълни права за използване на финалното съдържание.",
          "VEKTO запазва правото да използва завършения материал в портфолио, case studies, маркетингови материали — освен при изрично писмено забранение от клиента.",
          "Source файлове (project files, raw footage, scripts) остават собственост на VEKTO и могат да се предоставят срещу допълнителна такса.",
        ],
      },
      {
        title: "6. Отказ и анулиране",
        body: [
          "Клиентът може да прекрати проекта писмено по всяко време.",
          "При анулиране ПРЕДИ start: пълно възстановяване минус 10% административна такса.",
          "При анулиране СЛЕД старт: аванса не подлежи на връщане, но клиентът получава всички готови материали към момента.",
        ],
      },
      {
        title: "7. Отговорност",
        body: [
          "VEKTO се ангажира с професионалното изпълнение на услугите. Не носим отговорност за:",
          "• Загуба на печалба, индиректни щети или последствия от използването на доставеното съдържание",
          "• Резултати от рекламни кампании (които зависят от външни фактори)",
          "• Промени в политиките на трети платформи (Meta, TikTok, YouTube)",
          "Общата ни отговорност не надвишава сумата, платена от клиента за конкретния проект.",
        ],
      },
      {
        title: "8. Конфиденциалност",
        body: [
          "Двете страни се ангажират да пазят бизнес информацията на другата страна конфиденциална. NDA може да бъде подписан при поискване преди стартиране на работа.",
        ],
      },
      {
        title: "9. Промени в Условията",
        body: [
          "Можем да актуализираме тези Условия. Действащите условия за всеки проект са тези, валидни към датата на подписване на договор за този проект.",
        ],
      },
      {
        title: "10. Приложимо право",
        body: [
          "Тези Условия се регулират от законодателството на Република България. Спорове се решават чрез преговори; при невъзможност — от компетентен български съд.",
        ],
      },
    ],
  },
  en: {
    home: "← Back to site",
    eyebrow: "Legal",
    h1: "Terms of Service",
    updated: "Last updated: May 19, 2026",
    intro:
      "These terms of service (\"Terms\") govern the use of vektoagency.com and the services VEKTO provides. By using the site or signing a project, you agree to them.",
    sections: [
      {
        title: "1. Who we are",
        body: [
          "VEKTO is a creative agency based in Bulgaria, specializing in AI-powered video content, cinematic productions, and branding.",
          "Email: vekto.agency.bg@gmail.com · Phone: +359 88 225 1474",
        ],
      },
      {
        title: "2. Services",
        body: [
          "We offer the following services:",
          "• Short-form videos for social media",
          "• AI avatars and virtual spokespersons",
          "• Cinematic films for business",
          "• AI product visualizations",
          "Specific scope, pricing, and timelines are defined in a separate agreement for each project.",
        ],
      },
      {
        title: "3. Proposal and payment",
        body: [
          "After submitting /start or /brief, we send a personalized proposal within 24-48 hours.",
          "Payments are processed via bank transfer or platforms like Stripe / Revolut. A 50% deposit is required to start; the remaining 50% upon delivery.",
          "Prices are in EUR/BGN and include VAT where applicable.",
        ],
      },
      {
        title: "4. Timelines and delivery",
        body: [
          "Timelines are defined in the project agreement. Standard first-material delivery is 5-10 business days.",
          "Up to 2 rounds of revisions are included in the stated price. Additional revisions are billed separately.",
          "Delays from the client side (missing assets, late approvals) extend the timeline.",
        ],
      },
      {
        title: "5. Intellectual property",
        body: [
          "Upon full payment, the client receives full usage rights to the final content.",
          "VEKTO retains the right to use completed work in portfolio, case studies, and marketing — unless explicitly prohibited in writing by the client.",
          "Source files (project files, raw footage, scripts) remain VEKTO property and can be provided for an additional fee.",
        ],
      },
      {
        title: "6. Cancellation",
        body: [
          "Client may terminate the project in writing at any time.",
          "Cancellation BEFORE start: full refund minus 10% admin fee.",
          "Cancellation AFTER start: deposit is non-refundable, but client receives all materials completed up to that point.",
        ],
      },
      {
        title: "7. Liability",
        body: [
          "VEKTO commits to professional execution of services. We are not liable for:",
          "• Loss of profit, indirect or consequential damages from using delivered content",
          "• Ad campaign results (which depend on external factors)",
          "• Changes in third-party platform policies (Meta, TikTok, YouTube)",
          "Our total liability does not exceed the amount paid by the client for the specific project.",
        ],
      },
      {
        title: "8. Confidentiality",
        body: [
          "Both parties commit to keeping each other's business information confidential. An NDA can be signed on request before work begins.",
        ],
      },
      {
        title: "9. Changes to Terms",
        body: [
          "We may update these Terms. The applicable terms for each project are those valid at the date of project agreement signature.",
        ],
      },
      {
        title: "10. Governing law",
        body: [
          "These Terms are governed by the laws of the Republic of Bulgaria. Disputes are resolved through negotiation; if not possible, by competent Bulgarian courts.",
        ],
      },
    ],
  },
};

export default async function TermsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("vekto-lang")?.value === "bg" ? "bg" : "en") as "bg" | "en";
  const t = copy[lang];

  return (
    <div className="min-h-screen bg-[#080808] text-[#ece8e1]">
      <header className="border-b border-[#1e1e1c] bg-[#080808]/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-3 md:py-4">
          <Link
            href="/"
            className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#9a958e] hover:text-[#c8ff00] transition-colors"
          >
            {t.home}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-16">
        <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">{t.eyebrow}</p>
        <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-3">{t.h1}</h1>
        <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#666] mb-8">{t.updated}</p>
        <p className="text-[14px] md:text-base text-[#a0a0a0] leading-relaxed mb-10 md:mb-12">{t.intro}</p>

        <div className="space-y-8 md:space-y-10">
          {t.sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-mono text-[11px] md:text-xs text-[#c8ff00] uppercase tracking-[0.25em] mb-3">
                {s.title}
              </h2>
              <div className="space-y-2 text-[14px] md:text-[15px] text-[#cfcbc4] leading-relaxed">
                {s.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
