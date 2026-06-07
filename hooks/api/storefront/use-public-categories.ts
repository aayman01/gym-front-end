import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PublicCategory } from "@/types/storefront";

const BASE_URL = "/public/categories";

export const PUBLIC_CATEGORY_QUERY_KEYS = {
  all: ["public-categories"] as const,
  list: () => [...PUBLIC_CATEGORY_QUERY_KEYS.all, "list"] as const,
};

export async function getPublicCategories() {
  return api.get<PublicCategory[]>(BASE_URL);
}

export function usePublicCategories() {
  return useQuery({
    queryKey: PUBLIC_CATEGORY_QUERY_KEYS.list(),
    queryFn: getPublicCategories,
  });
}
