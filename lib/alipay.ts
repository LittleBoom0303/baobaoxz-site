/**
 * 支付宝当面付（扫码付）实现
 * 文档：https://opendocs.alipay.com/apis/alipay.trade.pay
 *
 * 使用方式：
 * 1. 执照下来后，在 Vercel Environment Variables 填入：
 *    ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, ALIPAY_PUBLIC_KEY
 * 2. 回调地址在 config.ts 已配置为 https://baobaoxz.com/api/callback/alipay
 */

import { AlipaySdk } from "alipay-sdk";
import { ALIPAY } from "@/lib/config";
import crypto from "crypto";

let _sdk: AlipaySdk | null = null;

function getAlipaySdk(): AlipaySdk {
  if (_sdk) return _sdk;

  if (!ALIPAY.app_id || !ALIPAY.private_key || !ALIPAY.alipay_public_key) {
    throw new Error("支付宝未配置，请联系管理员");
  }

  _sdk = new AlipaySdk({
    appId: ALIPAY.app_id,
    privateKey: ALIPAY.private_key,
    alipayPublicKey: ALIPAY.alipay_public_key,
    signType: "RSA2",
  });

  return _sdk;
}

/**
 * 支付宝当面付：创建扫码支付订单
 * 返回 qr_code，用户扫码支付
 */
export async function alipayCreateOrder(params: {
  orderId: string;
  amount: number; // 单位：元
  description: string;
}): Promise<{ qrCode: string; tradeNo: string }> {
  const sdk = getAlipaySdk();

  const response = await sdk.exec(
    "alipay.trade.precreate", // 预下单（生成二维码）
    {
      outTradeNo: params.orderId,
      totalAmount: String(params.amount),
      subject: params.description.slice(0, 256),
      timeoutExpress: "30m",
    }
  );

  if (response.code !== "10000") {
    throw new Error(`支付宝下单失败：${response.msg ?? response.subMsg}`);
  }

  return {
    qrCode: response.qrCode ?? "",
    tradeNo: response.tradeNo ?? "",
  };
}

/**
 * 支付宝交易查询（用于 poll 确认支付状态）
 */
export async function alipayQueryOrder(outTradeNo: string): Promise<{
  tradeStatus: string;
  totalAmount: string;
}> {
  const sdk = getAlipaySdk();

  try {
    const response = await sdk.exec("alipay.trade.query", {
      outTradeNo,
    });

    return {
      tradeStatus: response.tradeStatus ?? "UNKNOWN",
      totalAmount: response.totalAmount ?? "0",
    };
  } catch {
    return { tradeStatus: "UNKNOWN", totalAmount: "0" };
  }
}

/**
 * 验证支付宝回调签名
 * 支付宝回调参数在 request.body 中（express/raw body）
 * 验签由 alipay-sdk 自动处理
 */
export async function verifyAlipayCallback(
  postData: Record<string, string>
): Promise<boolean> {
  const sdk = getAlipaySdk();
  const sign = postData.sign;
  const signType = postData.sign_type;

  if (!sign) return false;

  // alipay-sdk 验签：排除 sign 和 sign_type 字段
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(postData)) {
    if (k !== "sign" && k !== "sign_type") {
      data[k] = v;
    }
  }

  try {
    return sdk.checkNotifySign(data);
  } catch {
    return false;
  }
}

/** 支付宝回调中提取订单信息（TRADE_SUCCESS = 支付成功） */
export function parseAlipayCallback(
  postData: Record<string, string>
): {
  outTradeNo: string;
  tradeNo: string;
  tradeStatus: string;
  totalAmount: string;
} {
  return {
    outTradeNo: postData.out_trade_no ?? "",
    tradeNo: postData.trade_no ?? "",
    tradeStatus: postData.trade_status ?? "",
    totalAmount: postData.total_amount ?? postData.total_amount ?? "0",
  };
}
