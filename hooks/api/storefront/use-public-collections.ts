import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PublicCollection } from "@/types/storefront";

export const PUBLIC_COLLECTION_QUERY_KEYS = {
  all: ["public-collections"] as const,
};

export function usePublicCollections() {
  return useQuery({
    queryKey: PUBLIC_COLLECTION_QUERY_KEYS.all,
    queryFn: () => api.get<PublicCollection[]>("/public/collections"),
    staleTime: 5 * 60_000,
  });
}
