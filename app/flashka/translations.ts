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
      eyebrow: "VEKTO · ЗА 5-ТЕ НОВИ БРАНДА В БГ",
      h1Top: "Кодът е в",
      h1Bottom: "30+ успешни бранда.",
      sub: "Цялата ни оперативна система — на тази флашка. Прилагаме я с 30+ бранда в БГ и САЩ. Сега я отваряме за нови 5 бизнеса.",
      ctaPrimary: "Кандидатствай →",
      ctaMicro: "60 секунди · кандидатстване · отговор до 24ч",
      home: "← Към сайта",
      langToggle: "EN",
    },

    frame: {
      eyebrow: "ВАЖНО",
      h2: "Това е нашата оперативна система.",
      h2Highlight: "Структурата на работата, която работи.",
      body: "Прилагаме я с 30+ клиента в БГ и САЩ. Когато станеш такъв, екипът ни я пуска в твоя бизнес.",
    },

    inside: {
      eyebrow: "КАКВО Е ВЪТРЕ",
      h2: "4 модула. 1 система.",
      h2Highlight: "Същата, с която работим.",
      items: [
        {
          number: "01",
          title: "Funnel framework",
          body: "Точният поток ad → лендинг → продажба. С benchmarks за всяка стъпка. Прилагаме го с всеки клиент.",
        },
        {
          number: "02",
          title: "AI creative engine",
          body: "Pipeline за 30+ видео реклами месечно. Без агенция fee, без 6 седмици чакане.",
        },
        {
          number: "03",
          title: "Scaling matrix",
          body: "Стъпките от $1K → $10K → $100K дневен ad бюджет. Кога да дублираш, кога да убиеш кампания.",
        },
        {
          number: "04",
          title: "Conversion stack",
          body: "Целият tech и copy stack: ad platforms, лендинг шаблони, retention механизми за повторни продажби.",
        },
      ],
    },

    proof: {
      eyebrow: "ДОКАЗАНО",
      h2: "30+ бранда я ползват.",
      h2Highlight: "БГ и САЩ. Реални числа.",
      items: [
        { value: 30, suffix: "+", decimals: 0, label: "Бранда я ползват в БГ и САЩ" },
        { value: 10, suffix: "M+", decimals: 0, label: "$ генериран оборот общо" },
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
        "Отворен си за външна стратегия и бърза итерация.",
      ],
      noTitle: "Не е за теб ако:",
      noItems: [
        "Тепърва стартираш и нямаш активен бизнес.",
        "Очакваш гарантиран резултат без работа от твоя страна.",
        "Търсиш единично PDF / курс без external екип.",
        "Не си готов за месечен ангажимент.",
      ],
    },

    formSection: {
      eyebrow: "КАНДИДАТСТВАЙ",
      h2: "60 секунди.",
      h2Highlight: "Отговор до 24 часа.",
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
      eyebrow: "ВРЕМЕ ЗА РЕШЕНИЕ",
      h2: "Една анкета.",
      h2Highlight: "Едно решение.",
      sub: "60 секунди. До 24 часа имаш отговор — да или не, без хитрости.",
      scrollToForm: "Кандидатствай →",
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
      eyebrow: "VEKTO · FOR THE NEXT 5 BRANDS IN BG",
      h1Top: "The code is in",
      h1Bottom: "30+ successful brands.",
      sub: "Our entire operating system — on this flash drive. We apply it with 30+ brands in BG and US. Now opening it for 5 new businesses.",
      ctaPrimary: "Apply →",
      ctaMicro: "60 seconds · application · reply within 24h",
      home: "← Back to site",
      langToggle: "БГ",
    },

    frame: {
      eyebrow: "IMPORTANT",
      h2: "This is our operating system.",
      h2Highlight: "The work structure that works.",
      body: "We apply it with 30+ clients in BG and US. When you become one, our team puts it in your business.",
    },

    inside: {
      eyebrow: "WHAT'S INSIDE",
      h2: "4 modules. 1 system.",
      h2Highlight: "The one we run with every client.",
      items: [
        {
          number: "01",
          title: "Funnel framework",
          body: "The exact ad → landing → sale flow. With benchmarks at every step. Applied with every client.",
        },
        {
          number: "02",
          title: "AI creative engine",
          body: "Pipeline for 30+ video ads per month. No agency fee, no 6-week wait.",
        },
        {
          number: "03",
          title: "Scaling matrix",
          body: "Steps from $1K → $10K → $100K daily ad budget. When to duplicate, when to kill a campaign.",
        },
        {
          number: "04",
          title: "Conversion stack",
          body: "Full tech and copy stack: ad platforms, landing templates, retention systems for repeat sales.",
        },
      ],
    },

    proof: {
      eyebrow: "PROVEN",
      h2: "30+ brands use it.",
      h2Highlight: "BG and US. Real numbers.",
      items: [
        { value: 30, suffix: "+", decimals: 0, label: "Brands using it in BG and US" },
        { value: 10, suffix: "M+", decimals: 0, label: "$ total revenue generated" },
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
        "Open to outside strategy and fast iteration.",
      ],
      noTitle: "Not for you if:",
      noItems: [
        "Just starting and don't have an active business.",
        "Expect guaranteed results without your own work.",
        "Looking for a standalone PDF / course without an external team.",
        "Not ready for a monthly engagement.",
      ],
    },

    formSection: {
      eyebrow: "APPLY",
      h2: "60 seconds.",
      h2Highlight: "Reply within 24 hours.",
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
      eyebrow: "TIME TO DECIDE",
      h2: "One application.",
      h2Highlight: "One decision.",
      sub: "60 seconds. Within 24 hours you have an answer — yes or no, no tricks.",
      scrollToForm: "Apply →",
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
