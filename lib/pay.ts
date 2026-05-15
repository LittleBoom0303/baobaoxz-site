// 订阅套餐定义
export interface Plan {
  id: string;
  name: string;
  price: number; // 人民币：元
  periodDays: number;
  periodLabel: string;
  features: string[];
  badge?: string;
}

export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "月度会员",
    price: 9.9,
    periodDays: 30,
    periodLabel: "1个月",
    features: [
      "无限文字 / 语音对话",
      "音色克隆（30秒录音还原声音）",
      "多个 AI 角色切换",
      "云端聊天记录同步",
    ],
    badge: "首月特惠",
  },
  {
    id: "quarterly",
    name: "季度会员",
    price: 55.9,
    periodDays: 90,
    periodLabel: "3个月",
    features: [
      "无限文字 / 语音对话",
      "音色克隆（30秒录音还原声音）",
      "多个 AI 角色切换",
      "云端聊天记录同步",
      "跨平台 Web/App 使用",
    ],
    badge: "最受欢迎",
  },
  {
    id: "yearly",
    name: "年度会员",
    price: 88,
    periodDays: 365,
    periodLabel: "1年",
    features: [
      "无限文字 / 语音对话",
      "音色克隆（30秒录音还原声音）",
      "多个 AI 角色切换",
      "云端聊天记录同步",
      "跨平台 Web/App 使用",
    ],
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
