import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import {
    getDefaultUserDetailFormValues,
    userDetailFormSchema,
    USER_ROLE_OPTIONS,
    userDetailFormValuesToRequest,
    type UserDetailFormValues,
} from './models';

import { adminApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import ErrorState from '@/components/error-state';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { useAppSelector } from '@/core/hooks/use-redux.hook';

function AdminUserDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const currentUser = useAppSelector(state => state.user.user);

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['admin', 'users', 'detail', id] as const,
        queryFn: () => adminApi.getUserById(id!),
        enabled: !!id,
    });

    const form = useForm<UserDetailFormValues>({
        resolver: zodResolver(userDetailFormSchema),
        mode: 'onChange',
        defaultValues: getDefaultUserDetailFormValues(user ?? null),
    });

    useEffect(() => {
        if (user) {
            form.reset(getDefaultUserDetailFormValues(user));
        }
    }, [user, form]);

    const isViewingSelf = Boolean(user && currentUser && user.id === currentUser.id);

    const updateUserMutation = useMutation({
        mutationFn: (values: UserDetailFormValues) => adminApi.updateUser(id!, userDetailFormValuesToRequest(values)),
        onSuccess: updated => {
            queryClient.setQueryData(['admin', 'users', 'detail', id], updated);
            form.reset(getDefaultUserDetailFormValues(updated));
            toast.success('User updated successfully');
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: (userId: string) => adminApi.deleteUser(userId),
        onSuccess: () => {
            toast.success('User deleted successfully');
            setDeleteDialogOpen(false);
            navigate(`/${ROUTES.ADMIN.USERS}`);
        },
    });

    const { mutate: updateUser } = updateUserMutation;
    const { mutate: deleteUser } = deleteUserMutation;

    const createdDate = useMemo(() => {
        if (!user) return '';
        return new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [user]);

    const handleSubmit = useCallback(
        (values: UserDetailFormValues) => {
            updateUser(values);
        },
        [updateUser]
    );

    const handleDeleteClick = useCallback(() => {
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (user) {
            deleteUser(user.id);
        }
    }, [user, deleteUser]);

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.ADMIN.USERS}`}>
                        <ArrowLeft className='h-4 w-4' />
                        Back to Users
                    </Link>
                </Button>
                <ErrorState
                    title='Failed to load user details'
                    description='Please try again later or go back to the users list.'
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.ADMIN.USERS}`}>Back to Users</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ADMIN.USERS}`}>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Users
                </Link>
            </Button>

            <div className='mx-auto max-w-4xl space-y-6'>
                <div className='grid gap-6 lg:grid-cols-3'>
                    <div className='space-y-6 lg:col-span-2'>
                        <FormProvider {...form}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Details</CardTitle>
                                    <CardDescription>
                                        View user information. Only the role can be updated.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                                        <div className='space-y-2'>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>First name</span>
                                                <span className='font-medium'>{user.firstName}</span>
                                            </div>
                                            <Separator />
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Last name</span>
                                                <span className='font-medium'>{user.lastName}</span>
                                            </div>
                                            <Separator />
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Email</span>
                                                <span className='font-medium'>{user.email}</span>
                                            </div>
                                            <Separator />
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Phone number</span>
                                                <span className='font-medium'>{user.phoneNumber || '-'}</span>
                                            </div>
                                            <Separator />
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Location</span>
                                                <span className='font-medium'>{user.location || '-'}</span>
                                            </div>
                                            <Separator />
                                        </div>
                                        <Field>
                                            <FieldLabel>Role</FieldLabel>
                                            <Controller
                                                control={form.control}
                                                name='role'
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={isViewingSelf}
                                                        aria-invalid={!!form.formState.errors.role}
                                                    >
                                                        <SelectTrigger className='w-full' disabled={isViewingSelf}>
                                                            <SelectValue placeholder='Select role' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {USER_ROLE_OPTIONS.map(opt => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {form.formState.errors.role && (
                                                <FieldError>{form.formState.errors.role.message}</FieldError>
                                            )}
                                        </Field>
                                        <div className='text-sm text-muted-foreground'>Created at {createdDate}</div>
                                        {!isViewingSelf && (
                                            <div className='flex gap-4'>
                                                <Button
                                                    type='submit'
                                                    disabled={!form.formState.isDirty || updateUserMutation.isPending}
                                                >
                                                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={handleDeleteClick}
                                                    disabled={deleteUserMutation.isPending}
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                    Delete User
                                                </Button>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </FormProvider>
                    </div>
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete user <strong>{user.email}</strong>? This action cannot be
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
                            disabled={deleteUserMutation.isPending}
                        >
                            {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminUserDetail);
