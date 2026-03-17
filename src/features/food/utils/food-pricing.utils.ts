/**
 * Checks if a discount price is set (discount exists).
 * A discount is considered to exist when discountPrice is not null/undefined,
 * including when it is 0 (e.g. free item with a discount).
 */
export function hasFoodDiscountPrice(discountPrice: number | null | undefined): discountPrice is number {
    return discountPrice != null && discountPrice !== 0;
}

/**
 * Computes pricing for a food/cart item with optional discount.
 * Treats discountPrice === 0 as a valid discount (e.g. free with discount).
 */
export function getFoodPricing(price: number, discountPrice: number | null | undefined) {
    const hasDiscount = hasFoodDiscountPrice(discountPrice);
    const effectivePrice = hasDiscount ? discountPrice : price;
    const hasSavings = hasDiscount && effectivePrice < price;
    return { hasDiscount, effectivePrice, hasSavings };
}
