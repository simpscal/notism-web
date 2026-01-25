import { apiClient } from './client';
import {
    AddCartItemRequestModel,
    CartItemResponseModel,
    GetCartResponseModel,
    UpdateCartItemQuantityRequestModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const cartApi = {
    getCart: () => {
        return apiClient.get<GetCartResponseModel>(API_ENDPOINTS.CART.BASE);
    },

    addItem: (data: AddCartItemRequestModel) => {
        return apiClient.post<CartItemResponseModel>(API_ENDPOINTS.CART.ITEMS, data);
    },

    updateItemQuantity: (itemId: string, data: UpdateCartItemQuantityRequestModel) => {
        return apiClient.patch<CartItemResponseModel>(API_ENDPOINTS.CART.ITEM(itemId), data);
    },

    removeItem: (itemId: string) => {
        return apiClient.delete(API_ENDPOINTS.CART.ITEM(itemId));
    },

    clearCart: () => {
        return apiClient.delete(API_ENDPOINTS.CART.BASE);
    },
};
