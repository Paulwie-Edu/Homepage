import { NextResponse } from "next/server";

type QuotePayload = {
  region?: string;
  bundle?: string;
  service_title?: string;
  english_level?: number;
  urgency?: number;
  with_language_ratio?: number;
  session_id?: string;
};

const regionBase: Record<string, number> = {
  英国: 12800,
  美国: 19800,
  香港: 15800,
  澳洲: 14800,
  欧陆: 17800,
  日韩: 13800,
  东南亚: 9800
};

const bundleWeight: Record<string, number> = {
  仅留学申请: 1,
  "留学 + 语言套餐": 1.45,
  仅语言提升: 0.75,
  "课程作业 / 学术护航": 0.68,
  求职与海外落地: 0.58
};

export async function POST(request: Request) {
  const payload = (await request.json()) as QuotePayload;
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for") ?? headers.get("x-real-ip") ?? "unknown";
  const userAgent = headers.get("user-agent") ?? "unknown";
  const base = regionBase[payload.region ?? "英国"] ?? 12800;
  const weight = bundleWeight[payload.bundle ?? "留学 + 语言套餐"] ?? 1;
  const urgency = clamp(payload.urgency ?? 35, 0, 100);
  const englishLevel = clamp(payload.english_level ?? 65, 0, 100);
  const languageRatio = clamp(payload.with_language_ratio ?? 60, 0, 100);
  const serviceLift = payload.service_title?.includes("博士") || payload.service_title?.includes("申请") ? 1.18 : 1;
  const deviceLift = /iPhone|Macintosh|iPad/i.test(userAgent) ? 1.08 : 1;
  const amount = Math.round((base * weight * (1 + urgency / 180) * (1 + (100 - englishLevel) / 320) * (1 + languageRatio / 250) * serviceLift * deviceLift) / 100) * 100;

  return NextResponse.json({
    estimate: formatCny(amount),
    amount,
    timeline: urgency > 70 ? "7-14 天加急" : "3-6 周",
    package: `${payload.region ?? "英国"} · ${payload.bundle ?? "留学 + 语言套餐"}`,
    confidence: forwardedFor === "unknown" ? "server-device" : "server-ip-device",
    quote_id: `${payload.session_id ?? "anon"}-${Date.now()}`,
    observed_context: {
      ip: forwardedFor.split(",")[0],
      user_agent: userAgent,
      request_time: new Date().toISOString(),
      accept_language: headers.get("accept-language") ?? "unknown"
    }
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatCny(amount: number) {
  return `¥${amount.toLocaleString("zh-CN")}`;
}
