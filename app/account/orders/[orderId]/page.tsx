"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import { useCustomerOrder } from "@/hooks/api/storefront/use-customer-orders";

function statusColor(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING": return "bg-amber-500/10 text-amber-500";
    case "CONFIRMED":
    case "PROCESSING": return "bg-blue-500/10 text-blue-400";
    case "SHIPPED": return "bg-indigo-500/10 text-indigo-400";
    case "DELIVERED":
    case "COMPLETED": return "bg-green-500/10 text-green-400";
    case "CANCELLED":
    case "REFUNDED": return "bg-red-500/10 text-red-400";
    default: return "bg-muted/50 text-muted-foreground";
  }
}

type Props = { params: Promise<{ orderId: string }> };

export default function OrderDetailPage({ params }: Props) {
  const { orderId } = use(params);
  const { data: order, isLoading, isError } = useCustomerOrder(orderId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-muted/40" />
        <div className="h-48 animate-pulse rounded-xl bg-muted/30" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Order not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          Order #{order.orderNumber}
        </h1>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor(order.status)}`}
        >
          {order.status.toLowerCase()}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Placed on{" "}
        {new Date(order.createdAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <section className="rounded-2xl border border-border/60 bg-card/60 p-6 space-y-3">
        <h2 className="font-semibold">Items</h2>
        <ul className="divide-y divide-border/60">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3">
                <Package className="size-5 shrink-0 text-primary/40" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    SKU: {item.sku} · {item.unit} · qty {item.quantity}
                  </p>
                </div>
              </div>
              <p className="shrink-0 font-semibold">{formatPrice(item.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-1.5 border-t border-border/60 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Item total</span>
            <span>{formatPrice(order.itemTotal)}</span>
          </div>
          {parseFloat(order.taxAmount) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(order.taxAmount)}</span>
            </div>
          )}
          {parseFloat(order.shippingAmount) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(order.shippingAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 text-base font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {order.shipping && (
          <section className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-1.5 text-sm">
            <h2 className="font-semibold">Shipping address</h2>
            <p>{order.shipping.recipientName}</p>
            <p className="text-muted-foreground">{order.shipping.addressLine1}</p>
            <p className="text-muted-foreground">
              {order.shipping.city}, {order.shipping.stateOrDivision}
            </p>
            <p className="text-muted-foreground">{order.shipping.country}</p>
            {order.shipping.shippingMethod && (
              <p className="pt-1 font-medium text-primary/80">
                via {order.shipping.shippingMethod.name}
              </p>
            )}
          </section>
        )}

        {order.billing && (
          <section className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-1.5 text-sm">
            <h2 className="font-semibold">Billing info</h2>
            <p>{order.billing.recipientName}</p>
            <p className="text-muted-foreground">{order.billing.email}</p>
            <p className="text-muted-foreground">{order.billing.phone}</p>
            <p className="text-muted-foreground">{order.billing.addressLine1}</p>
            <p className="text-muted-foreground">
              {order.billing.city}, {order.billing.stateOrDivision}
            </p>
            {order.paymentMethod && (
              <p className="pt-1 font-medium text-primary/80">
                {order.paymentMethod.name}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
