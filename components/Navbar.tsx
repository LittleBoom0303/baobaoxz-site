"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [lang, setLang] = useState<"zh" | "en">("zh");

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold text-base tracking-tight">
            BBXZ
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted">
            <Link href="/#projects" className="hover:text-foreground transition-colors">
              {lang === "zh" ? "项目" : "Projects"}
            </Link>
            <Link href="/subscribe" className="hover:text-foreground transition-colors">
              Subscribe
            </Link>
            <Link href="/membership" className="hover:text-foreground transition-colors">
              {lang === "zh" ? "会员" : "Membership"}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang("en")}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
              lang === "en" ? "text-foreground font-medium" : "text-muted hover:text-foreground"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("zh")}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
              lang === "zh" ? "text-foreground font-medium" : "text-muted hover:text-foreground"
            }`}
          >
            中文
          </button>
          <Link
            href="/subscribe"
            className="ml-3 bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm px-4 py-1.5 rounded-full transition-colors font-medium"
          >
            {lang === "zh" ? "立即订阅" : "Subscribe"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
