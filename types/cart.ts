export type CartItem = {
  id: string;
  quantity: number;
  isSelected: boolean;
  productId: string;
  variantId: string | null;
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
    availableStock: number;
  } | null;
};

export type Cart = {
  id: string;
  items: CartItem[];
  itemCount: number;
  selectedCount: number;
  selectedTotal: string;
};

export type ShippingMethod = {
  id: string;
  name: string;
  price: string;
  deliveryDays: number | null;
};

export type PaymentMethod = {
  id: string;
  code: string;
  name: string;
  imageUrl: string | null;
};

export type CheckoutPreview = {
  itemTotal: string;
  taxAmount: string;
  shippingAmount: string;
  discountAmount?: string;
  totalAmount: string;
  couponCode?: string | null;
};

export type AddressInput = {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateOrDivision: string;
  postalCode?: string | null;
  country: string;
};

export type BillingAddressInput = AddressInput & { email: string };

export type PlaceOrderInput = {
  paymentMethodId: string;
  shippingMethodId?: string;
  shippingAddress?: AddressInput;
  billingAddress: BillingAddressInput;
  notes?: string | null;
  couponCode?: string;
};

export type PlacedOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  currency: string;
  createdAt: string;
  itemTotal: string;
  taxAmount: string;
  shippingAmount: string;
  discountAmount?: string;
  totalAmount: string;
  items: {
    id: string;
    title: string;
    sku: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
  }[];
  billing: {
    recipientName: string;
    email: string;
    phone: string;
    addressLine1: string;
    city: string;
    stateOrDivision: string;
    country: string;
  } | null;
  shipping: {
    recipientName: string;
    addressLine1: string;
    city: string;
    stateOrDivision: string;
    country: string;
  } | null;
  paymentMethod: { id: string; code: string; name: string } | null;
};
