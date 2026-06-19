import type {
    CreateOrderModel,
    HeldRefundModel,
    OrderDeliveryStatusTimingModel,
    OrderItemModel,
    OrderModel,
    OrderPaymentQrModel,
    OrdersModel,
    RefundSummaryModel,
} from './order.model';
import type {
    CreateOrderResponseModel,
    DeliveryStatusTimingResponseModel,
    GetOrdersResponseModel,
    HeldRefundResponseModel,
    OrderItemResponseModel,
    OrderPaymentQrResponseModel,
    OrderResponseModel,
    RefundSummaryResponseModel,
} from './order.response';

export function toHeldRefund(response: HeldRefundResponseModel): HeldRefundModel {
    return {
        refundId: response.refundId,
        orderRef: response.orderReference,
        amount: response.amount,
    };
}

export function toRefundSummary(response: RefundSummaryResponseModel): RefundSummaryModel {
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
    };
}

export function toOrderItem(item: OrderItemResponseModel): OrderItemModel {
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

export function toDeliveryStatusTiming(timing: DeliveryStatusTimingResponseModel): OrderDeliveryStatusTimingModel {
    return {
        orderPlacedCompletedAt: timing.orderPlacedCompletedAt,
        preparingCompletedAt: timing.preparingCompletedAt,
        onTheWayCompletedAt: timing.onTheWayCompletedAt,
        deliveredCompletedAt: timing.deliveredCompletedAt,
    };
}

function mapPaymentQr(paymentQr: OrderPaymentQrResponseModel): OrderPaymentQrModel {
    return {
        bankCode: paymentQr.bankCode,
        accountNumber: paymentQr.accountNumber,
        accountHolderName: paymentQr.accountHolderName,
        amount: paymentQr.amount,
        orderReference: paymentQr.orderReference,
    };
}

export function toOrder(response: OrderResponseModel): OrderModel {
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
        refund: response.refund ? toRefundSummary(response.refund) : null,
    };
}

export function toOrders(response: GetOrdersResponseModel): OrdersModel {
    return {
        totalCount: response.totalCount,
        items: response.items.map(toOrder),
    };
}

export function toCreateOrder(response: CreateOrderResponseModel): CreateOrderModel {
    return {
        orderId: response.orderId,
        slugId: response.slugId,
        totalAmount: response.totalAmount,
        paymentMethod: response.paymentMethod,
        deliveryStatus: response.deliveryStatus,
        createdAt: response.createdAt,
    };
}
