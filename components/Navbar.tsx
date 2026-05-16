"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "./LocaleProvider";

export default function Navbar() {
  const { locale, setLocale } = useLocale();

  return (
    <nav
      className="navbar"
      style={{
        background: "rgba(5,5,8,0.85)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg tracking-tight text-white">
          BBXZ
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/#features" className="text-white/40 hover:text-[#00c888] transition-colors duration-300">
            {locale === "zh" ? "功能" : "Features"}
          </Link>
          <Link href="/subscribe" className="text-white/40 hover:text-[#00c888] transition-colors duration-300">
            {locale === "zh" ? "订阅" : "Subscribe"}
          </Link>
          <Link href="/membership" className="text-white/40 hover:text-[#00c888] transition-colors duration-300">
            {locale === "zh" ? "会员" : "Membership"}
          </Link>
          <Link href="/download" className="text-white/40 hover:text-[#00c888] transition-colors duration-300">
            {locale === "zh" ? "下载" : "Download"}
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <button
            onClick={() => setLocale("en")}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors duration-200 cursor-pointer ${
              locale === "en" ? "text-white font-medium" : "text-white/40 hover:text-white/70"
            }`}
          >
            EN
          </button>
          <span className="text-white/20 text-xs">/</span>
          <button
            onClick={() => setLocale("zh")}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors duration-200 cursor-pointer ${
              locale === "zh" ? "text-white font-medium" : "text-white/40 hover:text-white/70"
            }`}
          >
            中文
          </button>

          {/* Download */}
          <Link
            href="/download"
            className="ml-2 text-sm px-4 py-1.5 rounded-full text-white/60 border border-white/12 hover:border-[rgba(0,200,136,0.4)] hover:text-white/90 transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            {locale === "zh" ? "下载 App" : "Download"}
          </Link>

          {/* Subscribe */}
          <Link
            href="/subscribe"
            className="text-sm px-4 py-1.5 rounded-full text-white font-medium transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #00c888, #00c8ff)",
              boxShadow: "0 0 16px rgba(0,200,136,0.2)",
            }}
          >
            {locale === "zh" ? "立即订阅" : "Subscribe"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
