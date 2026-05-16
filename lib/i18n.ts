import { cookies } from "next/headers";

export type Locale = "zh" | "en";

const LOCALE_COOKIE = "locale";
const DEFAULT_LOCALE: Locale = "zh";

export async function getLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(LOCALE_COOKIE)?.value as Locale | undefined;
    return val === "zh" || val === "en" ? val : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function setLocaleCookie(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

// ─── UI strings ──────────────────────────────────────────────────────────────
type StrKey =
  | "features"
  | "subscribe"
  | "membership"
  | "download"
  | "pricing"
  | "faq"
  | "contact"
  | "subscribeNow"
  | "queryMember"
  | "subscribeDesc"
  | "howItWorks"
  | "cta"
  | "landingSubtitle"
  | "landingDesc"
  | "appTagline"
  | "appDesc"
  | "featuresTitle"
  | "featuresSubtitle"
  | "pricingTitle"
  | "pricingSubtitle"
  | "faqTitle"
  | "ctaTitle"
  | "ctaSubtitle";

const STRINGS: Record<StrKey, { zh: string; en: string }> = {
  features: { zh: "功能", en: "Features" },
  subscribe: { zh: "订阅", en: "Subscribe" },
  membership: { zh: "会员", en: "Membership" },
  download: { zh: "下载", en: "Download" },
  pricing: { zh: "会员订阅", en: "Pricing" },
  faq: { zh: "常见问题", en: "FAQ" },
  contact: { zh: "联系我们", en: "Contact" },
  subscribeNow: { zh: "立即订阅", en: "Subscribe Now" },
  queryMember: { zh: "查询会员", en: "Query Member" },
  subscribeDesc: { zh: "一次订阅，全部功能开放", en: "One subscription, all features unlocked" },
  howItWorks: { zh: "如何使用", en: "How It Works" },
  cta: { zh: "开始你的 AI 声音之旅", en: "Start Your AI Voice Journey" },
  landingSubtitle: { zh: "用你的声音，和 AI 聊聊", en: "Talk to AI with your own voice" },
  landingDesc: {
    zh: "录 30 秒声音，AI 就能用你的音色说话。文字输入、语音对话，随时随地陪伴。",
    en: "Record 30 seconds of audio, and AI can speak with your voice. Text or voice input, companionship anywhere.",
  },
  appTagline: { zh: "AI 声音陪伴，随时使用", en: "AI Voice Companion, Always Available" },
  appDesc: { zh: "选择你的平台，开始使用", en: "Choose your platform and get started" },
  featuresTitle: { zh: "产品功能", en: "Features" },
  featuresSubtitle: { zh: "每个功能都为真实使用场景设计", en: "Every feature is designed for real use cases" },
  pricingTitle: { zh: "会员订阅", en: "Pricing" },
  pricingSubtitle: { zh: "一次订阅，全部功能开放", en: "One subscription, all features open" },
  faqTitle: { zh: "常见问题", en: "FAQ" },
  ctaTitle: { zh: "开始你的 AI 声音之旅", en: "Start Your AI Voice Journey" },
  ctaSubtitle: { zh: "用自己的声音，和 AI 聊任何话题", en: "Talk to AI about anything with your own voice" },
};

export function t(key: StrKey, locale: Locale): string {
  return STRINGS[key]?.[locale] ?? STRINGS[key]?.zh ?? key;
}
