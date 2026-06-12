import { apiClient } from './client';
import { toCartItem, toCart } from './mappers';
import {
    AddCartItemRequestModel,
    BulkAddCartItemsRequestModel,
    CartItemResponseModel,
    GetCartResponseModel,
    ReplaceCartItemCustomisationsRequestModel,
    UpdateCartItemQuantityRequestModel,
    UpdateCartItemQuantityResponseModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const cartApi = {
    getCart: async () => {
        const response = await apiClient.get<GetCartResponseModel>(API_ENDPOINTS.CART.BASE);
        return toCart(response);
    },

    addItem: async (data: AddCartItemRequestModel) => {
        const response = await apiClient.post<CartItemResponseModel>(API_ENDPOINTS.CART.ITEMS, data);
        return toCartItem(response);
    },

    updateItemQuantity: async (itemId: string, data: UpdateCartItemQuantityRequestModel) => {
        // The backend returns only `{ id }` here — do NOT run it through toCartItem
        // (it would throw on the missing fields). A 2xx means the new quantity is
        // persisted; the caller treats the requested quantity as authoritative.
        return apiClient.patch<UpdateCartItemQuantityResponseModel>(API_ENDPOINTS.CART.ITEM(itemId), data);
    },

    removeItem: (itemId: string) => {
        return apiClient.delete(API_ENDPOINTS.CART.ITEM(itemId));
    },

    clearCart: () => {
        return apiClient.delete(API_ENDPOINTS.CART.BASE);
    },

    bulkAddItems: async (data: BulkAddCartItemsRequestModel) => {
        const response = await apiClient.post<GetCartResponseModel>(API_ENDPOINTS.CART.ITEMS_BULK, data);
        return toCart(response);
    },

    replaceItemCustomisations: async (itemId: string, data: ReplaceCartItemCustomisationsRequestModel) => {
        const response = await apiClient.put<CartItemResponseModel>(
            API_ENDPOINTS.CART.ITEM_CUSTOMISATIONS(itemId),
            data
        );
        return toCartItem(response);
    },
};
