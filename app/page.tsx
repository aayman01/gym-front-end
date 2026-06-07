import { BenefitsStrip } from "@/components/home/benefits-strip";
import { BrandStory } from "@/components/home/brand-story";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HomeCta } from "@/components/home/home-cta";
import { HomeHero } from "@/components/home/home-hero";
import { SocialProof } from "@/components/home/social-proof";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HomeHero />
        <CategoryShowcase />
        <FeaturedProducts />
        <BenefitsStrip />
        <SocialProof />
        <BrandStory />
        <HomeCta />
      </main>
      <SiteFooter />
    </div>
  );
}
