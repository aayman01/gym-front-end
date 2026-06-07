"use client";

import { CategoryCard } from "@/components/home/category-card";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { FALLBACK_CATEGORIES } from "@/lib/fallback-home-data";
import { usePublicCategories } from "@/hooks/api/storefront/use-public-categories";

export function CategoryShowcase() {
  const { data, isLoading, isError } = usePublicCategories();
  const categories =
    !isError && data && data.length > 0 ? data : FALLBACK_CATEGORIES;

  return (
    <section id="categories" className="border-b border-border/60 py-16 md:py-24">
      <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Shop by Goal"
            title="Find the right supplement category"
            description="From daily protein to session-boosting pre-workout, browse categories tailored to your training style."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.05}>
              <CategoryCard category={category} index={index} />
            </Reveal>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading categories...</p>
        ) : null}
      </div>
    </section>
  );
}
