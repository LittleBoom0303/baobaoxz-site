"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function PrivacyPage() {
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

  const isZh = locale === "zh";

  return (
    <div className="page-dark">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {isZh ? "隐私政策" : "Privacy Policy"}
          </h1>
          <p className="text-white/30 text-sm">
            {isZh ? "更新日期：2026 年 5 月 16 日" : "Last updated: May 16, 2026"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8 text-white/60 text-sm leading-relaxed"
        >
          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "1. 信息收集" : "1. Information We Collect"}
            </h2>
            <p>
              {isZh
                ? "我们收集您主动提供的信息，包括：手机号码（用于账号注册和登录验证码）、录音音频（用于音色克隆功能）、聊天记录（存储于云端以实现多设备同步）。我们不会收集与以上功能无关的个人信息。"
                : "We collect information you actively provide: phone number (for account registration and SMS login), voice recordings (for voice cloning), and chat history (stored in cloud for multi-device sync). We do not collect personal information unrelated to these functions."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "2. 信息使用" : "2. How We Use Your Information"}
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>{isZh ? "提供语音合成和音色克隆服务" : "Providing voice synthesis and voice cloning services"}</li>
              <li>{isZh ? "实现多设备聊天记录同步" : "Enabling multi-device chat history sync"}</li>
              <li>{isZh ? "发送服务相关的通知（如会员到期提醒）" : "Sending service-related notifications (e.g., membership expiry reminders)"}</li>
              <li>{isZh ? "改善产品体验和服务稳定性" : "Improving product experience and service stability"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "3. 信息存储与安全" : "3. Data Storage and Security"}
            </h2>
            <p>
              {isZh
                ? "您的数据存储于阿里云服务器（位于中国大陆）。我们采用加密传输（HTTPS）和加密存储来保护您的数据安全。请勿与他人分享您的账号验证码。"
                : "Your data is stored on Alibaba Cloud servers (located in mainland China). We use encrypted transmission (HTTPS) and encrypted storage to protect your data. Please do not share your account verification codes with others."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "4. 信息共享" : "4. Information Sharing"}
            </h2>
            <p>
              {isZh
                ? "除以下情况外，我们不会与任何第三方共享您的个人信息：(1) 获得您的明确同意；(2) 法律法规或政府要求；(3) 保护我们的合法权益所需的最小范围。音色克隆音频仅用于服务目的，不会出售或提供给第三方。"
                : "We do not share your personal information with any third parties except: (1) with your explicit consent; (2) as required by law or government; (3) to the minimum extent necessary to protect our legitimate interests. Voice cloning audio is used only for service purposes and is not sold or provided to third parties."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "5. 您的权利" : "5. Your Rights"}
            </h2>
            <p>
              {isZh
                ? "您有权查询、导出或删除您的个人数据。如需删除账号或清除所有数据，请联系 contact@baobaoxz.com。删除后数据将在 30 天内不可恢复。"
                : "You have the right to query, export, or delete your personal data. To delete your account or all data, please contact contact@baobaoxz.com. Data will be irrecoverably removed within 30 days after deletion."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "6. 儿童隐私" : "6. Children's Privacy"}
            </h2>
            <p>
              {isZh
                ? "我们的服务不面向 14 岁以下儿童，我们不会故意收集未成年人个人信息。"
                : "Our services are not directed to children under 14. We do not knowingly collect personal information from minors."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "7. 政策更新" : "7. Policy Updates"}
            </h2>
            <p>
              {isZh
                ? "我们可能会不时更新本隐私政策。更新后将在页面顶部注明最新更新日期。建议您定期查阅。"
                : "We may update this Privacy Policy from time to time. Updates will be indicated by the \"Last updated\" date at the top of this page. We recommend reviewing it periodically."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "8. 联系我们" : "8. Contact Us"}
            </h2>
            <p>
              {isZh
                ? "如对本隐私政策有任何疑问，请联系："
                : "For any questions about this Privacy Policy, please contact:"}
            </p>
            <p className="mt-1">
              <a href="mailto:contact@baobaoxz.com" className="text-[#00c888] hover:underline">
                contact@baobaoxz.com
              </a>
            </p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
