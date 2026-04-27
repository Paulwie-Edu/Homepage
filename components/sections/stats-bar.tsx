"use client";

import useSWR from "swr";
import CountUp from "react-countup";

export const DEFAULT_STATS = {
  students_score: "3000+",
  master_offer: "100+",
  phd_offer: "30+",
  tutoring_hours: "5000H+"
};

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Stats API unavailable");
  return response.json();
};

const parseValue = (raw: string) => Number(raw.replace(/[^\d]/g, ""));

export function StatsBar() {
  const { data } = useSWR("/api/stats", fetcher, {
    fallbackData: DEFAULT_STATS,
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  const stats = data ?? DEFAULT_STATS;

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
        {Object.entries(stats).map(([key, value]) => (
          <article key={key} className="glass rounded-3xl px-6 py-8 text-center shadow-glow">
            <p className="font-mono text-3xl font-semibold text-white md:text-5xl">
              <CountUp end={parseValue(value)} duration={2} />
              {value.replace(/\d+/g, "")}
            </p>
            <p className="mt-3 text-sm text-white/70">{labelMap[key as keyof typeof DEFAULT_STATS]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const labelMap = {
  students_score: "学生出分",
  master_offer: "本硕 Offer",
  phd_offer: "博士上岸",
  tutoring_hours: "课程辅导时长"
};
