// 套餐定义
export const PLANS = [
  {
    id: "monthly",
    name: "月度会员",
    nameEn: "Monthly",
    price: 9.9,
    priceDisplay: "¥9.9",
    days: 30,
    recommended: false,
  },
  {
    id: "quarterly",
    name: "季度会员",
    nameEn: "Quarterly",
    price: 55.9,
    priceDisplay: "¥55.9",
    days: 90,
    recommended: false,
  },
  {
    id: "yearly",
    name: "年度会员",
    nameEn: "Yearly",
    price: 199.9,
    priceDisplay: "¥199.9",
    days: 365,
    recommended: true,
  },
];

// 获取plan信息
export function getPlan(planId: string) {
  return PLANS.find((p) => p.id === planId);
}

// 生成订单号
export function generateOrderId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `BBXZ-${ts}-${rand}`.toUpperCase();
}

// 生成user_id（与Flexichrono后端一致：user_{phone[-4:]}）
// 若用户未登录，生成临时user_id用于匿名下单
export function generateAnonUserId(): string {
  return `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
