"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PricingCalculator } from "@/components/sections/pricing-calculator";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 pb-16 pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(67,97,238,0.35),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(147,51,234,0.3),transparent_35%)]" />
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/50">Borderless Spatial UI</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-7xl">重塑你的学术与人生轨迹</h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-white/70 md:text-xl">
          C2 顶级语言资质 · 万场考试经验 · 500强投研视野
        </p>
        <div className="mt-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-12 px-8 text-base">启动专属评估</Button>
            </DialogTrigger>
            <DialogContent>
              <PricingCalculator />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
