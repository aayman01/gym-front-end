"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useCustomerSession } from "@/hooks/api/storefront/use-customer-auth";
import { useCustomerAddresses } from "@/hooks/api/storefront/use-customer-addresses";
import { useCustomerOrders } from "@/hooks/api/storefront/use-customer-orders";

export default function AccountOverviewPage() {
  const { data: customer } = useCustomerSession();
  const { data: addresses = [] } = useCustomerAddresses();
  const { data: ordersData } = useCustomerOrders(1, 3);

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const recentOrders = ordersData?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {customer?.firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, addresses, and order history.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card/60 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-primary" />
              Default address
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/account/addresses" />}>
              <ArrowRight className="size-4" />
            </Button>
          </div>
          {defaultAddress ? (
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">{defaultAddress.recipientName}</p>
              <p>{defaultAddress.addressLine1}</p>
              {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
              <p>
                {defaultAddress.city}, {defaultAddress.stateOrDivision}
              </p>
              <p>{defaultAddress.country}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Package className="size-4 text-primary" />
              Recent orders
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/account/orders" />}>
              <ArrowRight className="size-4" />
            </Button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg p-2 text-sm hover:bg-muted/30"
                  >
                    <div>
                      <p className="font-medium">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {order.status.toLowerCase()}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
