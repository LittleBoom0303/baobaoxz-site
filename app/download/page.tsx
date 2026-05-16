"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PLATFORMS = [
  {
    id: "android",
    name: "Android",
    tag: "Android 5.0+",
    desc_zh: "APK 直接安装，无需 Google Play",
    desc_en: "APK direct install, no Google Play required",
    cta_zh: "下载 APK",
    cta_en: "Download APK",
    href: "/app/flexichrono.apk",
    badge: "可下载",
    badgeColor: "#00c888",
  },
  {
    id: "web",
    name: "Web 版",
    tag: "浏览器打开",
    desc_zh: "任何设备的浏览器都能打开，功能完整",
    desc_en: "Open in any browser, full features",
    cta_zh: "打开 Web 版",
    cta_en: "Open Web Version",
    href: "https://flexichrono.com/app",
    badge: "开发中",
    badgeColor: "#f59e0b",
  },
  {
    id: "ios",
    name: "iOS",
    tag: "即将上架",
    desc_zh: "App Store 审核中，敬请期待",
    desc_en: "Pending App Store review",
    cta_zh: "敬请期待",
    cta_en: "Coming Soon",
    href: null,
    badge: "敬请期待",
    badgeColor: "#6b7280",
  },
];

function PlatformCard({ p, locale }: { p: typeof PLATFORMS[0]; locale: string }) {
  const isAndroid = p.id === "android";
  const [downloading, setDownloading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-dark p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-white font-semibold text-lg">{p.name}</h2>
            {p.badge && (
              <span
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{
                  color: p.badgeColor,
                  borderColor: `${p.badgeColor}40`,
                  background: `${p.badgeColor}10`,
                }}
              >
                {p.badge}
              </span>
            )}
          </div>
          <div className="text-white/30 text-sm mb-1">{p.tag}</div>
          <div className="text-white/40 text-sm">{locale === "zh" ? p.desc_zh : p.desc_en}</div>
        </div>

        {p.href ? (
          <a
            href={p.href}
            download={isAndroid ? "Flexichrono.apk" : undefined}
            target={p.id === "web" ? "_blank" : undefined}
            rel="noopener noreferrer"
            onClick={() => isAndroid && setDownloading(true)}
            className="shrink-0 px-6 py-3 rounded-xl text-white text-sm font-medium text-center transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #00c888, #00c8ff)",
              boxShadow: "0 0 20px rgba(0,200,136,0.15)",
            }}
          >
            {downloading && isAndroid
              ? locale === "zh" ? "下载中..." : "Downloading..."
              : locale === "zh" ? p.cta_zh : p.cta_en}
          </a>
        ) : (
          <span
            className="shrink-0 px-6 py-3 rounded-xl text-white/30 text-sm font-medium border border-white/10 cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {locale === "zh" ? p.cta_zh : p.cta_en}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function DownloadPage() {
  const [locale, setLocale] = useState("zh");

  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
      if (match) {
        const val = decodeURIComponent(match[1]);
        if (val === "zh" || val === "en") setLocale(val);
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="page-dark">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl font-bold text-white mb-3">
            {locale === "zh" ? "下载 App" : "Download App"}
          </h1>
          <p className="text-white/40 text-lg">
            {locale === "zh" ? "选择你的平台，开始使用" : "Choose your platform and get started"}
          </p>
        </motion.div>

        {/* Platform cards */}
        <div className="space-y-4 mb-12">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <PlatformCard p={p} locale={locale} />
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card-dark p-6 mb-12"
        >
          <h3 className="text-white font-semibold text-base mb-5">
            {locale === "zh" ? "使用流程" : "How It Works"}
          </h3>
          <div className="space-y-4">
            {[
              {
                num: "1",
                title_zh: "下载或打开 App",
                title_en: "Download or Open App",
                desc_zh: "选择你喜欢的方式安装",
                desc_en: "Install in your preferred way",
              },
              {
                num: "2",
                title_zh: "注册/登录账号",
                title_en: "Register / Login",
                desc_zh: "手机号 + 验证码即可登录",
                desc_en: "Phone number + SMS code to login",
              },
              {
                num: "3",
                title_zh: "订阅会员",
                title_en: "Subscribe",
                desc_zh: "¥88/年，解锁全部功能",
                desc_en: "¥88/year, unlock all features",
              },
              {
                num: "4",
                title_zh: "开始使用",
                title_en: "Start Using",
                desc_zh: "文字对话、语音输入、音色克隆",
                desc_en: "Text chat, voice input, voice clone",
              },
            ].map(({ num, title_zh, title_en, desc_zh, desc_en }, i) => (
              <motion.div
                key={num}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,200,136,0.2), rgba(0,200,255,0.2))",
                    border: "1px solid rgba(0,200,136,0.3)",
                    color: "#00c888",
                  }}
                >
                  {num}
                </div>
                <div>
                  <div className="text-white/80 font-medium text-sm">
                    {locale === "zh" ? title_zh : title_en}
                  </div>
                  <div className="text-white/30 text-xs mt-0.5">
                    {locale === "zh" ? desc_zh : desc_en}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-white/30 text-sm mb-5">
            {locale === "zh" ? "订阅会员后解锁音色克隆功能" : "Subscribe to unlock voice cloning"}
          </p>
          <Link
            href="/subscribe"
            className="inline-block px-10 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #00c888, #00c8ff)",
              boxShadow: "0 0 40px rgba(0,200,136,0.2)",
            }}
          >
            {locale === "zh" ? "立即订阅 ¥88/年" : "Subscribe Now ¥88/yr"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
