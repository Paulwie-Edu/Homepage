"use client";

import CountUp from "react-countup";

const services = [
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
    pricing: "申请规划按项目报价；文书/面试/套磁可按 ¥1,000/小时拆分，加急插队另算。"
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
    pricing: "课程与作业辅导按 ¥1,000/小时起；急单、跨时区陪跑和高强度冲刺另算。"
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
    pricing: "求职、签证和落地咨询按 ¥1,000/小时起；长期陪跑可按阶段包月。"
  }
];

export function ServiceShowcase() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold md:text-4xl">申请、课程与职业服务</h2>
        <p className="mt-3 text-sm text-white/65">考试服务使用上方独立报价引擎；非考试服务直接展示服务范围与时薪规则。</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/60 hover:bg-white/[0.06]">
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
              <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-white/65">{service.pricing}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
