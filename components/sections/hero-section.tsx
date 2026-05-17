import { BrandLogo } from "@/components/ui/brand-logo";

const proofCards = [
  {
    title: "学术背景",
    body: "985 大学 Double E Major · 欧陆百万奖学金岗位制计算机博士",
    eyebrow: "Academic"
  },
  {
    title: "语言资质",
    body: "全考试 C2 水平 · 每类主流语言考试均有百场以上实战经验",
    eyebrow: "Language"
  },
  {
    title: "服务规模",
    body: "累计服务 3000+ 学生，覆盖 Offer、本硕博申请、出国语言成绩与学术支持",
    eyebrow: "Outcome"
  }
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 pb-16 pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(67,97,238,0.35),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(147,51,234,0.3),transparent_35%)]" />
      <div className="mx-auto max-w-5xl text-center">
        <BrandLogo />
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white md:text-7xl">重塑你的学术与人生轨迹</h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-white/70 md:text-xl">
          C2 顶级语言资质 · 万场考试经验 · 500强投研视野
        </p>
        <p className="mt-3 text-sm text-amber-200/80">PAULWIE EDU · 博维国际教育</p>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {proofCards.map((card) => (
            <article key={card.title} className="glass rounded-3xl p-5 text-left shadow-glow">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200/65">{card.eyebrow}</p>
              <h2 className="mt-3 text-lg font-semibold text-white">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">{card.body}</p>
            </article>
          ))}
        </div>

        <a href="#exam-pricing" className="mx-auto mt-12 inline-flex flex-col items-center gap-2 text-xs tracking-[0.24em] text-white/45 transition hover:text-white/75">
          <span>下滑浏览服务</span>
          <span className="animate-bounce text-2xl leading-none">↓</span>
        </a>
      </div>
    </section>
  );
}
