// Direct-response copy for /flashka — paid-traffic LP for the
// 'векто адс' campaign. The флашка is the metaphor for VEKTO's
// internal operating system: the strategy + AI tools + frameworks
// they actually apply with every client. The LP doesn't sell a
// download — it sells AGENCY ACCESS. Applying = becoming a client
// for whom they execute the system on a 90-day engagement.
//
// Bilingual (BG/EN). The campaign is BG-targeted by default but the
// header carries a language toggle so EN visitors get a coherent
// fallback. Structure mirrors /start's translations.ts so both LPs
// stay symmetrical for future iteration.

export type Lang = "bg" | "en";

export const flashkaCopy = {
  bg: {
    meta: {
      eyebrow: "VEKTO · 5 СПОТА · ВЕЧЕ В БЪЛГАРИЯ",
      h1Top: "Кодът е в",
      h1Bottom: "30+ успешни бранда.",
      sub: "Цялата ни оперативна система — на тази флашка. Прилагаме я с 30+ бранда в БГ и САЩ. Сега я отваряме за нови 5 бизнеса.",
      ctaPrimary: "Кандидатствай",
      ctaMicroItems: ["60 секунди", "безплатно", "отговор до 24ч"] as const,
      home: "← Към сайта",
      langToggle: "EN",
    },

    clients: {
      eyebrow: "С НАС РАБОТЯТ",
      sub: "30+ бранда в България и САЩ. Видео, реклами, scaling.",
    },

    about: {
      eyebrow: "ЗАД ВСИЧКО",
      h2: "За VEKTO.",
      h2Highlight: "За флашката.",
      vektoLabel: "АГЕНЦИЯТА",
      vektoBody: "VEKTO е маркетинг агенция от ново поколение. Работим с 30+ бранда в БГ и САЩ — стартъпи, e-commerce, услуги. Видео, реклами, scaling, цяла маркетинг система под един покрив.",
      driveLabel: "ФЛАШКАТА",
      driveBody: "Метафора за нашата вътрешна оперативна система. Конкретна структура от framework-и, AI инструменти, ad templates и scaling протоколи. Прилагаме я с всеки клиент. Сега я отваряме за нови 5.",
    },

    inside: {
      eyebrow: "КАКВО Е ВЪТРЕ",
      h2: "4 модула. 1 система.",
      h2Highlight: "Същата, с която работим.",
      items: [
        {
          number: "01",
          title: "Funnel framework",
          body: "Точният път от реклама до продажба. Прилагаме го с всеки клиент.",
        },
        {
          number: "02",
          title: "AI creative engine",
          body: "Производство на видеа в мащаб — без агенция fee и месеци чакане.",
        },
        {
          number: "03",
          title: "Scaling matrix",
          body: "Точните стъпки за scaling — от тест до пълно разгръщане.",
        },
        {
          number: "04",
          title: "Conversion stack",
          body: "Целият tech и copy stack, който ползваме във всеки проект.",
        },
      ],
    },

    proof: {
      eyebrow: "ДОКАЗАНО",
      h2: "30+ бранда я ползват.",
      h2Highlight: "БГ и САЩ. Реални числа.",
      items: [
        { value: 30, suffix: "+", decimals: 0, label: "Бранда я ползват в БГ и САЩ" },
        { value: 3, suffix: "M+", decimals: 0, label: "$ генериран оборот за различни брандове" },
        { value: 4.8, suffix: "×", decimals: 1, label: "Среден ROAS от наши кампании" },
        { value: 5, suffix: "", decimals: 0, label: "Свободни спота за нови бизнеси" },
      ],
    },

    qualify: {
      eyebrow: "ЗА КОГО",
      h2: "Работим заедно",
      h2Highlight: "ако...",
      yesTitle: "Подходящ си ако:",
      yesItems: [
        "Имаш активен бизнес — ecom, услуги или info-продукт.",
        "Готов си за 90-дневен ангажимент с конкретни цели.",
        "Целта ти е scaling, не proof-of-concept.",
        "Отворен си за външна стратегия и експерти.",
      ],
      noTitle: "Не е за теб ако:",
      noItems: [
        "Тепърва стартираш и нямаш активен бизнес.",
        "Търсиш изпълнител, не партньор за растеж.",
        "Търсиш единично PDF / курс без external екип.",
        "Не си готов за месечен ангажимент.",
      ],
    },

    formSection: {
      eyebrow: "КАНДИДАТСТВАЙ",
      h2: "Отговор",
      h2Highlight: "до 24 часа.",
      sub: "Преглеждаме всяка кандидатура лично. Пишем ти само ако има match.",
      submitMicro: "✓ Безплатна кандидатура   ✓ Отговор до 24ч   ✓ Без ангажимент",
    },

    fields: {
      name: "Име",
      namePh: "Иван Иванов",
      email: "Email",
      emailPh: "ivan@biznes.bg",
      brand: "Бизнес / уебсайт",
      brandPh: "https://...",
    },

    cta: {
      submit: "Кандидатствай →",
      submitting: "Изпращаме…",
      orBook: "Или директно с екипа:",
      bookCta: "Резервирай разговор",
      callCta: "Обади се",
    },

    faq: {
      eyebrow: "ВЪПРОСИ",
      h2: "Преди да кандидатстваш —",
      h2Highlight: "почти всеки пита това.",
      items: [
        {
          q: "Защо ограничавате до 5 нови бранда?",
          a: "Защото onboarding-ът на нов клиент изисква 90-минутна сесия + 30 дни наблюдение от старши член на екипа. На 6-ти бранд качеството пада. Предпочитаме 5 с резултат пред 15 със среден.",
        },
        {
          q: "Какво се случва ако кандидатствам?",
          a: "До 24 часа получаваш отговор: одобрен с покана за discovery call, или 'не сега' с конкретни препоръки. Без upsell, без 'имаме друг продукт за €X'.",
        },
        {
          q: "Колко струва?",
          a: "Цената зависи от мащаба и нишата. Обсъждаме я само с одобрените кандидати на discovery call-а. По принцип системата се отплаща за 30-45 дни от ROAS подобрението.",
        },
        {
          q: "Защо точно флашка?",
          a: "Метафора за нашата цялостна оперативна система — framework, AI tools, ad templates, scaling протоколи. Прилагаме я с теб 90 дни. При сериозни клиенти физическата флашка е и литерален носител на цялата документация.",
        },
        {
          q: "Какво ако вече имаме маркетинг екип?",
          a: "Перфектно — често работим заедно с in-house teams. Те носят brand context, ние носим execution framework. Plug-in extension, не replacement.",
        },
        {
          q: "Колко време работим заедно?",
          a: "Минимум 90-дневен ангажимент за измерими резултати. След това — продължение на месечна база. Без 12-месечни договори като големите агенции.",
        },
      ],
    },

    finalCta: {
      eyebrow: "СПОТОВЕТЕ СВЪРШВАТ",
      h2: "Следващият бранд с 4.8× ROAS",
      h2Highlight: "може да е вашият.",
      sub: "Остават 5 спота. Една анкета. До 24 часа имаш отговор — да или не.",
      scrollToForm: "Кандидатствай сега →",
      orBook: "Или резервирай разговор",
    },

    stickyMobile: {
      cta: "Кандидатствай →",
    },

    success: {
      title: "Кандидатурата е получена.",
      body: "Преглеждаме всичко лично — не автомат. Пишем ти на имейла до 24 часа: одобрен с next steps, или 'не сега' с препоръки. Междувременно можеш да резервираш разговор:",
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
      eyebrow: "VEKTO · 5 SPOTS · NOW IN BULGARIA",
      h1Top: "The code is in",
      h1Bottom: "30+ successful brands.",
      sub: "Our entire operating system — on this flash drive. We apply it with 30+ brands in BG and US. Now opening it for 5 new businesses.",
      ctaPrimary: "Apply",
      ctaMicroItems: ["60 seconds", "free", "reply within 24h"] as const,
      home: "← Back to site",
      langToggle: "БГ",
    },

    clients: {
      eyebrow: "WORKING WITH US",
      sub: "30+ brands across BG and US. Video, ads, scaling.",
    },

    about: {
      eyebrow: "BEHIND IT ALL",
      h2: "About VEKTO.",
      h2Highlight: "About the drive.",
      vektoLabel: "THE AGENCY",
      vektoBody: "VEKTO is a next-gen marketing agency. We work with 30+ brands in BG and US — startups, e-commerce, services. Video, ads, scaling, the full marketing system under one roof.",
      driveLabel: "THE DRIVE",
      driveBody: "The metaphor for our internal operating system. A concrete structure of frameworks, AI tools, ad templates, and scaling protocols. We apply it with every client. Opening it for 5 new ones now.",
    },

    inside: {
      eyebrow: "WHAT'S INSIDE",
      h2: "4 modules. 1 system.",
      h2Highlight: "The one we run with every client.",
      items: [
        {
          number: "01",
          title: "Funnel framework",
          body: "The exact path from ad to sale. Applied with every client.",
        },
        {
          number: "02",
          title: "AI creative engine",
          body: "Video production at scale — no agency fee, no months of waiting.",
        },
        {
          number: "03",
          title: "Scaling matrix",
          body: "The exact steps for scaling — from test to full rollout.",
        },
        {
          number: "04",
          title: "Conversion stack",
          body: "The full tech and copy stack we use on every project.",
        },
      ],
    },

    proof: {
      eyebrow: "PROVEN",
      h2: "30+ brands use it.",
      h2Highlight: "BG and US. Real numbers.",
      items: [
        { value: 30, suffix: "+", decimals: 0, label: "Brands using it in BG and US" },
        { value: 3, suffix: "M+", decimals: 0, label: "$ revenue generated across brands" },
        { value: 4.8, suffix: "×", decimals: 1, label: "Average ROAS on our campaigns" },
        { value: 5, suffix: "", decimals: 0, label: "Spots open for new businesses" },
      ],
    },

    qualify: {
      eyebrow: "FOR WHOM",
      h2: "We work together",
      h2Highlight: "if...",
      yesTitle: "You're a fit if:",
      yesItems: [
        "You have an active business — ecom, services, or info-product.",
        "Ready for a 90-day engagement with concrete goals.",
        "Your goal is scaling, not proof-of-concept.",
        "Open to outside strategy and outside expertise.",
      ],
      noTitle: "Not for you if:",
      noItems: [
        "Just starting and don't have an active business.",
        "Looking for a contractor, not a partner for growth.",
        "Looking for a standalone PDF / course without an external team.",
        "Not ready for a monthly engagement.",
      ],
    },

    formSection: {
      eyebrow: "APPLY",
      h2: "Reply",
      h2Highlight: "within 24 hours.",
      sub: "We review every application personally. We only write back if there's a fit.",
      submitMicro: "✓ Free application   ✓ Reply within 24h   ✓ No commitment",
    },

    fields: {
      name: "Name",
      namePh: "John Smith",
      email: "Email",
      emailPh: "john@business.com",
      brand: "Business / website",
      brandPh: "https://...",
    },

    cta: {
      submit: "Apply →",
      submitting: "Sending…",
      orBook: "Or directly with the team:",
      bookCta: "Book a call",
      callCta: "Call us",
    },

    faq: {
      eyebrow: "QUESTIONS",
      h2: "Before you apply —",
      h2Highlight: "almost everyone asks this.",
      items: [
        {
          q: "Why limit to 5 new brands?",
          a: "Because onboarding a new client requires a 90-minute session + 30 days of monitoring by a senior team member. At brand #6 quality drops. We'd rather have 5 with results than 15 mediocre.",
        },
        {
          q: "What happens if I apply?",
          a: "Within 24 hours you get an answer: approved with an invitation to a discovery call, or 'not now' with concrete recommendations. No upsell, no 'we have another product for €X'.",
        },
        {
          q: "How much does it cost?",
          a: "The price depends on scale and niche. We discuss it only with approved candidates on the discovery call. As a rule, the system pays for itself in 30-45 days via ROAS improvement.",
        },
        {
          q: "Why a USB drive specifically?",
          a: "Metaphor for our complete operating system — framework, AI tools, ad templates, scaling protocols. We run it with you for 90 days. For serious clients the physical drive is also a literal carrier of the full documentation.",
        },
        {
          q: "What if we already have a marketing team?",
          a: "Perfect — we often work alongside in-house teams. They bring brand context, we bring the execution framework. Plug-in extension, not replacement.",
        },
        {
          q: "How long do we work together?",
          a: "Minimum 90-day engagement for measurable results. After that — month-to-month continuation. No 12-month contracts like big agencies.",
        },
      ],
    },

    finalCta: {
      eyebrow: "SPOTS ARE FILLING",
      h2: "The next brand with 4.8× ROAS",
      h2Highlight: "could be you.",
      sub: "5 spots left. One application. Within 24 hours you have an answer — yes or no.",
      scrollToForm: "Apply now →",
      orBook: "Or book a call",
    },

    stickyMobile: {
      cta: "Apply →",
    },

    success: {
      title: "Application received.",
      body: "We review everything personally — not an automated system. We'll email you within 24 hours: approved with next steps, or 'not now' with recommendations. Meanwhile you can book a call:",
      bookCta: "Book a meeting",
      backHome: "← Back to site",
    },

    error: {
      generic: "Something went wrong. Try again or email vekto.agency.bg@gmail.com",
      requiredEmail: "Email is required.",
    },
  },
} as const;
