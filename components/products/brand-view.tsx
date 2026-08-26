"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductsView } from "@/components/products/products-view";
import { usePublicBrands } from "@/hooks/api/storefront/use-public-brands";

type Props = { slug: string };

export function BrandView({ slug }: Props) {
  const { data: brands, isLoading, isError } = usePublicBrands();
  const brand = brands?.find((b) => b.slug === slug);

  if (!isLoading && !isError && brands && !brand) {
    notFound();
  }

  const title = brand?.name ?? "Brand";
  const subtitle = brand
    ? `Shop performance-grade supplements from ${brand.name}.`
    : "Browse products from this brand.";

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
        eyebrow="Brand"
        title={isLoading ? "Loading…" : title}
        subtitle={subtitle}
        forcedQuery={{ brandSlug: slug }}
        hideBrandFilter
      />
    </div>
  );
}
