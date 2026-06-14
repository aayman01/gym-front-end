import { BenefitsStrip } from "@/components/home/benefits-strip";
import { BrandStory } from "@/components/home/brand-story";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HomeCta } from "@/components/home/home-cta";
import { HomeHero } from "@/components/home/home-hero";
import { SocialProof } from "@/components/home/social-proof";

export default function Home() {
  return (
    <>
      <HomeHero />
      <CategoryShowcase />
      <FeaturedProducts />
      <BenefitsStrip />
      <SocialProof />
      <BrandStory />
      <HomeCta />
    </>
  );
}
