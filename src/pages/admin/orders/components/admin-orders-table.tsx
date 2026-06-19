import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, MoreVertical, Search } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { ADMIN_QUERY_KEYS, adminApi } from '@/apis';
import type { AdminOrdersModel } from '@/apis';
import { PAGE_SIZE, ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import { Button } from '@/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import ErrorState from '@/components/error-state';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import Spinner from '@/components/spinner';
import {
    SortableTableHead,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TablePagination,
    useTableSort,
} from '@/components/table';
import { DELIVERY_STATUS, PaymentStatusBadge, PaymentStatusEnum } from '@/features/order';

const EMPTY_STATE_COL_SPAN = 8;

interface AdminOrdersTableProps {
    onOrderClick: (slugId: string) => void;
    paymentStatus?: string;
}

function AdminOrdersTable({ onOrderClick, paymentStatus }: AdminOrdersTableProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const { sortBy, sortOrder, handleSort } = useTableSort<string>(() => setPage(1));

    useEffect(() => {
        setPage(1);
    }, [paymentStatus]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const {
        data: ordersData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ADMIN_QUERY_KEYS.ordersTable({ page, pageSize: PAGE_SIZE, sortBy, sortOrder, search, paymentStatus }),
        queryFn: () =>
            adminApi.getOrdersForTable({
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
                sortBy,
                sortOrder,
                keyword: search || undefined,
                paymentStatus,
            }),
        placeholderData: keepPreviousData,
    });

    const orders = ordersData?.items || [];
    const totalCount = ordersData?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const updateDeliveryStatusMutation = useMutation({
        mutationFn: ({ orderId, deliveryStatus }: { orderId: string; deliveryStatus: string }) =>
            adminApi.updateOrderDeliveryStatus(orderId, { deliveryStatus }),
        onSuccess: updatedOrder => {
            // Update table view cache
            queryClient.setQueryData<AdminOrdersModel>(
                ADMIN_QUERY_KEYS.ordersTable({ page, pageSize: PAGE_SIZE, sortBy, sortOrder, search, paymentStatus }),
                oldData => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        items: oldData.items.map(order => (order.id === updatedOrder.id ? updatedOrder : order)),
                    };
                }
            );
            toast.success(t('admin.orders.statusUpdated'));
        },
    });

    const { mutate: updateStatus, isPending: isUpdating } = updateDeliveryStatusMutation;

    const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    }, []);

    const handleStatusChange = useCallback(
        (orderId: string) => (newStatus: string) => {
            updateStatus({ orderId, deliveryStatus: newStatus });
        },
        [updateStatus]
    );

    const handleViewClick = useCallback(
        (slugId: string) => () => {
            onOrderClick(slugId);
        },
        [onOrderClick]
    );

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (isError) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <ErrorState
                    title={t('admin.orders.failedToLoad')}
                    description={t('common.tryAgainLater')}
                    iconSize='sm'
                />
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            {/* Search input */}
            <div className='mb-4 max-w-md'>
                <InputGroup>
                    <InputGroupInput
                        type='text'
                        placeholder={t('orders.searchPlaceholder')}
                        value={searchInput}
                        onChange={handleSearchInputChange}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Orders table */}
            <div className='rounded-md border overflow-auto flex-1 min-h-0 flex flex-col'>
                <Table className={orders.length === 0 ? 'h-full' : undefined}>
                    <TableHeader>
                        <TableRow>
                            <SortableTableHead
                                field='slugId'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[120px]'
                            >
                                {t('orders.orderId')}
                            </SortableTableHead>
                            <SortableTableHead
                                field='userName'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[150px]'
                            >
                                {t('admin.orders.customer')}
                            </SortableTableHead>
                            <SortableTableHead
                                field='userEmail'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[200px]'
                            >
                                {t('auth.email')}
                            </SortableTableHead>
                            <SortableTableHead
                                field='totalAmount'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[100px]'
                            >
                                {t('orders.total')}
                            </SortableTableHead>
                            <TableHead className='min-w-[80px]'>{t('orders.items')}</TableHead>
                            <TableHead className='min-w-[150px]'>{t('orders.status')}</TableHead>
                            <TableHead className='min-w-[140px]'>Payment</TableHead>
                            <TableHead className='min-w-[120px] text-right'>{t('orders.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={orders.length === 0 ? 'h-full' : undefined}>
                        {orders.length > 0 ? (
                            orders.map(order => {
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className='font-medium'>
                                            <Link
                                                to={`/${ROUTES.ADMIN.ORDER_DETAIL(order.slugId)}`}
                                                className='text-primary underline-offset-4 hover:underline'
                                            >
                                                #{order.slugId}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{order.userName}</TableCell>
                                        <TableCell>{order.userEmail}</TableCell>
                                        <TableCell className='font-semibold'>{formatVnd(order.totalAmount)}</TableCell>
                                        <TableCell>{order.totalItems}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.deliveryStatus}
                                                onValueChange={handleStatusChange(order.id)}
                                                disabled={isUpdating}
                                            >
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DELIVERY_STATUS.map(status => (
                                                        <SelectItem key={status.key} value={status.key}>
                                                            {t(status.label)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <PaymentStatusBadge
                                                paymentStatus={order.paymentStatus as PaymentStatusEnum}
                                            />
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant='ghost' size='icon-sm' className='h-8 w-8'>
                                                        <MoreVertical className='h-4 w-4' />
                                                        <span className='sr-only'>Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='end'>
                                                    <DropdownMenuItem onClick={handleViewClick(order.slugId)}>
                                                        <Eye className='h-4 w-4' />
                                                        {t('common.view')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={EMPTY_STATE_COL_SPAN} className='text-center text-muted-foreground'>
                                    {t('orders.noOrders')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

export default memo(AdminOrdersTable);
