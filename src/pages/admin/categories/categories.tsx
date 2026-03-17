import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { adminApi } from '@/apis';
import { GetAdminCategoriesResponseModel } from '@/apis/models';
import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import ErrorState from '@/components/error-state';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
import Spinner from '@/components/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { useAppDispatch } from '@/core/hooks';
import { removeCategory } from '@/store/food';

function AdminCategories() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(null);
    const [search, setSearch] = useState('');

    const {
        data: categoriesData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['admin', 'categories'] as const,
        queryFn: () => adminApi.getCategories(),
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (categoryId: string) => adminApi.deleteCategory(categoryId),
        onSuccess: (_, categoryId) => {
            queryClient.setQueryData<GetAdminCategoriesResponseModel>(['admin', 'categories'] as const, oldData => {
                if (!oldData) return oldData;
                const updatedItems = oldData.items.filter(c => c.id !== categoryId);
                return {
                    ...oldData,
                    items: updatedItems,
                };
            });
            dispatch(removeCategory(categoryId));
            toast.success('Category deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedCategory(null);
        },
    });

    const handleViewClick = useCallback(
        (categoryId: string) => {
            navigate(`/${ROUTES.ADMIN.CATEGORY_DETAIL(categoryId)}`);
        },
        [navigate]
    );

    const handleDeleteClick = useCallback((categoryId: string, categoryName: string) => {
        setSelectedCategory({ id: categoryId, name: categoryName });
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (selectedCategory) {
            deleteCategoryMutation.mutate(selectedCategory.id);
        }
    }, [selectedCategory]);

    const filteredCategories = useMemo(() => {
        const items = categoriesData?.items ?? [];
        if (!search.trim()) return items;
        const term = search.trim().toLowerCase();
        return items.filter(c => c.name.toLowerCase().includes(term));
    }, [categoriesData?.items, search]);

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
                <ErrorState title='Failed to load categories' description='Please try again later.' iconSize='sm' />
            </div>
        );
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='mb-6 px-4 pt-6'>
                <h1 className='text-2xl font-bold'>Categories Management</h1>
                <p className='mt-1 text-sm text-muted-foreground'>Manage all food categories in the system</p>
            </div>

            <div className='mb-4 flex flex-wrap items-center justify-between gap-4 px-4'>
                <InputGroup className='max-w-sm'>
                    <InputGroupInput
                        type='search'
                        aria-label='Search categories'
                        placeholder='Search categories by name...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <InputGroupAddon>
                        <Search className='size-4' />
                    </InputGroupAddon>
                </InputGroup>
                <Button asChild>
                    <Link to={`/${ROUTES.ADMIN.CATEGORY_ADD}`}>
                        <Plus className='h-4 w-4' />
                        Add Category
                    </Link>
                </Button>
            </div>

            <div className='flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-6'>
                <div className='flex min-h-0 flex-1 flex-col overflow-auto rounded-md border'>
                    <Table className={!filteredCategories.length ? 'h-full' : undefined}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='min-w-[200px]'>Name</TableHead>
                                <TableHead className='min-w-[80px] text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className={!filteredCategories.length ? 'h-full' : undefined}>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(category => (
                                    <TableRow key={category.id}>
                                        <TableCell className='font-medium'>
                                            <Link
                                                to={`/${ROUTES.ADMIN.CATEGORY_DETAIL(category.id)}`}
                                                className='text-primary underline-offset-4 hover:underline'
                                            >
                                                {category.name}
                                            </Link>
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
                                                    <DropdownMenuItem onClick={() => handleViewClick(category.id)}>
                                                        <Eye className='h-4 w-4' />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant='destructive'
                                                        onClick={() => handleDeleteClick(category.id, category.name)}
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className='text-center text-muted-foreground'>
                                        {search.trim() ? 'No categories match your search' : 'No categories found'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{selectedCategory?.name}</strong>? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleConfirmDelete}
                            disabled={deleteCategoryMutation.isPending}
                        >
                            {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminCategories);
