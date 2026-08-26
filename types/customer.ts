export type CustomerSession = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type CustomerProfile = CustomerSession & {
  phone: string | null;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type CustomerAddress = {
  id: string;
  customerId: string;
  label: string | null;
  isDefault: boolean;
  recipientName: string;
  phone: string;
  country: string;
  stateOrDivision: string;
  city: string;
  postalCode: string | null;
  addressLine1: string;
  addressLine2: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAddressInput = {
  label?: string | null;
  isDefault?: boolean;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateOrDivision: string;
  postalCode?: string | null;
  country: string;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  returnStatus: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
  itemTotal: string;
  taxAmount: string;
  shippingAmount: string;
  totalAmount: string;
  discountAmount: string;
  items: {
    id: string;
    title: string;
    sku: string;
    unit: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    reviewId: string | null;
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
    shippingMethod: { id: string; name: string } | null;
  } | null;
  paymentMethod: { id: string; code: string; name: string } | null;
};

export type PaginatedOrders = {
  data: CustomerOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};
