"use client";

import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { SiteSettingsHydrator } from "@/components/site-settings-hydrator";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsHydrator />
      <CartDrawer />
      <Toaster richColors position="bottom-right" />
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </QueryClientProvider>
  );
}
