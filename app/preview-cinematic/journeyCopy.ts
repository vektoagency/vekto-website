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
        kicker: "01 · VEKTO · 50+ БИЗНЕСА · 500+ ВИДЕА / МЕСЕЦ",
        h1a: "БИЗНЕСЪТ ТИ ЗАСЛУЖАВА ЛИ",
        h1b: "ДА БЪДЕ",
        h1hi: "СКАЛИРАН?",
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
        kicker: "02 · ЗАЩО СМЕ ТУК",
        quote: "„Стигнахме до едно ниво и заседнахме. Каквото и да пробваме — числата са същите.“",
        attribution: "— почти всеки бизнес, преди да дойде при нас",
        response: "Затова",
        responseHi: "сме тук.",
      },
      focus: {
        kicker: "03 · ЧЕТИРИ ЕКИПА · ЕДИН ПОКРИВ",
        rooms: [
          { title: "КРЕАТИВИ", detail: "Видео · заснемане · AI ads", num: "500+", label: "ВИДЕА / МЕСЕЦ" },
          { title: "УЕБСАЙТОВЕ", detail: "Лендинги · е-ком · портали", num: "12", label: "САЙТА / ГОДИНА" },
          { title: "СТРАТЕГИИ", detail: "Позициониране · оферта · план", num: "50+", label: "БИЗНЕСА" },
          { title: "AI РЕШЕНИЯ", detail: "AI видео · автоматизации", num: "5.2×", label: "ROAS · AI КАМПАНИЯ" },
        ],
      },
      standard: {
        kicker: "07 · СТАНДАРТЪТ · БЕЗ КОМПРОМИС",
        principles: [
          "ЕДИН БИЗНЕС НА НИША.",
          "ТРЪГВАМЕ ОТ РЕЗУЛТАТА.",
          "AI ЗАПОЧВА. ХОРАТА ЗАВЪРШВАТ.",
          "ДАННИТЕ РЕШАВАТ.",
        ],
      },
      cases: {
        kicker: "04 · КЕЙСОВЕ · РЕАЛНИ РЕЗУЛТАТИ",
        // One card per service room, one metric type per card. Every number
        // is real: the three ROAS wins are the long-approved ones; the CVR
        // is computed from live Meta account data (beMe, last 90d:
        // 840 purchases / 24,389 link clicks = 3.4%).
        cases: [
          { service: "РЕКЛАМИ", metric: "7.7×", sub: "ROAS · ОФЕРТА СЪС СРОК", meta: "PARFEN · 60 ДНИ" },
          { service: "КРЕАТИВ", metric: "5.2×", sub: "ROAS · AI КАМПАНИЯ", meta: "MEN'S CARE · 90 ДНИ" },
          { service: "САЙТ + ФУНИЯ", metric: "3.4%", sub: "CVR · ОТ КЛИК ДО ПОРЪЧКА", meta: "beMe · 90 ДНИ" },
        ],
        note: "РЕАЛНА МЕТРИКА · РЕАЛЕН БЮДЖЕТ · РЕАЛЕН ПЕРИОД",
      },
      landing: {
        kicker: "09 · АКО СИ СТИГНАЛ ДОТУК",
        h2a: "ТОГАВА Е ВРЕМЕ ЗА",
        h2hi: "РАЗГОВОР.",
        cta: "ЗАПАЗИ РАЗГОВОР",
        meta: "30 МИНУТИ · БЕЗПЛАТНО · БЕЗ АНГАЖИМЕНТ",
      },
    },
    hud: { zone: "ЗОНА", frame: "КАДЪР" },
    rail: ["НАЧАЛО", "ЗАЩО", "ФОКУС", "СТАНДАРТ", "КЕЙСОВЕ", "РАЗГОВОР"],
    scrollCue: "СКРОЛНИ",
    roster: {
      eyebrow: "05 · СЪСТАВЪТ",
      headline1: "50+ БИЗНЕСА В ПОРТФОЛИОТО.",
      headline2Prefix: "24",
      headline2Highlight: "ОТ ТЯХ.",
      region: { BG: "БГ", US: "САЩ" },
      coda: "ОСТАНАЛИТЕ — ПО ЗАЯВКА",
    },
    process: {
      eyebrow: "06 · КАК РАБОТИМ",
      headline1: "ОТ ПЪРВИЯ РАЗГОВОР",
      headline2Prefix: "ДО",
      headline2Highlight: "РАСТЕЖА.",
      steps: [
        { num: "01", title: "ЗАПОЗНАВАНЕ", duration: "30 МИНУТИ · БЕЗПЛАТНО", body: "Разговор за бизнеса, целите и ситуацията. Проверяваме дали си пасваме — и в двете посоки." },
        { num: "02", title: "ДИАГНОСТИКА", duration: "2 СЕДМИЦИ", body: "Одит на каналите, позиционирането, офертата и проследяването. Излизаш с конкретен план за 90 дни." },
        { num: "03", title: "ИЗГРАЖДАНЕ", duration: "30 ДНИ", body: "Сглобяваме системата: стратегия, криейтиви, фуния, проследяване, инфраструктура. Готово за старт." },
        { num: "04", title: "СТАРТ И СКАЛИРАНЕ", duration: "МЕСЕЦ 2 →", body: "Пускаме, мерим, скалираме. Данните решават посоката." },
      ],
    },
    fit: {
      eyebrow: "08 · КАКВО ПОЛУЧАВАШ",
      headlinePrefix: "ЧЕТИРИ НЕЩА, КОИТО",
      headlineHighlight: "НЕ СЕ ПРОМЕНЯТ",
      headlineSuffix: ".",
      items: [
        "Отговор до 24 часа — от човек, не от бот",
        "Един екип за криейтиви, реклами, сайтове и стратегия",
        "Без 12-месечни договори — спираш с 15 дни предизвестие",
        "Два кръга редакции, включени в цената",
      ],
    },
    after: {
      workEyebrow: "РАБОТАТА · РЕАЛНИ КЛИПОВЕ",
      workHeadline1: "РЕАЛНИ БИЗНЕСИ.",
      workHeadline2: "РЕАЛНИ ВИДЕА.",
      workNote: "Всяко видео долу е въртяно като истинска реклама. Задръж отгоре, за да го гледаш.",
      workAll: "Цялото портфолио",
    },
    endCard: {
      eyebrow: "СЛЕДВАЩАТА СТЪПКА",
      h1: "ИМАШ ЛИ БИЗНЕС,",
      h2: "КОЙТО ЗАСЛУЖАВА РАСТЕЖ?",
      cta: "ЗАПАЗИ РАЗГОВОР",
      meta: "30 МИНУТИ · БЕЗПЛАТНО · БЕЗ АНГАЖИМЕНТ",
    },
  },
  en: {
    zones: {
      vault: {
        kicker: "01 · VEKTO · 50+ BRANDS · 500+ VIDEOS / MONTH",
        h1a: "DOES YOUR BUSINESS",
        h1b: "DESERVE",
        h1hi: "TO SCALE?",
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
        quote: "“We got to a level and got stuck. Whatever we try, the numbers stay the same.”",
        attribution: "— almost every brand, before they find us",
        response: "That's why",
        responseHi: "we exist.",
      },
      focus: {
        kicker: "03 · FOUR ROOMS · ONE ROOF",
        rooms: [
          { title: "CREATIVE", detail: "Video · live shoots · AI ads", num: "500+", label: "VIDEOS / MONTH" },
          { title: "WEBSITES", detail: "Landing · e-com · portals", num: "12", label: "SITES / YEAR" },
          { title: "STRATEGY", detail: "Positioning · offer · plan", num: "50+", label: "BRANDS" },
          { title: "AI SOLUTIONS", detail: "AI video · automations", num: "5.2×", label: "ROAS · AI CAMPAIGN" },
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
          { service: "ADS", metric: "7.7×", sub: "ROAS · URGENCY OFFER", meta: "PARFEN · 60 DAYS" },
          { service: "CREATIVE", metric: "5.2×", sub: "ROAS · AI CAMPAIGN", meta: "MEN'S CARE · 90 DAYS" },
          { service: "SITE + FUNNEL", metric: "3.4%", sub: "CVR · CLICK → ORDER", meta: "beMe · 90 DAYS" },
        ],
        note: "REAL METRIC · REAL BUDGET · REAL PERIOD",
      },
      landing: {
        kicker: "09 · IF YOU'VE MADE IT THIS FAR",
        h2a: "THEN IT'S TIME FOR",
        h2hi: "A CALL.",
        cta: "BOOK A CALL",
        meta: "30 MINUTES · FREE · NO STRINGS",
      },
    },
    hud: { zone: "ZONE", frame: "FRAME" },
    rail: ["START", "WHY", "FOCUS", "STANDARD", "CASES", "TALK"],
    scrollCue: "SCROLL",
    roster: {
      eyebrow: "05 · THE ROSTER",
      headline1: "50+ BRANDS IN THE PORTFOLIO.",
      headline2Prefix: "24",
      headline2Highlight: "OF THEM.",
      region: { BG: "BG", US: "US" },
      coda: "THE REST — ON REQUEST",
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
      eyebrow: "08 · WHAT YOU GET",
      headlinePrefix: "FOUR THINGS THAT",
      headlineHighlight: "DON'T CHANGE",
      headlineSuffix: ".",
      items: [
        "A reply within 24 hours — from a person, not a bot",
        "One team for creatives, ads, websites and strategy",
        "No 12-month contracts — leave on 15 days' notice",
        "Two rounds of revisions, included",
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
      meta: "30 MINUTES · FREE · NO STRINGS",
    },
  },
} as const;

export type JourneyLang = keyof typeof JOURNEY_COPY;
