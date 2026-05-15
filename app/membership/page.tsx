"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pt-24 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-semibold tracking-tight mb-3">会员状态</h1>
          <p className="text-lg text-neutral-500">查询您的订阅情况</p>
        </div>

        {step === "query" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="请输入 11 位手机号"
                maxLength={11}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-base outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">验证码</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6 位验证码"
                  maxLength={6}
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 text-base outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendCode}
                  disabled={codeLoading || !phone || phone.length !== 11 || countdown > 0}
                  className="px-4 py-3 rounded-xl bg-neutral-100 text-neutral-600 text-sm font-medium whitespace-nowrap disabled:opacity-40 hover:bg-neutral-200 transition"
                >
                  {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={queryStatus}
              disabled={loading || !phone || !code}
              className="w-full py-4 rounded-full bg-blue-600 text-white text-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition"
            >
              {loading ? "查询中..." : "查询会员状态"}
            </button>
          </>
        )}

        {step === "result" && status && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-neutral-100 p-7">
              <div className="flex items-center justify-between mb-5">
                <span className="text-base font-medium text-neutral-700">会员状态</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status.hasMembership
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-neutral-100 text-neutral-500"
                }`}>
                  {status.hasMembership ? "✓ 已开通" : "未开通"}
                </span>
              </div>

              {status.hasMembership ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-neutral-50">
                    <span className="text-sm text-neutral-500">会员计划</span>
                    <span className="font-medium">
                      {status.plan === "yearly" ? "年度会员" : status.plan === "quarterly" ? "季度会员" : status.plan === "monthly" ? "月度会员" : status.plan}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-neutral-500">到期时间</span>
                    <span className="font-medium">
                      {status.expiresAt ? new Date(status.expiresAt).toLocaleDateString("zh-CN", {
                        year: "numeric", month: "long", day: "numeric"
                      }) : "—"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-neutral-500 mb-5">尚未开通会员</p>
                  <Link
                    href="/subscribe"
                    className="inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    立即订阅
                  </Link>
                </div>
              )}
            </div>

            {status.hasMembership && (
              <div className="rounded-2xl border border-neutral-100 p-7">
                <h3 className="font-semibold text-base mb-4">会员权益</h3>
                <ul className="space-y-3">
                  {[
                    ["🎙️", "专属音色克隆", "录制 30 秒，还原你的声音"],
                    ["💬", "无限对话", "文字 / 语音输入，想聊多久聊多久"],
                    ["🔊", "更多音色", "解锁小黎之外的声音"],
                    ["📱", "跨平台使用", "Web / App 随时切换"],
                  ].map(([icon, title, desc]) => (
                    <li key={title} className="flex gap-3">
                      <span className="text-xl mt-0.5">{icon}</span>
                      <div>
                        <div className="font-medium text-sm">{title}</div>
                        <div className="text-xs text-neutral-500">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => { setStep("query"); setStatus(null); }}
              className="w-full py-3 rounded-full border border-neutral-200 text-neutral-600 font-medium hover:border-neutral-300 transition"
            >
              重新查询
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
