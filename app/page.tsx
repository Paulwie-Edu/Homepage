import { HeroSection } from "@/components/sections/hero-section";
import { MediaHub } from "@/components/sections/media-hub";
import { ServiceShowcase } from "@/components/sections/service-showcase";
import { SocialStrip } from "@/components/sections/social-strip";
import { StatsBar } from "@/components/sections/stats-bar";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <ServiceShowcase />
      <MediaHub />
      <SocialStrip />
    </main>
  );
}
