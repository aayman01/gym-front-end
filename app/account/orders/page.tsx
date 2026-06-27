"use client";

import Link from "next/link";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useCustomerOrders } from "@/hooks/api/storefront/use-customer-orders";

function statusColor(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-amber-500/10 text-amber-500";
    case "CONFIRMED":
    case "PROCESSING":
      return "bg-blue-500/10 text-blue-400";
    case "SHIPPED":
      return "bg-indigo-500/10 text-indigo-400";
    case "DELIVERED":
    case "COMPLETED":
      return "bg-green-500/10 text-green-400";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-muted/50 text-muted-foreground";
  }
}

export default function OrdersPage() {
  const { data, isLoading } = useCustomerOrders(1, 20);
  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Order history</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all your past orders.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted/40" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <ShoppingBag className="mb-3 size-12 text-muted-foreground/30" />
          <p className="font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Place your first order to see it here.
          </p>
          <Button className="mt-4" render={<Link href="/products" />}>
            Browse products
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/60 p-4 transition hover:border-primary/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Package className="size-5 shrink-0 text-primary/60" />
                  <div className="min-w-0">
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor(order.status)}`}
                  >
                    {order.status.toLowerCase()}
                  </span>
                  <p className="font-semibold text-primary">
                    {formatPrice(order.totalAmount)}
                  </p>
                  <ArrowRight className="size-4 text-muted-foreground/60" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
