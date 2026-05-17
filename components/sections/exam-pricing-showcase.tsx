"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type ExamKey = "duolingo" | "toefl" | "gre" | "sat" | "ielts" | "other";
type Bet = "big" | "small";

type ExamQuote = {
  amount: number;
  estimate: string;
  title: string;
  summary: string;
  serviceIncludes: string[];
  caveats: string[];
  quoteMeta: {
    confidence: string;
    capturedAt: string;
    deviceTier: string;
  };
};

type ExamState = {
  mode: string;
  targetScore: number;
  currentSpeaking: number;
  targetSpeaking: number;
  needsSpeakingPrediction: boolean;
  needsWriting: boolean;
  otherExam: string;
};

const exams: Array<{
  key: ExamKey;
  logo: string;
  title: string;
  proof: string;
  accent: string;
}> = [
  {
    key: "duolingo",
    logo: "DET",
    title: "多邻国英语测试",
    proof: "155 分导师成绩 · 10000+ 考场经验 · 2026 年 100+ 出分",
    accent: "from-emerald-300/30 to-lime-300/10"
  },
  {
    key: "toefl",
    logo: "TOEFL",
    title: "TOEFL 家考 / 新托福",
    proof: "新托福 6 分 · 老托福 118 · 2026 年 100+ 出分",
    accent: "from-sky-300/30 to-blue-500/10"
  },
  {
    key: "gre",
    logo: "GRE",
    title: "GRE 冲刺与保分",
    proof: "335+5 导师成绩 · 500+ 场次经验 · 写作目标可加项",
    accent: "from-violet-300/30 to-indigo-500/10"
  },
  {
    key: "sat",
    logo: "SAT",
    title: "SAT 保分方案",
    proof: "1600 满分获得者 · 20+ 场次经验 · 1400/1500/1550+ 分段",
    accent: "from-amber-300/30 to-orange-500/10"
  },
  {
    key: "ielts",
    logo: "IELTS",
    title: "雅思境外线下直出",
    proof: "雅思 8.5 · 100+ 线下场次 · 境外线下直接出分",
    accent: "from-red-300/30 to-rose-500/10"
  },
  {
    key: "other",
    logo: "PTE+",
    title: "其他语言考试",
    proof: "PTE 90 · TOEIC 990 · LanguageCert C1 High · CAE/CPE C2",
    accent: "from-cyan-300/30 to-teal-500/10"
  }
];

const defaultExamState: Record<ExamKey, ExamState> = {
  duolingo: {
    mode: "guarantee",
    targetScore: 120,
    currentSpeaking: 80,
    targetSpeaking: 100,
    needsSpeakingPrediction: false,
    needsWriting: false,
    otherExam: "duolingo"
  },
  toefl: {
    mode: "home",
    targetScore: 5,
    currentSpeaking: 0,
    targetSpeaking: 0,
    needsSpeakingPrediction: true,
    needsWriting: false,
    otherExam: "toefl"
  },
  gre: {
    mode: "guarantee",
    targetScore: 320,
    currentSpeaking: 0,
    targetSpeaking: 0,
    needsSpeakingPrediction: false,
    needsWriting: true,
    otherExam: "gre"
  },
  sat: {
    mode: "guarantee",
    targetScore: 1500,
    currentSpeaking: 0,
    targetSpeaking: 0,
    needsSpeakingPrediction: false,
    needsWriting: false,
    otherExam: "sat"
  },
  ielts: {
    mode: "offline",
    targetScore: 0,
    currentSpeaking: 0,
    targetSpeaking: 0,
    needsSpeakingPrediction: false,
    needsWriting: false,
    otherExam: "ielts"
  },
  other: {
    mode: "guarantee",
    targetScore: 0,
    currentSpeaking: 0,
    targetSpeaking: 0,
    needsSpeakingPrediction: false,
    needsWriting: false,
    otherExam: "pte"
  }
};

const fallbackQuotes: Record<ExamKey, ExamQuote> = {
  duolingo: buildFallbackQuote("多邻国保分服务", 11000, "目标 120 分；小分课程按系统预估另计。"),
  toefl: buildFallbackQuote("TOEFL 家考 / 新托福方案", 13000, "目标 5.0 分；可选口语预测。"),
  gre: buildFallbackQuote("GRE 保分 / 冲刺方案", 11000, "目标 320 分；写作加项另计。"),
  sat: buildFallbackQuote("SAT 保分方案", 15000, "目标 1500 分。"),
  ielts: buildFallbackQuote("雅思境外线下直出", 80000, "¥80,000 起，具体看行情。"),
  other: buildFallbackQuote("其他语言考试远程保分", 10000, "TOEIC / LanguageCert / PTE 等 ¥10,000 起。")
};

export function ExamPricingShowcase() {
  const [active, setActive] = useState<ExamKey>("duolingo");
  const [examState, setExamState] = useState(defaultExamState);
  const [quotes, setQuotes] = useState<Partial<Record<ExamKey, ExamQuote>>>({});
  const [loading, setLoading] = useState(false);
  const [bet, setBet] = useState<Bet>("big");
  const [dice, setDice] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeExam = exams.find((exam) => exam.key === active) ?? exams[0];
  const activeState = examState[active];
  const quote = quotes[active] ?? fallbackQuotes[active];
  const wonDiscount = dice !== null && ((bet === "big" && dice >= 4) || (bet === "small" && dice <= 3));
  const finalAmount = wonDiscount ? quote.amount - 500 : quote.amount;
  const visitor = useMemo(() => buildVisitorContext(), []);

  function updateActive(next: ExamKey) {
    setActive(next);
    setDice(null);
    const index = exams.findIndex((exam) => exam.key === next);
    const width = panelRef.current?.clientWidth ?? 0;
    panelRef.current?.scrollTo({ left: width * index, behavior: "smooth" });
  }

  function patchActive(patch: Partial<ExamState>) {
    setExamState((current) => ({ ...current, [active]: { ...current[active], ...patch } }));
    setDice(null);
  }

  async function requestQuote() {
    setLoading(true);
    setDice(null);

    try {
      const response = await fetch("/api/exam-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: active === "other" ? activeState.otherExam : active,
          mode: activeState.mode,
          targetScore: activeState.targetScore,
          currentSpeaking: activeState.currentSpeaking,
          targetSpeaking: activeState.targetSpeaking,
          needsSpeakingPrediction: activeState.needsSpeakingPrediction,
          needsWriting: activeState.needsWriting,
          visitor
        })
      });

      if (!response.ok) throw new Error("Exam quote API unavailable");
      const data = (await response.json()) as ExamQuote;
      setQuotes((current) => ({ ...current, [active]: data }));
    } catch {
      setQuotes((current) => ({ ...current, [active]: fallbackQuotes[active] }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Exam Pricing Engine</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-4xl">语言考试报价切屏</h2>
          </div>
          <p className="max-w-xl text-sm text-white/65">多邻国优先，其次托福、GRE、SAT；价格通过独立 API 计算，页面只展示结果和服务说明。</p>
        </div>

        <div ref={panelRef} className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4">
          {exams.map((exam) => (
            <article key={exam.key} className="min-w-full snap-center rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-8">
              <div className={`rounded-[1.5rem] bg-gradient-to-br ${exam.accent} p-5`}>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-xl">
                    <span className="inline-flex rounded-2xl border border-white/25 bg-black/20 px-4 py-2 font-mono text-sm font-semibold text-white">{exam.logo}</span>
                    <h3 className="mt-5 text-2xl font-semibold text-white md:text-4xl">{exam.title}</h3>
                    <p className="mt-3 text-sm text-white/70">{exam.proof}</p>
                    <DecisionTree exam={exam.key} />
                  </div>
                  <div className="glass w-full rounded-3xl p-4 lg:max-w-md">
                    <Controls exam={exam.key} state={activeState} onChange={patchActive} />
                    <Button className="mt-5 w-full" onClick={requestQuote}>{loading && active === exam.key ? "生成报价中..." : "生成截图报价"}</Button>
                    <QuoteCard quote={quote} bet={bet} dice={dice} finalAmount={finalAmount} wonDiscount={wonDiscount} onBet={setBet} onRoll={() => setDice(1 + Math.floor(Math.random() * 6))} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="glass sticky bottom-4 z-20 mx-auto mt-2 flex max-w-3xl items-center justify-center gap-2 rounded-full p-2 shadow-glow">
          {exams.map((exam) => (
            <button
              key={exam.key}
              type="button"
              onClick={() => updateActive(exam.key)}
              className={`rounded-full px-3 py-2 font-mono text-xs transition ${active === exam.key ? "bg-amber-200 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
              aria-label={`切换到 ${exam.title}`}
            >
              {exam.logo}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-white/45">当前：{activeExam.title}</p>
      </div>
    </section>
  );
}

function Controls({ exam, state, onChange }: { exam: ExamKey; state: ExamState; onChange: (patch: Partial<ExamState>) => void }) {
  if (exam === "duolingo") {
    return (
      <div className="space-y-4">
        <Segmented value={state.mode} options={[{ value: "single", label: "单次" }, { value: "guarantee", label: "保分" }]} onChange={(mode) => onChange({ mode })} />
        <Range label={`目标总分：${state.targetScore}`} min={60} max={140} step={5} value={state.targetScore} onChange={(targetScore) => onChange({ targetScore })} />
        <Range label={`当前口语：${state.currentSpeaking}`} min={60} max={140} step={5} value={state.currentSpeaking} onChange={(currentSpeaking) => onChange({ currentSpeaking })} />
        <Range label={`目标口语小分：${state.targetSpeaking}`} min={60} max={140} step={5} value={state.targetSpeaking} onChange={(targetSpeaking) => onChange({ targetSpeaking })} />
      </div>
    );
  }

  if (exam === "toefl") {
    return (
      <div className="space-y-4">
        <Range label={`新托福目标：${state.targetScore.toFixed(1)}`} min={3} max={6} step={0.5} value={state.targetScore} onChange={(targetScore) => onChange({ targetScore })} />
        <Toggle checked={state.needsSpeakingPrediction} label="加口语预测 +¥3,000" onChange={(needsSpeakingPrediction) => onChange({ needsSpeakingPrediction })} />
      </div>
    );
  }

  if (exam === "gre") {
    return (
      <div className="space-y-4">
        <Range label={`GRE 目标：${state.targetScore}`} min={300} max={330} step={10} value={state.targetScore} onChange={(targetScore) => onChange({ targetScore })} />
        <Toggle checked={state.needsWriting} label="需要写作成绩要求" onChange={(needsWriting) => onChange({ needsWriting })} />
      </div>
    );
  }

  if (exam === "sat") {
    return <Range label={`SAT 目标：${state.targetScore}`} min={1400} max={1550} step={50} value={state.targetScore} onChange={(targetScore) => onChange({ targetScore })} />;
  }

  if (exam === "ielts") {
    return <p className="rounded-2xl bg-black/20 p-4 text-sm text-white/75">雅思为境外线下直出（头像非本人）方案，价格 ¥80,000 起，具体按行情和考区确认。</p>;
  }

  return (
    <div className="space-y-4">
      <Segmented
        value={state.otherExam}
        options={[
          { value: "pte", label: "PTE" },
          { value: "toeic", label: "TOEIC" },
          { value: "languagecert", label: "朗思" },
          { value: "cael", label: "CAEL" }
        ]}
        onChange={(otherExam) => onChange({ otherExam })}
      />
      <p className="rounded-2xl bg-black/20 p-4 text-sm text-white/75">其他考试按远程保分报价，PTE / TOEIC / LanguageCert ¥10,000 起，CAEL ¥30,000 起。</p>
    </div>
  );
}

function QuoteCard({ quote, bet, dice, finalAmount, wonDiscount, onBet, onRoll }: { quote: ExamQuote; bet: Bet; dice: number | null; finalAmount: number; wonDiscount: boolean; onBet: (bet: Bet) => void; onRoll: () => void }) {
  return (
    <div className="mt-5 rounded-3xl border border-white/15 bg-black/25 p-4">
      <p className="text-xs text-white/50">系统报价</p>
      <p className="mt-1 font-mono text-3xl text-white">{quote.estimate}</p>
      <p className="mt-2 text-sm text-white/70">{quote.summary}</p>
      <div className="mt-4 grid gap-2 text-xs text-white/65">
        {quote.serviceIncludes.map((item) => <span key={item}>✓ {item}</span>)}
        {quote.caveats.map((item) => <span key={item}>• {item}</span>)}
      </div>
      <div className="mt-5 rounded-2xl border border-amber-200/25 bg-amber-200/10 p-3">
        <p className="text-sm text-amber-100">截图前押大小，猜中立减 ¥500</p>
        <div className="mt-3 flex gap-2">
          <Button variant={bet === "big" ? "default" : "ghost"} className="border border-white/15 px-4 py-2" onClick={() => onBet("big")}>押大 4-6</Button>
          <Button variant={bet === "small" ? "default" : "ghost"} className="border border-white/15 px-4 py-2" onClick={() => onBet("small")}>押小 1-3</Button>
          <Button className="px-4 py-2" onClick={onRoll}>掷骰子</Button>
        </div>
        {dice !== null && (
          <div className="mt-3 rounded-xl bg-black/25 p-3 text-sm text-white/80">
            <p>骰子点数：<span className="font-mono text-xl text-amber-200">{dice}</span> · {wonDiscount ? "猜中，已减 ¥500" : "未猜中，截图价不变"}</p>
            <p className="mt-1">截图锁定价：<span className="font-mono text-amber-200">{formatCny(finalAmount)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

function DecisionTree({ exam }: { exam: ExamKey }) {
  const trees: Record<ExamKey, string[]> = {
    duolingo: ["单次：¥3,500 起，不含申诉/重考", "保分：≤100 分 ¥8,000；100 分以上每 +10 分加 ¥1,500", "有口语小分：目标 - 当前，每 5 分预估 1 节课，每节 ¥500", "地区/设备系数由独立 API 计算，前端不展示"],
    toefl: ["目标 <4.5：¥8,000", "4.5-5.0：¥9,000", "≥5.0：¥10,000 起", "口语预测：可选 +¥3,000"],
    gre: ["300 档：¥8,000", "310 档：¥9,000", "320+ 档：¥10,000 起", "写作 4/4.5/5 目标需加项确认"],
    sat: ["1400：¥10,000", "1500：¥15,000", "1550+：¥20,000", "具体按考期与目标截图确认"],
    ielts: ["境外线下直出", "头像非本人", "¥80,000 起", "行情波动大，截图私聊确认"],
    other: ["PTE / TOEIC / LanguageCert：¥10,000 起", "CAEL 换脸：¥30,000 起", "具体看目标分与风控", "截图后微信 Paulwie 私聊"]
  };

  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Decision Tree</p>
      <ul className="mt-3 space-y-2 text-sm text-white/72">
        {trees[exam].map((item) => <li key={item}>↳ {item}</li>)}
      </ul>
    </div>
  );
}

function Range({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-sm text-white/80">
      {label}
      <input className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-amber-300" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${checked ? "border-amber-200/60 bg-amber-200/10 text-amber-100" : "border-white/15 bg-white/5 text-white/70"}`}>
      {checked ? "✓" : "○"} {label}
    </button>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <div className="grid gap-2 rounded-2xl bg-black/20 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => onChange(option.value)} className={`rounded-xl px-3 py-2 text-xs transition ${value === option.value ? "bg-amber-200 text-black" : "text-white/65 hover:bg-white/10"}`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

function buildVisitorContext() {
  if (typeof window === "undefined") return null;
  return {
    userAgent: navigator.userAgent,
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    capturedAt: new Date().toISOString()
  };
}

function buildFallbackQuote(title: string, amount: number, summary: string): ExamQuote {
  return {
    amount,
    estimate: formatCny(amount),
    title,
    summary,
    serviceIncludes: ["报价 API 不可用时显示前端兜底价", "截图后以微信 Paulwie 最终确认为准"],
    caveats: ["地区与设备系数由服务端独立计算", "本页不展示隐藏加权逻辑"],
    quoteMeta: {
      confidence: "frontend-fallback",
      capturedAt: "pending",
      deviceTier: "unknown"
    }
  };
}

function formatCny(amount: number) {
  return `¥${amount.toLocaleString("zh-CN")}`;
}
