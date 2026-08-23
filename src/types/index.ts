export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  productCount: number;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export type QuantityMode = 'CUSTOM_INTERVAL' | 'PRESET_ONLY' | 'ANY_QUANTITY';
export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface DiscountTier {
  minQty: number;
  maxQty: number | null;
  discountType: DiscountType;
  discountValue: number;
}

export interface QuantityConfig {
  quantityMode: QuantityMode;
  minQuantity: number;
  quantityStep: number;
  presetOptions?: number[];
}

export interface VariantOptionItem {
  label: string;
  extraPrice?: number;
  priceMultiplier?: number;
}

export interface VariantOption {
  name: string;
  options: VariantOptionItem[];
  defaultOption?: string;
}

export interface ProductRequirementConfig {
  requiresArtworkUpload: boolean;
  requiresCustomDimensions: boolean;
  dimensionUnit?: 'ft' | 'in';
  defaultWidth?: number;
  defaultHeight?: number;
  minSqFt?: number;
  variantOptions?: VariantOption[];
}

export interface Product {
  id: string;
  _id?: string;
  categoryId: string;
  subcategoryId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  pricingType: 'fixed' | 'per_sqft';
  minQuantity: number;
  quantityPresets: number[];
  quantityConfig?: QuantityConfig;
  discountTiers?: DiscountTier[];
  requirements: ProductRequirementConfig;
  thumbnail: string;
  images?: string[];
  badges: string[];
  rating: number;
  reviewsCount: number;
  turnaroundTime: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  customDimensions?: {
    width: number;
    height: number;
    unit: 'ft' | 'in';
    totalSqFt: number;
  };
  selectedVariants: Record<string, string>;
  artworkFile?: {
    name: string;
    size: number;
    type: string;
    previewUrl?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  gstin?: string;
  houseNo: string;
  buildingName?: string;
  streetName: string;
  area: string;
  state?: string;
  pin: string;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber?: string;
  userId?: {
    email: string;
    mobileNumber?: string;
    accountType: 'INDIVIDUAL' | 'ORGANIZATION';
    individual?: {
      name: string;
    };
    organization?: {
      creditEligible: boolean;
      companyName: string;
      contactName?: string;
    };
  };
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: 'Pending' | 'Printing' | 'Dispatched' | 'Delivered' | 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  orderStatus?: string;
  paymentStatus?: string;
  createdAt: string;
  paymentMethod: string;
  expectedProcessingTime?: string;
  expectedShippingTime?: string;
  expectedDeliveryTime?: string;
}
