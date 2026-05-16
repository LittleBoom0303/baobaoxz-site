"use client";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useEffect, useState } from "react";

// ─── Animated Background ───
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radial gradient glow center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(0,200,136,0.4) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00c888" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#00c888] animate-float-a opacity-60" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#00c8ff] animate-float-b opacity-50" />
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-[#7c3aed] animate-float-c opacity-40" />
      <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 rounded-full bg-[#00c888] animate-float-d opacity-20" />
    </div>
  );
}

// ─── Neon Text ───
function NeonText({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        textShadow: "0 0 20px rgba(0,200,136,0.3), 0 0 40px rgba(0,200,136,0.1)",
      }}
    >
      {children}
    </motion.span>
  );
}

// ─── Glowing Card ───
function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glow border */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(0,200,136,0.4), rgba(0,200,255,0.4), rgba(124,58,237,0.4))",
          filter: "blur(8px)",
        }}
      />
      {/* Card */}
      <div className="relative rounded-2xl bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/10 p-8 group-hover:border-[rgba(0,200,136,0.3)] transition-colors duration-500">
        {children}
      </div>
    </motion.div>
  );
}

// ─── Feature Icon ───
function FeatureIcon({ emoji, color }: { emoji: string; color: string }) {
  return (
    <motion.div
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
      style={{
        background: `rgba(${color}, 0.1)`,
        border: `1px solid rgba(${color}, 0.2)`,
        boxShadow: `0 0 20px rgba(${color}, 0.1)`,
      }}
      whileHover={{ scale: 1.08, rotate: 3 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {emoji}
    </motion.div>
  );
}

// ─── Pricing Card ───
function PricingCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative max-w-md mx-auto"
    >
      {/* Outer glow */}
      <div className="absolute -inset-1 rounded-3xl opacity-60"
        style={{
          background: "linear-gradient(135deg, #00c888, #00c8ff, #7c3aed, #00c888)",
          filter: "blur(20px)",
        }}
      />
      {/* Card */}
      <div className="relative rounded-3xl bg-[#0a0a0f] border border-[rgba(0,200,136,0.3)] p-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,200,136,0.3)] bg-[rgba(0,200,136,0.08)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c888] animate-pulse" />
          <span className="text-sm text-[#00c888] font-medium">年度会员 · 限时特惠</span>
        </div>

        <div className="text-5xl font-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
          ¥88
          <span className="text-xl text-white/40 font-normal ml-1">/年</span>
        </div>
        <div className="text-white/30 text-sm mb-8 line-through">原价 ¥199.9/年</div>

        <ul className="text-left space-y-4 mb-10">
          {[
            { text: "无限文字 / 语音对话", color: "0,200,136" },
            { text: "音色克隆（30秒还原你的声音）", color: "0,200,255" },
            { text: "多个 AI 角色切换", color: "124,58,237" },
            { text: "云端聊天记录同步", color: "0,200,136" },
            { text: "跨平台 Web / App", color: "0,200,255" },
          ].map(({ text, color }) => (
            <li key={text} className="flex items-center gap-3 text-white/80">
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(${color}, 0.2)`, border: `1px solid rgba(${color}, 0.4)` }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4.5 7.5L8 3" stroke={`rgb(${color})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {text}
            </li>
          ))}
        </ul>

        <Link
          href="/subscribe"
          className="block w-full py-4 rounded-2xl text-white font-semibold text-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #00c888, #00c8ff)",
            boxShadow: "0 0 30px rgba(0,200,136,0.3), 0 0 60px rgba(0,200,136,0.1)",
          }}
        >
          立即订阅 ¥88/年
        </Link>

        <p className="text-white/20 text-xs mt-4">支付即表示同意《用户协议》和《隐私政策》</p>
      </div>
    </motion.div>
  );
}

// ─── FAQ Item ───
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between gap-4 py-5 border-b border-white/8"
      >
        <span className="text-white/90 font-medium">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#00c888] text-xl flex-shrink-0"
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-white/40 text-sm leading-relaxed pb-5">{a}</p>
      </motion.div>
    </motion.div>
  );
}

// ─── HowItWorks Step ───
function StepCard({ num, title, desc, index }: { num: string; title: string; desc: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative text-center"
    >
      {/* Connector line */}
      {index < 2 && (
        <div className="hidden md:block absolute top-7 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-px"
          style={{
            background: "linear-gradient(90deg, rgba(0,200,136,0.4), rgba(0,200,255,0.4))",
          }}
        />
      )}
      {/* Number circle */}
      <div className="relative inline-flex mb-5">
        <div className="absolute inset-0 rounded-full opacity-30"
          style={{ background: "rgba(0,200,136,0.2)", filter: "blur(10px)" }}
        />
        <div className="relative w-14 h-14 rounded-full border border-[rgba(0,200,136,0.4)] bg-[rgba(0,200,136,0.08)] flex items-center justify-center text-xl font-bold text-[#00c888]"
          style={{ fontFamily: "monospace" }}>
          {num}
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed max-w-[200px] mx-auto">{desc}</p>
    </motion.div>
  );
}

// ─── Main Page ───
export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -60]), { stiffness: 100, damping: 30 });

  const features = [
    { emoji: "🎙️", title: "30 秒克隆你的声音", desc: "在安静环境录制 30 秒音频，AI 学习你的音色特征，还原自然流畅的语音输出。", color: "0,200,136" },
    { emoji: "💬", title: "无限对话，实时流式输出", desc: "支持文字和语音输入，AI 回复以语音流式播放，边听边聊。SSE 实时通信，低延迟体验。", color: "0,200,255" },
    { emoji: "🔊", title: "多个角色，多种音色", desc: "除了默认音色小黎，还可克隆专属音色。不同场景切换不同角色，陪伴、学习、娱乐都可以。", color: "124,58,237" },
    { emoji: "📱", title: "跨平台，随时使用", desc: "Web/App 多端同步，碎片时间随时对话。云端存储聊天记录，换设备也不丢失。", color: "0,200,136" },
    { emoji: "🔒", title: "隐私优先，数据安全", desc: "音色克隆需签署授权书，录音仅用于生成音色模型。数据加密传输，放心使用。", color: "0,200,255" },
    { emoji: "⚡", title: "火山引擎 TTS 技术", desc: "基于字节跳动火山引擎语音合成技术，高保真音色还原，流畅自然的语调生成。", color: "124,58,237" },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-32 pb-28 overflow-hidden">
        <GridBackground />

        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[rgba(0,200,136,0.3)] bg-[rgba(0,200,136,0.06)] mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-[#00c888] animate-pulse" />
          <span className="text-sm text-[#00c888] font-medium tracking-wide">音色克隆 · AI 陪伴 · 跨平台</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          style={{ y }}
        >
          <NeonText>用你的声音</NeonText>
          <br />
          <NeonText delay={0.15}>和 AI 聊聊</NeonText>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative z-10 text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-12"
        >
          录 30 秒声音，AI 就能用你的音色说话。
          <br />
          文字输入、语音对话，随时随地陪伴。
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative z-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/subscribe"
            className="px-9 py-4 rounded-2xl text-white font-semibold text-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #00c888, #00c8ff)",
              boxShadow: "0 0 40px rgba(0,200,136,0.25), 0 0 80px rgba(0,200,136,0.1)",
            }}
          >
            立即订阅 ¥88/年
          </Link>
          <Link
            href="/membership"
            className="px-9 py-4 rounded-2xl font-semibold text-lg text-white/60 border border-white/15 hover:border-[rgba(0,200,136,0.4)] hover:text-white/90 transition-all duration-300 hover:scale-[1.03]"
            style={{ backdropFilter: "blur(10px)" }}
          >
            查询会员
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-2 rounded-full bg-[#00c888]"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-6 py-28 max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,200,136,0.2)] bg-[rgba(0,200,136,0.04)] mb-4">
            <span className="text-[#00c888] text-xs font-medium tracking-widest uppercase">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">产品功能</h2>
          <p className="text-white/40 text-lg">每个功能都为真实使用场景设计</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <GlowCard key={f.title}>
              <FeatureIcon emoji={f.emoji} color={f.color} />
              <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{f.desc}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-6 py-28 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(0,200,136,0.03) 50%, transparent 100%)",
        }}>
        <div className="absolute inset-0">
          <GridBackground />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,200,136,0.2)] bg-[rgba(0,200,136,0.04)] mb-4">
              <span className="text-[#00c888] text-xs font-medium tracking-widest uppercase">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">如何使用</h2>
            <p className="text-white/40 text-lg">三步开始你的 AI 声音陪伴</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard num="01" title="订阅会员" desc="¥88/年订阅会员，解锁全部功能，包括音色克隆权益。" index={0} />
            <StepCard num="02" title="录制声音" desc="在安静环境录制 30 秒语音，朗读一段文字，提交后 AI 开始训练音色。" index={1} />
            <StepCard num="03" title="开始对话" desc="用你自己的声音和 AI 对话，文字输入或语音输入，AI 语音流式播放回复。" index={2} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative px-6 py-28 overflow-hidden">
        <div className="absolute inset-0">
          <GridBackground />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,200,136,0.2)] bg-[rgba(0,200,136,0.04)] mb-4">
              <span className="text-[#00c888] text-xs font-medium tracking-widest uppercase">Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">会员订阅</h2>
            <p className="text-white/40 text-lg">一次订阅，全部功能开放</p>
          </motion.div>
          <PricingCard />
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-6 py-28 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.03) 50%, transparent 100%)",
        }}>
        <div className="absolute inset-0">
          <GridBackground />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,200,136,0.2)] bg-[rgba(0,200,136,0.04)] mb-4">
              <span className="text-[#00c888] text-xs font-medium tracking-widest uppercase">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">常见问题</h2>
          </motion.div>

          <div className="border-t border-white/8">
            {[
              { q: "音色克隆需要多久？", a: "提交录音后，AI 训练需要数分钟。训练完成后会收到通知，之后即可使用克隆音色和 AI 对话。" },
              { q: "会员到期后，我的音色和聊天记录还在吗？", a: "会员到期后，音色克隆权益暂停，但您的聊天记录和音色模型数据会保留。续费后可继续使用。" },
              { q: "可以退款吗？", a: "订阅费用一经支付，不支持退款。如有特殊情况请联系客服处理。" },
              { q: "支持哪些支付方式？", a: "支持微信支付、支付宝扫码付款。国外用户支持 PayPal。" },
              { q: "如何查询我的会员状态？", a: "点击页面导航栏的「会员」按钮，输入您的手机号获取验证码即可查询。" },
            ].map((item, i) => (
              <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(0,200,136,0.5) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold text-white mb-5"
          >
            开始你的 AI 声音之旅
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/40 text-lg mb-10"
          >
            用自己的声音，和 AI 聊任何话题
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/subscribe"
              className="inline-block px-14 py-5 rounded-2xl text-white font-semibold text-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.04]"
              style={{
                background: "linear-gradient(135deg, #00c888, #00c8ff)",
                boxShadow: "0 0 60px rgba(0,200,136,0.3), 0 0 120px rgba(0,200,136,0.1)",
              }}
            >
              立即订阅 ¥88/年
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
