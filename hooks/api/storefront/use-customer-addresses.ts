import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  CreateAddressInput,
  CustomerAddress,
  UpdateAddressInput,
} from "@/types/customer";

const BASE = "/user/addresses";

export const ADDRESS_QUERY_KEYS = {
  all: ["customer-addresses"] as const,
  list: () => [...ADDRESS_QUERY_KEYS.all] as const,
};

export function useCustomerAddresses() {
  return useQuery({
    queryKey: ADDRESS_QUERY_KEYS.list(),
    queryFn: () => api.get<CustomerAddress[]>(BASE),
    staleTime: 2 * 60_000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAddressInput) =>
      api.post<CustomerAddress>(BASE, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.all }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAddressInput }) =>
      api.patch<CustomerAddress>(`${BASE}/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.all }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ deleted: boolean }>(`${BASE}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.all }),
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<CustomerAddress>(`${BASE}/${id}/default`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.all }),
  });
}
