import { CartItemViewModel } from '../models';

import { CartItemResponseModel } from '@/apis/models';

export const mapCartItemResponseToViewModel = (item: CartItemResponseModel): CartItemViewModel => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    discountPrice: item.discountPrice,
    imageUrl: item.imageUrl,
    category: item.category,
    quantity: item.quantity,
    stockQuantity: item.stockQuantity,
    quantityUnit: item.quantityUnit,
});
