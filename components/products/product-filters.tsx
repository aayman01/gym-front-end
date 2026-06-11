"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePublicCategories } from "@/hooks/api/storefront/use-public-categories";
import { usePublicBrands } from "@/hooks/api/storefront/use-public-brands";
import { useFilterParams } from "@/hooks/use-filter-params";
import type { PublicProductsQuery } from "@/types/storefront";

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Newest", value: "updatedAt:desc" },
  { label: "Oldest", value: "updatedAt:asc" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Top Rated", value: "rating:desc" },
  { label: "A → Z", value: "title:asc" },
  { label: "Z → A", value: "title:desc" },
];

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function ProductFilters() {
  const { query, update, reset, hasFilters } = useFilterParams();
  const { data: categories } = usePublicCategories();
  const { data: brands } = usePublicBrands();

  const [localSearch, setLocalSearch] = useState(query.search ?? "");
  const [localMinPrice, setLocalMinPrice] = useState(
    query.minPrice != null ? String(query.minPrice) : "",
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    query.maxPrice != null ? String(query.maxPrice) : "",
  );

  function handleReset() {
    setLocalSearch("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
    reset();
  }

  const debouncedSearch = useDebouncedValue(localSearch);
  const debouncedMinPrice = useDebouncedValue(localMinPrice, 600);
  const debouncedMaxPrice = useDebouncedValue(localMaxPrice, 600);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    update({ search: debouncedSearch || undefined });
    // update is stable (useCallback), omitting it intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (!mounted.current) return;
    update({
      minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
      maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMinPrice, debouncedMaxPrice]);

  const currentSort = query.sortBy
    ? `${query.sortBy}:${query.sortOrder ?? "desc"}`
    : "updatedAt:desc";

  function handleSortChange(value: string) {
    const [sortBy, sortOrder] = value.split(":") as [
      PublicProductsQuery["sortBy"],
      PublicProductsQuery["sortOrder"],
    ];
    update({ sortBy, sortOrder });
  }

  return (
    <aside className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="size-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search supplements…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sort by
        </label>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/50"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div>
          <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update({ categorySlug: undefined })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                !query.categorySlug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground",
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  update({
                    categorySlug:
                      query.categorySlug === cat.slug ? undefined : cat.slug,
                  })
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  query.categorySlug === cat.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {brands && brands.length > 0 && (
        <div>
          <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Brand
          </label>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => update({ brandSlug: undefined })}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                !query.brandSlug
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "size-3 rounded-full border-2",
                  !query.brandSlug ? "border-primary bg-primary" : "border-muted-foreground",
                )}
              />
              All brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() =>
                  update({
                    brandSlug:
                      query.brandSlug === brand.slug ? undefined : brand.slug,
                  })
                }
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                  query.brandSlug === brand.slug
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-3 rounded-full border-2",
                    query.brandSlug === brand.slug
                      ? "border-primary bg-primary"
                      : "border-muted-foreground",
                  )}
                />
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price range */}
      <div>
        <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Price range
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-6 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
            />
          </div>
          <span className="text-muted-foreground">–</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-6 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
            />
          </div>
        </div>
      </div>

      {/* Min rating */}
      <div>
        <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Min rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() =>
                update({
                  minRating: query.minRating === star ? undefined : star,
                })
              }
              className="transition-transform hover:scale-110 active:scale-95"
              aria-label={`${star} star${star > 1 ? "s" : ""} minimum`}
            >
              <Star
                className={cn(
                  "size-6",
                  query.minRating && star <= query.minRating
                    ? "fill-primary text-primary"
                    : "fill-none text-muted-foreground",
                )}
              />
            </button>
          ))}
          {query.minRating && (
            <button
              type="button"
              onClick={() => update({ minRating: undefined })}
              className="ml-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="border-t border-border/60 pt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Active filters
          </p>
          <div className="flex flex-wrap gap-2">
            {query.search && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs"
                onClick={() => {
                  setLocalSearch("");
                  update({ search: undefined });
                }}
              >
                &ldquo;{query.search}&rdquo;
                <X className="size-3 cursor-pointer" />
              </Badge>
            )}
            {query.categorySlug && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs"
                onClick={() => update({ categorySlug: undefined })}
              >
                {query.categorySlug}
                <X className="size-3 cursor-pointer" />
              </Badge>
            )}
            {query.brandSlug && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs"
                onClick={() => update({ brandSlug: undefined })}
              >
                {query.brandSlug}
                <X className="size-3 cursor-pointer" />
              </Badge>
            )}
            {(query.minPrice != null || query.maxPrice != null) && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs"
                onClick={() => {
                  setLocalMinPrice("");
                  setLocalMaxPrice("");
                  update({ minPrice: undefined, maxPrice: undefined });
                }}
              >
                ${query.minPrice ?? 0} – ${query.maxPrice ?? "∞"}
                <X className="size-3 cursor-pointer" />
              </Badge>
            )}
            {query.minRating != null && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs"
                onClick={() => update({ minRating: undefined })}
              >
                {query.minRating}+ ★
                <X className="size-3 cursor-pointer" />
              </Badge>
            )}
          </div>
        </div>
      )}

      {hasFilters && (
        <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
          Clear all filters
        </Button>
      )}
    </aside>
  );
}
