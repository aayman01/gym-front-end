"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  CheckCircle,
  LogIn,
  Loader2,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/api/storefront/use-cart";
import {
  usePaymentMethods,
  usePlaceOrder,
  usePreviewCheckout,
  useShippingMethods,
} from "@/hooks/api/storefront/use-checkout";
import { useCustomerSession } from "@/hooks/api/storefront/use-customer-auth";
import { useCustomerAddresses } from "@/hooks/api/storefront/use-customer-addresses";
import type { PlacedOrder } from "@/types/cart";
import type { CustomerAddress } from "@/types/customer";

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

type CheckoutValues = z.infer<typeof checkoutSchema>;

const inputCls =
  "rounded-md border border-border/60 bg-card/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60 w-full";

function AddressFields({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CheckoutValues>>["register"];
  errors: ReturnType<typeof useForm<CheckoutValues>>["formState"]["errors"];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 space-y-1.5">
        <Label>Full name</Label>
        <Input className={inputCls} placeholder="John Doe" {...register("recipientName")} />
        {errors.recipientName && (
          <p className="text-xs text-destructive">{errors.recipientName.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input className={inputCls} type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Phone</Label>
        <Input className={inputCls} placeholder="+1 555 000 0000" {...register("phone")} />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>
      <div className="sm:col-span-2 space-y-1.5">
        <Label>Address line 1</Label>
        <Input className={inputCls} placeholder="Street address" {...register("addressLine1")} />
        {errors.addressLine1 && (
          <p className="text-xs text-destructive">{errors.addressLine1.message}</p>
        )}
      </div>
      <div className="sm:col-span-2 space-y-1.5">
        <Label>Address line 2 (optional)</Label>
        <Input className={inputCls} placeholder="Apartment, suite, etc." {...register("addressLine2")} />
      </div>
      <div className="space-y-1.5">
        <Label>City</Label>
        <Input className={inputCls} placeholder="City" {...register("city")} />
        {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>State / Division</Label>
        <Input className={inputCls} placeholder="State" {...register("stateOrDivision")} />
        {errors.stateOrDivision && (
          <p className="text-xs text-destructive">{errors.stateOrDivision.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Postal code (optional)</Label>
        <Input className={inputCls} placeholder="10001" {...register("postalCode")} />
      </div>
      <div className="space-y-1.5">
        <Label>Country (2-letter code)</Label>
        <Input className={inputCls} placeholder="US" maxLength={2} {...register("country")} />
        {errors.country && (
          <p className="text-xs text-destructive">{errors.country.message}</p>
        )}
      </div>
    </div>
  );
}

function SavedAddressPicker({
  addresses,
  onSelect,
}: {
  addresses: CustomerAddress[];
  onSelect: (addr: CustomerAddress) => void;
}) {
  if (addresses.length === 0) return null;
  return (
    <div className="mb-4 space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        Saved addresses — select one to prefill:
      </p>
      <div className="flex flex-wrap gap-2">
        {addresses.map((addr) => (
          <button
            key={addr.id}
            type="button"
            onClick={() => onSelect(addr)}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs transition hover:border-primary/60"
          >
            <MapPin className="size-3 text-primary" />
            {addr.label ?? addr.city}
            {addr.isDefault && (
              <span className="ml-0.5 text-[10px] text-primary">(default)</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: shippingMethods = [], isLoading: shippingLoading } = useShippingMethods();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const { data: customer, isLoading: customerLoading } = useCustomerSession();
  const { data: savedAddresses = [] } = useCustomerAddresses();
  const placeOrder = usePlaceOrder();

  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();

  const selectedShipping =
    shippingMethods.find((m) => m.id === selectedShippingId) ??
    shippingMethods[0] ??
    null;

  // Server-computed totals (includes tax). Only available for logged-in customers.
  const { data: preview, isError: previewError, error: previewErr } = usePreviewCheckout({
    shippingMethodId: selectedShipping?.id,
    couponCode: appliedCoupon,
    enabled: Boolean(customer) && (cart?.items?.length ?? 0) > 0,
  });

  const codMethod =
    paymentMethods.find((m) => m.code?.toLowerCase() === "cod") ??
    paymentMethods[0] ??
    null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "US" },
  });

  // Prefill from session when customer loads
  useEffect(() => {
    if (!customer) return;
    const defaultAddr = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];
    if (defaultAddr) {
      reset({
        recipientName: defaultAddr.recipientName,
        email: customer.email,
        phone: defaultAddr.phone,
        addressLine1: defaultAddr.addressLine1,
        addressLine2: defaultAddr.addressLine2 ?? "",
        city: defaultAddr.city,
        stateOrDivision: defaultAddr.stateOrDivision,
        postalCode: defaultAddr.postalCode ?? "",
        country: defaultAddr.country,
      });
    } else {
      reset((prev) => ({
        ...prev,
        email: customer.email,
        recipientName: `${customer.firstName} ${customer.lastName}`.trim(),
      }));
    }
  }, [customer, savedAddresses, reset]);

  useEffect(() => {
    if (!appliedCoupon || !previewError) return;
    toast.error(
      (previewErr as { message?: string })?.message ?? "Could not apply coupon",
    );
    setAppliedCoupon(undefined);
  }, [appliedCoupon, previewError, previewErr]);

  const handleAddressSelect = (addr: CustomerAddress) => {
    reset((prev) => ({
      ...prev,
      recipientName: addr.recipientName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 ?? "",
      city: addr.city,
      stateOrDivision: addr.stateOrDivision,
      postalCode: addr.postalCode ?? "",
      country: addr.country,
    }));
  };

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

  // Placing an order requires an authenticated customer (API is guarded).
  if (!customerLoading && !customer) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <LogIn className="mx-auto mb-4 size-12 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Sign in to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You need an account to place an order. Your cart is saved and will be
          waiting for you.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button render={<Link href="/login?redirect=/checkout" />}>
            Sign in
          </Button>
          <Button
            variant="outline"
            render={<Link href="/register?redirect=/checkout" />}
          >
            Create an account
          </Button>
        </div>
        <Button
          variant="ghost"
          className="mt-4"
          render={<Link href="/cart" />}
        >
          Back to cart
        </Button>
      </div>
    );
  }

  const subtotal = preview
    ? parseFloat(preview.itemTotal)
    : parseFloat(cart?.selectedTotal ?? "0");
  const taxAmount = preview ? parseFloat(preview.taxAmount) : 0;
  const discountAmount = preview ? parseFloat(preview.discountAmount ?? "0") : 0;
  const shippingCost = preview
    ? parseFloat(preview.shippingAmount)
    : selectedShipping
      ? parseFloat(String(selectedShipping.price))
      : 0;
  const total = preview
    ? parseFloat(preview.totalAmount)
    : subtotal + shippingCost;

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
        couponCode: appliedCoupon,
      });
      setPlacedOrder(result.order);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Failed to place order");
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
              {savedAddresses.length > 0 && (
                <SavedAddressPicker
                  addresses={savedAddresses}
                  onSelect={handleAddressSelect}
                />
              )}
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
                              (selectedShippingId ?? shippingMethods[0]?.id) === method.id
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
                        (parseFloat(item.variant?.price ?? "0") * item.quantity).toFixed(2),
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal.toFixed(2))}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(taxAmount.toFixed(2))}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount{preview?.couponCode ? ` (${preview.couponCode})` : ""}</span>
                  <span>-{formatPrice(discountAmount.toFixed(2))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost.toFixed(2))}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                className={inputCls}
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!couponInput.trim()}
                onClick={() => setAppliedCoupon(couponInput.trim().toUpperCase())}
              >
                Apply
              </Button>
            </div>
            {appliedCoupon && discountAmount > 0 && (
              <button
                type="button"
                className="mt-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setAppliedCoupon(undefined);
                  setCouponInput("");
                }}
              >
                Remove coupon
              </button>
            )}

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
  const { data: customer } = useCustomerSession();

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

      <div className="mt-8 flex flex-col items-center gap-3">
        {customer && (
          <Button variant="outline" render={<Link href="/account/orders" />}>
            View in order history
          </Button>
        )}
        <Button render={<Link href="/products" />}>Continue shopping</Button>
      </div>
    </div>
  );
}
