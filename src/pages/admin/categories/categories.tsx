import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ADMIN_QUERY_KEYS, adminApi } from '@/apis';
import type { AdminCategoriesModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch } from '@/core/hooks';
import { removeCategory } from '@/features/food/store';
import { Button } from '@/uis/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/uis/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/uis/dropdown-menu';
import ErrorState from '@/uis/error-state';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/uis/input-group';
import Spinner from '@/uis/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/uis/table';

function AdminCategories() {
    const { t } = useTranslation();
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
        queryKey: ADMIN_QUERY_KEYS.categories(),
        queryFn: () => adminApi.getCategories(),
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (categoryId: string) => adminApi.deleteCategory(categoryId),
        onSuccess: (_, categoryId) => {
            queryClient.setQueryData<AdminCategoriesModel>(ADMIN_QUERY_KEYS.categories(), oldData => {
                if (!oldData) return oldData;
                const updatedItems = oldData.items.filter(c => c.id !== categoryId);
                return {
                    ...oldData,
                    items: updatedItems,
                };
            });
            dispatch(removeCategory(categoryId));
            toast.success(t('admin.categories.deletedSuccess'));
            setDeleteDialogOpen(false);
            setSelectedCategory(null);
        },
    });

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, []);

    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
    }, []);

    const handleViewClick = useCallback(
        (categoryId: string) => () => {
            navigate(`/${ROUTES.ADMIN.CATEGORY_DETAIL(categoryId)}`);
        },
        [navigate]
    );

    const handleDeleteClick = useCallback(
        (categoryId: string, categoryName: string) => () => {
            setSelectedCategory({ id: categoryId, name: categoryName });
            setDeleteDialogOpen(true);
        },
        []
    );

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
                <ErrorState
                    title={t('admin.categories.failedToLoad')}
                    description={t('common.tryAgainLater')}
                    iconSize='sm'
                />
            </div>
        );
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='mb-6 px-4 pt-6'>
                <h1 className='text-2xl font-bold'>{t('admin.categories.management')}</h1>
                <p className='mt-1 text-sm text-muted-foreground'>{t('admin.categories.subtitle')}</p>
            </div>

            <div className='mb-4 flex flex-wrap items-center justify-between gap-4 px-4'>
                <InputGroup className='max-w-sm'>
                    <InputGroupInput
                        type='search'
                        aria-label='Search categories'
                        placeholder={t('admin.categories.searchPlaceholder')}
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <InputGroupAddon>
                        <Search className='size-4' />
                    </InputGroupAddon>
                </InputGroup>
                <Button asChild>
                    <Link to={`/${ROUTES.ADMIN.CATEGORY_ADD}`}>
                        <Plus className='h-4 w-4' />
                        {t('admin.categories.addCategory')}
                    </Link>
                </Button>
            </div>

            <div className='flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-6'>
                <div className='flex min-h-0 flex-1 flex-col overflow-auto rounded-md border'>
                    <Table className={!filteredCategories.length ? 'h-full' : undefined}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='min-w-[200px]'>{t('admin.categories.name')}</TableHead>
                                <TableHead className='min-w-[80px] text-right'>
                                    {t('admin.categories.actions')}
                                </TableHead>
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
                                                    <DropdownMenuItem onClick={handleViewClick(category.id)}>
                                                        <Eye className='h-4 w-4' />
                                                        {t('common.view')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant='destructive'
                                                        onClick={handleDeleteClick(category.id, category.name)}
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                        {t('common.delete')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className='text-center text-muted-foreground'>
                                        {search.trim()
                                            ? t('admin.categories.noMatch')
                                            : t('admin.categories.noCategories')}
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
                        <DialogTitle>{t('admin.categories.deleteCategory')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.categories.deleteCategoryConfirm', { name: selectedCategory?.name })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCloseDeleteDialog}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleConfirmDelete}
                            disabled={deleteCategoryMutation.isPending}
                        >
                            {deleteCategoryMutation.isPending ? t('common.deleting') : t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminCategories);
