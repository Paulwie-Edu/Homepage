const services = [
  { title: "留学指导", detail: "保录名校策略 · 选校/文书/面试全流程" },
  { title: "语言辅导", detail: "雅思 8.5 / 多邻国 155 分层提分体系" },
  { title: "课程作业", detail: "论文/Presentation/考试冲刺 1v1 方案" },
  { title: "职场与生活", detail: "求职辅导 · 实习规划 · 海外落地支持" }
];

export function ServiceShowcase() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold md:text-4xl">悬浮业务矩阵</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/60 hover:bg-white/[0.06]"
            >
              <h3 className="text-xl font-medium text-white">{service.title}</h3>
              <p className="mt-3 text-sm text-white/65 transition-colors group-hover:text-white/85">{service.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
