"use client";

import Link from "next/link";

// Broadsheet newspaper homepage — dense, columnar, editorial old-school.
// Multi-column masthead, section rules, drop caps on the lead article,
// stacked headlines, italic captions, actual columns rendering text
// (CSS multi-column layout), advertisement-style CTAs styled as
// classified ads. Feels like the front page of the FT or NYT Sunday
// edition — but for a growth studio.

export default function NewspaperHomepage() {
  return (
    <div
      className="min-h-screen bg-[#f2ede0] text-[#0f0e0c] py-6 md:py-10 px-4 md:px-8"
      style={{
        fontFamily: "var(--font-news-serif), 'Times New Roman', serif",
      }}
    >
      <div className="max-w-[1180px] mx-auto">
        {/* ===== MASTHEAD ===== */}
        <div className="border-t-4 border-b border-black pt-4 pb-3">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-2 font-ui text-[10px] md:text-[11px] uppercase tracking-[0.2em]">
            <span>Vol. II · N° 26</span>
            <span>Sofia · Bulgaria — Established MMXXIV</span>
            <span>04 August 2026 · The Digital Edition</span>
          </div>
          <div className="text-center">
            <h1
              className="font-serif italic leading-none tracking-tight"
              style={{ fontSize: "clamp(56px, 10vw, 148px)", fontWeight: 700 }}
            >
              The Vekto Chronicle
            </h1>
            <div className="mt-3 pt-3 border-t border-black flex justify-between text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-ui">
              <span>50 брандa · BG + US</span>
              <span className="hidden md:inline italic font-serif normal-case tracking-normal text-sm">
                "The growth broadsheet of record."
              </span>
              <span>Price: One (1) Discovery Call</span>
            </div>
          </div>
        </div>

        {/* ===== FRONT PAGE — 3 COLUMN LAYOUT ===== */}
        <div className="grid md:grid-cols-[1.6fr_1fr_1fr] gap-6 md:gap-8 pt-8">
          {/* LEAD ARTICLE */}
          <article className="md:col-span-1">
            <div className="font-ui text-[10px] md:text-[11px] uppercase tracking-[0.25em] mb-3">
              LEAD STORY · Aug 04 · Sofia
            </div>
            <h2
              className="font-serif leading-[0.98] tracking-[-0.01em] mb-4"
              style={{ fontSize: "clamp(32px, 4.5vw, 64px)", fontWeight: 700 }}
            >
              Independent Sofia studio delivers 4.8× ROAS across 50 brands in Bulgaria and the United States
            </h2>
            <div className="italic text-sm md:text-base opacity-80 mb-5 pb-4 border-b border-black">
              A quiet growth practice on Rakovski Street has been busy building
              full-stack marketing machinery for the region's most ambitious
              brands. This weekend, they are opening applications for 2026.
            </div>
            <div
              className="text-[15px] leading-[1.65] columns-1 md:columns-2 gap-6"
              style={{ columnRule: "1px solid #0f0e0c33" }}
            >
              <p className="mb-4">
                <span
                  className="float-left text-[68px] leading-[0.85] mr-2 mt-1 font-serif"
                  style={{ fontWeight: 700 }}
                >
                  С
                </span>
                тудио VEKTO — независим growth practice със седалище в
                София, работещ с брандове в България и САЩ — обяви, че
                отваря дванадесет позиции за нови партньорства през
                кампанията MMXXVI. Историята на студиото започва през
                2024 г. в тиха стая на Ракoвски, но списъкът на клиенти
                вече включва Anomaly, Ethan's и Lucky Energy — имена,
                които обикновено попадат в друга ценова категория.
              </p>
              <p className="mb-4">
                „Работим като разширение на екипа на клиента", казва
                Николай, един от основателите, докато проверява отчет за
                платена реклама на своя лаптоп. „Не сме vendor. Сме
                позиция в портфолиото им." Среднният ROAS на техните
                активни кампании е 4.8×, а една от последните им
                интервенции — за MEN'S CARE — е довела до
                пет-цифрен ръст на месечния оборот.
              </p>
              <p className="mb-4">
                Услугите им са четири: реклами (Meta, Google, TikTok),
                съдържание (AI видео, живи снимки, продуктови визии),
                уебсайтове (от лендинг до пълен ecom) и стратегия
                (позициониране, offer, планиране). Всичко под един
                покрив. „Не мениджираме vendor-и вместо клиента", казва
                Мария, отговорна за продуктовите визуализации. „Един
                екип, един стандарт, един project manager."
              </p>
              <p className="mb-4">
                Партньорствата се приемат на квартална база. Резервацията
                за 2026 г. е ограничена до 12 нови бранда. Заявки се
                приемат на <em>vektoagency@gmail.com</em>. Личен преглед
                до двадесет и четири часа.
              </p>
              <p className="italic text-sm opacity-70 pt-2 border-t border-black/20">
                Продължение и портфолио — на страница A2. <em>See back page for the reel.</em>
              </p>
            </div>
          </article>

          {/* MIDDLE COLUMN — SIDEBAR STORIES */}
          <div className="md:col-span-1 md:border-l md:pl-8 border-black/40">
            <div className="pb-6 mb-6 border-b border-black/40">
              <div className="font-ui text-[10px] uppercase tracking-[0.25em] mb-2">
                THE ROSTER · A brief look
              </div>
              <h3
                className="font-serif leading-[1.04] tracking-tight mb-3"
                style={{ fontSize: "clamp(22px, 2.2vw, 32px)", fontWeight: 700 }}
              >
                From perfumeries to wearables: who Vekto works with.
              </h3>
              <p className="text-[13px] leading-[1.55]">
                A partial list, in the order they joined: MEN'S CARE,
                DUSQ, PARFEN, ISOSPORT, BIOTICA, BEMEACNE, KRISTA G,
                GIFTO, ADVENTURES BG, ALPEN PHARMA, NIDO, ARTE HOTEL,
                KASHMIR HOTEL, CARTEL CAFFE, PHYTOLIFE, GOURMET HOUSE,
                BULTEX, NEDELYA, DUSQ (US), NUTRIFITT, ANOMALY,
                LUCKY ENERGY, TASTE FLAVOR CO., ETHAN'S.
              </p>
            </div>

            <div className="pb-6 mb-6 border-b border-black/40">
              <div className="font-ui text-[10px] uppercase tracking-[0.25em] mb-2">
                METHODOLOGY · The four disciplines
              </div>
              <ol className="space-y-2 text-[13px] leading-[1.55]">
                <li>
                  <strong>I. Реклами</strong> — Управление на кампании в
                  Meta, Google и TikTok. Full-funnel attribution.
                </li>
                <li>
                  <strong>II. Съдържание</strong> — Видео (AI и живи
                  снимки), UGC, продуктови визии. Средно 40+ бранд-safe
                  creatives на месец за активни клиенти.
                </li>
                <li>
                  <strong>III. Уебсайтове</strong> — Лендинг страници,
                  корпоративни сайтове, ecom магазини, портали. Next.js,
                  Shopify, Webflow.
                </li>
                <li>
                  <strong>IV. Стратегия</strong> — Позициониране, offer
                  design, тримесечно планиране, fractional CMO.
                </li>
              </ol>
            </div>

            <div>
              <div className="font-ui text-[10px] uppercase tracking-[0.25em] mb-2">
                LATEST · Wire
              </div>
              <div className="space-y-3 text-[13px] leading-[1.55]">
                <div>
                  <strong>MEN'S CARE upgraded.</strong> Studio confirms 5.2× lift in monthly revenue for the beauty client. See A3.
                </div>
                <div>
                  <strong>New position: BULTEX.</strong> Workwear brand joins the roster this quarter. Second BG-only case since the summer.
                </div>
                <div>
                  <strong>US wire: DUSQ launch.</strong> Cinematic reel drives 1.2M reach in launch week. Details on A4.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — CLASSIFIED ADS */}
          <div className="md:col-span-1 md:border-l md:pl-8 border-black/40">
            <div className="font-ui text-[10px] uppercase tracking-[0.25em] mb-3">
              CLASSIFIEDS · A note to readers
            </div>

            <div className="border-2 border-black p-4 mb-5 text-center">
              <div className="font-ui text-[10px] uppercase tracking-[0.25em] mb-2">
                Wanted — Immediate
              </div>
              <div
                className="font-serif italic leading-[1.05] mb-2"
                style={{ fontSize: "clamp(20px, 1.8vw, 28px)", fontWeight: 700 }}
              >
                Twelve ambitious brands.
              </div>
              <p className="text-[12px] leading-tight mb-3 italic">
                Applicants should possess a live product, revenue in the
                six figures, and impatience for meaningful growth.
              </p>
              <a
                href="mailto:vektoagency@gmail.com"
                className="inline-block text-[11px] font-ui uppercase tracking-widest font-bold border-b-2 border-black hover:no-underline"
              >
                Apply within →
              </a>
            </div>

            <div className="border border-black p-3 mb-5">
              <div className="font-ui text-[9px] uppercase tracking-[0.3em] mb-1 opacity-70">
                Directory
              </div>
              <div className="text-[13px] leading-tight space-y-1.5">
                <div><strong>Correspondence:</strong> vektoagency@gmail.com</div>
                <div><strong>Voice:</strong> +359 88 225 1474</div>
                <div><strong>Bureau:</strong> Sofia, Bulgaria</div>
                <div><strong>Hours:</strong> Mon–Fri, 09:00–18:00 UTC+2</div>
              </div>
            </div>

            <div className="border border-black p-3 mb-5">
              <div className="font-ui text-[9px] uppercase tracking-[0.3em] mb-2 opacity-70">
                Read more
              </div>
              <div className="space-y-1.5 text-[13px]">
                <Link href="/case-studies" className="block hover:underline">→ Case studies (A2)</Link>
                <Link href="/portfolio" className="block hover:underline">→ Full showreel (A4)</Link>
                <Link href="/ai-creative" className="block hover:underline">→ AI creative dept. (B1)</Link>
                <Link href="/websites" className="block hover:underline">→ Web bureau (B2)</Link>
              </div>
            </div>

            <div className="text-center italic text-[11px] leading-tight opacity-60 pt-3 border-t border-black/40">
              <em>"Growth partner" is a job description. </em>
              <br />
              <em>Not a marketing slogan.</em>
            </div>
          </div>
        </div>

        {/* ===== BELOW-FOLD RULE ===== */}
        <div className="mt-10 pt-4 border-t-2 border-black">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] font-ui">
            <span>© VEKTO Chronicle · 2026</span>
            <span className="hidden md:inline italic normal-case tracking-normal font-serif text-sm">All positions are proprietary. No re-sale.</span>
            <span>vektoagency.com</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-serif { font-family: var(--font-news-serif), 'Times New Roman', serif; }
        .font-ui { font-family: var(--font-news-sans), system-ui, sans-serif; }
      `}</style>
    </div>
  );
}
