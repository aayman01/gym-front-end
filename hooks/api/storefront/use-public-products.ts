import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  PublicProductsListPayload,
  PublicProductsQuery,
} from "@/types/storefront";

const BASE_URL = "/public/products";

export const PUBLIC_PRODUCT_QUERY_KEYS = {
  all: ["public-products"] as const,
  lists: () => [...PUBLIC_PRODUCT_QUERY_KEYS.all, "list"] as const,
  list: (query: PublicProductsQuery) =>
    [...PUBLIC_PRODUCT_QUERY_KEYS.lists(), query] as const,
};

export async function getPublicProducts(query: PublicProductsQuery = {}) {
  return api.get<PublicProductsListPayload>(BASE_URL, {
    params: { page: 1, limit: 12, ...query },
  });
}

export function usePublicProducts(
  query: PublicProductsQuery = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: PUBLIC_PRODUCT_QUERY_KEYS.list(query),
    queryFn: () => getPublicProducts(query),
    enabled: options?.enabled ?? true,
  });
}
