"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

type PricingCalculatorProps = {
  serviceTitle?: string;
  defaultBundle?: number;
};

type VisitorContext = {
  sessionId: string;
  capturedAt: string;
  timezone: string;
  locale: string;
  userAgent: string;
  screen: string;
};

type QuoteResult = {
  estimate: string;
  amount: number;
  timeline: string;
  package: string;
  confidence: string;
};

const DEFAULT_PRICE: QuoteResult = {
  estimate: "¥12,800",
  amount: 12800,
  timeline: "3-6 周",
  package: "英国硕士申请 + 语言提升",
  confidence: "fallback"
};

const regions = ["英国", "美国", "香港", "澳洲", "欧陆", "日韩", "东南亚"];
const bundles = ["仅留学申请", "留学 + 语言套餐", "仅语言提升", "课程作业 / 学术护航", "求职与海外落地"];
const visitorCacheKey = "paulwie-latest-visitor-context";

const fetcher = async ([url, payload]: [string, RequestInit]) => {
  const response = await fetch(url, payload);
  if (!response.ok) throw new Error("Quote API unavailable");
  return response.json();
};

export function PricingCalculator({ serviceTitle = "专属学术规划", defaultBundle = 1 }: PricingCalculatorProps) {
  const [visitor, setVisitor] = useState<VisitorContext | null>(null);
  const [form, setForm] = useState({
    regionIndex: 0,
    bundleIndex: defaultBundle,
    englishLevel: 65,
    urgency: 35,
    withLanguage: defaultBundle === 2 ? 100 : 60
  });
  const [submitted, setSubmitted] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);

  useEffect(() => {
    const sessionId = crypto.randomUUID();
    const snapshot: VisitorContext = {
      sessionId,
      capturedAt: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}×${window.screen.height}@${window.devicePixelRatio}`
    };

    localStorage.setItem(visitorCacheKey, JSON.stringify(snapshot));
    setVisitor(snapshot);
  }, []);

  const visitorForQuote = visitor ?? readCachedVisitor();
  const fallbackQuote = useMemo(() => calculateFallbackQuote(form, serviceTitle), [form, serviceTitle]);
  const payload = {
    region: regions[form.regionIndex],
    bundle: bundles[form.bundleIndex],
    service_title: serviceTitle,
    english_level: form.englishLevel,
    urgency: form.urgency,
    with_language_ratio: form.withLanguage,
    session_id: visitorForQuote?.sessionId ?? "pending-session",
    visitor_context: visitorForQuote
  };

  const { data, isLoading } = useSWR<QuoteResult>(
    submitted
      ? [
          "/api/quote",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        ]
      : null,
    fetcher,
    { fallbackData: fallbackQuote, revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const result = submitted ? data ?? fallbackQuote : DEFAULT_PRICE;
  const discountAmount = discountPercent ? Math.round((result.amount * discountPercent) / 100) : 0;
  const finalAmount = result.amount - discountAmount;

  function rollDiscount() {
    const base = result.amount;
    const minimum = base >= 30000 ? 22 : base >= 18000 ? 16 : 8;
    const spread = base >= 30000 ? 8 : base >= 18000 ? 7 : 5;
    setDiscountPercent(minimum + Math.floor(Math.random() * (spread + 1)));
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">Quote Modal</p>
      <h3 className="mt-2 text-xl font-semibold text-white">{serviceTitle} · 动态报价</h3>
      <p className="mt-2 text-sm text-white/70">
        不跳转新页面；系统会把当前会话、设备与访问时间一并写入报价请求，后端可用请求 IP 做进一步分层。
      </p>
      <div className="mt-5 space-y-4">
        <Slider
          label={`申请地区：${regions[form.regionIndex]}`}
          value={form.regionIndex}
          min={0}
          max={regions.length - 1}
          step={1}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, regionIndex: value }));
            setSubmitted(false);
            setDiscountPercent(null);
          }}
        />
        <Slider
          label={`服务类型：${bundles[form.bundleIndex]}`}
          value={form.bundleIndex}
          min={0}
          max={bundles.length - 1}
          step={1}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, bundleIndex: value }));
            setSubmitted(false);
            setDiscountPercent(null);
          }}
        />
        <Slider
          label={`英语基础：${form.englishLevel}/100`}
          value={form.englishLevel}
          min={0}
          max={100}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, englishLevel: value }));
            setSubmitted(false);
            setDiscountPercent(null);
          }}
        />
        <Slider
          label={`加急程度：${form.urgency}/100`}
          value={form.urgency}
          min={0}
          max={100}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, urgency: value }));
            setSubmitted(false);
            setDiscountPercent(null);
          }}
        />
        <Slider
          label={`语言服务占比：${form.withLanguage}%`}
          value={form.withLanguage}
          min={0}
          max={100}
          onChange={(value) => {
            setForm((prev) => ({ ...prev, withLanguage: value }));
            setSubmitted(false);
            setDiscountPercent(null);
          }}
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => setSubmitted(true)}>{isLoading ? "计算中..." : "获取报价"}</Button>
        <Button variant="ghost" className="border border-white/15 px-5 py-3" disabled={!submitted || discountPercent !== null} onClick={rollDiscount}>
          {discountPercent === null ? "Roll 限时折扣" : "折扣已锁定"}
        </Button>
      </div>
      <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white/85">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-white/60">系统报价</p>
            <p className="font-mono text-3xl text-white">{formatCny(result.amount)}</p>
          </div>
          {discountPercent !== null && (
            <div className="rounded-xl border border-amber-200/40 bg-amber-200/10 px-3 py-2 text-right text-amber-100">
              <p className="text-xs">截图专属折扣</p>
              <p className="font-mono text-xl">-{discountPercent}%</p>
            </div>
          )}
        </div>
        <div className="mt-4 grid gap-2 text-xs text-white/70 sm:grid-cols-2">
          <p>服务周期：{result.timeline}</p>
          <p>推荐方案：{result.package}</p>
          <p>会话编号：{payload.session_id}</p>
          <p>报价来源：{result.confidence}</p>
        </div>
        {discountPercent !== null && (
          <div className="mt-4 rounded-xl bg-black/25 p-3">
            <p className="text-white/70">折后锁定价</p>
            <p className="font-mono text-2xl text-amber-200">{formatCny(finalAmount)}</p>
            <p className="mt-2 text-xs text-white/60">请截图此报价并添加微信 Paulwie；截图有效期以当前访问时间为准。</p>
          </div>
        )}
      </div>
    </div>
  );
}

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

function Slider({ label, value, min, max, step = 1, onChange }: SliderProps) {
  return (
    <label className="block text-sm text-white/80">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-amber-300"
      />
    </label>
  );
}

function readCachedVisitor() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(visitorCacheKey);
  return raw ? (JSON.parse(raw) as VisitorContext) : null;
}

function calculateFallbackQuote(form: { regionIndex: number; bundleIndex: number; englishLevel: number; urgency: number; withLanguage: number }, serviceTitle: string): QuoteResult {
  const regionBase = [12800, 19800, 15800, 14800, 17800, 13800, 9800][form.regionIndex] ?? 12800;
  const bundleWeight = [1, 1.45, 0.75, 0.68, 0.58][form.bundleIndex] ?? 1;
  const languageLift = 1 + form.withLanguage / 250;
  const urgencyLift = 1 + form.urgency / 180;
  const levelLift = 1 + (100 - form.englishLevel) / 320;
  const serviceLift = serviceTitle.includes("博士") || serviceTitle.includes("申请") ? 1.18 : 1;
  const amount = Math.round((regionBase * bundleWeight * languageLift * urgencyLift * levelLift * serviceLift) / 100) * 100;

  return {
    estimate: formatCny(amount),
    amount,
    timeline: form.urgency > 70 ? "7-14 天加急" : "3-6 周",
    package: `${regions[form.regionIndex]} · ${bundles[form.bundleIndex]}`,
    confidence: "frontend-fallback"
  };
}

function formatCny(amount: number) {
  return `¥${amount.toLocaleString("zh-CN")}`;
}
