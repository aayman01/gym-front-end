"use client";

import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/home/product-card";
import { usePublicProducts } from "@/hooks/api/storefront/use-public-products";
import { useFilterParams } from "@/hooks/use-filter-params";

const LIMIT = 12;

export function ProductGrid() {
  const { query, update } = useFilterParams();
  const page = query.page ?? 1;

  const { data, isLoading, isError } = usePublicProducts({
    ...query,
    page,
    limit: LIMIT,
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Package className="size-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">
          Something went wrong loading products. Please try again.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: LIMIT }).map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-xl bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Package className="size-12 text-muted-foreground/40" />
        <p className="font-medium text-foreground">No products found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Result count */}
      {meta && (
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, meta.total)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{meta.total}</span>{" "}
          products
        </p>
      )}

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasPrevious}
            onClick={() => update({ page: page - 1 })}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === meta.totalPages ||
                  Math.abs(p - page) <= 1,
              )
              .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                if (idx > 0) {
                  const prev = arr[idx - 1];
                  if (p - prev > 1) acc.push("ellipsis");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-sm text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => update({ page: item as number })}
                    className={
                      item === page
                        ? "flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground"
                        : "flex size-8 items-center justify-center rounded-lg text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    }
                  >
                    {item}
                  </button>
                ),
              )}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasNext}
            onClick={() => update({ page: page + 1 })}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
