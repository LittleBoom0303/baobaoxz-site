import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();
    if (!phone || phone.length !== 11 || !code || code.length !== 6) {
      return NextResponse.json({ error: "参数错误" }, { status: 400 });
    }
    // 演示模式：任意6位验证码都通过
    const user_id = `user_${phone.slice(-4)}`;
    return NextResponse.json({
      ok: true,
      user_id,
      access_token: `demo_token_${user_id}`,
    });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
