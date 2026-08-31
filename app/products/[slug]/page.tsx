"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { ProductDetailView } from "@/components/products/pdp/product-detail-view";
import { usePublicProduct } from "@/hooks/api/storefront/use-public-product";

type Props = {
  params: Promise<{ slug: string }>;
};

function ProductDetailLoader({ slug }: { slug: string }) {
  const { data: product, isLoading, isError, error } = usePublicProduct(slug);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    // status 404 triggers Next.js not-found boundary
    const status = (error as { status?: number })?.status;
    if (status === 404) notFound();
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Failed to load product. Please try again.</p>
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 h-4 w-32 animate-pulse rounded-full bg-muted/40" />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted/40" />
        <div className="space-y-4">
          <div className="h-3 w-20 animate-pulse rounded bg-muted/30" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted/40" />
          <div className="h-6 w-24 animate-pulse rounded bg-muted/40" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted/40" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  return <ProductDetailLoader slug={slug} />;
}
