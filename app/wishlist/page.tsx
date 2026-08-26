"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useAddToCart } from "@/hooks/api/storefront/use-cart";
import {
  useRemoveWishlistItem,
  useWishlist,
} from "@/hooks/api/storefront/use-wishlist";
import { useCartStore } from "@/stores/cart-store";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();
  const removeItem = useRemoveWishlistItem();
  const addToCart = useAddToCart();
  const openCart = useCartStore((s) => s.openDrawer);
  const items = wishlist?.items ?? [];

  const handleRemove = async (itemId: string) => {
    try {
      await removeItem.mutateAsync(itemId);
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Could not remove item");
    }
  };

  const handleAddToCart = async (item: (typeof items)[number]) => {
    try {
      await addToCart.mutateAsync({
        productId: item.productId,
        variantId: item.variantId ?? undefined,
        quantity: 1,
      });
      toast.success("Added to cart");
      openCart();
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Save products you want to come back to.
      </p>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted/40" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <Heart className="mb-3 size-12 text-muted-foreground/30" />
          <p className="font-medium">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the heart on a product to save it here.
          </p>
          <Button className="mt-4" render={<Link href="/products" />}>
            Browse products
          </Button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60"
            >
              <Link href={`/products/${item.product.slug}`} className="relative aspect-[4/3] bg-surface-dim">
                {item.product.thumbnailUrl ? (
                  <Image
                    src={item.product.thumbnailUrl}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="size-10 text-primary/50" />
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <Link href={`/products/${item.product.slug}`}>
                  <p className="font-medium leading-snug hover:text-primary">
                    {item.product.title}
                  </p>
                </Link>
                {item.variant && (
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(item.variant.price)}
                  </p>
                )}
                <div className="mt-auto flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => void handleAddToCart(item)}
                    disabled={addToCart.isPending}
                  >
                    Add to cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label="Remove from wishlist"
                    onClick={() => void handleRemove(item.id)}
                    disabled={removeItem.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
