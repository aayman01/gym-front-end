"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/api/storefront/use-cart";
import { useCartStore } from "@/stores/cart-store";
import type { PublicProductDetail } from "@/types/storefront";

type Props = {
  product: PublicProductDetail;
  selectedVariantId: string | null;
};

export function AddToCartForm({ product, selectedVariantId }: Props) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  const openCart = useCartStore((s) => s.openDrawer);

  const selectedVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId)
    : product.variants.find((v) => v.isBase) ?? product.variants[0];

  const availableStock = selectedVariant?.availableStock ?? 0;
  const outOfStock = availableStock <= 0;
  const maxQty = Math.min(availableStock, 99);

  const handleAdd = async () => {
    if (!selectedVariant) return;
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });
      toast.success("Added to cart");
      openCart();
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-muted-foreground">Quantity</p>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/60">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-9 items-center justify-center rounded-l-lg text-foreground transition hover:bg-primary/10 disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= maxQty}
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="flex size-9 items-center justify-center rounded-r-lg text-foreground transition hover:bg-primary/10 disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
        {outOfStock ? (
          <span className="text-xs font-medium text-destructive">
            Out of stock
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {availableStock} available
          </span>
        )}
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={outOfStock || !selectedVariant || addToCart.isPending}
        onClick={handleAdd}
      >
        <ShoppingCart className="mr-2 size-5" />
        {addToCart.isPending ? "Adding..." : "Add to cart"}
      </Button>
    </div>
  );
}
