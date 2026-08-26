import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ORDER_QUERY_KEYS } from "@/hooks/api/storefront/use-customer-orders";

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      orderItemId: string;
      rating: number;
      comment?: string | null;
    }) => api.post("/user/reviews", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.all });
    },
  });
}
