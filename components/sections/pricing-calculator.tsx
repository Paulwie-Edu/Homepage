"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

const DEFAULT_PRICE = { estimate: "¥9,800", timeline: "2-4 周", package: "留学申请 + 语言提升" };

const fetcher = async ([url, payload]: [string, RequestInit]) => {
  const response = await fetch(url, payload);
  if (!response.ok) throw new Error("Quote API unavailable");
  return response.json();
};

export function PricingCalculator() {
  const [form, setForm] = useState({ target: "英国硕士", urgency: "标准" });
  const [submitted, setSubmitted] = useState(false);

  const { data, isLoading } = useSWR(
    submitted
      ? [
          "/api/quote",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
          }
        ]
      : null,
    fetcher,
    { fallbackData: DEFAULT_PRICE, revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const result = data ?? DEFAULT_PRICE;

  return (
    <div>
      <h3 className="text-xl font-semibold text-white">动态报价向导</h3>
      <p className="mt-2 text-sm text-white/70">即使后端未就绪，系统也会展示 fallbackData 报价。</p>
      <div className="mt-6 space-y-4">
        <label className="block text-sm text-white/80">
          目标项目
          <input
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2"
            value={form.target}
            onChange={(e) => setForm((prev) => ({ ...prev, target: e.target.value }))}
          />
        </label>
        <label className="block text-sm text-white/80">
          紧急程度
          <select
            className="mt-2 w-full rounded-xl border border-white/20 bg-[#0b1224] px-3 py-2"
            value={form.urgency}
            onChange={(e) => setForm((prev) => ({ ...prev, urgency: e.target.value }))}
          >
            <option>标准</option>
            <option>加急</option>
            <option>冲刺</option>
          </select>
        </label>
      </div>
      <Button className="mt-6" onClick={() => setSubmitted(true)}>
        {isLoading ? "计算中..." : "获取报价"}
      </Button>
      <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white/85">
        <p>估算价格：{result.estimate}</p>
        <p>服务周期：{result.timeline}</p>
        <p>推荐方案：{result.package}</p>
      </div>
    </div>
  );
}
