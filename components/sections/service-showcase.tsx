"use client";

import CountUp from "react-countup";
import { PricingCalculator } from "@/components/sections/pricing-calculator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const services = [
  {
    title: "语言成绩辅导与直接出分",
    badges: ["IELTS", "TOEFL", "DUOLINGO"],
    points: [
      "导师实绩：雅思 8.5，2026 年已带 100+ 学生线下成功出分",
      "导师实绩：托福 116，2026 年已带 100+ 学生成功出分",
      "导师实绩：多邻国 155，累计 10000+ 场考试案例沉淀"
    ],
    metrics: [
      { label: "雅思出分", value: 120 },
      { label: "托福出分", value: 105 },
      { label: "多邻国案例", value: 10000 }
    ],
    defaultBundle: 2
  },
  {
    title: "本科 / 硕士 / 博士申请成果",
    badges: ["IVY", "QS50", "HK TOP5"],
    points: [
      "常青藤本科申请路径规划 + 学术背景重塑",
      "QS 前 50 / 前 100 硕士申请矩阵：英国、美国、澳洲、香港",
      "欧陆博士科研型申请：套磁、RP、面试全流程支持"
    ],
    metrics: [
      { label: "QS50 硕士", value: 85 },
      { label: "HK TOP5", value: 60 },
      { label: "欧陆博士", value: 30 }
    ],
    defaultBundle: 0
  },
  {
    title: "课程作业与学术护航",
    badges: ["Essay", "Exam", "1v1"],
    points: [
      "论文、Presentation、考试冲刺一体化辅导",
      "研究方法 + 学术写作框架搭建，减少试错成本",
      "按周交付制：可视化进度与纠错反馈"
    ],
    metrics: [
      { label: "课程辅导小时", value: 5000 },
      { label: "论文项目", value: 900 },
      { label: "冲刺班", value: 260 }
    ],
    defaultBundle: 3
  },
  {
    title: "求职与海外落地支持",
    badges: ["CV", "Interview", "Career"],
    points: [
      "求职策略、简历重构、行为面试题库训练",
      "500 强投研视角下的行业路径建议",
      "海外生活与签证流程支持，降低落地焦虑"
    ],
    metrics: [
      { label: "求职辅导", value: 400 },
      { label: "模拟面试", value: 1000 },
      { label: "落地支持", value: 320 }
    ],
    defaultBundle: 4
  }
];

export function ServiceShowcase() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold md:text-4xl">业务与成果一体化矩阵</h2>
        <p className="mt-3 text-sm text-white/65">每个区块内直接展示业务逻辑与可验证成果，不再拆分为独立案例页。</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Dialog key={service.title}>
              <article className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/60 hover:bg-white/[0.06]">
                <div className="flex flex-wrap gap-2">
                  {service.badges.map((badge) => (
                    <span key={badge} className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white/85">
                      {badge}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-xl font-medium text-white">{service.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {service.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {service.metrics.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/15 bg-black/20 p-2 text-center">
                      <p className="font-mono text-lg text-amber-200">
                        <CountUp end={item.value} duration={1.6} separator="," />+
                      </p>
                      <p className="text-[11px] text-white/70">{item.label}</p>
                    </div>
                  ))}
                </div>
                <DialogTrigger asChild>
                  <Button className="mt-5 w-full">进入该服务并获取弹窗报价</Button>
                </DialogTrigger>
              </article>
              <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
                <PricingCalculator serviceTitle={service.title} defaultBundle={service.defaultBundle} />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
