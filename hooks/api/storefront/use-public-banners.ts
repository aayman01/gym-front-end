import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PublicBanner } from "@/types/storefront";

export const PUBLIC_BANNER_QUERY_KEYS = {
  all: ["public-banners"] as const,
};

export function usePublicBanners() {
  return useQuery({
    queryKey: PUBLIC_BANNER_QUERY_KEYS.all,
    queryFn: () => api.get<PublicBanner[]>("/public/banners"),
    staleTime: 5 * 60_000,
  });
}
