import { apiClient } from '../client';

import { toCart, toCartItem } from './cart.mapper';
import {
    AddCartItemRequestModel,
    BulkAddCartItemsRequestModel,
    ReplaceCartItemCustomisationsRequestModel,
    UpdateCartItemQuantityRequestModel,
} from './cart.request';
import { CartItemResponseModel, GetCartResponseModel, UpdateCartItemQuantityResponseModel } from './cart.response';

import { API_ENDPOINTS } from '@/app/constants';

export const CART_QUERY_KEYS = {};

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
