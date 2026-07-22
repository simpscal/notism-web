import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MoreVertical, Search, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PatternFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { ADMIN_QUERY_KEYS, adminApi } from '@/apis';
import type { AdminUsersModel } from '@/apis';
import { PAGE_SIZE, ROUTES } from '@/app/constants';
import { useAppSelector } from '@/core/hooks/use-redux.hook';
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

function AdminUsers() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const { sortBy, sortOrder, handleSort } = useTableSort<string>(() => setPage(1));

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);
    const currentUser = useAppSelector(state => state.user.user);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const {
        data: usersData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ADMIN_QUERY_KEYS.users({ page, pageSize: PAGE_SIZE, sortBy, sortOrder, search }),
        queryFn: () =>
            adminApi.getUsers({
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
                sortBy,
                sortOrder,
                keyword: search || undefined,
            }),
        placeholderData: keepPreviousData,
    });

    const deleteUserMutation = useMutation({
        mutationFn: (userId: string) => adminApi.deleteUser(userId),
        onSuccess: (_, userId) => {
            // Remove the user from the cache
            queryClient.setQueryData<AdminUsersModel>(
                ADMIN_QUERY_KEYS.users({ page, pageSize: PAGE_SIZE, sortBy, sortOrder, search }),
                oldData => {
                    if (!oldData) return oldData;

                    const updatedItems = oldData.items.filter(user => user.id !== userId);
                    const updatedTotalCount = oldData.totalCount - 1;

                    // If current page becomes empty and it's not the first page, navigate to previous page
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

            toast.success(t('admin.users.deletedSuccess'));
            setDeleteDialogOpen(false);
            setSelectedUser(null);
        },
    });

    const { mutate: deleteUser, isPending: isDeleting } = deleteUserMutation;

    const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    }, []);

    const handleDeleteClick = useCallback(
        (userId: string, userEmail: string) => () => {
            setSelectedUser({ id: userId, email: userEmail });
            setDeleteDialogOpen(true);
        },
        []
    );

    const handleConfirmDelete = useCallback(() => {
        if (selectedUser) {
            deleteUser(selectedUser.id);
        }
    }, [selectedUser, deleteUser]);

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
                    title={t('admin.users.failedToLoad')}
                    description={t('common.tryAgainLater')}
                    iconSize='sm'
                />
            </div>
        );
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='mb-6 px-4 pt-6'>
                <h1 className='text-2xl font-bold'>{t('admin.users.management')}</h1>
                <p className='mt-1 text-sm text-muted-foreground'>{t('admin.users.subtitle')}</p>
            </div>

            {/* Search input */}
            <div className='px-4 mb-4 max-w-md'>
                <InputGroup>
                    <InputGroupInput
                        type='text'
                        placeholder={t('admin.users.searchPlaceholder')}
                        value={searchInput}
                        onChange={handleSearchInputChange}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Users table */}
            <div className='flex-1 overflow-hidden px-4 pb-6 min-h-0 flex flex-col'>
                <div className='rounded-md border overflow-auto flex-1 min-h-0 flex flex-col'>
                    <Table className={!usersData?.items?.length ? 'h-full' : undefined}>
                        <TableHeader>
                            <TableRow>
                                <SortableTableHead
                                    field='firstName'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[120px]'
                                >
                                    {t('admin.users.firstName')}
                                </SortableTableHead>
                                <SortableTableHead
                                    field='lastName'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[120px]'
                                >
                                    {t('admin.users.lastName')}
                                </SortableTableHead>
                                <SortableTableHead
                                    field='email'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[200px]'
                                >
                                    {t('admin.users.email')}
                                </SortableTableHead>
                                <TableHead className='min-w-[140px]'>{t('admin.users.phoneNumber')}</TableHead>
                                <TableHead className='min-w-[150px]'>{t('admin.users.location')}</TableHead>
                                <SortableTableHead
                                    field='role'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[100px]'
                                >
                                    {t('admin.users.role')}
                                </SortableTableHead>
                                <TableHead className='min-w-[80px] text-right'>{t('admin.users.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className={!usersData?.items?.length ? 'h-full' : undefined}>
                            {usersData && usersData.items.length > 0 ? (
                                usersData.items.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className='font-medium'>
                                            <Link
                                                to={`/${ROUTES.ADMIN.USER_DETAIL(user.id)}`}
                                                className='text-primary underline-offset-4 hover:underline'
                                            >
                                                {user.firstName}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.phoneNumber ? (
                                                <PatternFormat
                                                    value={user.phoneNumber}
                                                    format='(###) ###-####'
                                                    displayType='text'
                                                    mask='_'
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>{user.location || '-'}</TableCell>
                                        <TableCell className='capitalize'>{user.role}</TableCell>
                                        <TableCell className='text-right'>
                                            {user.id !== currentUser?.id ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant='ghost' size='icon-sm' className='h-8 w-8'>
                                                            <MoreVertical className='h-4 w-4' />
                                                            <span className='sr-only'>Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align='end'>
                                                        <DropdownMenuItem
                                                            variant='destructive'
                                                            onClick={handleDeleteClick(user.id, user.email)}
                                                        >
                                                            <Trash2 className=' h-4 w-4' />
                                                            {t('common.delete')}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center text-muted-foreground'>
                                        {t('admin.users.noUsers')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {usersData && (
                <TablePagination
                    page={page}
                    totalPages={Math.ceil(usersData.totalCount / PAGE_SIZE)}
                    onPageChange={setPage}
                />
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('admin.users.deleteUser')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.users.deleteUserConfirm', { email: selectedUser?.email })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCloseDeleteDialog}>
                            {t('common.cancel')}
                        </Button>
                        <Button variant='destructive' onClick={handleConfirmDelete} disabled={isDeleting}>
                            {isDeleting ? t('common.deleting') : t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminUsers);
