"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { motion } from "motion/react";
import { useNavbarVisibility } from "@/hooks/use-navbar-visibility";
import { useSiteSettingsStore } from "@/stores/site-settings-store";
import { useCartStore } from "@/stores/cart-store";
import { useCart } from "@/hooks/api/storefront/use-cart";

function HeaderLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const headerLogoUrl = useSiteSettingsStore(
    (s) => s.settings?.headerLogoUrl,
  );
  const siteName = useSiteSettingsStore(
    (s) => s.settings?.siteName ?? "Crimson Forge",
  );

  if (headerLogoUrl) {
    return (
      <Image
        src={headerLogoUrl}
        alt={siteName}
        width={size === "sm" ? 120 : 160}
        height={size === "sm" ? 40 : 50}
        className="h-8 w-auto object-contain md:h-10"
        priority
      />
    );
  }

  const tileClass =
    size === "sm"
      ? "flex size-10 items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground"
      : "flex size-11 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground";

  return (
    <span className={tileClass}>
      {siteName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </span>
  );
}

function HeaderSearch({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          placeholder="Search"
          readOnly
          aria-label="Search (coming soon)"
          className="h-10 w-full cursor-default rounded-full bg-white pl-11 pr-4 text-sm text-foreground placeholder:text-neutral-400 outline-none md:h-11"
        />
      </div>
    </div>
  );
}

function HeaderActions() {
  const iconClass =
    "size-5 stroke-[1.5] text-muted-foreground transition-colors hover:text-foreground md:size-6";
  const toggleCart = useCartStore((s) => s.toggleDrawer);
  const { data: cart } = useCart();
  const itemCount = cart?.itemCount ?? 0;

  return (
    <div className="flex shrink-0 items-center gap-4 md:gap-5">
      <button
        type="button"
        aria-label="Wishlist (coming soon)"
        className="flex items-center justify-center"
      >
        <Heart className={iconClass} />
      </button>
      <button
        type="button"
        aria-label="Cart"
        onClick={toggleCart}
        className="relative flex items-center justify-center"
      >
        <ShoppingCart className={iconClass} />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>
      <button
        type="button"
        aria-label="Account (coming soon)"
        className="flex items-center justify-center"
      >
        <User className={iconClass} />
      </button>
    </div>
  );
}

export function SiteHeader() {
  const visible = useNavbarVisibility();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md"
      initial={false}
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-8 md:py-0">
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="shrink-0">
              <HeaderLogo size="sm" />
            </Link>
            <HeaderActions />
          </div>
          <HeaderSearch />
        </div>

        <div className="hidden h-[72px] items-center gap-6 md:flex">
          <Link href="/" className="shrink-0">
            <HeaderLogo />
          </Link>

          <div className="mx-auto w-full max-w-xl flex-1">
            <HeaderSearch />
          </div>

          <HeaderActions />
        </div>
      </div>
    </motion.header>
  );
}
