"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TermsPage() {
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
            {isZh ? "用户协议" : "Terms of Service"}
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
              {isZh ? "1. 服务说明" : "1. Service Description"}
            </h2>
            <p>
              {isZh
                ? "BBXZ（Flexichrono）是一款 AI 声音陪伴产品，提供音色克隆、文字对话、语音交互等服务（以下简称「本服务」）。本服务按「现状」提供，我们会尽力保证服务的稳定性和可用性，但不对服务的绝对无间断作出承诺。"
                : "BBXZ (Flexichrono) is an AI voice companion product providing voice cloning, text chat, and voice interaction services (collectively, \"the Service\"). The Service is provided \"as is.\" We strive to maintain stability and availability but do not guarantee uninterrupted service."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "2. 账号注册与安全" : "2. Account Registration and Security"}
            </h2>
            <p>
              {isZh
                ? "您需要使用手机号码注册本服务。我们会向您的手机号发送验证码以完成登录。请妥善保管您的账号信息，如因您个人保管不善导致的账号被盗用，由您自行承担责任。"
                : "You need a phone number to register for this service. We send a verification code to your phone for login. Please keep your account information secure. You are responsible for any unauthorized use of your account due to your own negligence."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "3. 会员订阅与退款" : "3. Subscription and Refund Policy"}
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                {isZh
                  ? "订阅费用：月度会员 ¥9.9/月，季度会员 ¥55.9/季，年度会员 ¥88/年（以页面实际标价为准）。"
                  : "Subscription fees: Monthly ¥9.9/mo, Quarterly ¥55.9/qtr, Annual ¥88/yr (subject to actual prices on the page)."}
              </li>
              <li>
                {isZh
                  ? "订阅生效：支付成功后会员权益即时开通。"
                  : "Activation: Membership benefits are activated immediately upon successful payment."}
              </li>
              <li>
                {isZh
                  ? "退款政策：订阅费用一经支付，不支持退款。如有特殊情况请联系客服处理。"
                  : "Refund Policy: Subscription fees are non-refundable after payment. Contact customer support for special circumstances."}
              </li>
              <li>
                {isZh
                  ? "自动续费：年度会员到期前 3 天内如未取消，将自动续费下一年度。季度会员到期前 1 天内自动续费。"
                  : "Auto-renewal: Annual members are auto-renewed within 3 days before expiry unless cancelled. Quarterly members auto-renew within 1 day before expiry."}
              </li>
              <li>
                {isZh
                  ? "取消订阅：可随时联系 contact@baobaoxz.com 取消，取消后当前周期内权益不受影响。"
                  : "Cancellation: You may cancel anytime via contact@baobaoxz.com. Benefits remain active for the current period after cancellation."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "4. 音色克隆授权" : "4. Voice Cloning Authorization"}
            </h2>
            <p>
              {isZh
                ? "使用音色克隆功能即表示您确认：所提交的录音音频为您本人声音或已获得声音所有人的合法授权。您对克隆音色享有合法权益，不得用于仿冒、欺诈或其他违法用途。因音色克隆内容产生的任何法律责任由您自行承担。"
                : "By using the voice cloning feature, you confirm that the voice recording you submit is your own voice or you have obtained legitimate authorization from the voice owner. You bear full legal responsibility for any use of cloned voices for impersonation, fraud, or other illegal purposes."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "5. 禁止用途" : "5. Prohibited Uses"}
            </h2>
            <p>{isZh ? "您同意不会使用本服务从事以下行为：" : "You agree not to use this service to:"}</p>
            <ul className="space-y-1.5 list-disc pl-5 mt-2">
              <li>{isZh ? "违反任何适用法律法规" : "Violate any applicable laws or regulations"}</li>
              <li>{isZh ? "仿冒他人或进行任何形式的欺诈" : "Impersonate others or engage in any form of fraud"}</li>
              <li>{isZh ? "生成虚假信息、仇恨言论、暴力内容" : "Generate false information, hate speech, or violent content"}</li>
              <li>{isZh ? "干扰或破坏服务正常运行" : "Interfere with or disrupt the normal operation of the service"}</li>
              <li>{isZh ? "试图未经授权访问其他用户账号或数据" : "Attempt unauthorized access to other users' accounts or data"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "6. 知识产权" : "6. Intellectual Property"}
            </h2>
            <p>
              {isZh
                ? "本服务中的 AI 模型、技术、文字内容、界面设计等知识产权归我们或相关权利人所有。未经授权不得复制、修改、传播或用于商业目的。"
                : "The AI models, technology, text content, and interface design of this service are owned by us or respective right holders. Reproduction, modification, distribution, or commercial use without authorization is prohibited."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "7. 服务变更与终止" : "7. Service Changes and Termination"}
            </h2>
            <p>
              {isZh
                ? "我们保留随时修改或中断服务的权利，并将尽可能提前通知用户。因服务变更或中断对您造成的损失，我们的责任仅限于您已支付但尚未使用的服务费用。"
                : "We reserve the right to modify or discontinue the service at any time with reasonable notice where possible. Our liability for any losses due to service changes or interruptions is limited to fees you have paid for unused services."}
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">
              {isZh ? "8. 联系我们" : "8. Contact Us"}
            </h2>
            <p>
              {isZh
                ? "如对本协议有任何疑问，请联系："
                : "For any questions about these Terms, please contact:"}
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
