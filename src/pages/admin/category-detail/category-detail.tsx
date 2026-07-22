import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import {
    categoryDetailFormSchema,
    getDefaultCategoryDetailFormValues,
    categoryDetailFormValuesToRequest,
    type CategoryDetailFormValues,
} from './models';

import { ADMIN_QUERY_KEYS, adminApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch } from '@/core/hooks';
import { addCategory, removeCategory, updateCategory } from '@/store/food';
import { Button } from '@/uis/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/uis/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/uis/dialog';
import ErrorState from '@/uis/error-state';
import { Field, FieldError, FieldLabel } from '@/uis/field';
import { Input } from '@/uis/input';
import Spinner from '@/uis/spinner';

function AdminCategoryDetail() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const isAddMode = !id || id === 'new';

    const {
        data: category,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ADMIN_QUERY_KEYS.categoryDetail(id ?? ''),
        queryFn: () => adminApi.getCategoryById(id!),
        enabled: !!id && !isAddMode,
    });

    const form = useForm<CategoryDetailFormValues>({
        resolver: zodResolver(categoryDetailFormSchema),
        mode: 'onChange',
        defaultValues: getDefaultCategoryDetailFormValues(category ?? null),
    });

    useEffect(() => {
        if (category) {
            form.reset(getDefaultCategoryDetailFormValues(category));
        } else if (isAddMode) {
            form.reset(getDefaultCategoryDetailFormValues(null));
        }
    }, [category, isAddMode, form]);

    const createCategoryMutation = useMutation({
        mutationFn: (data: CategoryDetailFormValues) =>
            adminApi.createCategory(categoryDetailFormValuesToRequest(data)),
        onSuccess: created => {
            dispatch(addCategory(created));
            toast.success(t('admin.categories.createdSuccess'));
            navigate(`/${ROUTES.ADMIN.CATEGORY_DETAIL(created.id)}`);
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: (values: CategoryDetailFormValues) =>
            adminApi.updateCategory(id!, categoryDetailFormValuesToRequest(values)),
        onSuccess: updated => {
            queryClient.setQueryData(ADMIN_QUERY_KEYS.categoryDetail(id ?? ''), updated);
            dispatch(updateCategory(updated));
            form.reset(getDefaultCategoryDetailFormValues(updated));
            toast.success(t('admin.categories.updatedSuccess'));
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (categoryId: string) => adminApi.deleteCategory(categoryId),
        onSuccess: (_, categoryId) => {
            dispatch(removeCategory(categoryId));
            toast.success(t('admin.categories.deletedSuccess'));
            setDeleteDialogOpen(false);
            navigate(`/${ROUTES.ADMIN.CATEGORIES}`);
        },
    });

    const handleSubmit = useCallback(
        (values: CategoryDetailFormValues) => {
            if (isAddMode) {
                createCategoryMutation.mutate(values);
            } else {
                updateCategoryMutation.mutate(values);
            }
        },
        [isAddMode]
    );

    const handleDeleteClick = useCallback(() => {
        setDeleteDialogOpen(true);
    }, []);

    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (id && !isAddMode) {
            deleteCategoryMutation.mutate(id);
        }
    }, [id, isAddMode]);

    if (!isAddMode && isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (!isAddMode && (isError || (!category && !isLoading))) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.ADMIN.CATEGORIES}`}>
                        <ArrowLeft className='h-4 w-4' />
                        Back to Categories
                    </Link>
                </Button>
                <ErrorState
                    title='Failed to load category'
                    description='Please try again later or go back to the categories list.'
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.ADMIN.CATEGORIES}`}>Back to Categories</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    const isPending = createCategoryMutation.isPending || updateCategoryMutation.isPending;

    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ADMIN.CATEGORIES}`}>
                    <ArrowLeft className='h-4 w-4' />
                    {t('admin.categoryForm.backToCategories')}
                </Link>
            </Button>

            <div className='mx-auto max-w-4xl space-y-6'>
                <div className='grid gap-6 lg:grid-cols-3'>
                    <div className='space-y-6 lg:col-span-2'>
                        <FormProvider {...form}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {isAddMode
                                            ? t('admin.categoryForm.addTitle')
                                            : t('admin.categoryForm.editTitle')}
                                    </CardTitle>
                                    <CardDescription>
                                        {isAddMode
                                            ? t('admin.categoryForm.addDescription')
                                            : t('admin.categoryForm.editDescription')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                                        <Field>
                                            <FieldLabel>{t('admin.categories.name')}</FieldLabel>
                                            <Input
                                                {...form.register('name')}
                                                placeholder={t('admin.categoryForm.namePlaceholder')}
                                                aria-invalid={!!form.formState.errors.name}
                                            />
                                            {form.formState.errors.name && (
                                                <FieldError>{form.formState.errors.name.message}</FieldError>
                                            )}
                                        </Field>
                                        <div className='flex gap-4'>
                                            <Button type='submit' disabled={!form.formState.isDirty || isPending}>
                                                {isPending
                                                    ? t('common.saving')
                                                    : isAddMode
                                                      ? t('admin.categoryForm.createCategory')
                                                      : t('admin.foodForm.saveChanges')}
                                            </Button>
                                            {!isAddMode && (
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={handleDeleteClick}
                                                    disabled={deleteCategoryMutation.isPending}
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                    {t('admin.categories.deleteCategory')}
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </FormProvider>
                    </div>
                </div>
            </div>

            {!isAddMode && category && (
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('admin.categories.deleteCategory')}</DialogTitle>
                            <DialogDescription>
                                {t('admin.categories.deleteCategoryConfirm', { name: category.name })}
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
            )}
        </div>
    );
}

export default memo(AdminCategoryDetail);
