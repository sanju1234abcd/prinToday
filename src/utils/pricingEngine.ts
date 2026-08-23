import { DiscountTier } from '../types';

export interface CalculatePriceArgs {
  basePrice: number;
  quantity: number;
  pricingType?: 'fixed' | 'per_sqft';
  widthFt?: number;
  heightFt?: number;
  requiresCustomDimensions?: boolean;
  minSqFt?: number;
  discountTiers?: DiscountTier[];
}

export interface PriceBreakdown {
  rawTotalPrice: number;
  discountAmount: number;
  finalTotalPrice: number;
  effectiveUnitPrice: number;
  appliedTier?: DiscountTier | null;
  appliedDiscountPercent?: number;
}

export const formatINR = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const calculateProductPrice = (args: CalculatePriceArgs): PriceBreakdown => {
  const {
    basePrice,
    quantity,
    pricingType = 'fixed',
    widthFt = 1,
    heightFt = 1,
    requiresCustomDimensions = false,
    minSqFt = 0,
    discountTiers = []
  } = args;

  let unitPrice = basePrice;
  let sqFtPerUnit = 1;

  // Handle sq ft pricing
  if (requiresCustomDimensions || pricingType === 'per_sqft') {
    sqFtPerUnit = widthFt * heightFt;
    if (minSqFt > 0 && sqFtPerUnit < minSqFt) {
      sqFtPerUnit = minSqFt;
    }
    unitPrice = basePrice * sqFtPerUnit;
  }

  const rawTotalPrice = unitPrice * quantity;

  // effectiveMetric: for per_sqft → total sq ft ordered; for fixed → quantity
  // This is what discount tiers are keyed against.
  const effectiveMetric = (requiresCustomDimensions || pricingType === 'per_sqft')
    ? sqFtPerUnit * quantity
    : quantity;

  // Find applicable discount tier using effectiveMetric
  const applicableTier = discountTiers.find(
    tier => effectiveMetric >= tier.minQty && (tier.maxQty === null || effectiveMetric <= tier.maxQty)
  ) ?? null;

  let discountAmount = 0;
  let appliedDiscountPercent = 0;

  if (applicableTier) {
    if (applicableTier.discountType === 'PERCENTAGE') {
      discountAmount = rawTotalPrice * (applicableTier.discountValue / 100);
      appliedDiscountPercent = applicableTier.discountValue;
    } else if ((applicableTier.discountType as string) === 'FLAT' || (applicableTier.discountType as string) === 'FLAT_AMOUNT') {
      discountAmount = applicableTier.discountValue;
      appliedDiscountPercent = rawTotalPrice > 0 ? (discountAmount / rawTotalPrice) * 100 : 0;
    }
  }

  // Final values
  const finalTotalPrice = Math.max(0, rawTotalPrice - discountAmount);
  const effectiveUnitPrice = quantity > 0 ? finalTotalPrice / quantity : 0;

  return {
    rawTotalPrice,
    discountAmount,
    finalTotalPrice,
    effectiveUnitPrice,
    appliedTier: applicableTier,
    appliedDiscountPercent
  };
};

