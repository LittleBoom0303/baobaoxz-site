import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-sm text-blue-600 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          音色克隆 · AI 陪伴 · 跨平台
        </div>
        <h1 className="text-6xl font-semibold tracking-tight leading-tight max-w-2xl mb-6">
          用你的声音<br />和 AI 聊聊
        </h1>
        <p className="text-xl text-neutral-500 max-w-lg leading-relaxed mb-10">
          录 30 秒声音，AI 就能用你的音色说话。<br />
          文字输入、语音对话，随时随地陪伴。
        </p>
        <div className="flex gap-4">
          <Link href="/subscribe" className="px-8 py-3.5 rounded-full bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition">
            立即订阅 ¥88/年
          </Link>
          <Link href="/membership" className="px-8 py-3.5 rounded-full border border-neutral-200 text-neutral-700 font-medium text-lg hover:border-neutral-300 transition">
            查询会员
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section id="features" className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-4">产品功能</h2>
        <p className="text-neutral-500 text-center mb-14">每个功能都为真实使用场景设计</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl mb-5">🎙️</div>
            <h3 className="text-xl font-semibold mb-3">30 秒克隆你的声音</h3>
            <p className="text-neutral-500 leading-relaxed">
              在安静环境录制 30 秒音频，AI 学习你的音色特征，还原自然流畅的语音输出。录制越自然，克隆效果越好。
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl mb-5">💬</div>
            <h3 className="text-xl font-semibold mb-3">无限对话，实时流式输出</h3>
            <p className="text-neutral-500 leading-relaxed">
              支持文字和语音输入，AI 回复以语音流式播放，边听边聊。SSE 实时通信，低延迟体验。
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl mb-5">🔊</div>
            <h3 className="text-xl font-semibold mb-3">多个角色，多种音色</h3>
            <p className="text-neutral-500 leading-relaxed">
              除了默认音色小黎，还可克隆专属音色。不同场景切换不同角色，陪伴、学习、娱乐都可以。
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-5">📱</div>
            <h3 className="text-xl font-semibold mb-3">跨平台，随时使用</h3>
            <p className="text-neutral-500 leading-relaxed">
              Web/App 多端同步，碎片时间随时对话。云端存储聊天记录，换设备也不丢失。
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl mb-5">🔒</div>
            <h3 className="text-xl font-semibold mb-3">隐私优先，数据安全</h3>
            <p className="text-neutral-500 leading-relaxed">
              音色克隆需签署授权书，录音仅用于生成音色模型。数据加密传输，放心使用。
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-2xl mb-5">⚡</div>
            <h3 className="text-xl font-semibold mb-3">火山引擎 TTS 技术</h3>
            <p className="text-neutral-500 leading-relaxed">
              基于字节跳动火山引擎语音合成技术，高保真音色还原，流畅自然的语调生成。
            </p>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">立即开始</h2>
          <p className="text-neutral-500 mb-8">Web 直接使用，或下载 App 随时随地对话</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://flexichrono.com/app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition"
            >
              🌐 打开 Web 版
            </a>
            <Link
              href="/download"
              className="px-8 py-4 rounded-full border-2 border-neutral-200 text-neutral-700 font-medium text-lg hover:border-neutral-300 transition"
            >
              📱 下载 App
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-4">如何使用</h2>
          <p className="text-neutral-500 text-center mb-14">三步开始你的 AI 声音陪伴</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">订阅会员</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">¥88/年订阅会员，解锁全部功能，包括音色克隆权益。</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">录制声音</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">在安静环境录制 30 秒语音，朗读一段文字，提交后 AI 开始训练音色。</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">开始对话</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">用你自己的声音和 AI 对话，文字输入或语音输入，AI 语音流式播放回复。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">会员订阅</h2>
          <p className="text-neutral-500 mb-10">一次订阅，全部功能开放</p>
          <div className="rounded-2xl border-2 border-blue-600 p-8 md:p-12">
            <div className="text-sm text-blue-600 font-medium mb-2">年度会员</div>
            <div className="flex items-end justify-center gap-1 mb-2">
              <span className="text-5xl font-semibold">¥88</span>
              <span className="text-neutral-500 mb-2 ml-1">/年</span>
            </div>
            <div className="text-neutral-500 text-sm mb-8">原价 ¥199.9/年，限时 ¥88</div>
            <ul className="text-left max-w-xs mx-auto space-y-3 mb-8">
              {[
                "无限文字 / 语音对话",
                "音色克隆（录 30 秒还原你的声音）",
                "多个 AI 角色切换",
                "云端聊天记录同步",
                "跨平台 Web/App",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-neutral-700">
                  <span className="text-green-500 text-lg">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/subscribe" className="inline-block px-10 py-3.5 rounded-full bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition">
              立即订阅
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-14">常见问题</h2>
          <div className="space-y-6">
            {[
              {
                q: "音色克隆需要多久？",
                a: "提交录音后，AI 训练需要数分钟。训练完成后会收到通知，之后即可使用克隆音色和 AI 对话。"
              },
              {
                q: "会员到期后，我的音色和聊天记录还在吗？",
                a: "会员到期后，音色克隆权益暂停，但您的聊天记录和音色模型数据会保留。续费后可继续使用。"
              },
              {
                q: "可以退款吗？",
                a: "订阅费用一经支付，不支持退款。如有特殊情况请联系客服处理。"
              },
              {
                q: "支持哪些支付方式？",
                a: "支持微信支付、支付宝扫码付款。国外用户支持 PayPal。"
              },
              {
                q: "如何查询我的会员状态？",
                a: "点击页面导航栏的「会员」按钮，输入您的手机号获取验证码即可查询。"
              }
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-6 border border-neutral-100">
                <h3 className="font-semibold text-lg mb-2">{q}</h3>
                <p className="text-neutral-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-4xl font-semibold mb-4">开始你的 AI 声音之旅</h2>
        <p className="text-neutral-500 text-lg mb-8">用自己的声音，和 AI 聊任何话题</p>
        <Link href="/subscribe" className="inline-block px-10 py-4 rounded-full bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition">
          立即订阅 ¥88/年
        </Link>
      </section>

      <Footer />
    </div>
  );
}
