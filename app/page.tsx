import { HeroSection } from "@/components/sections/hero-section";
import { MediaHub } from "@/components/sections/media-hub";
import { ServiceShowcase } from "@/components/sections/service-showcase";
import { StatsBar } from "@/components/sections/stats-bar";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <ServiceShowcase />
      <MediaHub />
    </main>
  );
}
