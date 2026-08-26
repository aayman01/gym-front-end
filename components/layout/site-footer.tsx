"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettingsStore } from "@/stores/site-settings-store";

const footerLinks = [
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
    { href: "/account", label: "Account" },
  { href: "/wishlist", label: "Wishlist" },
];

export function SiteFooter() {
  const siteName = useSiteSettingsStore(
    (s) => s.settings?.siteName ?? "Crimson Forge Supplements",
  );
  const copyrightText = useSiteSettingsStore((s) => s.settings?.copyrightText);
  const footerLogoUrl = useSiteSettingsStore((s) => s.settings?.footerLogoUrl);

  return (
    <footer className="border-t border-border/60 bg-surface-dim/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-3">
          {footerLogoUrl ? (
            <Image
              src={footerLogoUrl}
              alt={siteName}
              width={140}
              height={44}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="text-base font-semibold text-foreground">
              {siteName}
            </span>
          )}
        </div>

        <nav className="flex flex-wrap items-center gap-5 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-1 px-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <p>{copyrightText ?? `© ${new Date().getFullYear()} ${siteName}`}</p>
        <p>Built for strength, recovery, and performance.</p>
      </div>
    </footer>
  );
}
