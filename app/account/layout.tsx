"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, LogOut, MapPin, Package, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCustomerSession, useLogout } from "@/hooks/api/storefront/use-customer-auth";

const navItems = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/profile", label: "Profile", icon: User, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: false },
  { href: "/account/orders", label: "Orders", icon: Package, exact: false },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: customer, isLoading, isError } = useCustomerSession();
  const logout = useLogout();

  useEffect(() => {
    if (!isLoading && (isError || !customer)) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isError, customer, router, pathname]);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success("Signed out");
      router.push("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (isLoading || !customer) {
    return <AccountSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          <div className="mb-4 rounded-xl border border-border/60 bg-card/60 p-4">
            <p className="font-semibold">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {customer.email}
            </p>
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="space-y-2">
          <div className="h-20 animate-pulse rounded-xl bg-muted/40" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-muted/30" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted/40" />
          <div className="h-48 animate-pulse rounded-xl bg-muted/30" />
        </div>
      </div>
    </div>
  );
}
