"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettingsStore } from "@/stores/site-settings-store";

const footerLinks = [
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/account", label: "Account" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const siteName = useSiteSettingsStore(
    (s) => s.settings?.siteName ?? "Crimson Forge Supplements",
  );
  const copyrightText = useSiteSettingsStore((s) => s.settings?.copyrightText);
  const footerLogoUrl = useSiteSettingsStore((s) => s.settings?.footerLogoUrl);
  const contactPhone = useSiteSettingsStore((s) => s.settings?.contactPhone);
  const contactEmail = useSiteSettingsStore((s) => s.settings?.contactEmail);
  const contactAddress = useSiteSettingsStore(
    (s) => s.settings?.contactAddress,
  );

  const hasContact = Boolean(contactPhone || contactEmail || contactAddress);

  return (
    <footer className="border-t border-border/60 bg-surface-dim/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4">
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

            {hasContact ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {contactPhone ? (
                  <li>
                    <a
                      href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      <Phone className="size-3.5 shrink-0 text-primary" />
                      {contactPhone}
                    </a>
                  </li>
                ) : null}
                {contactEmail ? (
                  <li>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      <Mail className="size-3.5 shrink-0 text-primary" />
                      {contactEmail}
                    </a>
                  </li>
                ) : null}
                {contactAddress ? (
                  <li className="inline-flex items-start gap-2">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span className="whitespace-pre-line">{contactAddress}</span>
                  </li>
                ) : null}
              </ul>
            ) : null}
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

        <div className="flex flex-col gap-1 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{copyrightText ?? `© ${new Date().getFullYear()} ${siteName}`}</p>
          <p>Built for strength, recovery, and performance.</p>
        </div>
      </div>
    </footer>
  );
}
