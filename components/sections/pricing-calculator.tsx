"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

const DEFAULT_PRICE = { estimate: "¥12,800", timeline: "3-6 周", package: "英国硕士申请 + 语言提升" };

const regions = ["英国", "美国", "香港", "澳洲", "欧陆", "日韩", "东南亚"];
const bundles = ["仅留学申请", "留学 + 语言套餐", "仅语言提升"];

const fetcher = async ([url, payload]: [string, RequestInit]) => {
  const response = await fetch(url, payload);
  if (!response.ok) throw new Error("Quote API unavailable");
  return response.json();
};

export function PricingCalculator() {
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const [form, setForm] = useState({
    regionIndex: 0,
    bundleIndex: 1,
    englishLevel: 65,
    urgency: 35,
    withLanguage: 80
  });
  const [submitted, setSubmitted] = useState(false);

  const payload = {
    region: regions[form.regionIndex],
    bundle: bundles[form.bundleIndex],
    english_level: form.englishLevel,
    urgency: form.urgency,
    with_language_ratio: form.withLanguage,
    session_id: sessionId,
    hidden_context: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
      platform: navigator.userAgentData?.platform ?? "unknown"
    }
  };

  const { data, isLoading } = useSWR(
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
    { fallbackData: DEFAULT_PRICE, revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const result = data ?? DEFAULT_PRICE;

  return (
    <div>
      <h3 className="text-xl font-semibold text-white">动态报价向导（滑动式）</h3>
      <p className="mt-2 text-sm text-white/70">按地区、套餐、英语基础与紧急程度动态测算，自动关联你的会话 ID。</p>
      <div className="mt-5 space-y-4">
        <Slider
          label={`申请地区：${regions[form.regionIndex]}`}
          value={form.regionIndex}
          min={0}
          max={regions.length - 1}
          step={1}
          onChange={(value) => setForm((prev) => ({ ...prev, regionIndex: value }))}
        />
        <Slider
          label={`服务类型：${bundles[form.bundleIndex]}`}
          value={form.bundleIndex}
          min={0}
          max={bundles.length - 1}
          step={1}
          onChange={(value) => setForm((prev) => ({ ...prev, bundleIndex: value }))}
        />
        <Slider
          label={`英语基础：${form.englishLevel}/100`}
          value={form.englishLevel}
          min={0}
          max={100}
          onChange={(value) => setForm((prev) => ({ ...prev, englishLevel: value }))}
        />
        <Slider
          label={`加急程度：${form.urgency}/100`}
          value={form.urgency}
          min={0}
          max={100}
          onChange={(value) => setForm((prev) => ({ ...prev, urgency: value }))}
        />
        <Slider
          label={`语言服务占比：${form.withLanguage}%`}
          value={form.withLanguage}
          min={0}
          max={100}
          onChange={(value) => setForm((prev) => ({ ...prev, withLanguage: value }))}
        />
      </div>
      <Button className="mt-6" onClick={() => setSubmitted(true)}>
        {isLoading ? "计算中..." : "获取报价"}
      </Button>
      <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white/85">
        <p>估算价格：{result.estimate}</p>
        <p>服务周期：{result.timeline}</p>
        <p>推荐方案：{result.package}</p>
        <p className="mt-2 text-xs text-white/60">Session: {sessionId}</p>
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
