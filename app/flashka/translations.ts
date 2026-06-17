// Direct-response copy for /flashka — the dedicated landing for
// Meta paid traffic coming from the 'векто адс' campaign. The ads
// stack a single promise: '$1M revenue from one export file on a
// USB stick, system tested with 30+ brands in US, now in Bulgaria,
// first 5 spots'. The LP has to match that promise in 3 seconds and
// then walk the reader from curiosity -> mechanism -> proof -> apply.

export const flashkaCopy = {
  meta: {
    eyebrow: "VEKTO · САМО ЗА ПЪРВИТЕ 5 БРАНДА В БГ",
    h1Top: "На тази флашка е кодът зад",
    h1Bottom: "$1 000 000 оборот.",
    sub: "Системата работи в САЩ с 30+ бранда. Сега я носим в България — за 5-те, които са готови да я ползват.",
    ctaPrimary: "Кандидатствай за флашката",
    ctaMicro: "60 секунди · кандидатстване · отговор до 24ч",
    home: "← Към сайта",
  },

  // Pattern interrupt — sets the frame that this isn't a course/agency
  // pitch but a system-access offer. Removes objections like 'is this
  // another guru pitch?' before the reader builds them.
  frame: {
    eyebrow: "ВАЖНО",
    h2: "Това не е курс.",
    h2Highlight: "Не е оферта. Това е system access.",
    body:
      "Получаваш конкретна флашка с export файл — точната структура, по която 30+ бранда в БГ и САЩ растат от $0 до $1M+ оборот. Не е PDF за четене. Не е video курс за гледане. Това е plug-and-play система за изпълнение.",
  },

  // The reveal — what's actually on the flash drive. Concrete bulleted
  // list anchors the abstract promise to deliverables. 5 items because
  // 5 spots → reinforces the scarcity beat.
  inside: {
    eyebrow: "КАКВО ИМА НА ФЛАШКАТА",
    h2: "5 файла. 1 система.",
    h2Highlight: "Над $30M доказан оборот.",
    items: [
      {
        number: "01",
        title: "Funnel blueprint",
        body: "Точният поток: ad → landing → checkout. Кое работи, кое не, на кой етап хората отпадат и как да го коригираш за 24ч.",
      },
      {
        number: "02",
        title: "AI creative engine",
        body: "Нашата AI pipeline за 30+ видео реклами на месец. Без агенция fee, без 6 седмици чакане. Скрипт, видео, монтаж — за 5 дни.",
      },
      {
        number: "03",
        title: "Scaling matrix",
        body: "Точните стъпки от $1K → $10K → $100K дневен ad бюджет. Кога да дублираш кампания, кога да я убиеш, кога да чакаш.",
      },
      {
        number: "04",
        title: "Conversion stack",
        body: "Реклама, лендинг, email, retention — целият tech и copy stack, който качи 30+ бранда над $1M годишно.",
      },
      {
        number: "05",
        title: "Лична консултация",
        body: "90 минути 1-на-1 с топ член от екипа. Преглеждаме твоя бизнес, оптимизираме системата за твоята ниша. Лично, не имейл.",
      },
    ],
  },

  // Proof block — 4 stat counters. ROAS + revenue numbers hit hardest
  // for direct-response readers; brands+spots reinforce specificity.
  proof: {
    eyebrow: "ДОКАЗАНО",
    h2: "30+ бранда вече я ползват.",
    h2Highlight: "САЩ от 4 години. БГ — от сега.",
    items: [
      { value: 30, suffix: "+", decimals: 0, label: "Бранда я ползват в БГ + САЩ" },
      { value: 1, suffix: "M+", decimals: 0, label: "$ среден оборот на бранд" },
      { value: 4.8, suffix: "×", decimals: 1, label: "Среден ROAS от наши кампании" },
      { value: 5, suffix: "", decimals: 0, label: "Свободни спота за България" },
    ],
  },

  // Qualification — two columns. The 'who it's for' list speaks to the
  // ideal reader directly ('това си ти'); the 'NOT for' kills tire-
  // kickers before they fill the form and lifts the perceived value.
  qualify: {
    eyebrow: "ЗА КОГО",
    h2: "Системата работи",
    h2Highlight: "ако...",
    yesTitle: "Подходящ си ако:",
    yesItems: [
      "Имаш активен ecom, info-продукт или service бизнес.",
      "Месечен ad бюджет поне €1,000 (или си готов да го отделиш).",
      "Целта ти е scaling, не proof-of-concept или 'дали ще проработи'.",
      "Готов си да изпълниш конкретен план за 60 дни — без отлагане.",
    ],
    noTitle: "Не е за теб ако:",
    noItems: [
      "Тепърва стартираш и нямаш активен бизнес.",
      "Търсиш бърза печалба без планомерна работа.",
      "Не си отворен за външна стратегия или промяна в подхода.",
      "Чакаш 'някой друг' да направи всичко вместо теб.",
    ],
  },

  // The form — same fields as /start but reframed as an 'application'.
  // 'Кандидатствай' verb chosen deliberately (matches the ad CTA + the
  // qualification frame above). Field labels rewritten for context.
  formSection: {
    eyebrow: "КАНДИДАТСТВАЙ",
    h2: "60 секунди.",
    h2Highlight: "Отговор до 24 часа.",
    sub: "Преглеждаме всяка кандидатура лично. Не е автоматизирана оферта — пишем ти само ако има match с програмата.",
    submitMicro: "✓ Безплатна кандидатура   ✓ Отговор до 24ч   ✓ Без ангажимент",
  },

  fields: {
    name: "Име",
    namePh: "Иван Иванов",
    email: "Email",
    emailPh: "ivan@biznes.bg",
    brand: "Бизнес / уебсайт",
    brandPh: "https://...",
    phone: "Телефон / WhatsApp",
    phonePh: "+359 ...",
    sector: "Тип бизнес",
    sectorOptions: [
      { id: "ecom", label: "E-commerce" },
      { id: "info", label: "Info-продукт / Курс" },
      { id: "service", label: "Услуги / Агенция" },
      { id: "saas", label: "SaaS / Tech" },
      { id: "other", label: "Друго" },
    ],
    budget: "Месечен ad бюджет",
    budgetSuffix: "€ / месец",
    budgetMaxLabel: "10 000 €+",
    message: "Какъв резултат искаш в следващите 90 дни?",
    messagePh: "Кратко: текущо положение + целта ти. Колкото по-конкретно — толкова по-точна е оценката ни.",
  },

  cta: {
    submit: "Кандидатствай за флашката →",
    submitting: "Изпращаме…",
    orBook: "Или директно с екипа:",
    bookCta: "Резервирай разговор",
    callCta: "Обади се",
  },

  // FAQ — addresses the 4-5 objections that come up most: why limited,
  // what if not approved, price, why physical USB, in-house team, time
  // to results. Each Q is the actual question a skeptical reader asks.
  faq: {
    eyebrow: "ВЪПРОСИ",
    h2: "Преди да кандидатстваш —",
    h2Highlight: "почти всеки пита това.",
    items: [
      {
        q: "Защо ограничавате до 5 бранда?",
        a: "Защото личната консултация е 90 минути 1-на-1 с топ член от екипа. На 6-ти спот качеството пада. Предпочитаме 5 бранда с $1M+ резултати пред 50 със среден.",
      },
      {
        q: "Какво ако не съм одобрен?",
        a: "Получаваш честно 'не сега' с конкретни 3 стъпки какво да направиш първо. Без upsell, без 'но имаме друг продукт за €X'. Връщаме се, когато си готов.",
      },
      {
        q: "Колко струва?",
        a: "Цената обсъждаме само с одобрените кандидати — зависи от мащаба на бизнеса ти. По принцип системата се отплаща за 30-45 дни от ROAS подобрението. Затова не пишем число тук.",
      },
      {
        q: "Защо точно флашка, не PDF или онлайн портал?",
        a: "На физическата флашка е structured export със системата + AI промптове + ad creative templates + видео tutorials. Получаваш я в ръката си. По-сериозно от 'свали PDF от линк'. По-сигурно от 'портал, който ще изчезне след година'.",
      },
      {
        q: "Какво ако вече имаме маркетинг екип?",
        a: "Перфектно. Системата е made-to-plug-in като extension, не replacement. Често работим заедно с in-house team — те носят brand context, ние носим execution framework.",
      },
      {
        q: "Колко време отнема да видим резултат?",
        a: "30-45 дни до първите измерими подобрения в ROAS. 60-90 дни до пълно scaling на winning кампания. По-бързо не обещаваме — който обещава, лъже.",
      },
    ],
  },

  // Final CTA — pure scarcity + commitment beat. Repeats the 5-spot
  // limit but reframes as 'first come, first serve' to drive action.
  finalCta: {
    eyebrow: "ОСТАВАТ ОГРАНИЧЕНИ СПОТОВЕ",
    h2: "5 бранда. 1 страна.",
    h2Highlight: "Първите кандидати — първи опит.",
    sub: "Не пращаме оферти на всеки. Преглеждаме всяка кандидатура лично. Отговор до 24 часа — да или не, без хитрости.",
    scrollToForm: "Кандидатствай сега →",
    orBook: "Или резервирай 30-минутен разговор",
  },

  stickyMobile: {
    cta: "Кандидатствай →",
  },

  success: {
    title: "Кандидатурата е получена.",
    body: "Преглеждаме всичко лично — не автомат. Пишем ти на имейла до 24 часа с конкретен отговор: одобрен с next steps, или 'не сега' с препоръки. Междувременно можеш да резервираш разговор:",
    bookCta: "Резервирай среща",
    backHome: "← Към сайта",
  },

  error: {
    generic: "Нещо се обърка. Опитай пак или ни пиши на vekto.agency.bg@gmail.com",
    requiredEmail: "Имейлът е задължителен.",
  },
} as const;
