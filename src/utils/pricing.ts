import { Product } from '../types';

export const getStartingPrice = (product: Product): number => {
  let minPrice = product.basePrice;
  if (!product.discountTiers || product.discountTiers.length === 0) return minPrice;
  
  let highestPercentage = 0;
  let highestFlat = 0;
  
  product.discountTiers.forEach(tier => {
    if (tier.discountType === 'PERCENTAGE' && tier.discountValue > highestPercentage) {
      highestPercentage = tier.discountValue;
    }
    if ((tier.discountType === 'FLAT' || tier.discountType === 'FLAT_AMOUNT' as any) && tier.discountValue > highestFlat) {
      highestFlat = tier.discountValue;
    }
  });

  if (highestPercentage > 0) {
    const pct = highestPercentage > 1 ? highestPercentage / 100 : highestPercentage;
    minPrice = Math.min(minPrice, product.basePrice - (product.basePrice * pct));
  }
  if (highestFlat > 0) {
    minPrice = Math.min(minPrice, product.basePrice - highestFlat);
  }

  return Math.max(0, Math.round(minPrice));
};
