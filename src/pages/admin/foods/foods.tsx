import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ADMIN_QUERY_KEYS, adminApi } from '@/apis';
import type { AdminFoodsModel } from '@/apis';
import { PAGE_SIZE, ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import { Button } from '@/uis/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/uis/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/uis/dropdown-menu';
import ErrorState from '@/uis/error-state';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/uis/input-group';
import Spinner from '@/uis/spinner';
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
} from '@/uis/table';

const DESCRIPTION_MAX_LENGTH = 50;

function truncateDescription(description: string): string {
    if (description.length <= DESCRIPTION_MAX_LENGTH) return description;
    return `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
}

function AdminFoods() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const { sortBy, sortOrder, handleSort } = useTableSort<string>(() => setPage(1));

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const {
        data: foodsData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ADMIN_QUERY_KEYS.foods({ page, pageSize: PAGE_SIZE, search, sortBy, sortOrder }),
        queryFn: () =>
            adminApi.getFoods({
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
                keyword: search || undefined,
                sortBy,
                sortOrder,
            }),
        placeholderData: keepPreviousData,
    });

    const deleteFoodMutation = useMutation({
        mutationFn: (foodId: string) => adminApi.deleteFood(foodId),
        onSuccess: (_, foodId) => {
            queryClient.setQueryData<AdminFoodsModel>(
                ADMIN_QUERY_KEYS.foods({ page, pageSize: PAGE_SIZE, search, sortBy, sortOrder }),
                oldData => {
                    if (!oldData) return oldData;

                    const updatedItems = oldData.items.filter(food => food.id !== foodId);
                    const updatedTotalCount = oldData.totalCount - 1;

                    if (updatedItems.length === 0 && page > 1) {
                        setPage(page - 1);
                    }

                    return {
                        ...oldData,
                        items: updatedItems,
                        totalCount: updatedTotalCount,
                    };
                }
            );

            toast.success(t('admin.foods.deletedSuccess'));
            setDeleteDialogOpen(false);
            setSelectedFood(null);
        },
    });

    const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    }, []);

    const handleViewClick = useCallback(
        (foodId: string) => () => {
            navigate(`/${ROUTES.ADMIN.FOOD_DETAIL(foodId)}`);
        },
        [navigate]
    );

    const handleDeleteClick = useCallback(
        (foodId: string, foodName: string) => () => {
            setSelectedFood({ id: foodId, name: foodName });
            setDeleteDialogOpen(true);
        },
        []
    );

    const handleConfirmDelete = useCallback(() => {
        if (selectedFood) {
            deleteFoodMutation.mutate(selectedFood.id);
        }
    }, [selectedFood]);

    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
    }, []);

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
                    title={t('admin.foods.failedToLoad')}
                    description={t('common.tryAgainLater')}
                    iconSize='sm'
                />
            </div>
        );
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='mb-6 px-4 pt-6'>
                <h1 className='text-2xl font-bold'>{t('admin.foods.management')}</h1>
                <p className='mt-1 text-sm text-muted-foreground'>{t('admin.foods.subtitle')}</p>
            </div>

            <div className='mb-4 flex flex-wrap items-center gap-4 px-4 justify-between'>
                <div className='max-w-md flex-1'>
                    <InputGroup>
                        <InputGroupInput
                            type='text'
                            placeholder={t('admin.foods.searchPlaceholder')}
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <Button asChild>
                    <Link to={`/${ROUTES.ADMIN.FOOD_ADD}`}>
                        <Plus className='h-4 w-4' />
                        {t('admin.foods.addFood')}
                    </Link>
                </Button>
            </div>

            <div className='flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-6'>
                <div className='flex min-h-0 flex-1 flex-col overflow-auto rounded-md border'>
                    <Table className={!foodsData?.items?.length ? 'h-full' : undefined}>
                        <TableHeader>
                            <TableRow>
                                <SortableTableHead
                                    field='name'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[160px]'
                                >
                                    {t('admin.foods.name')}
                                </SortableTableHead>
                                <TableHead className='min-w-[200px]'>{t('admin.foods.description')}</TableHead>
                                <SortableTableHead
                                    field='price'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[80px]'
                                >
                                    {t('admin.foods.price')}
                                </SortableTableHead>
                                <SortableTableHead
                                    field='discountPrice'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[100px]'
                                >
                                    {t('admin.foods.discountPrice')}
                                </SortableTableHead>
                                <TableHead className='min-w-[100px]'>{t('admin.foods.category')}</TableHead>
                                <TableHead className='min-w-[90px]'>{t('admin.foods.available')}</TableHead>
                                <TableHead className='min-w-[80px]'>{t('admin.foods.stock')}</TableHead>
                                <TableHead className='min-w-[80px]'>{t('admin.foods.unit')}</TableHead>
                                <TableHead className='min-w-[80px] text-right'>{t('admin.foods.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className={!foodsData?.items?.length ? 'h-full' : undefined}>
                            {foodsData && foodsData.items.length > 0 ? (
                                foodsData.items.map(food => (
                                    <TableRow key={food.id}>
                                        <TableCell className='font-medium'>
                                            <Link
                                                to={`/${ROUTES.ADMIN.FOOD_DETAIL(food.id)}`}
                                                className='text-primary underline-offset-4 hover:underline'
                                            >
                                                {food.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className='max-w-[200px] truncate' title={food.description}>
                                            {truncateDescription(food.description)}
                                        </TableCell>
                                        <TableCell>{formatVnd(food.price)}</TableCell>
                                        <TableCell>
                                            {food.discountPrice != null ? formatVnd(food.discountPrice) : '-'}
                                        </TableCell>
                                        <TableCell>{food.category}</TableCell>
                                        <TableCell>
                                            {food.isAvailable ? t('admin.foods.yes') : t('admin.foods.no')}
                                        </TableCell>
                                        <TableCell>{food.stockQuantity}</TableCell>
                                        <TableCell>{food.quantityUnit}</TableCell>
                                        <TableCell className='text-right'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant='ghost' size='icon-sm' className='h-8 w-8'>
                                                        <MoreVertical className='h-4 w-4' />
                                                        <span className='sr-only'>Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='end'>
                                                    <DropdownMenuItem onClick={handleViewClick(food.id)}>
                                                        <Eye className=' h-4 w-4' />
                                                        {t('common.view')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant='destructive'
                                                        onClick={handleDeleteClick(food.id, food.name)}
                                                    >
                                                        <Trash2 className=' h-4 w-4' />
                                                        {t('common.delete')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className='text-center text-muted-foreground'>
                                        {t('admin.foods.noFoods')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {foodsData && (
                <TablePagination
                    page={page}
                    totalPages={Math.ceil(foodsData.totalCount / PAGE_SIZE) || 1}
                    onPageChange={setPage}
                />
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('admin.foods.deleteFood')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.foods.deleteFoodConfirm', { name: selectedFood?.name })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCloseDeleteDialog}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleConfirmDelete}
                            disabled={deleteFoodMutation.isPending}
                        >
                            {deleteFoodMutation.isPending ? t('common.deleting') : t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminFoods);
