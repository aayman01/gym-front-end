import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PublicProductDetail } from "@/types/storefront";

const BASE_URL = "/public/products";

export const PUBLIC_PRODUCT_DETAIL_QUERY_KEYS = {
  all: ["public-product-detail"] as const,
  detail: (slug: string) =>
    [...PUBLIC_PRODUCT_DETAIL_QUERY_KEYS.all, slug] as const,
};

export async function getPublicProduct(slug: string) {
  return api.get<PublicProductDetail>(`${BASE_URL}/${slug}`);
}

export function usePublicProduct(slug: string) {
  return useQuery({
    queryKey: PUBLIC_PRODUCT_DETAIL_QUERY_KEYS.detail(slug),
    queryFn: () => getPublicProduct(slug),
    enabled: !!slug,
  });
}
