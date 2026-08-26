import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Wishlist, WishlistItem } from "@/types/wishlist";

const BASE_URL = "/user/wishlist";

export const WISHLIST_QUERY_KEYS = {
  all: ["wishlist"] as const,
  detail: () => [...WISHLIST_QUERY_KEYS.all, "detail"] as const,
};

export async function getWishlist() {
  return api.get<Wishlist>(BASE_URL);
}

export async function addToWishlist(payload: {
  productId: string;
  variantId?: string;
}) {
  return api.post<WishlistItem>(`${BASE_URL}/items`, payload);
}

export async function removeWishlistItem(itemId: string) {
  return api.delete<{ removed: boolean }>(`${BASE_URL}/items/${itemId}`);
}

export async function mergeWishlist() {
  return api.post<{ synced: boolean; mergedItems?: number }>(
    `${BASE_URL}/merge`,
  );
}

export function useWishlist() {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEYS.detail(),
    queryFn: getWishlist,
    staleTime: 30_000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEYS.all });
    },
  });
}

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeWishlistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEYS.all });
    },
  });
}
