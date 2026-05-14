import { NextResponse } from "next/server";
import { existsSync } from "fs";
import { join } from "path";

// APK 文件路径（构建后放到 public/app/ 目录，或上传到 CDN）
const APK_LOCAL_PATH = join(process.cwd(), "public", "app", "flexichrono.apk");
const APK_CDN_URL = process.env.APK_CDN_URL || "";

export async function GET() {
  // 优先用 CDN URL（生产环境推荐）
  if (APK_CDN_URL) {
    return NextResponse.redirect(APK_CDN_URL);
  }

  // 本地文件（开发/演示）
  if (existsSync(APK_LOCAL_PATH)) {
    const file = await fetch(`file://${APK_LOCAL_PATH}`).then((r) => r.blob());
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="Flexichrono.apk"',
        "Content-Length": String(file.size),
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // APK 尚未构建
  return NextResponse.json(
    {
      error: "APK_NOT_READY",
      message: "Android 安装包正在构建中，请稍后再试",
      build_status: "pending",
      contact: "如需最新版本，请联系客服",
    },
    { status: 503 }
  );
}
