import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — VEKTO",
  description: "How VEKTO collects, uses, and protects your personal data — GDPR compliant.",
};

const copy = {
  bg: {
    home: "← Към сайта",
    eyebrow: "Юридическо",
    h1: "Политика за поверителност",
    updated: "Последно актуализирана: 19 май 2026 г.",
    intro:
      "Тази политика обяснява как VEKTO („ние\", „нашата агенция\") събира, използва, съхранява и защитава личните данни, които ни предоставяте, когато използвате vektoagency.com или нашите услуги.",
    sections: [
      {
        title: "1. Кои сме",
        body: [
          "VEKTO е творческа агенция, базирана в България.",
          "Имейл за връзка: vekto.agency.bg@gmail.com",
          "Телефон: +359 88 225 1474",
          "За въпроси относно поверителността, използвай същия имейл с тема „GDPR\".",
        ],
      },
      {
        title: "2. Какви данни събираме",
        body: [
          "Чрез формите на сайта (/start, /brief, формата за съобщение):",
          "• Име, имейл, телефон/WhatsApp",
          "• Уебсайт на бизнеса, индустрия, описание на проекта",
          "• Месечен бюджет, тип съдържание",
          "Автоматично при посещение на сайта:",
          "• IP адрес, browser, тип устройство, страници които посещаваш",
          "• Cookie за избор на език (vekto-lang) и cookie consent",
        ],
      },
      {
        title: "3. Защо ги събираме",
        body: [
          "• За да отговорим на твоето запитване и да изготвим оферта",
          "• За да резервираме среща чрез Cal.com",
          "• За да подобряваме сайта (анонимна аналитика)",
          "• За маркетингова оптимизация чрез Meta Pixel (само ако си се съгласил/а с cookies)",
        ],
      },
      {
        title: "4. Правно основание (GDPR Чл. 6)",
        body: [
          "• Изпълнение на договор / преддоговорна комуникация — когато попълниш форма",
          "• Легитимен интерес — за основна функционалност на сайта",
          "• Съгласие — за маркетингови cookies и Meta Pixel tracking",
        ],
      },
      {
        title: "5. Cookies и проследяване",
        body: [
          "Използваме следните видове cookies:",
          "• Необходими — функционалност на сайта (vekto-lang за език, cookie-consent)",
          "• Маркетинг — Meta Pixel за измерване на реклами и retargeting (само със съгласие)",
          "Можеш да управляваш съгласието чрез cookie banner-а на сайта или browser settings-ите си.",
          "Meta Pixel записва: PageView, Lead (при submit на форма), Schedule (резервация на среща), Contact (клик на телефон).",
        ],
      },
      {
        title: "6. Трети страни обработващи данни",
        body: [
          "• Vercel (хостинг) — vercel.com/legal/privacy-policy",
          "• Resend (изпращане на имейли от формите) — resend.com/legal/privacy",
          "• Cal.com (резервация на срещи) — cal.com/privacy",
          "• Meta (Facebook Pixel + реклами) — facebook.com/privacy/policy",
          "• Bunny CDN (видео хостинг) — bunny.net/privacy",
          "Всички спазват GDPR и имат DPA с нас.",
        ],
      },
      {
        title: "7. Колко дълго пазим данните",
        body: [
          "• Имейли от формите — до 3 години след последен контакт",
          "• Cookie consent — 12 месеца",
          "• Meta Pixel данни — според Meta retention policy",
          "След този срок данните се изтриват автоматично.",
        ],
      },
      {
        title: "8. Твоите права (GDPR)",
        body: [
          "Имаш право да:",
          "• Поискаш достъп до данните си",
          "• Поискаш корекция или изтриване",
          "• Възразиш срещу маркетингова обработка",
          "• Преносимост на данните",
          "• Жалба до КЗЛД (Комисия за защита на личните данни)",
          "За тези права пиши на vekto.agency.bg@gmail.com с тема „GDPR\". Отговаряме в 30 дни.",
        ],
      },
      {
        title: "9. Сигурност",
        body: [
          "Данните се пренасят по HTTPS. Хостингът е на сертифицирани партньори (Vercel, Resend) с ISO 27001. Не споделяме данни с трети страни извън описаните.",
        ],
      },
      {
        title: "10. Промени в политиката",
        body: [
          "Можем да актуализираме тази политика. Датата на последна актуализация е горе. Значителни промени ще бъдат съобщени чрез сайта.",
        ],
      },
    ],
  },
  en: {
    home: "← Back to site",
    eyebrow: "Legal",
    h1: "Privacy Policy",
    updated: "Last updated: May 19, 2026",
    intro:
      "This policy explains how VEKTO (\"we\", \"our agency\") collects, uses, stores, and protects the personal data you provide when using vektoagency.com or our services.",
    sections: [
      {
        title: "1. Who we are",
        body: [
          "VEKTO is a creative agency based in Bulgaria.",
          "Contact email: vekto.agency.bg@gmail.com",
          "Phone: +359 88 225 1474",
          "For privacy questions, email us with the subject \"GDPR\".",
        ],
      },
      {
        title: "2. What we collect",
        body: [
          "Through forms (/start, /brief, message form):",
          "• Name, email, phone/WhatsApp",
          "• Business website, industry, project description",
          "• Monthly budget, content type",
          "Automatically during site visit:",
          "• IP, browser, device type, pages visited",
          "• Language cookie (vekto-lang), cookie consent",
        ],
      },
      {
        title: "3. Why we collect it",
        body: [
          "• To reply to your inquiry and prepare a proposal",
          "• To schedule a meeting via Cal.com",
          "• To improve the site (anonymous analytics)",
          "• For ad optimization via Meta Pixel (only with cookie consent)",
        ],
      },
      {
        title: "4. Legal basis (GDPR Art. 6)",
        body: [
          "• Contract performance / pre-contract communication — when you fill a form",
          "• Legitimate interest — for basic site functionality",
          "• Consent — for marketing cookies and Meta Pixel tracking",
        ],
      },
      {
        title: "5. Cookies and tracking",
        body: [
          "We use the following cookie types:",
          "• Necessary — site functionality (vekto-lang, cookie-consent)",
          "• Marketing — Meta Pixel for ad measurement and retargeting (only with consent)",
          "You can manage consent via the cookie banner or your browser settings.",
          "Meta Pixel tracks: PageView, Lead (form submit), Schedule (meeting booking), Contact (phone click).",
        ],
      },
      {
        title: "6. Third-party data processors",
        body: [
          "• Vercel (hosting) — vercel.com/legal/privacy-policy",
          "• Resend (transactional email) — resend.com/legal/privacy",
          "• Cal.com (meeting bookings) — cal.com/privacy",
          "• Meta (Pixel + ads) — facebook.com/privacy/policy",
          "• Bunny CDN (video hosting) — bunny.net/privacy",
          "All are GDPR-compliant and we have DPAs in place.",
        ],
      },
      {
        title: "7. How long we keep data",
        body: [
          "• Form emails — up to 3 years after last contact",
          "• Cookie consent — 12 months",
          "• Meta Pixel data — per Meta's retention policy",
          "Data is automatically deleted after this period.",
        ],
      },
      {
        title: "8. Your rights (GDPR)",
        body: [
          "You have the right to:",
          "• Request access to your data",
          "• Request correction or deletion",
          "• Object to marketing processing",
          "• Data portability",
          "• File a complaint with the supervisory authority",
          "For these rights, email vekto.agency.bg@gmail.com with subject \"GDPR\". We respond within 30 days.",
        ],
      },
      {
        title: "9. Security",
        body: [
          "Data is transmitted over HTTPS. Hosting is on certified partners (Vercel, Resend) with ISO 27001. We don't share data with third parties outside those described.",
        ],
      },
      {
        title: "10. Policy changes",
        body: [
          "We may update this policy. The last update date is at the top. Significant changes will be communicated through the site.",
        ],
      },
    ],
  },
};

export default async function PrivacyPage() {
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
