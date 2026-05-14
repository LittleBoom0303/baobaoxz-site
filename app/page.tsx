import Link from "next/link";

const projects = [
  {
    name: "Terminal Copilot",
    desc: "AI coding assistant for your terminal. Context-aware, fast, local-first.",
    descZh: "终端 AI 编程助手，上下文感知，本地优先。",
    href: "#",
    locked: false,
  },
  {
    name: "API Cost Analyzer",
    desc: "Track and optimize your LLM API spend. Real-time cost breakdowns.",
    descZh: "追踪优化 LLM API 开销，实时成本分析。",
    href: "#",
    locked: false,
  },
  {
    name: "Open-Source Copilot Alternative",
    desc: "Full migration package: scripts + best-practice rules + config guides. 10 min setup. Saves $19/mo.",
    descZh: "完整迁移包：脚本 + 最优规则集 + 配置指南。10分钟搞定，每月省$19。",
    href: "#",
    locked: true,
    badge: "Subscribers only",
  },
  {
    name: "Agent Memory Architecture",
    desc: "Persistent memory for AI agents. Multi-session context, zero hallucination.",
    descZh: "AI 代理持久化记忆，多会话上下文，零幻觉。",
    href: "#",
    locked: true,
    badge: "Subscribers only",
  },
];

const faqs = [
  {
    q: "主要涵盖哪些类型的项目？",
    qEn: "What kind of projects do you cover?",
    a: "涵盖 AI 编程、终端工具、API 开发、数据处理、自动化等实用项目。每个项目都经过实战验证，可直接使用。",
  },
  {
    q: "多久更新一次？",
    qEn: "How often are new projects added?",
    a: "每周更新 1-3 个新项目，老项目持续维护迭代。订阅用户可随时查看全部历史项目。",
  },
  {
    q: "可以取消吗？",
    qEn: "Can I cancel?",
    a: "可以。随时取消，取消后会员资格持续到当前计费周期结束。",
  },
  {
    q: "适合谁？",
    qEn: "Who is this for?",
    a: "开发者、创业者、独立开发者。任何需要快速找到靠谱工具和项目的人。",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Stay Ahead. Pick the Right Ones.
            <br />
            <span className="text-gray-400">省时间，选对的。</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/#projects"
              className="border border-[#333] hover:border-[#555] text-white px-6 py-3 rounded-full transition-colors"
            >
              看项目 →
            </Link>
            <Link
              href="/subscribe"
              className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-3 rounded-full transition-colors font-medium"
            >
              订阅全部 ¥9.9/月
            </Link>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 border-t border-[#1f1f1f]">
        <div className="container">
          <h2 className="text-2xl font-bold mb-12 text-center">为什么值得花时间？</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "去噪音", titleEn: "Filter the Noise", body: "只选真正靠谱的项目，不凑数。" },
              { title: "快速判断", titleEn: "Fast Decision", body: "经过验证的设计方案，直接拿来用。" },
              { title: "拿来就用", titleEn: "Ready to Use", body: "代码、配置、规则全配套，上手即用。" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-[#111] border border-[#1f1f1f]">
                <h3 className="font-semibold mb-2">{item.titleEn}</h3>
                <p className="text-gray-400 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 border-t border-[#1f1f1f]">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">最新项目</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div
                key={p.name}
                className="p-6 rounded-xl bg-[#111] border border-[#1f1f1f] relative"
              >
                {p.locked && (
                  <span className="absolute top-4 right-4 text-xs bg-[#1f1f1f] text-gray-500 px-2 py-1 rounded">
                    🔒 {p.badge}
                  </span>
                )}
                <h3 className="font-semibold mb-2">{p.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{p.desc}</p>
                <p className="text-gray-600 text-xs mb-4">{p.descZh}</p>
                {p.locked ? (
                  <Link
                    href="/subscribe"
                    className="inline-block text-[#10b981] hover:text-[#059669] text-sm font-medium transition-colors"
                  >
                    Subscribe $9.9/mo →
                  </Link>
                ) : (
                  <Link
                    href="#"
                    className="inline-block text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Details → 查看详情 →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 border-t border-[#1f1f1f]">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">
            订阅解锁全部项目
          </h2>
          <p className="text-gray-400 mb-8">
            $9.9/月，随时取消。微信/支付宝/PayPal 均支持。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/subscribe"
              className="bg-[#10b981] hover:bg-[#059669] text-white px-8 py-3 rounded-full transition-colors font-semibold"
            >
              立即订阅
            </Link>
            <Link
              href="/membership"
              className="border border-[#333] hover:border-[#555] text-white px-6 py-3 rounded-full transition-colors"
            >
              查询会员状态
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-[#1f1f1f]">
        <div className="container max-w-2xl">
          <h2 className="text-2xl font-bold mb-8">常见问题</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border border-[#1f1f1f] rounded-lg p-4">
                <summary className="font-medium text-sm flex items-center justify-between">
                  <span>{faq.qEn}</span>
                  <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 text-sm mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
