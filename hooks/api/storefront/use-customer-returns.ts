import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ORDER_QUERY_KEYS } from "@/hooks/api/storefront/use-customer-orders";

export type CreateReturnInput = {
  items: {
    orderItemId: string;
    quantityRequested: number;
    reason: string;
  }[];
  customerReason?: string | null;
  customerComment?: string | null;
};

export function useCreateReturn(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReturnInput) =>
      api.post(`/user/orders/${orderId}/returns`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.all });
    },
  });
}
