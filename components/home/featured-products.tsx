"use client";

import { ProductCard } from "@/components/home/product-card";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-home-data";
import { usePublicProducts } from "@/hooks/api/storefront/use-public-products";

export function FeaturedProducts() {
  const { data, isLoading, isError } = usePublicProducts({ limit: 8 });
  const products =
    !isError && data?.data && data.data.length > 0
      ? data.data
      : FALLBACK_PRODUCTS;

  return (
    <section id="products" className="border-b border-border/60 py-16 md:py-24">
      <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Top Picks"
            title="Featured supplements"
            description="High-performing products with strong ratings, transparent formulas, and athlete-ready results."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.04}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        ) : null}
      </div>
    </section>
  );
}
