export interface RefundSummaryViewModel {
    id: string;
    slugId: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdAt: string;
    paidAt: string | null;
}

export interface RefundListItemViewModel {
    id: string;
    slugId: string;
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

export interface RefundDetailViewModel {
    id: string;
    slugId: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdAt: string;
    paidAt: string | null;
    transferReference: string | null;
    failureReason: string | null;
}
