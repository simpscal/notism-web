import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import AdminOrderCard from './admin-order-card';

import { ADMIN_QUERY_KEYS, adminApi } from '@/apis';
import type { AdminOrderModel, AdminOrdersModel } from '@/apis';
import { PAGE_SIZE } from '@/app/constants';
import Kanban, { KanbanColumn } from '@/components/kanban';
import Spinner from '@/components/spinner';
import { DELIVERY_STATUS } from '@/features/order';

interface AdminOrdersKanbanProps {
    onOrderClick: (slugId: string) => void;
    paymentStatus?: string;
    /** Delivery-status keys to momentarily emphasise. */
    highlightedStatuses?: string[];
}

function AdminOrdersKanban({ onOrderClick, paymentStatus, highlightedStatuses }: AdminOrdersKanbanProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const placedQuery = useInfiniteQuery({
        queryKey: ADMIN_QUERY_KEYS.ordersKanban(DELIVERY_STATUS[0].key, { paymentStatus }),
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
        queryKey: ADMIN_QUERY_KEYS.ordersKanban(DELIVERY_STATUS[1].key, { paymentStatus }),
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
        queryKey: ADMIN_QUERY_KEYS.ordersKanban(DELIVERY_STATUS[2].key, { paymentStatus }),
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
        queryKey: ADMIN_QUERY_KEYS.ordersKanban(DELIVERY_STATUS[3].key, { paymentStatus }),
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
        onMutate: async ({ orderId, deliveryStatus: targetColumnId, sourceColumnId }) => {
            await queryClient.cancelQueries({ queryKey: ADMIN_QUERY_KEYS.ordersKanbanAll() });

            const sourceKey = ADMIN_QUERY_KEYS.ordersKanban(sourceColumnId, { paymentStatus });
            const targetKey = ADMIN_QUERY_KEYS.ordersKanban(targetColumnId, { paymentStatus });

            const previousSource = queryClient.getQueryData<InfiniteData<AdminOrdersModel>>(sourceKey);
            const previousTarget = queryClient.getQueryData<InfiniteData<AdminOrdersModel>>(targetKey);

            const order = previousSource?.pages.flatMap(p => p.items).find(o => o.id === orderId);
            if (!order) return { previousSource, previousTarget };

            const movedOrder: AdminOrderModel = { ...order, deliveryStatus: targetColumnId };

            queryClient.setQueryData<InfiniteData<AdminOrdersModel>>(
                sourceKey,
                old =>
                    old && {
                        ...old,
                        pages: old.pages.map(p => ({
                            ...p,
                            items: p.items.filter(o => o.id !== orderId),
                            totalCount: p.totalCount - 1,
                        })),
                    }
            );

            queryClient.setQueryData<InfiniteData<AdminOrdersModel>>(targetKey, old =>
                old
                    ? {
                          ...old,
                          pages: [
                              {
                                  ...old.pages[0],
                                  items: [movedOrder, ...old.pages[0].items],
                                  totalCount: old.pages[0].totalCount + 1,
                              },
                              ...old.pages.slice(1),
                          ],
                      }
                    : { pages: [{ items: [movedOrder], totalCount: 1 }], pageParams: [0] }
            );

            return { previousSource, previousTarget };
        },
        onError: (_err, { sourceColumnId, deliveryStatus: targetColumnId }, context) => {
            if (context?.previousSource)
                queryClient.setQueryData(
                    ADMIN_QUERY_KEYS.ordersKanban(sourceColumnId, { paymentStatus }),
                    context.previousSource
                );
            if (context?.previousTarget)
                queryClient.setQueryData(
                    ADMIN_QUERY_KEYS.ordersKanban(targetColumnId, { paymentStatus }),
                    context.previousTarget
                );
        },
        onSettled: (_data, _err, { sourceColumnId, deliveryStatus: targetColumnId }) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.ordersKanbanColumn(sourceColumnId) });
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.ordersKanbanColumn(targetColumnId) });
        },
        onSuccess: () => toast.success(t('admin.orders.statusUpdated')),
    });

    const { mutate: updateStatus, isPending: isUpdating } = updateDeliveryStatusMutation;

    const columns = useMemo<KanbanColumn<AdminOrderModel>[]>(() => {
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
                isHighlighted: highlightedStatuses?.includes(status.key) ?? false,
                onLoadMore: () => {
                    if (hasMore && !isLoadingMore) {
                        query.fetchNextPage();
                    }
                },
            };
        });
    }, [queries, highlightedStatuses]);

    const handleItemMove = useCallback(
        (itemId: string, sourceColumnId: string, targetColumnId: string) => {
            if (isUpdating) return;

            updateStatus({ orderId: itemId, deliveryStatus: targetColumnId, sourceColumnId });
        },
        [updateStatus, isUpdating]
    );

    const renderItem = useCallback(
        (order: AdminOrderModel) => {
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
