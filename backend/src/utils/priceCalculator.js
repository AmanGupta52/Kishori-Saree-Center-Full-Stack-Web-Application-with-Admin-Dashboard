/**
 * Calculates discountAmount and sellingPrice given an original price,
 * a discount type ('percentage' | 'fixed' | 'none') and a discount value.
 */
const calculatePricing = (originalPrice, discountType, discountValue) => {
  const original = Number(originalPrice) || 0;
  const value = Number(discountValue) || 0;

  let discountAmount = 0;

  if (discountType === 'percentage') {
    discountAmount = Math.round((original * value) / 100);
  } else if (discountType === 'fixed') {
    discountAmount = value;
  }

  const sellingPrice = Math.max(original - discountAmount, 0);
  const discountPercentage = original > 0 ? Math.round((discountAmount / original) * 100) : 0;

  return { discountAmount, sellingPrice, discountPercentage };
};

module.exports = { calculatePricing };
