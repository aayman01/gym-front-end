"use client";

import { CategoryCard } from "@/components/home/category-card";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { usePublicCategories } from "@/hooks/api/storefront/use-public-categories";

export function CategoryShowcase() {
  const { data, isLoading, isError } = usePublicCategories();
  const categories = data ?? [];

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

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted/40" />
            ))}
          </div>
        ) : isError || categories.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Categories will appear here once they are published.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category, index) => (
              <Reveal key={category.id} delay={index * 0.05}>
                <CategoryCard category={category} index={index} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
