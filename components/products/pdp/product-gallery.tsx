"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Package, Star, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProductDetail } from "@/types/storefront";

type Props = {
  product: PublicProductDetail;
};

export function ProductGallery({ product }: Props) {
  const allImages = [
    ...(product.thumbnail
      ? [{ url: product.thumbnail.url, id: "thumb" }]
      : []),
    ...product.images.map((i) => ({ url: i.image.url, id: i.id })),
  ].filter(
    (img, idx, arr) => arr.findIndex((a) => a.url === img.url) === idx,
  );

  const [activeIdx, setActiveIdx] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-surface-dim">
        <Package className="size-20 text-primary/40" />
      </div>
    );
  }

  const current = allImages[activeIdx];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-surface-dim">
        <Image
          src={current.url}
          alt={product.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIdx((i) => (i === 0 ? allImages.length - 1 : i - 1))
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground backdrop-blur-sm transition hover:bg-background/90"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIdx((i) => (i === allImages.length - 1 ? 0 : i + 1))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground backdrop-blur-sm transition hover:bg-background/90"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border transition",
                idx === activeIdx
                  ? "border-primary ring-1 ring-primary"
                  : "border-border/60 hover:border-primary/50",
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
