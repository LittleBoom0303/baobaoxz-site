"use client";
import { useState, useEffect } from "react";

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
  const [savedUid, setSavedUid] = useState<string | null>(null);

  // 初始化：从localStorage读取userId
  useEffect(() => {
    const stored = localStorage.getItem("bbxz_uid");
    if (stored) {
      setUserId(stored);
      setInputId(stored);
      setSavedUid(stored);
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
    <div className="py-16">
      <div className="container max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-2">会员状态</h1>
        <p className="text-gray-400 text-center mb-10">
          输入你的用户ID，查询当前订阅状态
        </p>

        {/* 查询框 */}
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuery()}
            placeholder="输入 user ID"
            className="flex-1 bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#10b981]"
          />
          <button
            onClick={handleQuery}
            className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            查询
          </button>
        </div>

        {/* 状态显示 */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">查询中…</p>
          </div>
        )}

        {status === "active" && membership && (
          <div className="bg-[#0d2017] border border-[#10b981] rounded-xl p-8 text-center">
            <span className="text-5xl mb-4 block">✅</span>
            <h2 className="text-xl font-bold text-[#34d399] mb-1">会员有效</h2>
            <p className="text-gray-400 text-sm mb-6">
              {planNames[membership.planId || ""] || membership.planId || "订阅会员"}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between px-4">
                <span>开始时间</span>
                <span className="text-white">{formatDate(membership.startedAt)}</span>
              </div>
              <div className="flex justify-between px-4">
                <span>到期时间</span>
                <span className="text-[#34d399]">{formatDate(membership.expiresAt)}</span>
              </div>
            </div>
            {savedUid && savedUid === userId && (
              <p className="text-gray-600 text-xs mt-6">用户ID：{userId}</p>
            )}
          </div>
        )}

        {status === "expired" && (
          <div className="bg-[#111] border border-[#333] rounded-xl p-8 text-center">
            <span className="text-5xl mb-4 block">⏰</span>
            <h2 className="text-xl font-bold mb-1">会员已过期</h2>
            <p className="text-gray-400 text-sm mb-6">请续费以继续使用全部功能</p>
            <a
              href="/subscribe"
              className="inline-block bg-[#10b981] hover:bg-[#059669] text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              立即续费
            </a>
          </div>
        )}

        {status === "inactive" && (
          <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center">
            <span className="text-5xl mb-4 block">🔒</span>
            <h2 className="text-xl font-bold mb-1">暂无订阅</h2>
            <p className="text-gray-400 text-sm mb-6">订阅解锁全部项目</p>
            <a
              href="/subscribe"
              className="inline-block bg-[#10b981] hover:bg-[#059669] text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              立即订阅
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="bg-[#1f0d0d] border border-[#991b1b] rounded-xl p-8 text-center">
            <span className="text-5xl mb-4 block">❌</span>
            <h2 className="text-xl font-bold text-red-400 mb-1">查询失败</h2>
            <p className="text-gray-400 text-sm mb-4">用户ID不存在或服务异常</p>
            <button
              onClick={() => handleQuery()}
              className="border border-[#333] hover:border-[#555] text-white px-6 py-2 rounded-full text-sm transition-colors"
            >
              重试
            </button>
          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-8">
          提示：订阅成功后会话框显示的 user ID 即为你的账号ID，请妥善保存。
        </p>
      </div>
    </div>
  );
}
