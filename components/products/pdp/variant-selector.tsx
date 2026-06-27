"use client";

import { cn } from "@/lib/utils";
import type { PublicProductDetail } from "@/types/storefront";

type Variant = PublicProductDetail["variants"][number];

type Props = {
  product: PublicProductDetail;
  selectedVariantId: string | null;
  onVariantChange: (id: string) => void;
};

export function VariantSelector({
  product,
  selectedVariantId,
  onVariantChange,
}: Props) {
  if (product.variants.length <= 1 && product.attributes.length === 0) {
    return null;
  }

  if (product.attributes.length > 0) {
    return (
      <div className="space-y-4">
        {product.attributes.map((attr) => (
          <div key={attr.id}>
            <p className="mb-2 text-sm font-medium">{attr.name}</p>
            <div className="flex flex-wrap gap-2">
              {attr.options.map((opt) => {
                const matchingVariant = product.variants.find((v) =>
                  v.attributeOptions.some((ao) => ao.option.id === opt.id),
                );
                const isSelected =
                  matchingVariant?.id === selectedVariantId;
                const outOfStock =
                  matchingVariant && matchingVariant.availableStock <= 0;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={outOfStock || !matchingVariant}
                    onClick={() =>
                      matchingVariant && onVariantChange(matchingVariant.id)
                    }
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm font-medium transition",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-foreground hover:border-primary/50",
                      outOfStock && "cursor-not-allowed opacity-40 line-through",
                    )}
                  >
                    {opt.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium">Variant</p>
      <div className="flex flex-wrap gap-2">
        {product.variants.map((v: Variant) => (
          <button
            key={v.id}
            type="button"
            disabled={v.availableStock <= 0}
            onClick={() => onVariantChange(v.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition",
              v.id === selectedVariantId
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-foreground hover:border-primary/50",
              v.availableStock <= 0 &&
                "cursor-not-allowed opacity-40 line-through",
            )}
          >
            {v.sku}
          </button>
        ))}
      </div>
    </div>
  );
}
