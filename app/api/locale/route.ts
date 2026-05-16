import { NextResponse } from "next/server";
import { setLocaleCookie } from "@/lib/i18n";

export async function POST(request: Request) {
  try {
    const { locale } = await request.json();
    if (locale !== "zh" && locale !== "en") {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }
    await setLocaleCookie(locale);
    return NextResponse.json({ ok: true, locale });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
