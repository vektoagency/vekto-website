// Direct-response copy for /flashka — paid-traffic LP for the
// 'векто адс' campaign. The флашка is the metaphor for VEKTO's
// internal operating system: the strategy + AI tools + frameworks
// they actually apply with every client. The LP doesn't sell a
// download — it sells AGENCY ACCESS. Applying = becoming a client
// for whom they execute the system on a 90-day engagement.

export const flashkaCopy = {
  meta: {
    eyebrow: "VEKTO · ЗА 5-ТЕ НОВИ БРАНДА В БГ",
    h1Top: "Стратегията зад",
    h1Bottom: "30+ успешни бранда.",
    sub: "Цялата ни оперативна система за маркетинг и scaling. Прилагаме я с всеки клиент. Сега я отваряме за 5 нови бранда в България.",
    ctaPrimary: "Кандидатствай →",
    ctaMicro: "60 секунди · кандидатстване · отговор до 24ч",
    home: "← Към сайта",
  },

  // Pattern interrupt — frames the offer correctly: not a download,
  // not a course, an agency engagement where the strategy gets applied
  // FOR you. Kills the 'is this a guru pitch / PDF / online portal'
  // objections before they form.
  frame: {
    eyebrow: "ВАЖНО",
    h2: "Не курс. Не PDF.",
    h2Highlight: "Това е нашата оперативна система.",
    body: "Същата стратегия, която прилагаме с 30+ бранда в БГ и САЩ. Когато станеш клиент — екипът ни я пуска в твоя бизнес. Не я раздаваме самостоятелно.",
  },

  // Inside — what's actually on the agency's playbook. Concrete
  // deliverables anchor abstract strategy. Reframed as 'this is what
  // we run with every client' rather than 'here's what you get'.
  inside: {
    eyebrow: "КАКВО Е ВЪТРЕ",
    h2: "5 модула. 1 система.",
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
        body: "Целият tech и copy stack: ad platforms, лендинг шаблони, email flows, retention механизми.",
      },
      {
        number: "05",
        title: "Прилагане 1-на-1",
        body: "Екипът ни пуска системата в твоя бизнес. Не я даваме самостоятелно — прилагаме я с теб.",
      },
    ],
  },

  // Proof block — 4 stat counters anchored to real outcomes from the
  // system in production across 30+ client brands.
  proof: {
    eyebrow: "ДОКАЗАНО",
    h2: "30+ бранда я ползват.",
    h2Highlight: "БГ и САЩ. Реални числа.",
    items: [
      { value: 30, suffix: "+", decimals: 0, label: "Бранда я ползват в БГ и САЩ" },
      { value: 1, suffix: "M+", decimals: 0, label: "$ среден оборот на клиент" },
      { value: 4.8, suffix: "×", decimals: 1, label: "Среден ROAS от наши кампании" },
      { value: 5, suffix: "", decimals: 0, label: "Свободни спота за България" },
    ],
  },

  // Qualification — reframed as client-fit, not download-eligibility.
  // YES list says 'this is who we work well with'. NO list pre-
  // disqualifies tire-kickers and lifts perceived selectivity.
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

  // The form — application, not download request. Verb is
  // 'Кандидатствай' throughout to match the ad CTA.
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
    budget: "Месечен маркетинг бюджет",
    budgetSuffix: "€ / месец",
    budgetMaxLabel: "10 000 €+",
    message: "Каква е целта в следващите 90 дни?",
    messagePh: "Кратко: къде си сега и къде искаш да си. Колкото по-конкретно — толкова по-точна е оценката.",
  },

  cta: {
    submit: "Кандидатствай →",
    submitting: "Изпращаме…",
    orBook: "Или директно с екипа:",
    bookCta: "Резервирай разговор",
    callCta: "Обади се",
  },

  // FAQ — reframed for agency engagement (not product download).
  // 6 most-common objections from the application/discovery call
  // stage of client onboarding.
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

  // Final CTA — pure scarcity beat.
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
    body: "Преглеждаме всичко лично — не автомат. Пишем ти на имейла до 24 часа: одобрен с next steps, или 'не сега' с препоръки. Междувременно можеш да резервираш разговор:",
    bookCta: "Резервирай среща",
    backHome: "← Към сайта",
  },

  error: {
    generic: "Нещо се обърка. Опитай пак или ни пиши на vekto.agency.bg@gmail.com",
    requiredEmail: "Имейлът е задължителен.",
  },
} as const;
