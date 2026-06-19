export const CART_ENDPOINTS = {
    BASE: 'cart',
    ITEMS: 'cart/items',
    ITEMS_BULK: 'cart/items/bulk',
    ITEM: (itemId: string) => `cart/items/${itemId}`,
    ITEM_CUSTOMISATIONS: (itemId: string) => `cart/items/${itemId}/customisations`,
} as const;

export const CART_QUERY_KEYS = {};
