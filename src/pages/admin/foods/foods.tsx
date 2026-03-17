import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { adminApi } from '@/apis';
import { GetAdminFoodsResponseModel } from '@/apis/models';
import { PAGE_SIZE, ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import ErrorState from '@/components/error-state';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
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

const DESCRIPTION_MAX_LENGTH = 50;

function truncateDescription(description: string): string {
    if (description.length <= DESCRIPTION_MAX_LENGTH) return description;
    return `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
}

function AdminFoods() {
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
        queryKey: ['admin', 'foods', { page, pageSize: PAGE_SIZE, search, sortBy, sortOrder }] as const,
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
            queryClient.setQueryData<GetAdminFoodsResponseModel>(
                ['admin', 'foods', { page, pageSize: PAGE_SIZE, search, sortBy, sortOrder }] as const,
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

            toast.success('Food deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedFood(null);
        },
    });

    const handleViewClick = useCallback(
        (foodId: string) => {
            navigate(`/${ROUTES.ADMIN.FOOD_DETAIL(foodId)}`);
        },
        [navigate]
    );

    const handleDeleteClick = useCallback((foodId: string, foodName: string) => {
        setSelectedFood({ id: foodId, name: foodName });
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (selectedFood) {
            deleteFoodMutation.mutate(selectedFood.id);
        }
    }, [selectedFood]);

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
                <ErrorState title='Failed to load foods' description='Please try again later.' iconSize='sm' />
            </div>
        );
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='mb-6 px-4 pt-6'>
                <h1 className='text-2xl font-bold'>Foods Management</h1>
                <p className='mt-1 text-sm text-muted-foreground'>Manage all foods in the system</p>
            </div>

            <div className='mb-4 flex flex-wrap items-center gap-4 px-4 justify-between'>
                <div className='max-w-md flex-1'>
                    <InputGroup>
                        <InputGroupInput
                            type='text'
                            placeholder='Search foods by name or keyword...'
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <Button asChild>
                    <Link to={`/${ROUTES.ADMIN.FOOD_ADD}`}>
                        <Plus className='h-4 w-4' />
                        Add Food
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
                                    Name
                                </SortableTableHead>
                                <TableHead className='min-w-[200px]'>Description</TableHead>
                                <SortableTableHead
                                    field='price'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[80px]'
                                >
                                    Price
                                </SortableTableHead>
                                <SortableTableHead
                                    field='discountPrice'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[100px]'
                                >
                                    Discount Price
                                </SortableTableHead>
                                <TableHead className='min-w-[100px]'>Category</TableHead>
                                <TableHead className='min-w-[90px]'>Available</TableHead>
                                <TableHead className='min-w-[80px]'>Stock</TableHead>
                                <TableHead className='min-w-[80px]'>Unit</TableHead>
                                <TableHead className='min-w-[80px] text-right'>Actions</TableHead>
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
                                        <TableCell>${food.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {food.discountPrice != null ? `$${food.discountPrice.toFixed(2)}` : '-'}
                                        </TableCell>
                                        <TableCell>{food.category}</TableCell>
                                        <TableCell>{food.isAvailable ? 'Yes' : 'No'}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleViewClick(food.id)}>
                                                        <Eye className=' h-4 w-4' />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant='destructive'
                                                        onClick={() => handleDeleteClick(food.id, food.name)}
                                                    >
                                                        <Trash2 className=' h-4 w-4' />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className='text-center text-muted-foreground'>
                                        No foods found
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
                        <DialogTitle>Delete Food</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{selectedFood?.name}</strong>? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleConfirmDelete}
                            disabled={deleteFoodMutation.isPending}
                        >
                            {deleteFoodMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminFoods);
