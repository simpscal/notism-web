export interface RefundSummaryViewModel {
    id: string;
    slugId: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdAt: string;
    paidAt: string | null;
    transferReference: string | null;
}

export interface RefundListItemViewModel {
    id: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    transferReference: string | null;
    createdAt: string;
    paidAt: string | null;
}

export interface RefundsViewModel {
    totalCount: number;
    items: RefundListItemViewModel[];
}

export interface HeldRefundViewModel {
    refundId: string;
    orderRef: string;
    amount: number;
}

export interface RefundDetailViewModel {
    id: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdAt: string;
    paidAt: string | null;
    transferReference: string | null;
    failureReason: string | null;
    bankCode: string | null;
    accountNumber: string | null;
    accountHolderName: string | null;
}
