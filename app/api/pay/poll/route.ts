import { NextResponse } from "next/server";
import { getOrder } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json();
    if (!order_id) return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
    const order = getOrder(order_id as string);
    if (!order) return NextResponse.json({ status: "pending" });
    return NextResponse.json({ status: (order as { status: string }).status });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
