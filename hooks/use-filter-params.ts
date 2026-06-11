"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PublicProductsQuery } from "@/types/storefront";

const PARAM_KEYS: (keyof PublicProductsQuery)[] = [
  "page",
  "limit",
  "search",
  "categorySlug",
  "brandSlug",
  "minRating",
  "minPrice",
  "maxPrice",
  "sortBy",
  "sortOrder",
];

function toQuery(params: URLSearchParams): PublicProductsQuery {
  const q: PublicProductsQuery = {};

  const search = params.get("search");
  if (search) q.search = search;

  const categorySlug = params.get("categorySlug");
  if (categorySlug) q.categorySlug = categorySlug;

  const brandSlug = params.get("brandSlug");
  if (brandSlug) q.brandSlug = brandSlug;

  const minRating = params.get("minRating");
  if (minRating) q.minRating = Number(minRating);

  const minPrice = params.get("minPrice");
  if (minPrice) q.minPrice = Number(minPrice);

  const maxPrice = params.get("maxPrice");
  if (maxPrice) q.maxPrice = Number(maxPrice);

  const sortBy = params.get("sortBy") as PublicProductsQuery["sortBy"];
  if (sortBy) q.sortBy = sortBy;

  const sortOrder = params.get("sortOrder") as PublicProductsQuery["sortOrder"];
  if (sortOrder) q.sortOrder = sortOrder;

  const page = params.get("page");
  if (page) q.page = Number(page);

  return q;
}

export function useFilterParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = toQuery(searchParams);

  const update = useCallback(
    (patch: Partial<PublicProductsQuery>) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      // Reset to page 1 when any filter (not page itself) changes
      const isPageChange = Object.keys(patch).every((k) => k === "page");
      if (!isPageChange) {
        next.delete("page");
      }

      router.push(`?${next.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const reset = useCallback(() => {
    router.push("?", { scroll: false });
  }, [router]);

  const hasFilters = PARAM_KEYS.some((k) => {
    if (k === "page" || k === "limit" || k === "sortBy" || k === "sortOrder")
      return false;
    return searchParams.has(k);
  });

  return { query, update, reset, hasFilters };
}
