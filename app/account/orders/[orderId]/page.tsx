"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Package, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCustomerOrder } from "@/hooks/api/storefront/use-customer-orders";
import { useCreateReview } from "@/hooks/api/storefront/use-customer-reviews";
import { useCreateReturn } from "@/hooks/api/storefront/use-customer-returns";

const REVIEWABLE = new Set([
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
]);

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

type Props = { params: Promise<{ orderId: string }> };

export default function OrderDetailPage({ params }: Props) {
  const { orderId } = use(params);
  const { data: order, isLoading, isError } = useCustomerOrder(orderId);
  const createReview = useCreateReview();
  const createReturn = useCreateReturn(orderId);

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnItemId, setReturnItemId] = useState<string | null>(null);

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

  const canReview = REVIEWABLE.has(order.status.toUpperCase());
  const canReturn =
    order.status.toUpperCase() === "DELIVERED" ||
    order.status.toUpperCase() === "COMPLETED";

  async function submitReview(orderItemId: string) {
    try {
      await createReview.mutateAsync({
        orderItemId,
        rating,
        comment: comment.trim() || null,
      });
      toast.success("Review submitted");
      setReviewingId(null);
      setComment("");
      setRating(5);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Could not submit review");
    }
  }

  async function submitReturn(orderItemId: string, quantity: number) {
    if (!returnReason.trim()) {
      toast.error("Please describe why you want to return this item");
      return;
    }
    try {
      await createReturn.mutateAsync({
        items: [
          {
            orderItemId,
            quantityRequested: quantity,
            reason: returnReason.trim(),
          },
        ],
        customerReason: returnReason.trim(),
      });
      toast.success("Return requested");
      setReturnItemId(null);
      setReturnReason("");
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Could not request return");
    }
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
            <li key={item.id} className="space-y-3 py-3">
              <div className="flex items-center justify-between gap-4">
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
              </div>

              {canReview && (
                <div className="pl-8">
                  {item.reviewId ? (
                    <p className="text-xs text-muted-foreground">Review submitted</p>
                  ) : reviewingId === item.id ? (
                    <div className="space-y-2 rounded-xl border border-border/60 p-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRating(n)}
                            className="text-primary"
                            aria-label={`${n} stars`}
                          >
                            <Star
                              className="size-5"
                              fill={n <= rating ? "currentColor" : "none"}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        placeholder="Share your experience (optional)"
                        className="w-full rounded-md border border-border/60 bg-card/60 px-3 py-2 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={createReview.isPending}
                          onClick={() => void submitReview(item.id)}
                        >
                          {createReview.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "Submit review"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setReviewingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReviewingId(item.id);
                        setRating(5);
                        setComment("");
                      }}
                    >
                      Write a review
                    </Button>
                  )}
                </div>
              )}

              {canReturn && (
                <div className="pl-8">
                  {returnItemId === item.id ? (
                    <div className="space-y-2 rounded-xl border border-border/60 p-3">
                      <Label>Reason for return</Label>
                      <textarea
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        rows={3}
                        placeholder="Damaged, wrong item, etc."
                        className="w-full rounded-md border border-border/60 bg-card/60 px-3 py-2 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={createReturn.isPending}
                          onClick={() => void submitReturn(item.id, item.quantity)}
                        >
                          {createReturn.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "Request return"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setReturnItemId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReturnItemId(item.id);
                        setReturnReason("");
                      }}
                    >
                      Request return
                    </Button>
                  )}
                </div>
              )}
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
          {parseFloat(order.discountAmount) > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-{formatPrice(order.discountAmount)}</span>
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
