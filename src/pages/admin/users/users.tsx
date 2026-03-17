import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MoreVertical, Search, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { adminApi } from '@/apis';
import { GetAdminUsersResponseModel } from '@/apis/models';
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
import { useAppSelector } from '@/core/hooks/use-redux.hook';

function AdminUsers() {
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
        queryKey: ['admin', 'users', { page, pageSize: PAGE_SIZE, sortBy, sortOrder, search }] as const,
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
            queryClient.setQueryData<GetAdminUsersResponseModel>(
                ['admin', 'users', { page, pageSize: PAGE_SIZE, sortBy, sortOrder, search }] as const,
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

            toast.success('User deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedUser(null);
        },
    });

    const { mutate: deleteUser, isPending: isDeleting } = deleteUserMutation;

    const handleDeleteClick = useCallback((userId: string, userEmail: string) => {
        setSelectedUser({ id: userId, email: userEmail });
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (selectedUser) {
            deleteUser(selectedUser.id);
        }
    }, [selectedUser, deleteUser]);

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
                <ErrorState title='Failed to load users' description='Please try again later.' iconSize='sm' />
            </div>
        );
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='mb-6 px-4 pt-6'>
                <h1 className='text-2xl font-bold'>Users Management</h1>
                <p className='mt-1 text-sm text-muted-foreground'>Manage all users in the system</p>
            </div>

            {/* Search input */}
            <div className='px-4 mb-4 max-w-md'>
                <InputGroup>
                    <InputGroupInput
                        type='text'
                        placeholder='Search users by name, email, or phone...'
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
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
                                    First Name
                                </SortableTableHead>
                                <SortableTableHead
                                    field='lastName'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[120px]'
                                >
                                    Last Name
                                </SortableTableHead>
                                <SortableTableHead
                                    field='email'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[200px]'
                                >
                                    Email
                                </SortableTableHead>
                                <TableHead className='min-w-[140px]'>Phone Number</TableHead>
                                <TableHead className='min-w-[150px]'>Location</TableHead>
                                <SortableTableHead
                                    field='role'
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                    className='min-w-[100px]'
                                >
                                    Role
                                </SortableTableHead>
                                <TableHead className='min-w-[80px] text-right'>Actions</TableHead>
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
                                                            onClick={() => handleDeleteClick(user.id, user.email)}
                                                        >
                                                            <Trash2 className=' h-4 w-4' />
                                                            Delete
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
                                        No users found
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
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete user <strong>{selectedUser?.email}</strong>? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleConfirmDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminUsers);
