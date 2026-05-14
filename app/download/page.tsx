import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-semibold tracking-tight mb-4">下载 App</h1>
          <p className="text-xl text-neutral-500">选择你的平台，开始使用</p>
        </div>

        {/* Web */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Web 版（无需下载）</h2>
          <div className="rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-base mb-1">浏览器直接使用</div>
                <div className="text-sm text-neutral-500">
                  任何设备的浏览器都能打开，Web 版功能完整
                </div>
              </div>
              <a
                href="https://flexichrono.com/app"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                打开 Web 版
              </a>
            </div>
          </div>
        </div>

        {/* Android */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Android</h2>
          <div className="rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-base mb-1">Android 安装包（APK）</div>
                <div className="text-sm text-neutral-500">
                  Android 5.0+ 适用，无需 Google Play
                </div>
              </div>
              <a
                href="/api/download/app"
                className="shrink-0 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
              >
                下载 APK
              </a>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-800">
              <strong>提示：</strong>APK 仍在构建中。如需尝鲜，请联系客服获取最新版本。
            </div>
          </div>
        </div>

        {/* macOS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">macOS</h2>
          <div className="rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-base mb-1">macOS App（开发中）</div>
                <div className="text-sm text-neutral-500">
                  原生 macOS 客户端，Safari/Chrome/Firefox 均可用 Web 版
                </div>
              </div>
              <a
                href="https://flexichrono.com/app"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
              >
                打开 Web 版
              </a>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
              <strong>提示：</strong>macOS 原生客户端正在开发中，可先通过浏览器使用全部功能，功能体验与 App 一致。
            </div>
          </div>
        </div>

        {/* iOS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">iOS</h2>
          <div className="rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-base mb-1">iOS App（即将上架）</div>
                <div className="text-sm text-neutral-500">
                  需等待 App Store 审核通过
                </div>
              </div>
              <span className="shrink-0 px-6 py-2.5 rounded-full bg-neutral-100 text-neutral-400 text-sm font-medium cursor-not-allowed">
                敬请期待
              </span>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl bg-neutral-50 p-6">
          <h3 className="font-semibold text-base mb-3">使用流程</h3>
          <ol className="space-y-3">
            {[
              ["下载或打开 App", "选择你喜欢的方式安装"],
              ["注册/登录账号", "手机号 + 验证码即可登录"],
              ["订阅会员", "¥88/年，解锁全部功能"],
              ["开始使用", "文字对话、语音输入、音色克隆"],
            ].map(([title, desc], i) => (
              <li key={title} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium text-sm">{title}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-neutral-500 text-sm mb-4">
            订阅会员后解锁音色克隆功能
          </p>
          <Link
            href="/subscribe"
            className="inline-block px-8 py-3.5 rounded-full bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition"
          >
            立即订阅 ¥88/年
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
