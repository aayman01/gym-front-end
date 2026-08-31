import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-client";
import type {
  Cart,
  CartItem,
} from "@/types/cart";

const BASE_URL = "/user/cart";

export const CART_QUERY_KEYS = {
  all: ["cart"] as const,
  detail: () => [...CART_QUERY_KEYS.all, "detail"] as const,
};

export async function getCart() {
  return api.get<Cart>(BASE_URL);
}

export async function addToCart(payload: {
  productId: string;
  variantId?: string;
  quantity?: number;
  buyNow?: boolean;
}) {
  return api.post<CartItem>(`${BASE_URL}/items`, payload);
}

export async function updateCartItem(
  itemId: string,
  payload: { quantity?: number; isSelected?: boolean },
) {
  return api.patch<CartItem>(`${BASE_URL}/items/${itemId}`, payload);
}

export async function removeCartItem(itemId: string) {
  return api.delete<{ removed: boolean }>(`${BASE_URL}/items/${itemId}`);
}

export async function clearCart() {
  return api.delete<{ cleared: boolean }>(BASE_URL);
}

export async function mergeCart() {
  return api.post<{ synced: boolean; mergedItems?: number }>(`${BASE_URL}/merge`);
}

export function useCart() {
  return useQuery({
    queryKey: CART_QUERY_KEYS.detail(),
    queryFn: getCart,
    staleTime: 30_000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: { quantity?: number; isSelected?: boolean };
    }) => updateCartItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
    },
    onError: (error) => {
      const status = error instanceof ApiError ? error.status : undefined;
      // Stale UI after place-order (or concurrent delete) — refresh cart
      if (status === 404) {
        void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to remove item",
      );
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
    },
  });
}

export function useMergeCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mergeCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
    },
  });
}
