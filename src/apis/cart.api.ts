import { apiClient } from './client';
import {
    AddCartItemRequestModel,
    BulkAddCartItemsRequestModel,
    CartItemResponseModel,
    GetCartResponseModel,
    UpdateCartItemCustomisationRequestModel,
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

    bulkAddItems: (data: BulkAddCartItemsRequestModel) => {
        return apiClient.post<GetCartResponseModel>(API_ENDPOINTS.CART.ITEMS_BULK, data);
    },

    updateItemCustomisation: (itemId: string, data: UpdateCartItemCustomisationRequestModel) => {
        return apiClient.patch<{ id: string }>(API_ENDPOINTS.CART.ITEM_CUSTOMISATION(itemId), data);
    },
};
