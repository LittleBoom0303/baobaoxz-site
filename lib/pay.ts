// 订阅套餐定义
export interface Plan {
  id: string;
  name: string;
  price: number; // 人民币：元
  periodDays: number;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "yearly",
    name: "年度会员",
    price: 88,
    periodDays: 365,
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
