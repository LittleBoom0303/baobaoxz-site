"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type MembershipStatus = "loading" | "active" | "expired" | "inactive" | "error";

export default function MembershipPage() {
  const [userId, setUserId] = useState("");
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState<MembershipStatus>("loading");
  const [membership, setMembership] = useState<{
    planId: string | null;
    startedAt: string | null;
    expiresAt: string | null;
  } | null>(null);
  const [savedUid] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bbxz_uid");
    if (stored) {
      setUserId(stored);
      setInputId(stored);
      fetchMembership(stored);
    } else {
      setStatus("inactive");
    }
  }, []);

  const fetchMembership = async (uid: string) => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/membership?userId=${encodeURIComponent(uid)}`);
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus(data.status);
      setMembership(data.membership);
    } catch {
      setStatus("error");
    }
  };

  const handleQuery = () => {
    if (!inputId.trim()) return;
    setUserId(inputId.trim());
    fetchMembership(inputId.trim());
  };

  const planNames: Record<string, string> = {
    monthly: "月度会员",
    quarterly: "季度会员",
    yearly: "年度会员",
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="py-20 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            会员状态
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto">
            输入你的用户ID，查询当前订阅状态
          </p>
        </div>
      </div>

      {/* Query input */}
      <div className="container max-w-lg mb-16">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuery()}
            placeholder="输入 user ID"
            className="flex-1 border border-[rgba(0,0,0,0.12)] rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all bg-[rgba(0,0,0,0.02)]"
          />
          <button
            onClick={handleQuery}
            className="btn-primary text-base px-8 py-3.5 rounded-xl"
          >
            查询
          </button>
        </div>
      </div>

      {/* Status display */}
      <div className="container max-w-lg mb-20">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
            <p className="text-muted text-sm">查询中…</p>
          </div>
        )}

        {status === "active" && membership && (
          <div className="apple-card text-center">
            <div className="w-20 h-20 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-semibold mb-1">会员有效</h2>
            <p className="text-muted mb-8">
              {planNames[membership.planId || ""] || membership.planId || "订阅会员"}
            </p>
            <div className="bg-[rgba(0,0,0,0.03)] rounded-xl p-5 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">开始时间</span>
                <span className="text-sm font-medium">{formatDate(membership.startedAt)}</span>
              </div>
              <div className="h-px bg-[rgba(0,0,0,0.06)]" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">到期时间</span>
                <span className="text-sm font-medium text-[#0071e3]">
                  {formatDate(membership.expiresAt)}
                </span>
              </div>
            </div>
            {savedUid && savedUid === userId && (
              <p className="text-xs text-muted mt-6">用户ID：{userId}</p>
            )}
          </div>
        )}

        {status === "expired" && (
          <div className="apple-card text-center">
            <div className="w-20 h-20 rounded-full bg-[rgba(0,0,0,0.05)] flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⏰</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">会员已过期</h2>
            <p className="text-muted mb-8">请续费以继续使用全部功能</p>
            <Link href="/subscribe" className="btn-primary">
              立即续费
            </Link>
          </div>
        )}

        {status === "inactive" && (
          <div className="apple-card text-center">
            <div className="w-20 h-20 rounded-full bg-[rgba(0,0,0,0.05)] flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">暂无订阅</h2>
            <p className="text-muted mb-8">订阅解锁全部项目</p>
            <Link href="/subscribe" className="btn-primary">
              立即订阅
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="apple-card text-center">
            <div className="w-20 h-20 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✕</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">查询失败</h2>
            <p className="text-muted mb-8">用户ID不存在或服务异常</p>
            <button onClick={() => handleQuery()} className="btn-secondary">
              重试
            </button>
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="text-center pb-16">
        <p className="text-xs text-[rgba(0,0,0,0.3)] max-w-md mx-auto">
          提示：订阅成功后显示的 user ID 即为你的账号ID，请妥善保存。
        </p>
      </div>

      {/* Footer */}
      <footer className="footer py-10 mt-auto">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted">© 2026 BBXZ. All rights reserved.</div>
          <div className="flex items-center gap-8">
            <Link href="/subscribe" className="text-sm text-muted hover:text-foreground transition-colors">
              Subscribe
            </Link>
            <a href="mailto:contact@baobaoxz.com" className="text-sm text-muted hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
