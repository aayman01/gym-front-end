"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/api/storefront/use-cart";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  if (isLoading) {
    return <CartSkeleton />;
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center md:px-6">
        <ShoppingBag className="mb-4 size-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add some products to see them here.
        </p>
        <Button className="mt-6" render={<Link href="/products" />}>
          Browse products
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
        <Button
          variant="ghost"
          size="sm"
          disabled={clearCart.isPending}
          onClick={() => clearCart.mutate()}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="mr-1.5 size-4" />
          Clear all
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm"
            >
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface-dim">
                {item.product.thumbnailUrl ? (
                  <Image
                    src={item.product.thumbnailUrl}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="size-8 text-primary/30" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between gap-3 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="line-clamp-2 font-medium hover:text-primary"
                    >
                      {item.product.title}
                    </Link>
                    {item.variant && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        SKU: {item.variant.sku}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem.mutate(item.id)}
                    disabled={removeItem.isPending}
                    aria-label="Remove item"
                    className="shrink-0 rounded p-1 text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1 || updateItem.isPending}
                      onClick={() =>
                        updateItem.mutate({
                          itemId: item.id,
                          payload: { quantity: item.quantity - 1 },
                        })
                      }
                      className="flex size-8 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={
                        item.quantity >= (item.variant?.availableStock ?? 0) ||
                        updateItem.isPending
                      }
                      onClick={() =>
                        updateItem.mutate({
                          itemId: item.id,
                          payload: { quantity: item.quantity + 1 },
                        })
                      }
                      className="flex size-8 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  <p className="text-base font-bold text-primary">
                    {formatPrice(
                      (
                        parseFloat(item.variant?.price ?? "0") * item.quantity
                      ).toFixed(2),
                    )}
                  </p>
                </div>

                {item.variant && item.variant.availableStock < 5 && item.variant.availableStock > 0 && (
                  <p className="text-xs text-amber-500">
                    Only {item.variant.availableStock} left in stock
                  </p>
                )}
                {item.variant && item.variant.availableStock === 0 && (
                  <p className="text-xs text-destructive">
                    Out of stock — remove this item to continue
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-base font-semibold">Order summary</h2>

          <div className="space-y-3 border-b border-border/60 pb-4 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <span className="line-clamp-1 text-muted-foreground">
                  {item.product.title} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(
                    (
                      parseFloat(item.variant?.price ?? "0") * item.quantity
                    ).toFixed(2),
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-base font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(cart?.selectedTotal ?? "0")}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Shipping and taxes calculated at checkout
          </p>

          <div className="mt-5 space-y-2">
            <Button className="w-full" render={<Link href="/checkout" />}>
              Proceed to checkout
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              render={<Link href="/products" />}
            >
              Continue shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted/40" />
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-border/60 p-4 animate-pulse"
            >
              <div className="size-24 shrink-0 rounded-xl bg-muted/40" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/3 rounded bg-muted/40" />
                <div className="h-4 w-1/3 rounded bg-muted/30" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 rounded-2xl border border-border/60 bg-muted/20 animate-pulse" />
      </div>
    </div>
  );
}
