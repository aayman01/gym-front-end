"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle, Loader2, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format-price";
import { useCart } from "@/hooks/api/storefront/use-cart";
import {
  usePaymentMethods,
  usePlaceOrder,
  useShippingMethods,
} from "@/hooks/api/storefront/use-checkout";
import { cn } from "@/lib/utils";
import type { PlacedOrder } from "@/types/cart";

const addressSchema = z.object({
  recipientName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  stateOrDivision: z.string().min(1, "State/Division is required"),
  postalCode: z.string().optional(),
  country: z.string().length(2, "2-letter country code required"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const inputCls =
  "rounded-md border border-border/60 bg-card/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60 w-full";

function AddressFields({
  register,
  errors,
  prefix,
}: {
  register: ReturnType<typeof useForm<AddressFormValues>>["register"];
  errors: ReturnType<typeof useForm<AddressFormValues>>["formState"]["errors"];
  prefix?: string;
}) {
  const field = (name: keyof AddressFormValues) =>
    prefix ? (`${prefix}.${name}` as keyof AddressFormValues) : name;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 space-y-1.5">
        <Label>Full name</Label>
        <Input className={inputCls} placeholder="John Doe" {...register(field("recipientName"))} />
        {errors[field("recipientName")] && (
          <p className="text-xs text-destructive">{errors[field("recipientName")]?.message as string}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input className={inputCls} type="email" placeholder="you@example.com" {...register(field("email"))} />
        {errors[field("email")] && (
          <p className="text-xs text-destructive">{errors[field("email")]?.message as string}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Phone</Label>
        <Input className={inputCls} placeholder="+1 555 000 0000" {...register(field("phone"))} />
        {errors[field("phone")] && (
          <p className="text-xs text-destructive">{errors[field("phone")]?.message as string}</p>
        )}
      </div>

      <div className="sm:col-span-2 space-y-1.5">
        <Label>Address line 1</Label>
        <Input className={inputCls} placeholder="Street address" {...register(field("addressLine1"))} />
        {errors[field("addressLine1")] && (
          <p className="text-xs text-destructive">{errors[field("addressLine1")]?.message as string}</p>
        )}
      </div>

      <div className="sm:col-span-2 space-y-1.5">
        <Label>Address line 2 (optional)</Label>
        <Input className={inputCls} placeholder="Apartment, suite, etc." {...register(field("addressLine2"))} />
      </div>

      <div className="space-y-1.5">
        <Label>City</Label>
        <Input className={inputCls} placeholder="City" {...register(field("city"))} />
        {errors[field("city")] && (
          <p className="text-xs text-destructive">{errors[field("city")]?.message as string}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>State / Division</Label>
        <Input className={inputCls} placeholder="State" {...register(field("stateOrDivision"))} />
        {errors[field("stateOrDivision")] && (
          <p className="text-xs text-destructive">{errors[field("stateOrDivision")]?.message as string}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Postal code (optional)</Label>
        <Input className={inputCls} placeholder="10001" {...register(field("postalCode"))} />
      </div>

      <div className="space-y-1.5">
        <Label>Country (2-letter code)</Label>
        <Input className={inputCls} placeholder="US" maxLength={2} {...register(field("country"))} />
        {errors[field("country")] && (
          <p className="text-xs text-destructive">{errors[field("country")]?.message as string}</p>
        )}
      </div>
    </div>
  );
}

const checkoutSchema = z.object({
  recipientName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  stateOrDivision: z.string().min(1, "State/Division is required"),
  postalCode: z.string().optional(),
  country: z.string().length(2, "2-letter country code required"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: shippingMethods = [], isLoading: shippingLoading } = useShippingMethods();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const placeOrder = usePlaceOrder();

  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const selectedShipping = shippingMethods.find((m) => m.id === selectedShippingId) ?? shippingMethods[0] ?? null;
  const codMethod = paymentMethods.find((m) => m.code?.toLowerCase() === "cod") ?? paymentMethods[0] ?? null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "US" },
  });

  if (placedOrder) {
    return <OrderSuccess order={placedOrder} />;
  }

  const items = cart?.items ?? [];

  if (!cartLoading && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button className="mt-4" render={<Link href="/products" />}>
          Browse products
        </Button>
      </div>
    );
  }

  const subtotal = parseFloat(cart?.selectedTotal ?? "0");
  const shippingCost = selectedShipping ? parseFloat(String(selectedShipping.price)) : 0;
  const total = subtotal + shippingCost;

  const onSubmit = handleSubmit(async (values) => {
    if (!codMethod) {
      toast.error("No payment method available");
      return;
    }

    try {
      const result = await placeOrder.mutateAsync({
        paymentMethodId: codMethod.id,
        shippingMethodId: selectedShipping?.id,
        shippingAddress: {
          recipientName: values.recipientName,
          phone: values.phone,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2 ?? null,
          city: values.city,
          stateOrDivision: values.stateOrDivision,
          postalCode: values.postalCode ?? null,
          country: values.country,
        },
        billingAddress: {
          recipientName: values.recipientName,
          email: values.email,
          phone: values.phone,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2 ?? null,
          city: values.city,
          stateOrDivision: values.stateOrDivision,
          postalCode: values.postalCode ?? null,
          country: values.country,
        },
        notes: values.notes ?? null,
      });
      setPlacedOrder(result.order);
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? "Failed to place order";
      toast.error(msg);
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>

      <h1 className="mb-8 text-2xl font-bold tracking-tight">Checkout</h1>

      <form onSubmit={onSubmit}>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <section className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6">
              <h2 className="flex items-center gap-2 font-semibold">
                <Truck className="size-4 text-primary" />
                Shipping &amp; contact
              </h2>
              <AddressFields register={register} errors={errors} />
            </section>

            {shippingMethods.length > 0 && (
              <section className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6">
                <h2 className="font-semibold">Shipping method</h2>
                {shippingLoading ? (
                  <div className="h-16 animate-pulse rounded-xl bg-muted/30" />
                ) : (
                  <div className="space-y-2">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition",
                          (selectedShippingId ?? shippingMethods[0]?.id) === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border/60 hover:border-primary/40",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={
                              (selectedShippingId ?? shippingMethods[0]?.id) ===
                              method.id
                            }
                            onChange={() => setSelectedShippingId(method.id)}
                            className="accent-primary"
                          />
                          <div>
                            <p className="text-sm font-medium">{method.name}</p>
                            {method.deliveryDays && (
                              <p className="text-xs text-muted-foreground">
                                {method.deliveryDays} business days
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-semibold">
                          {parseFloat(String(method.price)) === 0
                            ? "Free"
                            : formatPrice(String(method.price))}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6">
              <h2 className="font-semibold">Payment method</h2>
              <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <Package className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {codMethod?.name ?? "Cash on Delivery"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pay when your order arrives
                  </p>
                </div>
              </div>
            </section>

            <div className="space-y-1.5">
              <Label>Order notes (optional)</Label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Any special instructions for your order..."
                className={cn(inputCls, "resize-none")}
              />
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
            <h2 className="mb-4 font-semibold">Order summary</h2>

            {cartLoading ? (
              <div className="space-y-2 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-2/3 rounded bg-muted/40" />
                    <div className="h-4 w-12 rounded bg-muted/40" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="mb-4 space-y-2 border-b border-border/60 pb-4 text-sm">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2">
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
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cart?.selectedTotal ?? "0")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost.toFixed(2))}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t border-border/60 pt-4 font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total.toFixed(2))}</span>
            </div>

            <Button
              type="submit"
              className="mt-5 w-full"
              disabled={placeOrder.isPending || !codMethod}
            >
              {placeOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Placing order...
                </>
              ) : (
                "Place order"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function OrderSuccess({ order }: { order: PlacedOrder }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <CheckCircle className="mx-auto mb-4 size-16 text-green-500" />
      <h1 className="text-2xl font-bold">Order placed!</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for your order. Your order number is{" "}
        <span className="font-semibold text-foreground">#{order.orderNumber}</span>.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        You&apos;ll receive a confirmation once the order is reviewed.
      </p>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card/60 p-6 text-left">
        <h2 className="mb-3 font-semibold">Order details</h2>
        <ul className="divide-y divide-border/60 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border/60 pt-3 font-semibold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <Button className="mt-8" render={<Link href="/products" />}>
        Continue shopping
      </Button>
    </div>
  );
}
