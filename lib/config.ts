// Flexichrono 后端地址（开发环境用本地，生产环境用公网地址或域名）
export const FLEXICHRONO_API = process.env.FLEXICHRONO_API || "http://localhost:8000";

// 支付回调密钥（与 Flexichrono 后端 MEMBERSHIP_CALLBACK_SECRET 一致）
export const MEMBERSHIP_CALLBACK_SECRET = process.env.MEMBERSHIP_CALLBACK_SECRET || "flexichrono-callback-secret-dev";

// 支付平台配置（执照下来后填充）
export const WXPAY = {
  app_id: process.env.WXPAY_APP_ID || "",
  mch_id: process.env.WXPAY_MCH_ID || "",
  api_key: process.env.WXPAY_API_KEY || "",
  // 回调地址（Vercel 部署后填入）
  notify_url: process.env.WXPAY_NOTIFY_URL || "https://baobaoxz.com/api/callback/wxpay",
};

export const ALIPAY = {
  app_id: process.env.ALIPAY_APP_ID || "",
  private_key: process.env.ALIPAY_PRIVATE_KEY || "",
  alipay_public_key: process.env.ALIPAY_PUBLIC_KEY || "",
  notify_url: process.env.ALIPAY_NOTIFY_URL || "https://baobaoxz.com/api/callback/alipay",
};

export const STRIPE = {
  secret_key: process.env.STRIPE_SECRET_KEY || "",
  webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || "",
};
