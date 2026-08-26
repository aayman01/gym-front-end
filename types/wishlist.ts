export type WishlistItem = {
  id: string;
  productId: string;
  variantId: string | null;
  createdAt: string;
  product: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
  };
  variant: {
    id: string;
    sku: string;
    price: string;
  } | null;
};

export type Wishlist = {
  id: string;
  items: WishlistItem[];
  itemCount: number;
};
