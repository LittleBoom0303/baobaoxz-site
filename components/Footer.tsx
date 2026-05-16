"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export default function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="border-t border-[rgba(255,255,255,0.07)] py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
        <div>
          © 2026 BBXZ. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/subscribe" className="hover:text-[#00c888] transition-colors">
            {locale === "zh" ? "订阅" : "Subscribe"}
          </Link>
          <Link href="/membership" className="hover:text-[#00c888] transition-colors">
            {locale === "zh" ? "会员" : "Membership"}
          </Link>
          <Link href="/privacy" className="hover:text-[#00c888] transition-colors">
            {locale === "zh" ? "隐私政策" : "Privacy Policy"}
          </Link>
          <Link href="/terms" className="hover:text-[#00c888] transition-colors">
            {locale === "zh" ? "使用协议" : "Terms of Service"}
          </Link>
          <a
            href={`mailto:contact@baobaoxz.com?subject=${locale === "zh" ? "联系 BBXZ" : "Contact BBXZ"}`}
            className="hover:text-[#00c888] transition-colors"
          >
            {locale === "zh" ? "联系我们" : "Contact"}
          </a>
        </div>
      </div>
    </footer>
  );
}
