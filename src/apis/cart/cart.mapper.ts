import type { CartItemCustomisationModel, CartItemModel, CartModel } from './cart.model';
import type { CartItemCustomisationResponseModel, CartItemResponseModel, GetCartResponseModel } from './cart.response';

function mapCustomisation(customisation: CartItemCustomisationResponseModel): CartItemCustomisationModel {
    return {
        groupId: customisation.groupId,
        groupLabel: customisation.groupLabel,
        optionId: customisation.optionId,
        optionLabel: customisation.optionLabel,
        surcharge: customisation.surcharge,
        availableOptions: customisation.availableOptions.map(option => ({
            id: option.id,
            label: option.label,
            surcharge: option.surcharge,
        })),
    };
}

export function toCartItem(item: CartItemResponseModel): CartItemModel {
    return {
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
        customisations: item.customisations.map(mapCustomisation),
        totalSurcharge: item.totalSurcharge,
    };
}

export function toCart(response: GetCartResponseModel): CartModel {
    return {
        items: response.items.map(item => ({
            ...toCartItem(item),
            isSelected: true,
        })),
    };
}
