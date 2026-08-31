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

export type PublicProductDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  basePrice: string;
  rating: string;
  type: string;
  sellingUnit: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  thumbnail: { id: string; url: string; mimeType: string } | null;
  images: {
    id: string;
    order: number;
    image: { id: string; url: string; mimeType: string };
  }[];
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: { id: string; url: string } | null;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  attributes: {
    id: string;
    name: string;
    options: { id: string; value: string; order: number }[];
  }[];
  variants: {
    id: string;
    sku: string;
    price: string;
    status: string;
    isBase: boolean;
    displayImage: { id: string; url: string } | null;
    availableStock: number;
    attributeOptions: {
      attribute: { id: string; name: string };
      option: { id: string; value: string };
    }[];
    sampleImages: {
      id: string;
      order: number;
      image: { id: string; url: string };
    }[];
  }[];
  relatedProducts: PublicProductCard[];
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ProductReview = {
  id: string;
  rating: number;
  comment: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  images: { id: string; url: string }[];
};

export type ProductReviewsPayload = {
  data: ProductReview[];
  meta: PaginationMeta;
};

export type PublicProductsListPayload = {
  data: PublicProductCard[];
  meta: PaginationMeta;
  filters: PublicProductsQuery & { page: number; limit: number };
};

export type PublicBanner = {
  id: string;
  title: string;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  mediaUrl: string | null;
};

export type PublicCollection = {
  id: string;
  title: string;
  subTitle: string | null;
  slug: string;
  type: string;
  products: PublicProductCard[];
};
