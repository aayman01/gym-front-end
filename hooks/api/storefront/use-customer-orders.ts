import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerOrder, PaginatedOrders } from "@/types/customer";

const BASE = "/user/orders";

export const ORDER_QUERY_KEYS = {
  all: ["customer-orders"] as const,
  list: (page: number) => [...ORDER_QUERY_KEYS.all, "list", page] as const,
  detail: (id: string) => [...ORDER_QUERY_KEYS.all, "detail", id] as const,
};

export function useCustomerOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.list(page),
    queryFn: () =>
      api.get<PaginatedOrders>(BASE, { params: { page, limit } }),
    staleTime: 60_000,
  });
}

export function useCustomerOrder(orderId: string) {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.detail(orderId),
    queryFn: () => api.get<CustomerOrder>(`${BASE}/${orderId}`),
    enabled: !!orderId,
    staleTime: 60_000,
  });
}
