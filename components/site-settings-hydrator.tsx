"use client";

import { useEffect } from "react";
import { useSiteSettingsStore } from "@/stores/site-settings-store";

export function SiteSettingsHydrator() {
  const fetchSettings = useSiteSettingsStore((s) => s.fetchSettings);
  const isLoaded = useSiteSettingsStore((s) => s.isLoaded);

  useEffect(() => {
    if (!isLoaded) {
      void fetchSettings();
    }
  }, [fetchSettings, isLoaded]);

  return null;
}
