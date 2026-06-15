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
} from '../models';

import { toCustomisationGroup } from './food.mapper';
import { toDeliveryStatusTiming, toOrderItem } from './order.mapper';

import type {
    AdminCategoriesViewModel,
    AdminCategoryViewModel,
    AdminCustomisationGroupViewModel,
    AdminCustomisationOptionViewModel,
    AdminFoodDetailImageViewModel,
    AdminFoodDetailViewModel,
    AdminFoodItemViewModel,
    AdminFoodsViewModel,
    AdminOrderDetailViewModel,
    AdminOrderViewModel,
    AdminOrdersViewModel,
    AdminUserDetailViewModel,
    AdminUserViewModel,
    AdminUsersViewModel,
    DashboardOrderStatusSummaryViewModel,
    DashboardRevenueGranularityViewModel,
    DashboardRevenueSeriesViewModel,
    DashboardTodaySalesViewModel,
} from '@/features/admin/models';
import type { RefundDetailViewModel, RefundListItemViewModel, RefundsViewModel } from '@/features/order/models';

export function toAdminOrder(response: AdminOrderResponseModel): AdminOrderViewModel {
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

export function toAdminOrders(response: GetAdminOrdersResponseModel): AdminOrdersViewModel {
    return {
        items: response.items.map(toAdminOrder),
        totalCount: response.totalCount,
    };
}

export function toAdminOrdersForKanban(response: GetAdminOrdersForKanbanResponseModel): AdminOrdersViewModel {
    return {
        items: response.items.map(toAdminOrder),
        totalCount: response.totalCount,
    };
}

export function toAdminRefundListItem(response: AdminRefundListItemResponseModel): RefundListItemViewModel {
    return {
        id: response.id,
        slugId: response.slugId,
        orderId: response.orderId,
        orderSlugId: response.orderSlugId,
        amount: response.amount,
        status: response.status,
        createdAt: response.createdAt,
    };
}

export function toAdminRefunds(response: GetAdminRefundsResponseModel): RefundsViewModel {
    return {
        items: response.items.map(toAdminRefundListItem),
        totalCount: response.totalCount,
    };
}

export function toAdminRefundDetail(response: AdminRefundDetailResponseModel): RefundDetailViewModel {
    return {
        id: response.id,
        slugId: response.slugId,
        orderId: response.orderId,
        orderSlugId: response.orderSlugId,
        amount: response.amount,
        status: response.status,
        createdAt: response.createdAt,
        paidAt: response.paidAt,
        transferReference: response.transferReference,
        failureReason: response.failureReason,
    };
}

export function toDashboardOrderStatusSummary(
    response: GetDashboardOrderStatusSummaryResponseModel
): DashboardOrderStatusSummaryViewModel {
    return {
        new: response.new,
        inProgress: response.inProgress,
        completed: response.completed,
    };
}

export function toDashboardTodaySales(response: GetDashboardTodaySalesResponseModel): DashboardTodaySalesViewModel {
    return {
        revenue: response.revenue,
        orderCount: response.orderCount,
    };
}

export function toDashboardRevenueSeries(
    response: GetDashboardRevenueSeriesResponseModel
): DashboardRevenueSeriesViewModel {
    return {
        granularity: response.granularity as DashboardRevenueGranularityViewModel,
        points: response.points.map(point => ({
            period: point.period,
            revenue: point.revenue,
        })),
    };
}

export function toAdminOrderDetail(response: AdminOrderDetailResponseModel): AdminOrderDetailViewModel {
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

function mapAdminUser(response: AdminUserResponseModel): AdminUserViewModel {
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

export function toAdminUsers(response: GetAdminUsersResponseModel): AdminUsersViewModel {
    return {
        items: response.items.map(mapAdminUser),
        totalCount: response.totalCount,
    };
}

export function toAdminUserDetail(response: AdminUserDetailResponseModel): AdminUserDetailViewModel {
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

function mapAdminFoodItem(response: AdminFoodItemResponseModel): AdminFoodItemViewModel {
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

export function toAdminFoods(response: GetAdminFoodsResponseModel): AdminFoodsViewModel {
    return {
        items: response.items.map(mapAdminFoodItem),
        totalCount: response.totalCount,
    };
}

function mapAdminFoodDetailImage(image: GetAdminFoodDetailImageModel): AdminFoodDetailImageViewModel {
    return {
        fileKey: image.fileKey,
        displayOrder: image.displayOrder,
        altText: image.altText,
        imageUrl: image.imageUrl,
    };
}

export function toAdminFoodDetail(response: GetAdminFoodDetailResponseModel): AdminFoodDetailViewModel {
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

export function toAdminCategory(response: AdminCategoryResponseModel): AdminCategoryViewModel {
    return {
        id: response.id,
        name: response.name,
    };
}

export function toAdminCategories(response: GetAdminCategoriesResponseModel): AdminCategoriesViewModel {
    return {
        items: response.items.map(toAdminCategory),
    };
}

export function toAdminCustomisationGroup(response: CustomisationGroupResponseModel): AdminCustomisationGroupViewModel {
    return {
        id: response.id,
        foodId: response.foodId,
        label: response.label,
        isRequired: response.isRequired,
        displayOrder: response.displayOrder,
    };
}

export function toAdminCustomisationOption(
    response: CustomisationOptionResponseModel
): AdminCustomisationOptionViewModel {
    return {
        id: response.id,
        groupId: response.groupId,
        label: response.label,
        surcharge: response.surcharge,
        displayOrder: response.displayOrder,
    };
}
