import type {
    CategoryModel,
    CustomisationGroupModel,
    CustomisationOptionModel,
    FoodDetailModel,
    FoodItemModel,
    FoodsModel,
} from './food.model';
import type {
    CategoryResponseModel,
    FoodCustomisationGroupResponseModel,
    FoodCustomisationOptionResponseModel,
    FoodItemResponseModel,
    GetFoodByIdResponseModel,
    GetFoodsResponseModel,
} from './food.response';

function mapCustomisationOption(option: FoodCustomisationOptionResponseModel): CustomisationOptionModel {
    return {
        value: option.value,
        label: option.label,
        ...(option.surcharge !== undefined && { surcharge: option.surcharge }),
    };
}

export function toCustomisationGroup(group: FoodCustomisationGroupResponseModel): CustomisationGroupModel {
    return {
        id: group.id,
        label: group.label,
        required: group.required,
        options: group.options.map(mapCustomisationOption),
    };
}

function mapFoodItem(item: FoodItemResponseModel): FoodItemModel {
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        imageUrl: item.imageUrl,
        category: item.category,
        isAvailable: item.isAvailable,
        stockQuantity: item.stockQuantity,
        quantityUnit: item.quantityUnit,
    };
}

export function toFoods(response: GetFoodsResponseModel): FoodsModel {
    return {
        totalCount: response.totalCount,
        items: response.items.map(mapFoodItem),
    };
}

export function toFood(response: GetFoodByIdResponseModel): FoodDetailModel {
    return {
        id: response.id,
        name: response.name,
        description: response.description,
        price: response.price,
        discountPrice: response.discountPrice,
        imageUrls: response.imageUrls,
        category: response.category,
        isAvailable: response.isAvailable,
        stockQuantity: response.stockQuantity,
        quantityUnit: response.quantityUnit,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        customisations: response.customisations.map(toCustomisationGroup),
    };
}

export function toCategory(response: CategoryResponseModel): CategoryModel {
    return {
        id: response.id,
        name: response.name,
    };
}
