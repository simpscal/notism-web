import { toCustomisationGroup } from '../food';
import type { RefundDetailModel, RefundListItemModel, RefundsModel } from '../order';
import { toDeliveryStatusTiming, toOrderItem } from '../order';

import type {
    AdminCategoriesModel,
    AdminCategoryModel,
    AdminCustomisationGroupModel,
    AdminCustomisationOptionModel,
    AdminFoodDetailImageModel,
    AdminFoodDetailModel,
    AdminFoodItemModel,
    AdminFoodsModel,
    AdminOrderDetailModel,
    AdminOrderModel,
    AdminOrdersModel,
    AdminUserDetailModel,
    AdminUserModel,
    AdminUsersModel,
    DashboardOrderStatusSummaryModel,
    DashboardRevenueGranularityModel,
    DashboardRevenueSeriesModel,
    DashboardTodaySalesModel,
} from './admin.model';
import type {
    AdminCategoryResponseModel,
    AdminFoodItemResponseModel,
    AdminOrderDetailResponseModel,
    AdminOrderResponseModel,
    AdminRefundDetailResponseModel,
    AdminRefundListItemResponseModel,
    AdminUserDetailResponseModel,
    AdminUserResponseModel,
    CustomisationGroupResponseModel,
    CustomisationOptionResponseModel,
    GetAdminCategoriesResponseModel,
    GetAdminFoodDetailImageModel,
    GetAdminFoodDetailResponseModel,
    GetAdminFoodsResponseModel,
    GetAdminOrdersForKanbanResponseModel,
    GetAdminOrdersResponseModel,
    GetAdminRefundsResponseModel,
    GetAdminUsersResponseModel,
    GetDashboardOrderStatusSummaryResponseModel,
    GetDashboardRevenueSeriesResponseModel,
    GetDashboardTodaySalesResponseModel,
} from './admin.response';

export function toAdminOrder(response: AdminOrderResponseModel): AdminOrderModel {
    return {
        id: response.id,
        slugId: response.slugId,
        userId: response.userId,
        userEmail: response.userEmail,
        userName: response.userName,
        totalAmount: response.totalAmount,
        deliveryStatus: response.deliveryStatus,
        paymentStatus: response.paymentStatus,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        totalItems: response.totalItems,
        deliveryNotes: response.deliveryNotes,
    };
}

export function toAdminOrders(response: GetAdminOrdersResponseModel): AdminOrdersModel {
    return {
        items: response.items.map(toAdminOrder),
        totalCount: response.totalCount,
    };
}

export function toAdminOrdersForKanban(response: GetAdminOrdersForKanbanResponseModel): AdminOrdersModel {
    return {
        items: response.items.map(toAdminOrder),
        totalCount: response.totalCount,
    };
}

export function toAdminRefundListItem(response: AdminRefundListItemResponseModel): RefundListItemModel {
    return {
        id: response.id,
        orderId: response.orderId,
        orderSlugId: response.orderSlugId,
        amount: response.amount,
        status: response.status,
        transferReference: response.transferReference,
        createdAt: response.createdAt,
        paidAt: response.paidAt,
    };
}

export function toAdminRefunds(response: GetAdminRefundsResponseModel): RefundsModel {
    return {
        items: response.items.map(toAdminRefundListItem),
        totalCount: response.totalCount,
    };
}

export function toAdminRefundDetail(response: AdminRefundDetailResponseModel): RefundDetailModel {
    return {
        id: response.id,
        orderId: response.orderId,
        orderSlugId: response.orderSlugId,
        amount: response.amount,
        status: response.status,
        createdAt: response.createdAt,
        paidAt: response.paidAt,
        transferReference: response.transferReference,
        failureReason: response.failureReason,
        bankCode: response.bankCode,
        accountNumber: response.accountNumber,
        accountHolderName: response.accountHolderName,
    };
}

export function toDashboardOrderStatusSummary(
    response: GetDashboardOrderStatusSummaryResponseModel
): DashboardOrderStatusSummaryModel {
    return {
        new: response.new,
        inProgress: response.inProgress,
        completed: response.completed,
    };
}

export function toDashboardTodaySales(response: GetDashboardTodaySalesResponseModel): DashboardTodaySalesModel {
    return {
        revenue: response.revenue,
        orderCount: response.orderCount,
    };
}

export function toDashboardRevenueSeries(
    response: GetDashboardRevenueSeriesResponseModel
): DashboardRevenueSeriesModel {
    return {
        granularity: response.granularity as DashboardRevenueGranularityModel,
        points: response.points.map(point => ({
            period: point.period,
            revenue: point.revenue,
        })),
    };
}

export function toAdminOrderDetail(response: AdminOrderDetailResponseModel): AdminOrderDetailModel {
    return {
        id: response.id,
        slugId: response.slugId,
        totalAmount: response.totalAmount,
        paymentMethod: response.paymentMethod,
        deliveryStatus: response.deliveryStatus,
        paymentStatus: response.paymentStatus,
        paidAt: response.paidAt,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        deliveryNotes: response.deliveryNotes,
        items: response.items.map(toOrderItem),
        deliveryStatusTiming: toDeliveryStatusTiming(response.deliveryStatusTiming),
    };
}

function mapAdminUser(response: AdminUserResponseModel): AdminUserModel {
    return {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role,
        phoneNumber: response.phoneNumber,
        location: response.location,
        createdAt: response.createdAt,
    };
}

export function toAdminUsers(response: GetAdminUsersResponseModel): AdminUsersModel {
    return {
        items: response.items.map(mapAdminUser),
        totalCount: response.totalCount,
    };
}

export function toAdminUserDetail(response: AdminUserDetailResponseModel): AdminUserDetailModel {
    return {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role,
        phoneNumber: response.phoneNumber,
        location: response.location,
        createdAt: response.createdAt,
    };
}

function mapAdminFoodItem(response: AdminFoodItemResponseModel): AdminFoodItemModel {
    return {
        id: response.id,
        name: response.name,
        description: response.description,
        price: response.price,
        discountPrice: response.discountPrice,
        imageUrl: response.imageUrl,
        category: response.category,
        isAvailable: response.isAvailable,
        stockQuantity: response.stockQuantity,
        quantityUnit: response.quantityUnit,
    };
}

export function toAdminFoods(response: GetAdminFoodsResponseModel): AdminFoodsModel {
    return {
        items: response.items.map(mapAdminFoodItem),
        totalCount: response.totalCount,
    };
}

function mapAdminFoodDetailImage(image: GetAdminFoodDetailImageModel): AdminFoodDetailImageModel {
    return {
        fileKey: image.fileKey,
        displayOrder: image.displayOrder,
        altText: image.altText,
        imageUrl: image.imageUrl,
    };
}

export function toAdminFoodDetail(response: GetAdminFoodDetailResponseModel): AdminFoodDetailModel {
    return {
        id: response.id,
        name: response.name,
        description: response.description,
        price: response.price,
        discountPrice: response.discountPrice,
        images: response.images.map(mapAdminFoodDetailImage),
        category: response.category,
        categoryId: response.categoryId,
        isAvailable: response.isAvailable,
        stockQuantity: response.stockQuantity,
        quantityUnit: response.quantityUnit,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        customisations: response.customisations.map(toCustomisationGroup),
    };
}

export function toAdminCategory(response: AdminCategoryResponseModel): AdminCategoryModel {
    return {
        id: response.id,
        name: response.name,
    };
}

export function toAdminCategories(response: GetAdminCategoriesResponseModel): AdminCategoriesModel {
    return {
        items: response.items.map(toAdminCategory),
    };
}

export function toAdminCustomisationGroup(response: CustomisationGroupResponseModel): AdminCustomisationGroupModel {
    return {
        id: response.id,
        foodId: response.foodId,
        label: response.label,
        isRequired: response.isRequired,
        displayOrder: response.displayOrder,
    };
}

export function toAdminCustomisationOption(response: CustomisationOptionResponseModel): AdminCustomisationOptionModel {
    return {
        id: response.id,
        groupId: response.groupId,
        label: response.label,
        surcharge: response.surcharge,
        displayOrder: response.displayOrder,
    };
}
