"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductsView } from "@/components/products/products-view";
import { usePublicCategory } from "@/hooks/api/storefront/use-public-categories";
import { ApiError } from "@/lib/api-client";

type Props = { slug: string };

export function CategoryView({ slug }: Props) {
  const { data: category, isLoading, isError, error } = usePublicCategory(slug);

  if (!isLoading && isError && error instanceof ApiError && error.status === 404) {
    notFound();
  }

  const title = category?.name ?? "Category";
  const subtitle = isError
    ? "This category could not be loaded. Browse the full catalog instead."
    : `Shop performance-grade supplements in ${category?.name ?? "this category"}.`;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to all products
        </Link>
      </div>

      <ProductsView
        eyebrow="Category"
        title={isLoading ? "Loading…" : title}
        subtitle={subtitle}
        forcedQuery={{ categorySlug: slug }}
        hideCategoryFilter
      />
    </div>
  );
}
