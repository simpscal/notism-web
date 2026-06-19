import { apiClient } from '../client';

import { CART_ENDPOINTS } from './cart.constant';
import { toCart, toCartItem } from './cart.mapper';
import {
    AddCartItemRequestModel,
    BulkAddCartItemsRequestModel,
    ReplaceCartItemCustomisationsRequestModel,
    UpdateCartItemQuantityRequestModel,
} from './cart.request';
import { CartItemResponseModel, GetCartResponseModel, UpdateCartItemQuantityResponseModel } from './cart.response';

export const cartApi = {
    getCart: async () => {
        const response = await apiClient.get<GetCartResponseModel>(CART_ENDPOINTS.BASE);
        return toCart(response);
    },

    addItem: async (data: AddCartItemRequestModel) => {
        const response = await apiClient.post<CartItemResponseModel>(CART_ENDPOINTS.ITEMS, data);
        return toCartItem(response);
    },

    updateItemQuantity: async (itemId: string, data: UpdateCartItemQuantityRequestModel) => {
        return apiClient.patch<UpdateCartItemQuantityResponseModel>(CART_ENDPOINTS.ITEM(itemId), data);
    },

    removeItem: (itemId: string) => {
        return apiClient.delete(CART_ENDPOINTS.ITEM(itemId));
    },

    clearCart: () => {
        return apiClient.delete(CART_ENDPOINTS.BASE);
    },

    bulkAddItems: async (data: BulkAddCartItemsRequestModel) => {
        const response = await apiClient.post<GetCartResponseModel>(CART_ENDPOINTS.ITEMS_BULK, data);
        return toCart(response);
    },

    replaceItemCustomisations: async (itemId: string, data: ReplaceCartItemCustomisationsRequestModel) => {
        const response = await apiClient.put<CartItemResponseModel>(CART_ENDPOINTS.ITEM_CUSTOMISATIONS(itemId), data);
        return toCartItem(response);
    },
};
