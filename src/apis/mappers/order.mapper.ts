import type {
    CreateOrderResponseModel,
    DeliveryStatusTimingResponseModel,
    GetOrdersResponseModel,
    OrderItemResponseModel,
    OrderPaymentQrResponseModel,
    OrderResponseModel,
} from '../models';

import type {
    CreateOrderViewModel,
    OrderDeliveryStatusTimingViewModel,
    OrderItemViewModel,
    OrderPaymentQrViewModel,
    OrdersViewModel,
    OrderViewModel,
} from '@/features/order/models';

export function toOrderItem(item: OrderItemResponseModel): OrderItemViewModel {
    return {
        id: item.id,
        foodId: item.foodId,
        foodName: item.foodName,
        unitPrice: item.unitPrice,
        discountPrice: item.discountPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        imageUrl: item.imageUrl,
        surcharge: item.surcharge,
        customisationLabel: item.customisationLabel,
    };
}

export function toDeliveryStatusTiming(timing: DeliveryStatusTimingResponseModel): OrderDeliveryStatusTimingViewModel {
    return {
        orderPlacedCompletedAt: timing.orderPlacedCompletedAt,
        preparingCompletedAt: timing.preparingCompletedAt,
        onTheWayCompletedAt: timing.onTheWayCompletedAt,
        deliveredCompletedAt: timing.deliveredCompletedAt,
    };
}

function mapPaymentQr(paymentQr: OrderPaymentQrResponseModel): OrderPaymentQrViewModel {
    return {
        bankCode: paymentQr.bankCode,
        accountNumber: paymentQr.accountNumber,
        accountHolderName: paymentQr.accountHolderName,
        amount: paymentQr.amount,
        orderReference: paymentQr.orderReference,
    };
}

export function toOrder(response: OrderResponseModel): OrderViewModel {
    return {
        id: response.id,
        slugId: response.slugId,
        totalAmount: response.totalAmount,
        paymentMethod: response.paymentMethod,
        deliveryStatus: response.deliveryStatus,
        paymentStatus: response.paymentStatus,
        paidAt: response.paidAt,
        paymentQr: response.paymentQr ? mapPaymentQr(response.paymentQr) : null,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        deliveryNotes: response.deliveryNotes,
        items: response.items.map(toOrderItem),
        deliveryStatusTiming: toDeliveryStatusTiming(response.deliveryStatusTiming),
    };
}

export function toOrders(response: GetOrdersResponseModel): OrdersViewModel {
    return {
        totalCount: response.totalCount,
        items: response.items.map(toOrder),
    };
}

export function toCreateOrder(response: CreateOrderResponseModel): CreateOrderViewModel {
    return {
        orderId: response.orderId,
        slugId: response.slugId,
        totalAmount: response.totalAmount,
        paymentMethod: response.paymentMethod,
        deliveryStatus: response.deliveryStatus,
        createdAt: response.createdAt,
    };
}
