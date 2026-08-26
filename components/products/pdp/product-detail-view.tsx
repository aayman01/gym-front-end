"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/products/pdp/product-gallery";
import { VariantSelector } from "@/components/products/pdp/variant-selector";
import { AddToCartForm } from "@/components/products/pdp/add-to-cart-form";
import { ProductReviews } from "@/components/products/pdp/product-reviews";
import { formatPrice } from "@/lib/format-price";
import type { PublicProductDetail } from "@/types/storefront";

type Props = { product: PublicProductDetail };

export function ProductDetailView({ product }: Props) {
  const baseVariant =
    product.variants.find((v) => v.isBase) ?? product.variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    baseVariant?.id ?? null,
  );

  const selectedVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId)
    : baseVariant;

  const displayPrice = selectedVariant?.price ?? product.basePrice;
  const rating = Number.parseFloat(product.rating);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />

        <div className="space-y-6">
          <div className="space-y-2">
            {product.brand && (
              <Link
                href={`/brands/${product.brand.slug}`}
                className="inline-block text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
              >
                {product.brand.name}
              </Link>
            )}
            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              {!Number.isNaN(rating) && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-4 fill-primary text-primary" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                </div>
              )}
              <Link href={`/categories/${product.category.slug}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer transition-colors hover:bg-secondary/70"
                >
                  {product.category.name}
                </Badge>
              </Link>
              <Badge variant="outline">{product.sellingUnit}</Badge>
            </div>
          </div>

          <p className="text-3xl font-bold text-primary">
            {formatPrice(displayPrice)}
          </p>

          {product.summary && (
            <p className="text-base leading-7 text-muted-foreground">
              {product.summary}
            </p>
          )}

          {product.variants.length > 0 && (
            <VariantSelector
              product={product}
              selectedVariantId={selectedVariantId}
              onVariantChange={setSelectedVariantId}
            />
          )}

          <AddToCartForm
            product={product}
            selectedVariantId={selectedVariantId}
          />

          {product.description && (
            <div className="space-y-2 border-t border-border/60 pt-6">
              <h2 className="text-base font-semibold">Description</h2>
              <div
                className="prose prose-sm prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {product.relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold">You may also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.relatedProducts.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group rounded-xl border border-border/60 bg-card/60 p-4 transition hover:border-primary/40"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {p.brand?.name ?? p.category.name}
                </p>
                <p className="mt-1 line-clamp-2 font-medium group-hover:text-primary">
                  {p.title}
                </p>
                <p className="mt-2 text-sm font-bold text-primary">
                  {formatPrice(p.basePrice)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
