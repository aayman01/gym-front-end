"use client";

import { useSiteSettingsStore } from "@/stores/site-settings-store";

export function SiteFooter() {
  const siteName = useSiteSettingsStore(
    (s) => s.settings?.siteName ?? "Crimson Forge Supplements",
  );
  const copyrightText = useSiteSettingsStore((s) => s.settings?.copyrightText);

  return (
    <footer className="border-t border-border/60 bg-surface-dim/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <p>{copyrightText ?? siteName}</p>
        <p>Built for strength, recovery, and performance.</p>
      </div>
    </footer>
  );
}
