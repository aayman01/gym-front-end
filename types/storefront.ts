export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  isFeature: boolean;
  image: { id: string; url: string } | null;
};

export type PublicProductCard = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  basePrice: string;
  rating: string;
  thumbnailUrl: string | null;
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
  categorySlug?: string;
  minRating?: number;
  isFeature?: boolean;
};

export type PublicProductsListPayload = {
  data: PublicProductCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
