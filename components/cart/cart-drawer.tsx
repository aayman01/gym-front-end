"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Package, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useCartStore } from "@/stores/cart-store";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/api/storefront/use-cart";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const close = useCartStore((s) => s.closeDrawer);
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const items = cart?.items ?? [];
  const selectedTotal = cart?.selectedTotal ?? "0.00";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold">
            Your cart{" "}
            {cart && cart.itemCount > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {cart.itemCount}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="rounded-md p-1.5 text-muted-foreground transition hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl bg-muted/30 p-3 animate-pulse"
                >
                  <div className="size-16 shrink-0 rounded-lg bg-muted/50" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted/50" />
                    <div className="h-3 w-1/2 rounded bg-muted/40" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="mb-4 size-12 text-muted-foreground/40" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add some products to get started
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={close}
                render={<Link href="/products" />}
              >
                Browse products
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-border/60 bg-card/60 p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-dim">
                    {item.product.thumbnailUrl ? (
                      <Image
                        src={item.product.thumbnailUrl}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="size-6 text-primary/30" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={close}
                        className="line-clamp-2 text-sm font-medium hover:text-primary"
                      >
                        {item.product.title}
                      </Link>
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
                      <p className="text-sm font-bold text-primary">
                        {formatPrice(item.variant?.price ?? "0")}
                      </p>
                      <div className="flex items-center gap-1 rounded-md border border-border/60">
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
                          className="flex size-7 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={
                            item.quantity >=
                              (item.variant?.availableStock ?? 0) ||
                            updateItem.isPending
                          }
                          onClick={() =>
                            updateItem.mutate({
                              itemId: item.id,
                              payload: { quantity: item.quantity + 1 },
                            })
                          }
                          className="flex size-7 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(selectedTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={close}
                render={<Link href="/cart" />}
                className="w-full"
              >
                View cart
              </Button>
              <Button
                onClick={close}
                render={<Link href="/checkout" />}
                className="w-full"
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
