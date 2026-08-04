// ============================================================================
// JOURNEY COPY — the overlay text for the six zones of the Vector's flight.
// Sparse on purpose: the film carries the narrative; the type answers it.
// Real figures only (5.2 / 7.7 / 10 from campaign history) — no invented
// numbers anywhere.
// ============================================================================

export const JOURNEY_COPY = {
  bg: {
    zones: {
      vault: {
        kicker: "VEKTO · AI GROWTH AGENCY · БЪЛГАРИЯ · САЩ",
        h1a: "ТВОЯТ ПАРТНЬОР",
        h1b: "ЗА",
        h1hi: "РАСТЕЖ ОНЛАЙН.",
        sub: "Скролни. Пътят е един кадър.",
        ctaPrimary: "ЗАПАЗИ РАЗГОВОР",
        ctaSecondary: "ПОРТФОЛИО",
      },
      ignition: {
        kicker: "02 · КАКВО ПРАВИМ",
        line1: "РЕКЛАМИ. КРЕАТИВ. САЙТОВЕ.",
        line2: "Един екип, една посока.",
      },
      screen: {
        kicker: "03 · КЪДЕ ЖИВЕЕ РАБОТАТА",
        line1: "ВСЯКО ВИДЕО ЗАВЪРШВА В ЕКРАН.",
        line2: "Реалните ни клипове са под пътуването.",
      },
      feed: {
        kicker: "04 · КАК РАБОТИМ",
        words: ["ЯСНО.", "БЪРЗО.", "С ЧИСЛА."],
      },
      curve: {
        kicker: "05 · РЕЗУЛТАТИТЕ",
        proof: [
          { metric: "5.2×", brand: "MEN'S CARE" },
          { metric: "7.7×", brand: "PARFEN" },
          { metric: "10×", brand: "FREYA" },
        ],
        note: "ROAS ПО РЕАЛНИ КАМПАНИИ",
      },
      landing: {
        kicker: "06 · ОТ ТУК НАТАТЪК",
        h2a: "ИМАШ БРАНД",
        h2hi: "ЗА РАСТЕЖ?",
        cta: "ЗАПАЗИ РАЗГОВОР",
        meta: "БЪЛГАРИЯ · САЩ",
      },
    },
    hud: { zone: "ЗОНА", frame: "КАДЪР" },
    after: {
      workEyebrow: "РАБОТАТА · РЕАЛНИ КЛИПОВЕ",
      workHeadline1: "РЕАЛНИ БРАНДОВЕ.",
      workHeadline2: "РЕАЛНИ ВИДЕА.",
      workNote: "Всяко видео долу е пускано като реклама. Мини с мишката, за да го гледаш.",
      workAll: "ВИЖ ЦЯЛОТО ПОРТФОЛИО",
    },
  },
  en: {
    zones: {
      vault: {
        kicker: "VEKTO · AI GROWTH AGENCY · BULGARIA · USA",
        h1a: "YOUR PARTNER",
        h1b: "FOR",
        h1hi: "ONLINE GROWTH.",
        sub: "Scroll. The whole path is one shot.",
        ctaPrimary: "BOOK A CALL",
        ctaSecondary: "PORTFOLIO",
      },
      ignition: {
        kicker: "02 · WHAT WE DO",
        line1: "ADS. CREATIVE. WEBSITES.",
        line2: "One team, one direction.",
      },
      screen: {
        kicker: "03 · WHERE THE WORK LIVES",
        line1: "EVERY VIDEO ENDS UP ON A SCREEN.",
        line2: "Our real spots are below the journey.",
      },
      feed: {
        kicker: "04 · HOW WE WORK",
        words: ["CLEAR.", "FAST.", "IN NUMBERS."],
      },
      curve: {
        kicker: "05 · THE RESULTS",
        proof: [
          { metric: "5.2×", brand: "MEN'S CARE" },
          { metric: "7.7×", brand: "PARFEN" },
          { metric: "10×", brand: "FREYA" },
        ],
        note: "ROAS ON REAL CAMPAIGNS",
      },
      landing: {
        kicker: "06 · FROM HERE",
        h2a: "GOT A BRAND",
        h2hi: "WORTH GROWING?",
        cta: "BOOK A CALL",
        meta: "BULGARIA · USA",
      },
    },
    hud: { zone: "ZONE", frame: "FRAME" },
    after: {
      workEyebrow: "THE WORK · REAL SPOTS",
      workHeadline1: "REAL BRANDS.",
      workHeadline2: "REAL VIDEO.",
      workNote: "Every spot below has run as an ad. Hover to play.",
      workAll: "SEE THE FULL PORTFOLIO",
    },
  },
} as const;

export type JourneyLang = keyof typeof JOURNEY_COPY;
