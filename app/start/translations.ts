// Minimal bilingual copy for the /start lead form — designed for cold
// paid traffic. Stays under 20 seconds of completion.

export type Lang = "bg" | "en";

export const startCopy = {
  bg: {
    meta: {
      eyebrow: "VEKTO / GET STARTED",
      h1: "Кажи ни за бизнеса си.",
      sub: "Отговаряме до 24 часа. Без обвързване, без shady fine print.",
      langToggle: "EN",
      home: "← Към сайта",
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
      message: "Съобщение (по избор)",
      messagePh: "Разкажи накратко с какво се занимаваш и какво искаш да постигнем заедно.",
      contentType: "Какво съдържание ти трябва",
      contentTypeOptions: [
        { id: "cinematic", label: "Cinematic brand film" },
        { id: "ugc", label: "UGC / Short-form" },
        { id: "product", label: "Product visuals" },
        { id: "avatar", label: "AI Avatar / Spokesperson" },
        { id: "unsure", label: "Не съм сигурен — препоръчайте" },
      ],
      budget: "Месечен бюджет",
      budgetSuffix: "€ / месец",
      budgetMaxLabel: "10 000 €+",
    },
    cta: {
      submit: "Изпрати →",
      submitting: "Изпраща се…",
      orBook: "Или се свържи директно:",
      bookCta: "Резервирай среща",
      callCta: "Обади се",
    },
    success: {
      title: "Получихме брифа ти.",
      body: "Ще ти пишем на имейла до 24 часа. Междувременно — можеш да резервираш 30-минутен call:",
      bookCta: "Резервирай Discovery Call",
      backHome: "← Към сайта",
    },
    error: {
      generic: "Нещо се обърка. Опитай пак или ни пиши на vekto.agency.bg@gmail.com",
      requiredEmail: "Имейлът е задължителен.",
    },
  },
  en: {
    meta: {
      eyebrow: "VEKTO / GET STARTED",
      h1: "Tell us about your business.",
      sub: "We reply within 24 hours. No commitment, no shady fine print.",
      langToggle: "БГ",
      home: "← Back to site",
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
      message: "Message (optional)",
      messagePh: "Tell us briefly what you do and what you'd like to achieve together.",
      contentType: "What content do you need",
      contentTypeOptions: [
        { id: "cinematic", label: "Cinematic brand film" },
        { id: "ugc", label: "UGC / Short-form" },
        { id: "product", label: "Product visuals" },
        { id: "avatar", label: "AI Avatar / Spokesperson" },
        { id: "unsure", label: "Not sure — recommend" },
      ],
      budget: "Monthly budget",
      budgetSuffix: "€ / month",
      budgetMaxLabel: "€10,000+",
    },
    cta: {
      submit: "Send →",
      submitting: "Sending…",
      orBook: "Or reach us directly:",
      bookCta: "Book a Call",
      callCta: "Call now",
    },
    success: {
      title: "Got your brief.",
      body: "We'll reply by email within 24 hours. Meanwhile — book a 30-min call:",
      bookCta: "Book Discovery Call",
      backHome: "← Back to site",
    },
    error: {
      generic: "Something went wrong. Try again or email vekto.agency.bg@gmail.com",
      requiredEmail: "Email is required.",
    },
  },
} as const;
