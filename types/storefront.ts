export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  isFeature: boolean;
  image: { id: string; url: string } | null;
};

export type PublicBrand = {
  id: string;
  name: string;
  slug: string;
  logo: { id: string; url: string } | null;
};

export type PublicProductCard = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  basePrice: string;
  rating: string;
  thumbnailUrl: string | null;
  images: {
    id: string;
    order: number;
    image: { id: string; url: string; mimeType: string };
  }[];
  minPrice: string | null;
  maxPrice: string | null;
  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export type PublicProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  brandId?: string;
  brandSlug?: string;
  minRating?: number;
  isFeature?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minBasePrice?: number;
  maxBasePrice?: number;
  sortBy?: "updatedAt" | "price" | "rating" | "title";
  sortOrder?: "asc" | "desc";
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type PublicProductsListPayload = {
  data: PublicProductCard[];
  meta: PaginationMeta;
  filters: PublicProductsQuery & { page: number; limit: number };
};
