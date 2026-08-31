"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { PublicSiteSettings } from "@/types/site-settings";

type SiteSettingsState = {
  settings: PublicSiteSettings | null;
  isLoaded: boolean;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  applyTheme: () => void;
  applyDocumentMeta: () => void;
};

let fetchInFlight: Promise<void> | null = null;

const defaultSettings: PublicSiteSettings = {
  siteName: "Crimson Forge",
  siteUrl: null,
  metaTitle: null,
  metaDescription: null,
  metaKeywords: null,
  copyrightText: null,
  primaryColor: null,
  primaryHoverColor: null,
  headerLogoUrl: null,
  footerLogoUrl: null,
  emailLogoUrl: null,
  faviconUrl: null,
  contactPhone: null,
  contactEmail: null,
  contactAddress: null,
  contactFormEnabled: true,
};

function setMetaTag(name: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export const useSiteSettingsStore = create<SiteSettingsState>((set, get) => ({
  settings: null,
  isLoaded: false,
  isLoading: false,

  fetchSettings: async () => {
    if (fetchInFlight) {
      return fetchInFlight;
    }

    fetchInFlight = (async () => {
      set({ isLoading: true });
      try {
        const settings = await api.get<PublicSiteSettings>("/public/site-settings");
        set({ settings, isLoaded: true, isLoading: false });
        get().applyTheme();
        get().applyDocumentMeta();
      } catch {
        set({ settings: defaultSettings, isLoaded: true, isLoading: false });
      } finally {
        fetchInFlight = null;
      }
    })();

    return fetchInFlight;
  },

  applyTheme: () => {
    const { settings } = get();
    if (typeof document === "undefined" || !settings) return;

    const root = document.documentElement;
    if (settings.primaryColor) {
      root.style.setProperty("--primary", settings.primaryColor);
    }
    if (settings.primaryHoverColor) {
      root.style.setProperty("--primary-hover", settings.primaryHoverColor);
    }
    if (settings.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.faviconUrl;
    }
  },

  applyDocumentMeta: () => {
    const { settings } = get();
    if (typeof document === "undefined" || !settings) return;

    if (settings.metaTitle) {
      document.title = settings.metaTitle;
    } else if (settings.siteName) {
      document.title = settings.siteName;
    }

    if (settings.metaDescription) {
      setMetaTag("description", settings.metaDescription);
    }
    if (settings.metaKeywords) {
      setMetaTag("keywords", settings.metaKeywords);
    }
  },
}));
