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
  variantOptions?: VariantOption[];
}

export interface Product {
  id: string;
  categoryId: string;
  subcategoryId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  pricingType: 'fixed' | 'per_sqft';
  minQuantity: number;
  quantityPresets: number[];
  requirements: ProductRequirementConfig;
  thumbnail: string;
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
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: 'Pending' | 'Printing' | 'Dispatched' | 'Delivered';
  createdAt: string;
  paymentMethod: string;
}
