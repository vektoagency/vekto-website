// ============================================================================
// JOURNEY COPY — the full brutalism funnel, carried by the film.
//
// Per Yavor: the funnel's INFORMATION is the same as /preview-brutalism's
// nine stations. The six film zones carry the narrative stations; the three
// data-heavy stations (roster, process, qualify) follow the journey as
// classic plates where they can breathe. Every overlay sits on a hard
// bone/jet plate so text reads against ANY film frame — no naked text on
// video. Real figures only.
//
//   Film zones:   01 HOOK · 02 WHY · 03 FOCUS · 07 STANDARD · 04 CASES · 09 CALL
//   After film:   05 ROSTER · 06 PROCESS · 08 FIT · THE WORK · END CTA
// ============================================================================

export const JOURNEY_COPY = {
  bg: {
    zones: {
      vault: {
        kicker: "01 · VEKTO · AI GROWTH AGENCY · БЪЛГАРИЯ · САЩ",
        h1a: "ТВОЯТ ПАРТНЬОР",
        h1b: "ЗА",
        h1hi: "РАСТЕЖ ОНЛАЙН.",
        ctaPrimary: "ЗАПАЗИ РАЗГОВОР",
        ctaSecondary: "ПОРТФОЛИО",
        proofTitle: "ROAS",
        proof: [
          { metric: "5.2×", brand: "MEN'S CARE" },
          { metric: "7.7×", brand: "PARFEN" },
          { metric: "10×", brand: "FREYA" },
        ],
      },
      why: {
        kicker: "02 · ЗАЩО СЪЩЕСТВУВАМЕ",
        quote: "„Инвестираме сериозно в реклама. Но никой не може да ми каже колко от това се връща.“",
        attribution: "— повечето собственици, в един момент през първата година",
        response: "Ако това ти звучи познато —",
        responseHi: "разбираме се.",
      },
      focus: {
        kicker: "03 · ЧЕТИРИ СТАИ · ЕДИН ПОКРИВ",
        rooms: [
          { title: "РЕКЛАМИ", detail: "Meta · Google · TikTok", num: "4.8×", label: "СРЕДЕН ROAS" },
          { title: "КРЕАТИВ", detail: "UGC · AI · заснемане", num: "200+", label: "ВИДЕА / МЕСЕЦ" },
          { title: "САЙТОВЕ", detail: "Landing · е-ком · портали", num: "12", label: "САЙТА / ГОДИНА" },
          { title: "СТРАТЕГИЯ", detail: "Позициониране · оферта", num: "50+", label: "БРАНДА" },
        ],
      },
      standard: {
        kicker: "07 · СТАНДАРТЪТ · БЕЗ КОМПРОМИС",
        principles: [
          "ЕДИН БРАНД НА НИША.",
          "ОТ РЕЗУЛТАТА, НАЗАД.",
          "AI ЗАПОЧВА. ХОРАТА ЗАВЪРШВАТ.",
          "ДАННИТЕ РЕШАВАТ.",
        ],
      },
      cases: {
        kicker: "04 · КЕЙСОВЕ · РЕАЛНИ РЕЗУЛТАТИ",
        cases: [
          { brand: "MEN'S CARE", metric: "5.2×", label: "ROAS · AI КАМПАНИЯ", duration: "90 ДНИ" },
          { brand: "PARFEN", metric: "7.7×", label: "ROAS · URGENCY ОФЕРТА", duration: "60 ДНИ" },
          { brand: "FREYA", metric: "10×", label: "ROAS · NAIL PRODUCTS", duration: "120 ДНИ" },
        ],
        note: "РЕАЛЕН МЕТРИК · РЕАЛЕН БЮДЖЕТ · РЕАЛЕН ПЕРИОД",
      },
      landing: {
        kicker: "09 · АКО СИ СТИГНАЛ ДОТУК",
        h2a: "ТОГАВА Е ВРЕМЕ ЗА",
        h2hi: "РАЗГОВОР.",
        cta: "ЗАПАЗИ РАЗГОВОР",
        meta: "БЪЛГАРИЯ · САЩ",
      },
    },
    hud: { zone: "ЗОНА", frame: "КАДЪР" },
    rail: ["НАЧАЛО", "ЗАЩО", "ФОКУС", "СТАНДАРТ", "КЕЙСОВЕ", "РАЗГОВОР"],
    scrollCue: "СКРОЛНИ",
    roster: {
      eyebrow: "05 · СЪСТАВЪТ",
      headline1: "50+ БРАНДА В ПОРТФЕЙЛА.",
      headline2Prefix: "12",
      headline2Highlight: "ОТ ТЯХ.",
      region: { BG: "БГ", US: "САЩ" },
      coda: "12 / 50+ · ОСТАНАЛИТЕ ПО ЗАЯВКА",
    },
    process: {
      eyebrow: "06 · КАК СЕ СЛУЧВА",
      headline1: "ОТ ПЪРВИЯ РАЗГОВОР",
      headline2Prefix: "ДО",
      headline2Highlight: "РАСТЕЖ.",
      steps: [
        { num: "01", title: "ЗАПОЗНАВАНЕ", duration: "30 МИНУТИ · БЕЗПЛАТНО", body: "Разговор за бранда, целите, ситуацията. Проверяваме дали сме fit — от двете страни." },
        { num: "02", title: "DIAGNOSTIC SPRINT", duration: "2 СЕДМИЦИ", body: "Audit на текущи канали, positioning, offer, tracking. Излизаш с конкретен 90-дневен план." },
        { num: "03", title: "SETUP PHASE", duration: "30 ДНИ", body: "Изграждаме stack-а: стратегия, creative, funnel, tracking, инфраструктура. Launch-ready." },
        { num: "04", title: "LAUNCH & SCALE", duration: "МЕСЕЦ 2 →", body: "Пускаме, мерим, скалираме. Данните решават посоката." },
      ],
    },
    fit: {
      eyebrow: "08 · КОГО ТЪРСИМ",
      headlinePrefix: "ОТГОВАРЯШ ЛИ НА ВСИЧКИТЕ",
      headlineHighlight: "ЧЕТИРИ",
      headlineSuffix: "?",
      items: [
        "Правиш €100k+ годишен приход",
        "Готов си да инвестираш в система, не в единични материали",
        "Искаш партньор, не изпълнител",
        "Цениш занаята повече от трикове",
      ],
    },
    after: {
      workEyebrow: "РАБОТАТА · РЕАЛНИ КЛИПОВЕ",
      workHeadline1: "РЕАЛНИ БРАНДОВЕ.",
      workHeadline2: "РЕАЛНИ ВИДЕА.",
      workNote: "Всяко видео долу е пускано като реклама. Мини с мишката, за да го гледаш.",
      workAll: "Цялото портфолио",
    },
    endCard: {
      eyebrow: "СЛЕДВАЩАТА СТЪПКА",
      h1: "ИМАШ БРАНД",
      h2: "ЗА РАСТЕЖ?",
      cta: "ЗАПАЗИ РАЗГОВОР",
      meta: "БЪЛГАРИЯ · САЩ",
    },
  },
  en: {
    zones: {
      vault: {
        kicker: "01 · VEKTO · AI GROWTH AGENCY · BULGARIA · USA",
        h1a: "YOUR PARTNER",
        h1b: "FOR",
        h1hi: "ONLINE GROWTH.",
        ctaPrimary: "BOOK A CALL",
        ctaSecondary: "PORTFOLIO",
        proofTitle: "ROAS",
        proof: [
          { metric: "5.2×", brand: "MEN'S CARE" },
          { metric: "7.7×", brand: "PARFEN" },
          { metric: "10×", brand: "FREYA" },
        ],
      },
      why: {
        kicker: "02 · WHY WE EXIST",
        quote: "“We invest seriously in advertising. But nobody can tell me how much of that actually comes back.”",
        attribution: "— most brand owners, at some point in year one",
        response: "If that sounds familiar —",
        responseHi: "we speak the same language.",
      },
      focus: {
        kicker: "03 · FOUR ROOMS · ONE ROOF",
        rooms: [
          { title: "ADS", detail: "Meta · Google · TikTok", num: "4.8×", label: "AVG ROAS" },
          { title: "CREATIVE", detail: "UGC · AI · live shoots", num: "200+", label: "VIDEOS / MONTH" },
          { title: "WEBSITES", detail: "Landing · e-com · portals", num: "12", label: "SITES / YEAR" },
          { title: "STRATEGY", detail: "Positioning · offer", num: "50+", label: "BRANDS" },
        ],
      },
      standard: {
        kicker: "07 · THE STANDARD · NON-NEGOTIABLE",
        principles: [
          "ONE BRAND PER NICHE.",
          "FROM THE OUTCOME, BACKWARDS.",
          "AI STARTS. HUMANS FINISH.",
          "DATA DECIDES.",
        ],
      },
      cases: {
        kicker: "04 · CASES · REAL RESULTS",
        cases: [
          { brand: "MEN'S CARE", metric: "5.2×", label: "ROAS · AI CAMPAIGN", duration: "90 DAYS" },
          { brand: "PARFEN", metric: "7.7×", label: "ROAS · URGENCY OFFER", duration: "60 DAYS" },
          { brand: "FREYA", metric: "10×", label: "ROAS · NAIL PRODUCTS", duration: "120 DAYS" },
        ],
        note: "REAL METRIC · REAL BUDGET · REAL PERIOD",
      },
      landing: {
        kicker: "09 · IF YOU'VE MADE IT THIS FAR",
        h2a: "THEN IT'S TIME FOR",
        h2hi: "A CALL.",
        cta: "BOOK A CALL",
        meta: "BULGARIA · USA",
      },
    },
    hud: { zone: "ZONE", frame: "FRAME" },
    rail: ["START", "WHY", "FOCUS", "STANDARD", "CASES", "TALK"],
    scrollCue: "SCROLL",
    roster: {
      eyebrow: "05 · THE ROSTER",
      headline1: "50+ BRANDS IN THE PORTFOLIO.",
      headline2Prefix: "12",
      headline2Highlight: "OF THEM.",
      region: { BG: "BG", US: "US" },
      coda: "12 / 50+ · REST ON REQUEST",
    },
    process: {
      eyebrow: "06 · HOW IT HAPPENS",
      headline1: "FROM THE FIRST CALL",
      headline2Prefix: "TO",
      headline2Highlight: "GROWTH.",
      steps: [
        { num: "01", title: "INTRO CALL", duration: "30 MINUTES · FREE", body: "The brand, the goals, the situation. We check the fit — both ways." },
        { num: "02", title: "DIAGNOSTIC SPRINT", duration: "2 WEEKS", body: "Audit of channels, positioning, offer, tracking. You leave with a concrete 90-day plan." },
        { num: "03", title: "SETUP PHASE", duration: "30 DAYS", body: "We build the stack: strategy, creative, funnel, tracking, infrastructure. Launch-ready." },
        { num: "04", title: "LAUNCH & SCALE", duration: "MONTH 2 →", body: "We launch, measure, scale. Data picks the direction." },
      ],
    },
    fit: {
      eyebrow: "08 · WHO WE'RE FOR",
      headlinePrefix: "DO YOU MEET ALL",
      headlineHighlight: "FOUR",
      headlineSuffix: "?",
      items: [
        "You do €100k+ in annual revenue",
        "You're ready to invest in a system, not one-off assets",
        "You want a partner, not a vendor",
        "You value craft over gimmicks",
      ],
    },
    after: {
      workEyebrow: "THE WORK · REAL SPOTS",
      workHeadline1: "REAL BRANDS.",
      workHeadline2: "REAL VIDEO.",
      workNote: "Every spot below has run as an ad. Hover to play.",
      workAll: "Full portfolio",
    },
    endCard: {
      eyebrow: "THE NEXT STEP",
      h1: "GOT A BRAND",
      h2: "WORTH GROWING?",
      cta: "BOOK A CALL",
      meta: "BULGARIA · USA",
    },
  },
} as const;

export type JourneyLang = keyof typeof JOURNEY_COPY;
