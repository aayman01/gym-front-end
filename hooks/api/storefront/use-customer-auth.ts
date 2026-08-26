import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ChangePasswordInput,
  CustomerProfile,
  CustomerSession,
  UpdateProfileInput,
} from "@/types/customer";

const BASE = "/user/auth";

export const CUSTOMER_AUTH_QUERY_KEYS = {
  session: ["customer-session"] as const,
};

export async function getMe() {
  return api.get<CustomerSession>(`${BASE}/me`);
}

export async function login(payload: { email: string; password: string }) {
  return api.post<CustomerSession>(`${BASE}/login`, payload);
}

export async function register(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}) {
  return api.post<{ id: string; email: string; firstName: string; lastName: string }>(
    `${BASE}/register`,
    payload,
  );
}

export async function logout() {
  return api.post<null>(`${BASE}/logout`);
}

export async function updateProfile(payload: UpdateProfileInput) {
  return api.patch<CustomerProfile>(`${BASE}/me`, payload);
}

export async function changePassword(payload: ChangePasswordInput) {
  return api.patch<null>(`${BASE}/password`, payload);
}

export function useCustomerSession() {
  return useQuery({
    queryKey: CUSTOMER_AUTH_QUERY_KEYS.session,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (customer) => {
      queryClient.setQueryData(CUSTOMER_AUTH_QUERY_KEYS.session, customer);
    },
  });
}

export function useRegister() {
  return useMutation({ mutationFn: register });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(CUSTOMER_AUTH_QUERY_KEYS.session, null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(CUSTOMER_AUTH_QUERY_KEYS.session, updated);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
