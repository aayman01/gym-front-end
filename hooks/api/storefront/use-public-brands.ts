import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PublicBrand } from "@/types/storefront";

const BASE_URL = "/public/brands";

export const PUBLIC_BRAND_QUERY_KEYS = {
  all: ["public-brands"] as const,
  list: () => [...PUBLIC_BRAND_QUERY_KEYS.all, "list"] as const,
};

export async function getPublicBrands() {
  return api.get<PublicBrand[]>(BASE_URL);
}

export function usePublicBrands() {
  return useQuery({
    queryKey: PUBLIC_BRAND_QUERY_KEYS.list(),
    queryFn: getPublicBrands,
    staleTime: 5 * 60 * 1000,
  });
}
