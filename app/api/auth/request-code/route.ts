import { NextResponse } from "next/server";

// 演示模式：发送验证码（实际上给 Flexichrono 后端发请求）
export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone || phone.length !== 11) {
      return NextResponse.json({ error: "手机号格式错误" }, { status: 400 });
    }
    // 演示模式：返回成功，前端任意6位验证码即可
    return NextResponse.json({ ok: true, message: "验证码已发送" });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
