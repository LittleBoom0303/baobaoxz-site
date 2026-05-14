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
    a: "涵盖 AI 编程、终端工具、API 开发、数据处理、自动化等实用项目。每个项目都经过实战验证，可直接使用。",
  },
  {
    q: "多久更新一次？",
    a: "每周更新 1-3 个新项目，老项目持续维护迭代。订阅用户可随时查看全部历史项目。",
  },
  {
    q: "可以取消吗？",
    a: "可以。随时取消，取消后会员资格持续到当前计费周期结束。",
  },
  {
    q: "适合谁？",
    a: "开发者、创业者、独立开发者。任何需要快速找到靠谱工具和项目的人。",
  },
  {
    q: "如何支付？",
    a: "支持微信支付、支付宝、PayPal。扫码即可开通，支付后会员立即生效。",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-28 text-center">
        <div className="container">
          <p className="text-sm font-semibold tracking-wide text-muted uppercase mb-6">
            BBXZ — 发现值得花时间的项目
          </p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-tight">
            省时间，<br className="hidden md:block" />
            选对的。
          </h1>
          <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            每周更新实用项目，涵盖 AI 编程、终端工具、API 开发。
            <br />
            经过验证的设计方案，直接拿来用。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/subscribe" className="btn-primary">
              立即订阅 ¥88/年
            </Link>
            <Link href="/#projects" className="btn-secondary">
              查看项目
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-[rgba(0,0,0,0.06)]" />

      {/* Why */}
      <section className="py-28">
        <div className="container">
          <p className="text-sm font-semibold tracking-wide text-muted uppercase text-center mb-4">
            为什么选择 BBXZ
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 tracking-tight">
            只选真正靠谱的
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "去噪音",
                body: "只选经过验证的项目，不凑数。每个推荐都有实战依据。",
              },
              {
                title: "快速判断",
                body: "经过验证的设计方案，代码+配置+规则全配套，上手即用。",
              },
              {
                title: "持续维护",
                body: "项目持续迭代，更新修复不用你操心。订阅期内全部免费。",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-[rgba(0,0,0,0.06)]" />

      {/* Projects */}
      <section id="projects" className="py-28">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
            最新项目
          </h2>
          <p className="text-muted mb-12 text-lg">
            部分项目仅对订阅用户开放
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p) => (
              <div
                key={p.name}
                className="apple-card relative flex flex-col justify-between"
              >
                {p.locked && (
                  <span className="absolute top-6 right-6 text-xs font-medium text-muted bg-[rgba(0,0,0,0.04)] px-3 py-1 rounded-full">
                    🔒 订阅专属
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-2 pr-16">{p.name}</h3>
                  <p className="text-muted text-sm mb-2 leading-relaxed">{p.desc}</p>
                  <p className="text-[rgba(0,0,0,0.4)] text-xs">{p.descZh}</p>
                </div>
                {p.locked ? (
                  <Link
                    href="/subscribe"
                    className="mt-6 inline-flex items-center gap-1 text-[#0071e3] hover:text-[#0077ed] text-sm font-medium transition-colors"
                  >
                    订阅查看 →
                  </Link>
                ) : (
                  <Link
                    href="#"
                    className="mt-6 inline-flex items-center gap-1 text-[#0071e3] hover:text-[#0077ed] text-sm font-medium transition-colors"
                  >
                    查看详情 →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div classyle={{ height: "1px", background: "rgba(0,0,0,0.06)" }} />

      {/* Subscribe CTA */}
      <section className="py-28">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
            解锁全部项目
          </h2>
          <p className="text-muted text-lg mb-10">
            年度会员 ¥88，随时取消。微信 · 支付宝 · PayPal
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/subscribe" className="btn-primary">
              立即订阅
            </Link>
            <Link href="/membership" className="btn-secondary">
              查询会员状态
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-[rgba(0,0,0,0.06)]" />

      {/* FAQ */}
      <section className="py-28">
        <div className="container max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 tracking-tight">
            常见问题
          </h2>
          <div className="space-y-1">
            {faqs.map((faq) => (
              <details key={faq.q} className="group">
                <summary className="flex items-center justify-between py-4 text-lg font-medium cursor-pointer list-none">
                  <span>{faq.q}</span>
                  <span className="text-muted text-sm group-open:rotate-180 transition-transform duration-200 ml-4">▲</span>
                </summary>
                <div className="h-px bg-[rgba(0,0,0,0.06)]" />
                <p className="text-muted py-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-10 mt-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted">
            © 2026 BBXZ. All rights reserved.
          </div>
          <div className="flex items-center gap-8">
            <Link href="/subscribe" className="text-sm text-muted hover:text-foreground transition-colors">
              Subscribe
            </Link>
            <Link href="/membership" className="text-sm text-muted hover:text-foreground transition-colors">
              会员
            </Link>
            <a href="mailto:contact@baobaoxz.com" className="text-sm text-muted hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
