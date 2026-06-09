import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, type ControllerRenderProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
            toast.success(t('admin.user.updated'));
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: (userId: string) => adminApi.deleteUser(userId),
        onSuccess: () => {
            toast.success(t('admin.user.deleted'));
            setDeleteDialogOpen(false);
            navigate(`/${ROUTES.ADMIN.USERS}`);
        },
    });

    const { mutate: updateUser } = updateUserMutation;
    const { mutate: deleteUser } = deleteUserMutation;

    const createdDate = useMemo(() => {
        if (!user) return '';
        return new Date(user.createdAt).toLocaleDateString(i18next.language === 'vi' ? 'vi-VN' : 'en-US', {
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

    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
    }, []);

    const renderRoleField = useCallback(
        ({ field }: { field: ControllerRenderProps<UserDetailFormValues, 'role'> }) => (
            <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isViewingSelf}
                aria-invalid={!!form.formState.errors.role}
            >
                <SelectTrigger className='w-full' disabled={isViewingSelf}>
                    <SelectValue placeholder={t('admin.user.selectRole')} />
                </SelectTrigger>
                <SelectContent>
                    {USER_ROLE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        ),
        [isViewingSelf, form.formState.errors.role, t]
    );

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
                        {t('common.back')}
                    </Link>
                </Button>
                <ErrorState
                    title={t('admin.user.failedToLoad')}
                    description={t('admin.user.tryAgainOrGoBack')}
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.ADMIN.USERS}`}>{t('common.back')}</Link>
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
                    {t('common.back')}
                </Link>
            </Button>

            <div className='mx-auto max-w-4xl space-y-6'>
                <div className='grid gap-6 lg:grid-cols-3'>
                    <div className='space-y-6 lg:col-span-2'>
                        <FormProvider {...form}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('admin.user.details')}</CardTitle>
                                    <CardDescription>{t('admin.user.viewInfoDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                                        <div className='space-y-2'>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>{t('auth.firstName')}</span>
                                                <span className='font-medium'>{user.firstName}</span>
                                            </div>
                                            <Separator />
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>{t('auth.lastName')}</span>
                                                <span className='font-medium'>{user.lastName}</span>
                                            </div>
                                            <Separator />
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>{t('auth.email')}</span>
                                                <span className='font-medium'>{user.email}</span>
                                            </div>
                                            <Separator />
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>
                                                    {t('admin.user.phoneNumber')}
                                                </span>
                                                <span className='font-medium'>{user.phoneNumber || '-'}</span>
                                            </div>
                                            <Separator />
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>
                                                    {t('admin.user.location')}
                                                </span>
                                                <span className='font-medium'>{user.location || '-'}</span>
                                            </div>
                                            <Separator />
                                        </div>
                                        <Field>
                                            <FieldLabel>{t('admin.user.role')}</FieldLabel>
                                            <Controller control={form.control} name='role' render={renderRoleField} />
                                            {form.formState.errors.role && (
                                                <FieldError>{form.formState.errors.role.message}</FieldError>
                                            )}
                                        </Field>
                                        <div className='text-sm text-muted-foreground'>
                                            {t('admin.user.createdAt')} {createdDate}
                                        </div>
                                        {!isViewingSelf && (
                                            <div className='flex gap-4'>
                                                <Button
                                                    type='submit'
                                                    disabled={!form.formState.isDirty || updateUserMutation.isPending}
                                                >
                                                    {updateUserMutation.isPending
                                                        ? t('common.saving')
                                                        : t('common.save')}
                                                </Button>
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={handleDeleteClick}
                                                    disabled={deleteUserMutation.isPending}
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                    {t('admin.user.deleteUser')}
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
                        <DialogTitle>{t('admin.user.deleteUser')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.user.deleteConfirmation', { email: user.email })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCloseDeleteDialog}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleConfirmDelete}
                            disabled={deleteUserMutation.isPending}
                        >
                            {deleteUserMutation.isPending ? t('common.deleting') : t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminUserDetail);
