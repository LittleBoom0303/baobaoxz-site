"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [lang, setLang] = useState<"zh" | "en">("zh");

  return (
    <nav className="border-b border-[#1f1f1f]">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg tracking-tight">
            BBXZ
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/#projects" className="text-gray-400 hover:text-white transition-colors">
              {lang === "zh" ? "项目" : "Projects"}
            </Link>
            <Link
              href="/subscribe"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang("en")}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              lang === "en" ? "bg-[#222]" : "text-gray-500 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("zh")}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              lang === "zh" ? "bg-[#222]" : "text-gray-500 hover:text-white"
            }`}
          >
            中文
          </button>
          <Link
            href="/subscribe"
            className="bg-[#10b981] hover:bg-[#059669] text-white text-sm px-4 py-1.5 rounded-full transition-colors font-medium"
          >
            {lang === "zh" ? "立即订阅" : "Subscribe"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
