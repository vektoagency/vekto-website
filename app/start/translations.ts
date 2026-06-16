// Conversion-optimized bilingual copy for the /start landing page —
// brutal benefit-driven headlines, social proof, objection handling,
// animated stats, comparison table, FAQ, sticky mobile CTA.
// Designed to convert cold Meta paid traffic at 6-10%+ rate.

export type Lang = "bg" | "en";

export const startCopy = {
  bg: {
    meta: {
      eyebrow: "VEKTO · 60-СЕКУНДНА АНКЕТА",
      h1Top: "Не всеки бранд расте.",
      h1Bottom: "Тези с посока — да.",
      sub: "Стратегия • Креатив • Видео • Реклами • Social media — пълен маркетинг екип за бранда ти.",
      trustBadges: [
        "30+ доволни бранда",
        "4.8× средно ROAS",
        "Без ангажимент",
      ],
      ctaMicro: "60 секунди · безплатно · лична оферта до 24ч",
      langToggle: "EN",
      home: "← Към сайта",
    },
    socialProof: {
      heading: "Бизнеси, които вече ни се довериха",
    },
    formSection: {
      eyebrow: "ПОПЪЛНИ АНКЕТАТА",
      h2: "Получи персонализирана оферта",
      h2Highlight: "до 24ч.",
      sub: "60 секунди за попълване. Безплатно. Без последици — само ясен план за бизнеса ти.",
      submitMicro: "✓ Отговор до 24ч    ✓ Без ангажимент    ✓ 100% безплатно",
    },
    fields: {
      name: "Име",
      namePh: "Иван Иванов",
      email: "Email",
      emailPh: "ivan@biznes.bg",
      brand: "Бранд / уебсайт",
      brandPh: "https://...",
      phone: "Телефон / WhatsApp (по избор)",
      phonePh: "+359 ...",
      message: "Какво искаш да постигнем заедно? (по избор)",
      messagePh: "Опиши накратко бизнеса си + целите. Колкото повече детайли — толкова по-точна офертата.",
      contentType: "Какво съдържание ти трябва",
      contentTypeOptions: [
        { id: "cinematic", label: "Брандови видеа / филми" },
        { id: "ugc", label: "UGC / Short-form" },
        { id: "ads", label: "Управление на реклами" },
        { id: "social", label: "Social media management" },
        { id: "product", label: "Продуктови визуализации" },
        { id: "unsure", label: "Не съм сигурен — препоръчайте" },
      ],
      budget: "Месечен бюджет",
      budgetSuffix: "€ / месец",
      budgetMaxLabel: "10 000 €+",
    },
    cta: {
      submit: "Получи оферта →",
      submitting: "Изпраща се…",
      orBook: "Или ако предпочиташ — поговори с нас директно:",
      bookCta: "Резервирай разговор",
      callCta: "Обади се",
    },
    process: {
      eyebrow: "КАК РАБОТИ",
      h2: "От идея до готови видеа",
      h2Highlight: "за 5 дни",
      steps: [
        {
          number: "01",
          title: "Анкета за 60 секунди",
          body: "Кажи ни за бизнеса и бюджета си. Колкото повече детайли — толкова по-точна офертата.",
        },
        {
          number: "02",
          title: "Персонална оферта за 24ч",
          body: "Преглеждаме всичко лично. Получаваш план, цени, deliverables, timeline — без вода.",
        },
        {
          number: "03",
          title: "Първи материали за 5 дни",
          body: "Готово съдържание за публикуване. Не седмици. Не месеци.",
        },
      ],
    },
    stats: {
      eyebrow: "ЦИФРИТЕ ГОВОРЯТ",
      h2: "Защо",
      h2Highlight: "30+ бранда избраха VEKTO",
      items: [
        { value: 30, suffix: "+", decimals: 0, label: "Доволни бранда в портфолиото" },
        { value: 1000, suffix: "+", decimals: 0, label: "Доставени проекта в портфолиото" },
        { value: 4.8, suffix: "×", decimals: 1, label: "Средно ROAS от наши проекти" },
        { value: 6, suffix: "×", decimals: 0, label: "По-бързо от традиционните агенции" },
      ],
    },
    compare: {
      eyebrow: "СРАВНЕНИЕ",
      h2: "Защо не",
      h2Highlight: "стандартна агенция?",
      headers: ["Параметър", "VEKTO", "Агенция", "In-house"],
      rows: [
        ["Време за първа доставка", "3-5 дни", "3-4 седмици", "1-2 седмици"],
        ["Тествани формати на месец", "30+ варианта", "3-5 варианта", "5-10 варианта"],
        ["Скалиране на winning формат", "За 24-48ч", "За седмици", "За дни"],
        ["AI обработка", "✓", "✗", "✗"],
        ["Многоезичност", "✓", "Доплащане", "Рядко"],
        ["Достъпност", "24/7", "Работно време", "Работно време"],
      ],
    },
    faq: {
      eyebrow: "ЧЕСТО ЗАДАВАНИ ВЪПРОСИ",
      h2: "Преди да решиш —",
      h2Highlight: "почти всеки питa това",
      items: [
        {
          q: "Защо е толкова евтино за това качество?",
          a: "AI намалява разходите за продукция с 60-70%. Не плащаш за студио, екип, седмици пред-продукция. Плащаш за резултат — готови видеа, готови за публикуване.",
        },
        {
          q: "Какво се случва ако не съм доволен?",
          a: "Включени са 2 кръга безплатни редакции. Ако след тях още не сме на едно ниво — възстановяваме неизползваната част от месечния fee. Без споразумения за минимален срок.",
        },
        {
          q: "Има ли минимален договор / срок?",
          a: "Не. Можеш да pause-неш или прекратиш по всяко време с 15-дневно предизвестие. Без 12-месечни ангажименти като агенциите.",
        },
        {
          q: "Какво се случва веднага след като попълня?",
          a: "Преглеждаме брифа ти лично (не AI чат-бот) до 24 часа. Получаваш персонална оферта по email — точни цени, deliverables, timeline. От там решаваш сам.",
        },
        {
          q: "Работите ли с бизнеси извън България?",
          a: "Да. Активно работим с брандове в САЩ (Anomaly, Ethan's, Nutrifitt, DUSQ) и Европа. Многоезично съдържание — без доплащане.",
        },
        {
          q: "Какво ако имам in-house маркетинг екип?",
          a: "Перфектно — функционираме като production extension. Те носят стратегията и creative direction; ние доставяме видеата за дни вместо седмици.",
        },
      ],
    },
    finalCta: {
      eyebrow: "ВРЕМЕ Е",
      h2: "Бранд, който се отличава —",
      h2Highlight: "бизнес, който расте.",
      sub: "Видео, реклами, social и стратегия. Всичко за големия резултат.",
      scrollToForm: "Попълни анкетата →",
      orBook: "Или резервирай разговор",
    },
    stickyMobile: {
      label: "Започни",
      cta: "Попълни анкетата →",
    },
    success: {
      title: "Брифът е получен.",
      body: "Благодарим, че отдели време. Преглеждаме всичко лично и пишем на имейла до 24 часа. Междувременно — можеш да резервираш 30-минутен разговор:",
      bookCta: "Резервирай среща",
      backHome: "← Към сайта",
    },
    error: {
      generic: "Нещо се обърка. Опитай пак или ни пиши на vekto.agency.bg@gmail.com",
      requiredEmail: "Имейлът е задължителен.",
    },
  },
  en: {
    meta: {
      eyebrow: "VEKTO · 60-SECOND SURVEY",
      h1Top: "Not every brand grows.",
      h1Bottom: "Those with direction do.",
      sub: "Strategy • Creative • Video • Ads • Social media — a full marketing team for your brand.",
      trustBadges: [
        "30+ happy brands",
        "4.8× average ROAS",
        "No commitment",
      ],
      ctaMicro: "60 seconds · free · personal proposal within 24h",
      langToggle: "БГ",
      home: "← Back to site",
    },
    socialProof: {
      heading: "Brands that already trust us",
    },
    formSection: {
      eyebrow: "FILL THE SURVEY",
      h2: "Get a personalized proposal",
      h2Highlight: "within 24h.",
      sub: "60 seconds to fill. Free. No strings — just a clear plan for your business.",
      submitMicro: "✓ Reply within 24h    ✓ No commitment    ✓ 100% free",
    },
    fields: {
      name: "Name",
      namePh: "John Smith",
      email: "Email",
      emailPh: "you@brand.com",
      brand: "Brand / website",
      brandPh: "https://...",
      phone: "Phone / WhatsApp (optional)",
      phonePh: "+1 ...",
      message: "What do you want to achieve? (optional)",
      messagePh: "Briefly describe your business + goals. The more details — the more accurate the proposal.",
      contentType: "What content do you need",
      contentTypeOptions: [
        { id: "cinematic", label: "Brand videos / films" },
        { id: "ugc", label: "UGC / Short-form" },
        { id: "ads", label: "Paid ads management" },
        { id: "social", label: "Social media management" },
        { id: "product", label: "Product visuals" },
        { id: "unsure", label: "Not sure — recommend" },
      ],
      budget: "Monthly budget",
      budgetSuffix: "€ / month",
      budgetMaxLabel: "€10,000+",
    },
    cta: {
      submit: "Get my proposal →",
      submitting: "Sending…",
      orBook: "Or if you prefer — talk to us directly:",
      bookCta: "Book a Call",
      callCta: "Call now",
    },
    process: {
      eyebrow: "HOW IT WORKS",
      h2: "From idea to delivered videos",
      h2Highlight: "in 5 days",
      steps: [
        {
          number: "01",
          title: "60-second brief",
          body: "Tell us about your business and budget. The more details — the more accurate the proposal.",
        },
        {
          number: "02",
          title: "Personal proposal in 24h",
          body: "We review everything personally. You get a plan, pricing, deliverables, timeline — no fluff.",
        },
        {
          number: "03",
          title: "First deliverables in 5 days",
          body: "Ready-to-publish content. Not weeks. Not months.",
        },
      ],
    },
    stats: {
      eyebrow: "THE NUMBERS",
      h2: "Why",
      h2Highlight: "30+ brands chose VEKTO",
      items: [
        { value: 30, suffix: "+", decimals: 0, label: "Happy brands in our portfolio" },
        { value: 1000, suffix: "+", decimals: 0, label: "Delivered projects in our portfolio" },
        { value: 4.8, suffix: "×", decimals: 1, label: "Average ROAS across our projects" },
        { value: 6, suffix: "×", decimals: 0, label: "Faster than traditional agencies" },
      ],
    },
    compare: {
      eyebrow: "COMPARISON",
      h2: "Why not",
      h2Highlight: "a traditional agency?",
      headers: ["Aspect", "VEKTO", "Agency", "In-house"],
      rows: [
        ["First-delivery time", "3-5 days", "3-4 weeks", "1-2 weeks"],
        ["Formats tested per month", "30+ variants", "3-5 variants", "5-10 variants"],
        ["Scaling a winning format", "In 24-48h", "In weeks", "In days"],
        ["AI processing", "✓", "✗", "✗"],
        ["Multilingual", "✓", "Extra cost", "Rarely"],
        ["Availability", "24/7", "Business hours", "Business hours"],
      ],
    },
    faq: {
      eyebrow: "FREQUENTLY ASKED",
      h2: "Before you decide —",
      h2Highlight: "almost everyone asks this",
      items: [
        {
          q: "Why is it so cheap for this quality?",
          a: "AI cuts production cost 60-70%. You don't pay for studio, crew, weeks of pre-production. You pay for result — ready-to-publish videos.",
        },
        {
          q: "What if I'm not happy?",
          a: "Includes 2 rounds of free revisions. If after that we're still not aligned — we refund the unused portion of the monthly fee. No minimum-term lock-ins.",
        },
        {
          q: "Is there a minimum contract?",
          a: "No. You can pause or cancel anytime with 15 days notice. No 12-month commitments like agencies require.",
        },
        {
          q: "What happens right after I submit?",
          a: "We review your brief personally (not an AI chat-bot) within 24 hours. You get a personalized proposal by email — exact prices, deliverables, timeline. You decide from there.",
        },
        {
          q: "Do you work with businesses outside Bulgaria?",
          a: "Yes. Actively working with brands in the US (Anomaly, Ethan's, Nutrifitt, DUSQ) and Europe. Multilingual content — no extra fee.",
        },
        {
          q: "What if I have an in-house marketing team?",
          a: "Perfect — we function as a production extension. They handle strategy and creative direction; we deliver videos in days instead of weeks.",
        },
      ],
    },
    finalCta: {
      eyebrow: "IT'S TIME",
      h2: "A brand that stands out —",
      h2Highlight: "a business that grows.",
      sub: "Video, ads, social, and strategy. Everything for real growth.",
      scrollToForm: "Fill the survey →",
      orBook: "Or book a call",
    },
    stickyMobile: {
      label: "Start",
      cta: "Fill the brief →",
    },
    success: {
      title: "Brief received.",
      body: "Thanks for taking the time. We review everything personally and email you within 24 hours. Meanwhile — book a 30-minute call:",
      bookCta: "Book a Meeting",
      backHome: "← Back to site",
    },
    error: {
      generic: "Something went wrong. Try again or email vekto.agency.bg@gmail.com",
      requiredEmail: "Email is required.",
    },
  },
} as const;
