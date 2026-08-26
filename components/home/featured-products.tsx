"use client";

import Link from "next/link";
import { ProductCard } from "@/components/home/product-card";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { Button } from "@/components/ui/button";
import { usePublicCollections } from "@/hooks/api/storefront/use-public-collections";
import { usePublicProducts } from "@/hooks/api/storefront/use-public-products";

export function FeaturedProducts() {
  const collectionsQuery = usePublicCollections();
  const featuredCollection = collectionsQuery.data?.find(
    (c) => c.products.length > 0,
  );
  const collectionProducts = featuredCollection?.products.slice(0, 8) ?? [];
  const useFallback =
    !collectionsQuery.isLoading && collectionProducts.length === 0;

  const fallbackQuery = usePublicProducts(
    { limit: 8, isFeature: true },
    { enabled: useFallback },
  );

  const products = useFallback
    ? (fallbackQuery.data?.data ?? [])
    : collectionProducts;
  const isLoading = collectionsQuery.isLoading || (useFallback && fallbackQuery.isLoading);
  const isError = collectionsQuery.isError && fallbackQuery.isError;

  const headingTitle = featuredCollection?.title ?? "Featured supplements";
  const headingDescription =
    featuredCollection?.subTitle ??
    "High-performing products with strong ratings, transparent formulas, and athlete-ready results.";

  return (
    <section id="products" className="border-b border-border/60 py-16 md:py-24">
      <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Top Picks"
            title={headingTitle}
            description={headingDescription}
          />
        </Reveal>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted/40" />
            ))}
          </div>
        ) : isError || products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Featured products will appear here once they are published.
            </p>
            <Button className="mt-4" render={<Link href="/products" />}>
              Browse catalog
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.04}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
