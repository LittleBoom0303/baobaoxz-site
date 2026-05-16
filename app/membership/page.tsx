"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function MembershipPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<{
    hasMembership: boolean;
    plan: string | null;
    expiresAt: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"query" | "result">("query");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [codeLoading, setCodeLoading] = useState(false);

  const sendCode = async () => {
    if (!phone || phone.length !== 11) return;
    setCodeLoading(true);
    try {
      await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setCountdown(60);
    } finally {
      setCodeLoading(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const queryStatus = async () => {
    if (!phone || phone.length !== 11 || !code || code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const user_id = `user_${phone.slice(-4)}`;
      const res = await fetch(`/api/membership?user_id=${user_id}`);
      const data = await res.json();
      setStatus({
        hasMembership: data.hasMembership ?? false,
        plan: data.plan ?? null,
        expiresAt: data.expiresAt ?? null,
      });
      setStep("result");
    } catch {
      setError("查询失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-dark">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pt-24 pb-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">会员状态</h1>
          <p className="text-white/40">查询您的订阅情况</p>
        </motion.div>

        {step === "query" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Phone input */}
            <div className="card-dark p-5 mb-4">
              <div className="section-title-dark mb-3">手机号</div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="请输入 11 位手机号"
                maxLength={11}
                className="input-dark"
              />
            </div>

            {/* Code input */}
            <div className="card-dark p-5 mb-4">
              <div className="section-title-dark mb-3">验证码</div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6 位验证码"
                  maxLength={6}
                  className="input-dark flex-1"
                />
                <motion.button
                  onClick={sendCode}
                  disabled={codeLoading || !phone || phone.length !== 11 || countdown > 0}
                  className="px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    background: countdown > 0 ? "rgba(255,255,255,0.06)" : "rgba(0,200,136,0.12)",
                    color: countdown > 0 ? "rgba(255,255,255,0.3)" : "#00c888",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: (codeLoading || !phone || phone.length !== 11 || countdown > 0) ? "not-allowed" : "pointer",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                </motion.button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl mb-4 text-center text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              className="btn-primary-dark mb-4"
              onClick={queryStatus}
              disabled={loading || !phone || !code}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "查询中..." : "查询会员状态"}
            </motion.button>
          </motion.div>
        )}

        {step === "result" && status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Status card */}
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm text-white/50">会员状态</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  status.hasMembership
                    ? "bg-[rgba(0,200,136,0.1)] text-[#00c888] border-[rgba(0,200,136,0.3)]"
                    : "bg-[rgba(255,255,255,0.04)] text-white/40 border-[rgba(255,255,255,0.1)]"
                }`}>
                  {status.hasMembership ? "✓ 已开通" : "未开通"}
                </span>
              </div>

              {status.hasMembership ? (
                <div className="space-y-4">
                  {[
                    ["会员计划", status.plan === "yearly" ? "年度会员" : status.plan === "quarterly" ? "季度会员" : status.plan === "monthly" ? "月度会员" : status.plan ?? "—"],
                    ["到期时间", status.expiresAt ? new Date(status.expiresAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }) : "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-3 border-t border-white/5">
                      <span className="text-sm text-white/40">{label}</span>
                      <span className="text-sm text-white/80 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-white/40 mb-5">尚未开通会员</p>
                  <Link href="/subscribe" className="btn-primary-dark inline-block">
                    立即订阅
                  </Link>
                </div>
              )}
            </div>

            {/* Benefits card */}
            {status.hasMembership && (
              <div className="card-dark p-6">
                <h3 className="text-white font-semibold text-base mb-5">会员权益</h3>
                <ul className="space-y-4">
                  {[
                    ["🎙️", "专属音色克隆", "录制 30 秒，还原你的声音"],
                    ["💬", "无限对话", "文字 / 语音输入，想聊多久聊多久"],
                    ["🔊", "更多音色", "解锁小黎之外的声音"],
                    ["📱", "跨平台使用", "Web / App 随时切换"],
                  ].map(([icon, title, desc]) => (
                    <li key={title} className="flex gap-4">
                      <span className="text-xl mt-0.5">{icon}</span>
                      <div>
                        <div className="text-white/80 font-medium text-sm">{title}</div>
                        <div className="text-white/30 text-xs">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <motion.button
              className="btn-secondary-dark"
              onClick={() => { setStep("query"); setStatus(null); }}
              whileTap={{ scale: 0.98 }}
            >
              重新查询
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
