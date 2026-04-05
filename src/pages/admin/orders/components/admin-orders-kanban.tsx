import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import AdminOrderCard from './admin-order-card';

import { adminApi } from '@/apis';
import { AdminOrderResponseModel, GetAdminOrdersForKanbanResponseModel } from '@/apis/models';
import { PAGE_SIZE } from '@/app/constants';
import Kanban, { KanbanColumn } from '@/components/kanban';
import Spinner from '@/components/spinner';
import { DELIVERY_STATUS } from '@/features/order';

interface AdminOrdersKanbanProps {
    onOrderClick: (slugId: string) => void;
    paymentStatus?: string;
}

function AdminOrdersKanban({ onOrderClick, paymentStatus }: AdminOrdersKanbanProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const placedQuery = useInfiniteQuery({
        queryKey: ['admin', 'orders', 'kanban', DELIVERY_STATUS[0].key, { paymentStatus }] as const,
        queryFn: ({ pageParam = 0 }) =>
            adminApi.getOrdersForKanban({
                status: DELIVERY_STATUS[0].key,
                skip: pageParam,
                take: PAGE_SIZE,
                paymentStatus,
            }),
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((acc, page) => acc + page.items.length, 0);
            const hasMore = loadedCount < lastPage.totalCount;
            if (!hasMore) return undefined;
            return loadedCount;
        },
        initialPageParam: 0,
    });

    const preparingQuery = useInfiniteQuery({
        queryKey: ['admin', 'orders', 'kanban', DELIVERY_STATUS[1].key, { paymentStatus }] as const,
        queryFn: ({ pageParam = 0 }) =>
            adminApi.getOrdersForKanban({
                status: DELIVERY_STATUS[1].key,
                skip: pageParam,
                take: PAGE_SIZE,
                paymentStatus,
            }),
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((acc, page) => acc + page.items.length, 0);
            const hasMore = loadedCount < lastPage.totalCount;
            if (!hasMore) return undefined;
            return loadedCount;
        },
        initialPageParam: 0,
    });

    const onTheWayQuery = useInfiniteQuery({
        queryKey: ['admin', 'orders', 'kanban', DELIVERY_STATUS[2].key, { paymentStatus }] as const,
        queryFn: ({ pageParam = 0 }) =>
            adminApi.getOrdersForKanban({
                status: DELIVERY_STATUS[2].key,
                skip: pageParam,
                take: PAGE_SIZE,
                paymentStatus,
            }),
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((acc, page) => acc + page.items.length, 0);
            const hasMore = loadedCount < lastPage.totalCount;
            if (!hasMore) return undefined;
            return loadedCount;
        },
        initialPageParam: 0,
    });

    const deliveredQuery = useInfiniteQuery({
        queryKey: ['admin', 'orders', 'kanban', DELIVERY_STATUS[3].key, { paymentStatus }] as const,
        queryFn: ({ pageParam = 0 }) =>
            adminApi.getOrdersForKanban({
                status: DELIVERY_STATUS[3].key,
                skip: pageParam,
                take: PAGE_SIZE,
                paymentStatus,
            }),
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((acc, page) => acc + page.items.length, 0);
            const hasMore = loadedCount < lastPage.totalCount;
            if (!hasMore) return undefined;
            return loadedCount;
        },
        initialPageParam: 0,
    });

    const queries = [placedQuery, preparingQuery, onTheWayQuery, deliveredQuery];
    const isInitialLoading = queries.some(query => query.isLoading && !query.data);

    const updateDeliveryStatusMutation = useMutation({
        mutationFn: ({
            orderId,
            deliveryStatus,
        }: {
            orderId: string;
            deliveryStatus: string;
            sourceColumnId: string;
        }) => adminApi.updateOrderDeliveryStatus(orderId, { deliveryStatus }),
        onSuccess: (updatedOrder, variables) => {
            const { sourceColumnId, deliveryStatus: targetColumnId } = variables;

            // Remove the order from the source column
            queryClient.setQueryData<InfiniteData<GetAdminOrdersForKanbanResponseModel>>(
                ['admin', 'orders', 'kanban', sourceColumnId, { paymentStatus }] as const,
                oldData => {
                    if (!oldData) return oldData;

                    const updatedPages = oldData.pages.map(page => ({
                        ...page,
                        items: page.items.filter(item => item.id !== updatedOrder.id),
                        totalCount: page.totalCount - 1,
                    }));

                    return {
                        ...oldData,
                        pages: updatedPages,
                    };
                }
            );

            // Add the order to the destination column
            queryClient.setQueryData<InfiniteData<GetAdminOrdersForKanbanResponseModel>>(
                ['admin', 'orders', 'kanban', targetColumnId, { paymentStatus }] as const,
                oldData => {
                    if (!oldData) {
                        return {
                            pages: [
                                {
                                    items: [updatedOrder],
                                    totalCount: 1,
                                },
                            ],
                            pageParams: [0],
                        };
                    }

                    // Add the order to the first page
                    const updatedPages = [...oldData.pages];
                    if (updatedPages.length > 0) {
                        updatedPages[0] = {
                            ...updatedPages[0],
                            items: [updatedOrder, ...updatedPages[0].items],
                            totalCount: updatedPages[0].totalCount + 1,
                        };
                    } else {
                        updatedPages.push({
                            items: [updatedOrder],
                            totalCount: 1,
                        });
                    }

                    return {
                        ...oldData,
                        pages: updatedPages,
                    };
                }
            );

            toast.success(t('admin.orders.statusUpdated'));
        },
    });

    const { mutate: updateStatus, isPending: isUpdating } = updateDeliveryStatusMutation;

    const columns = useMemo<KanbanColumn<AdminOrderResponseModel>[]>(() => {
        return DELIVERY_STATUS.map((status, index) => {
            const query = queries[index];
            const items = query.data?.pages.flatMap(page => page.items) ?? [];
            const lastPage = query.data?.pages[query.data.pages.length - 1];
            const totalCount = lastPage?.totalCount ?? 0;
            const loadedCount = query.data?.pages.reduce((acc, page) => acc + page.items.length, 0) ?? 0;
            const hasMore = lastPage ? loadedCount < lastPage.totalCount : false;
            const isLoadingMore = query.isFetchingNextPage;

            return {
                id: status.key,
                title: t(status.label),
                items,
                totalCount,
                hasMore,
                isLoadingMore,
                onLoadMore: () => {
                    if (hasMore && !isLoadingMore) {
                        query.fetchNextPage();
                    }
                },
            };
        });
    }, [queries]);

    const handleItemMove = useCallback(
        (itemId: string, sourceColumnId: string, targetColumnId: string) => {
            if (isUpdating) return;

            updateStatus({ orderId: itemId, deliveryStatus: targetColumnId, sourceColumnId });
        },
        [updateStatus, isUpdating]
    );

    const renderItem = useCallback(
        (order: AdminOrderResponseModel) => {
            return <AdminOrderCard order={order} onOrderClick={onOrderClick} />;
        },
        [onOrderClick]
    );

    if (isInitialLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <Kanban columns={columns} onItemMove={handleItemMove} renderItem={renderItem} getItemId={order => order.id} />
    );
}

export default memo(AdminOrdersKanban);
