import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ProductReviewsPayload } from "@/types/storefront";

const BASE_URL = "/public/products";

export const PUBLIC_REVIEW_QUERY_KEYS = {
  all: ["public-reviews"] as const,
  list: (productId: string, page: number) =>
    [...PUBLIC_REVIEW_QUERY_KEYS.all, productId, page] as const,
};

export async function getProductReviews(
  productId: string,
  page = 1,
  limit = 10,
) {
  return api.get<ProductReviewsPayload>(`${BASE_URL}/${productId}/reviews`, {
    params: { page, limit },
  });
}

export function useProductReviews(productId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: PUBLIC_REVIEW_QUERY_KEYS.list(productId, page),
    queryFn: () => getProductReviews(productId, page, limit),
    enabled: !!productId,
  });
}
