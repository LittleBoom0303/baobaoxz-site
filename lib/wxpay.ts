/**
 * 微信支付 Native API v2 实现
 * 文档：https://pay.weixin.qq.com/wiki/doc/api/native.php
 *
 * 使用方式：
 * 1. 执照下来后，在 Vercel Environment Variables 填入：
 *    WXPAY_APP_ID, WXPAY_MCH_ID, WXPAY_API_KEY
 * 2. 回调地址在 config.ts 已配置为 https://baobaoxz.com/api/callback/wxpay
 */

import crypto from "crypto-js";
import { WXPAY } from "@/lib/config";
import type { Plan } from "@/lib/pay";

/**
 * 微信支付 Native 预下单（创建二维码订单）
 * 返回 code_url（用户扫码支付链接）
 */
export async function wxpayCreateOrder(params: {
  orderId: string;
  amount: number; // 单位：元
  description: string;
}): Promise<{ codeUrl: string; prepayId: string }> {
  const { app_id, mch_id, api_key, notify_url } = WXPAY;

  if (!app_id || !mch_id || !api_key) {
    throw new Error("微信支付未配置，请联系管理员");
  }

  const now = Math.floor(Date.now() / 1000);
  const timeExpire = String(now + 30 * 60); // 30分钟过期

  // 构建请求参数（按字典序排列，微信支付要求）
  const payload: Record<string, string> = {
    appid: app_id,
    mch_id,
    nonce_str: generateNonceStr(),
    body: params.description.slice(0, 128),
    out_trade_no: params.orderId,
    total_fee: String(Math.round(params.amount * 100)), // 单位：分
    spbill_create_ip: "8.8.8.8", // Vercel serverless 无真实 IP，填写任意值
    time_expire: timeExpire,
    trade_type: "NATIVE",
    notify_url,
  };

  // 构造签名（字典序，URL编码，MD5，HMAC，转换为大写）
  const sign = buildWxpaySign(payload, api_key, "MD5");

  // 拼装 XML
  const xmlBody = mapToXml({ ...payload, sign });

  const res = await fetch("https://api.mch.weixin.qq.com/pay/unifiedorder", {
    method: "POST",
    body: xmlBody,
    headers: { "Content-Type": "text/xml" },
  });

  const xmlResponse = await res.text();
  const result = parseXml(xmlResponse);

  if (result.return_code !== "SUCCESS") {
    throw new Error(`微信支付下单失败：${result.return_msg}`);
  }
  if (result.result_code !== "SUCCESS") {
    throw new Error(`微信支付下单失败：${result.err_code_des ?? result.err_code}`);
  }

  return {
    codeUrl: result.code_url,
    prepayId: result.prepay_id,
  };
}

/**
 * 验证微信支付回调签名
 * 微信支付 v2 回调签名验证：
 * 将收到的参数按字典序排列，去除 sign 字段，
 * 拼接 API_KEY，用 MD5/HMAC-SHA256 计算，与回调中的 sign 比对
 */
export function verifyWxpayCallback(xmlBody: string): Record<string, string> {
  const params = parseXml(xmlBody);
  const { sign, ...rest } = params;

  if (rest.return_code !== "SUCCESS") {
    throw new Error("微信支付回调 return_code 不是 SUCCESS");
  }

  // 重新计算签名
  const calculatedSign = buildWxpaySign(rest, WXPAY.api_key, "HMAC-SHA256");
  if (calculatedSign.toUpperCase() !== (sign ?? "").toUpperCase()) {
    throw new Error("微信支付回调验签失败");
  }

  return params;
}

/**
 * 构造微信支付请求签名（v2 格式）
 * sign_type: MD5 或 HMAC-SHA256
 */
function buildWxpaySign(
  params: Record<string, string>,
  apiKey: string,
  signType: "MD5" | "HMAC-SHA256"
): string {
  // 1. 按字典序排列
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== "" && params[k] !== undefined && k !== "sign")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  // 2. 拼接 key
  const signStr = `${sorted}&key=${apiKey}`;

  // 3. MD5 或 HMAC-SHA256
  if (signType === "MD5") {
    return crypto.MD5(signStr).toString().toUpperCase();
  } else {
    return crypto.HmacSHA256(signStr, apiKey).toString().toUpperCase();
  }
}

// ---------- 工具函数 ----------

function generateNonceStr(): string {
  return Math.random().toString(36).slice(2, 18);
}

/** 将 JS 对象转换为微信支付 XML（不含 CDATA） */
function mapToXml(params: Record<string, string>): string {
  const parts = Object.entries(params).map(([k, v]) => `<${k}><![CDATA[${v}]]></${k}>`);
  return `<xml>${parts.join("")}</xml>`;
}

/** 解析微信支付 XML 响应 */
/** Parse XML into key-value object (handles CDATA and plain text) */
function parseXml(xml: string): Record<string, string> {
  const result: Record<string, string> = {};
  // Match <tag>...content...</tag> where content may be CDATA or plain text
  const re = /<(\w+)>(?:<!\[CDATA\[([^\]]*?)\]\]>|([^<]*?))\s*<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    result[m[1]] = m[2] ?? m[3] ?? "";
  }
  return result;
}

/** 查询订单状态（用于 poll） */
export async function wxpayQueryOrder(outTradeNo: string): Promise<{
  tradeState: string;
  tradeStateDesc: string;
}> {
  const { app_id, mch_id, api_key } = WXPAY;

  if (!app_id || !mch_id || !api_key) {
    return { tradeState: "NOTFOUND", tradeStateDesc: "未配置" };
  }

  const payload: Record<string, string> = {
    appid: app_id,
    mch_id,
    out_trade_no: outTradeNo,
    nonce_str: generateNonceStr(),
  };

  const sign = buildWxpaySign(payload, api_key, "MD5");
  const xmlBody = mapToXml({ ...payload, sign });

  const res = await fetch("https://api.mch.weixin.qq.com/pay/orderquery", {
    method: "POST",
    body: xmlBody,
    headers: { "Content-Type": "text/xml" },
  });

  const xmlResponse = await res.text();
  const result = parseXml(xmlResponse);

  return {
    tradeState: result.trade_state ?? "UNKNOWN",
    tradeStateDesc: result.trade_state_desc ?? "",
  };
}
