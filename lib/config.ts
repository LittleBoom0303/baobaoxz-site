// 支付配置
// 商户号到位后，在此填入环境变量

// 微信支付配置（个体工商户 + 微信支付商户号）
export const WXPAY_CONFIG = {
  appId: process.env.WXPAY_APP_ID || "",
  mchId: process.env.WXPAY_MCH_ID || "",
  apiKey: process.env.WXPAY_API_KEY || "",
  // 回调URL（Vercel部署后需要公网可访问的地址）
  notifyUrl: process.env.WXPAY_NOTIFY_URL || "https://baobaoxz.com/api/callback/wxpay",
};

// 支付宝当面付配置（个体工商户 + 支付宝商户号）
export const ALIPAY_CONFIG = {
  appId: process.env.ALIPAY_APP_ID || "",
  privateKey: process.env.ALIPAY_PRIVATE_KEY || "",
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || "",
  notifyUrl: process.env.ALIPAY_NOTIFY_URL || "https://baobaoxz.com/api/callback/alipay",
};

// PayPal配置
export const PAYPAL_CONFIG = {
  clientId: process.env.PAYPAL_CLIENT_ID || "",
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
  mode: process.env.PAYPAL_MODE || "sandbox", // 'sandbox' | 'live'
};
