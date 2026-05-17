import { NextResponse } from "next/server";

type ExamQuotePayload = {
  exam?: string;
  mode?: string;
  targetScore?: number;
  currentSpeaking?: number;
  targetSpeaking?: number;
  needsSpeakingPrediction?: boolean;
  needsWriting?: boolean;
  visitor?: {
    userAgent?: string;
    locale?: string;
    timezone?: string;
    capturedAt?: string;
  } | null;
};

const highValueCities = ["北京", "上海", "广州", "深圳", "苏州", "beijing", "shanghai", "guangzhou", "shenzhen", "suzhou"];
const highValueRegions = ["江苏", "浙江", "上海", "北京", "jiangsu", "zhejiang", "shanghai", "beijing"];
const premiumCountries = ["US", "CA", "HK", "GB", "IE", "FR", "DE", "NL", "CH", "SE", "NO", "DK", "FI", "IT", "ES", "AU", "NZ"];
const upperMiddleCountries = ["JP", "KR"];

export async function POST(request: Request) {
  const payload = (await request.json()) as ExamQuotePayload;
  const headers = request.headers;
  const userAgent = payload.visitor?.userAgent ?? headers.get("user-agent") ?? "";
  const location = readRequestLocation(headers);
  const baseQuote = priceExam(payload);
  const locationMultiplier = resolveLocationMultiplier(location);
  const afterLocation = roundDownToNearest(baseQuote.baseAmount * locationMultiplier, 500);
  const deviceSurcharge = /iPhone|iPad|Macintosh|Mac OS|iOS/i.test(userAgent) ? 500 : 0;
  const amount = afterLocation + deviceSurcharge;

  return NextResponse.json({
    amount,
    estimate: formatCny(amount),
    exam: baseQuote.exam,
    mode: baseQuote.mode,
    title: baseQuote.title,
    summary: baseQuote.summary,
    serviceIncludes: baseQuote.serviceIncludes,
    caveats: baseQuote.caveats,
    discountGame: {
      type: "dice-over-under",
      reward: 500,
      copy: "截图前可押大/押小掷骰子一次，猜中立减 ¥500。"
    },
    quoteMeta: {
      confidence: location.confidence,
      capturedAt: new Date().toISOString(),
      requestIp: location.ip,
      deviceTier: deviceSurcharge > 0 ? "apple" : "standard",
      locale: payload.visitor?.locale ?? headers.get("accept-language") ?? "unknown",
      timezone: payload.visitor?.timezone ?? "unknown"
    }
  });
}

function priceExam(payload: ExamQuotePayload) {
  const exam = payload.exam ?? "duolingo";
  const mode = payload.mode ?? defaultModeFor(exam);
  const targetScore = payload.targetScore ?? defaultScoreFor(exam);
  const currentSpeaking = payload.currentSpeaking ?? 80;
  const targetSpeaking = payload.targetSpeaking ?? targetScore;
  const speakingGap = Math.max(0, targetSpeaking - currentSpeaking);
  const speakingLessons = Math.ceil(speakingGap / 5);
  const speakingCourseFee = speakingLessons * 500;

  if (exam === "duolingo") {
    const baseAmount = mode === "single" ? 3500 : targetScore <= 100 ? 8000 : 8000 + Math.ceil((targetScore - 100) / 10) * 1500;
    const withSpeaking = baseAmount + speakingCourseFee;

    return {
      exam: "duolingo",
      mode,
      baseAmount: withSpeaking,
      title: mode === "single" ? "多邻国单次服务" : "多邻国保分服务",
      summary: `目标 ${targetScore} 分，系统预估 ${speakingLessons} 节口语/小分课。`,
      serviceIncludes: ["五年多邻国服务经验", "155 分导师成绩", "10000+ 考场经验", "2026 年 100+ 出分案例"],
      caveats: mode === "single" ? ["单次服务购买的是技术与考试时间", "不含申诉、重考与售后兜底", "如考试中触发风控，会先询问是否中断；单次费用不退"] : ["保分服务包含更完整的训练与复盘", "小分差距按每 5 分 1 节课预估", "最终以截图报价和微信确认方案为准"]
    };
  }

  if (exam === "toefl") {
    const baseAmount = targetScore < 4.5 ? 8000 : targetScore < 5 ? 9000 : 10000;
    const predictionFee = payload.needsSpeakingPrediction ? 3000 : 0;

    return {
      exam: "toefl",
      mode,
      baseAmount: baseAmount + predictionFee,
      title: "TOEFL 家考 / 新托福方案",
      summary: `目标 ${targetScore.toFixed(1)} 分${payload.needsSpeakingPrediction ? "，含口语预测" : "，不含口语预测"}。`,
      serviceIncludes: ["新托福 6 分 / 老托福 118 分导师成绩", "2026 年 100+ 托福出分", "累计 1000+ 托福出分案例"],
      caveats: ["5 分及以上需确认口语跟进能力", "口语预测为可选加项", "最终按当期行情与截图报价确认"]
    };
  }

  if (exam === "gre") {
    const baseAmount = targetScore < 310 ? 8000 : targetScore < 320 ? 9000 : targetScore <= 325 ? 10000 : 12000;

    return {
      exam: "gre",
      mode,
      baseAmount: baseAmount + (payload.needsWriting ? 1000 : 0),
      title: "GRE 保分 / 冲刺方案",
      summary: `目标 ${targetScore} 分${payload.needsWriting ? "，含写作要求" : "，不含写作加项"}。`,
      serviceIncludes: ["GRE 335+5 导师成绩", "500+ GRE 场次经验", "300 / 310 / 320 分段报价"],
      caveats: ["325+ 或特殊写作目标建议截图私聊", "写作 4/4.5/5 分目标需要单独确认"]
    };
  }

  if (exam === "sat") {
    const baseAmount = targetScore < 1500 ? 10000 : targetScore < 1550 ? 15000 : 20000;

    return {
      exam: "sat",
      mode,
      baseAmount,
      title: "SAT 保分方案",
      summary: `目标 ${targetScore} 分。`,
      serviceIncludes: ["SAT 1600 满分获得者", "20+ SAT 场次经验", "1400 / 1500 / 1550+ 分段报价"],
      caveats: ["1550+ 目标按高阶方案执行", "最终以微信确认考期与目标为准"]
    };
  }

  if (exam === "ielts") {
    return {
      exam: "ielts",
      mode,
      baseAmount: 80000,
      title: "雅思境外线下直出",
      summary: "境外线下直接出分（头像非本人），¥80,000 起，具体看行情价。",
      serviceIncludes: ["雅思 8.5 导师成绩", "100+ 线下场次经验", "成熟境外线下直出沟通流程"],
      caveats: ["行情波动较大", "需截图私聊确认考区、时间与执行条件"]
    };
  }

  const otherBase = exam === "cael" ? 30000 : 10000;

  return {
    exam,
    mode,
    baseAmount: otherBase,
    title: "其他语言考试远程保分",
    summary: exam === "cael" ? "CAEL 换脸方案 ¥30,000 起。" : "TOEIC / LanguageCert / PTE 等 ¥10,000 起，具体看分数。",
    serviceIncludes: ["LanguageCert C1 High", "CAE / CPE C2 等级", "TOEIC 990", "PTE 90"],
    caveats: ["不同考试风控与目标分不同", "建议截图后微信私聊定价"]
  };
}

function defaultModeFor(exam: string) {
  if (exam === "duolingo") return "guarantee";
  if (exam === "toefl") return "home";
  if (exam === "ielts") return "offline";
  return "guarantee";
}

function defaultScoreFor(exam: string) {
  if (exam === "toefl") return 5;
  if (exam === "gre") return 320;
  if (exam === "sat") return 1500;
  return 120;
}

function readRequestLocation(headers: Headers) {
  return {
    ip: headers.get("x-forwarded-for")?.split(",")[0] ?? headers.get("x-real-ip") ?? "unknown",
    city: decodeHeader(headers.get("x-vercel-ip-city") ?? headers.get("cf-ipcity")),
    region: decodeHeader(headers.get("x-vercel-ip-country-region") ?? headers.get("cf-region")),
    country: (headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry") ?? "").toUpperCase(),
    confidence: headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") ? "edge-geo" : "header-fallback"
  };
}

function resolveLocationMultiplier(location: { city: string; region: string; country: string }) {
  const city = location.city.toLowerCase();
  const region = location.region.toLowerCase();

  if (highValueCities.some((item) => city.includes(item.toLowerCase()))) return 1.2;
  if (highValueRegions.some((item) => region.includes(item.toLowerCase()))) return 1.2;
  if (upperMiddleCountries.includes(location.country)) return 1.2;
  if (premiumCountries.includes(location.country)) return 1.5;
  return 1;
}

function decodeHeader(value: string | null) {
  if (!value) return "";

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function roundDownToNearest(amount: number, step: number) {
  return Math.floor(amount / step) * step;
}

function formatCny(amount: number) {
  return `¥${amount.toLocaleString("zh-CN")}`;
}
