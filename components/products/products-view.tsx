"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "./product-filters";
import { ProductGrid } from "./product-grid";
import { useFilterParams } from "@/hooks/use-filter-params";
import type { PublicProductsQuery } from "@/types/storefront";

type ProductsViewProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Query values locked for this view (e.g. a category slug on a category page). */
  forcedQuery?: Partial<PublicProductsQuery>;
  /** Hide the category selector in the filters panel. */
  hideCategoryFilter?: boolean;
  /** Hide the brand selector in the filters panel. */
  hideBrandFilter?: boolean;
};

export function ProductsView({
  eyebrow = "Catalog",
  title = "All Supplements",
  subtitle = "Browse our full range of performance-grade supplements.",
  forcedQuery,
  hideCategoryFilter = false,
  hideBrandFilter = false,
}: ProductsViewProps = {}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { hasFilters } = useFilterParams();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
      {/* Page heading */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <Button
          variant="outline"
          size="sm"
          className="self-start md:hidden"
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          {mobileFiltersOpen ? (
            <>
              <X className="size-4" />
              Hide filters
            </>
          ) : (
            <>
              <SlidersHorizontal className="size-4" />
              {hasFilters ? "Filters •" : "Filters"}
            </>
          )}
        </Button>
      </div>

      {/* Mobile filter panel (above grid) */}
      {mobileFiltersOpen && (
        <div className="mb-6 rounded-xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm md:hidden">
          <ProductFilters
            hideCategory={hideCategoryFilter}
            hideBrand={hideBrandFilter}
          />
        </div>
      )}

      {/* Desktop layout: sidebar + grid */}
      <div className="flex items-start gap-8">
        {/* Sticky sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-24 rounded-xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
            <ProductFilters
              hideCategory={hideCategoryFilter}
              hideBrand={hideBrandFilter}
            />
          </div>
        </aside>

        {/* Product grid */}
        <main className="min-w-0 flex-1">
          <ProductGrid forcedQuery={forcedQuery} />
        </main>
      </div>
    </div>
  );
}
