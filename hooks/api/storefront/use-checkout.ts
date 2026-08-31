import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CART_QUERY_KEYS } from "@/hooks/api/storefront/use-cart";
import type {
  CheckoutPreview,
  PaymentMethod,
  PlacedOrder,
  PlaceOrderInput,
  ShippingMethod,
} from "@/types/cart";

const BASE_URL = "/user/checkout";

export const CHECKOUT_QUERY_KEYS = {
  shippingMethods: ["checkout-shipping-methods"] as const,
  paymentMethods: ["checkout-payment-methods"] as const,
  preview: (shippingMethodId?: string, couponCode?: string) =>
    ["checkout-preview", shippingMethodId ?? "none", couponCode ?? ""] as const,
};

export async function getShippingMethods() {
  return api.get<ShippingMethod[]>(`${BASE_URL}/shipping-methods`);
}

export async function getPaymentMethods() {
  return api.get<PaymentMethod[]>(`${BASE_URL}/payment-methods`);
}

export async function previewCheckout(payload: {
  shippingMethodId?: string;
  couponCode?: string;
}) {
  return api.post<CheckoutPreview>(`${BASE_URL}/preview`, payload);
}

export async function placeOrder(payload: PlaceOrderInput) {
  return api.post<{ order: PlacedOrder }>(`${BASE_URL}/place-order`, payload);
}

export function useShippingMethods() {
  return useQuery({
    queryKey: CHECKOUT_QUERY_KEYS.shippingMethods,
    queryFn: getShippingMethods,
    staleTime: 5 * 60_000,
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: CHECKOUT_QUERY_KEYS.paymentMethods,
    queryFn: getPaymentMethods,
    staleTime: 5 * 60_000,
  });
}

export function usePreviewCheckout(params: {
  shippingMethodId?: string;
  couponCode?: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: CHECKOUT_QUERY_KEYS.preview(
      params.shippingMethodId,
      params.couponCode,
    ),
    queryFn: () =>
      previewCheckout({
        shippingMethodId: params.shippingMethodId,
        couponCode: params.couponCode,
      }),
    enabled: params.enabled,
    staleTime: 30_000,
    retry: false,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
    },
  });
}
