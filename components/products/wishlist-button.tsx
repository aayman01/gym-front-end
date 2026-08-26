"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useAddToWishlist,
  useRemoveWishlistItem,
  useWishlist,
} from "@/hooks/api/storefront/use-wishlist";

type Props = {
  productId: string;
  variantId?: string | null;
  className?: string;
};

export function WishlistButton({ productId, variantId, className }: Props) {
  const { data: wishlist } = useWishlist();
  const add = useAddToWishlist();
  const remove = useRemoveWishlistItem();

  const existing = wishlist?.items.find((item) =>
    variantId
      ? item.variantId === variantId
      : item.productId === productId && !item.variantId,
  );
  const saved = Boolean(existing);
  const pending = add.isPending || remove.isPending;

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (existing) {
        await remove.mutateAsync(existing.id);
        toast.success("Removed from wishlist");
      } else {
        await add.mutateAsync({
          productId,
          variantId: variantId ?? undefined,
        });
        toast.success("Saved to wishlist");
      }
    } catch {
      toast.error("Could not update wishlist");
    }
  };

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      disabled={pending}
      onClick={(e) => void toggle(e)}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground backdrop-blur-sm transition hover:text-primary disabled:opacity-50",
        saved && "border-primary/40 text-primary",
        className,
      )}
    >
      <Heart className={cn("size-4", saved && "fill-primary")} />
    </button>
  );
}
