import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsView } from "@/components/products/products-view";

export const metadata: Metadata = {
  title: "Supplements Catalog | Crimson Forge",
  description:
    "Browse our full range of performance-grade gym supplements. Filter by category, brand, price, and rating.",
};

function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-16 animate-pulse rounded-full bg-primary/20" />
        <div className="h-10 w-64 animate-pulse rounded-xl bg-muted/40" />
        <div className="h-4 w-96 animate-pulse rounded-full bg-muted/30" />
      </div>
      <div className="flex gap-8">
        <div className="hidden w-60 shrink-0 md:block">
          <div className="h-[500px] animate-pulse rounded-xl bg-muted/40" />
        </div>
        <div className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-xl bg-muted/40"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsView />
    </Suspense>
  );
}
