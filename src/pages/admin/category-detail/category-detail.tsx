import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import {
    categoryDetailFormSchema,
    getDefaultCategoryDetailFormValues,
    categoryDetailFormValuesToRequest,
    type CategoryDetailFormValues,
} from './models';

import { adminApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import ErrorState from '@/components/error-state';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import Spinner from '@/components/spinner';
import { useAppDispatch } from '@/core/hooks';
import { addCategory, removeCategory, updateCategory } from '@/store/food';

function AdminCategoryDetail() {
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
        queryKey: ['admin', 'categories', 'detail', id] as const,
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
            toast.success('Category created successfully');
            navigate(`/${ROUTES.ADMIN.CATEGORY_DETAIL(created.id)}`);
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: (values: CategoryDetailFormValues) =>
            adminApi.updateCategory(id!, categoryDetailFormValuesToRequest(values)),
        onSuccess: updated => {
            queryClient.setQueryData(['admin', 'categories', 'detail', id], updated);
            dispatch(updateCategory(updated));
            form.reset(getDefaultCategoryDetailFormValues(updated));
            toast.success('Category updated successfully');
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (categoryId: string) => adminApi.deleteCategory(categoryId),
        onSuccess: (_, categoryId) => {
            dispatch(removeCategory(categoryId));
            toast.success('Category deleted successfully');
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
                    Back to Categories
                </Link>
            </Button>

            <div className='mx-auto max-w-4xl space-y-6'>
                <div className='grid gap-6 lg:grid-cols-3'>
                    <div className='space-y-6 lg:col-span-2'>
                        <FormProvider {...form}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{isAddMode ? 'Add Category' : 'Category Details'}</CardTitle>
                                    <CardDescription>
                                        {isAddMode
                                            ? 'Create a new food category.'
                                            : 'Edit the category information below.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                                        <Field>
                                            <FieldLabel>Name</FieldLabel>
                                            <Input
                                                {...form.register('name')}
                                                placeholder='Category name'
                                                aria-invalid={!!form.formState.errors.name}
                                            />
                                            {form.formState.errors.name && (
                                                <FieldError>{form.formState.errors.name.message}</FieldError>
                                            )}
                                        </Field>
                                        <div className='flex gap-4'>
                                            <Button type='submit' disabled={!form.formState.isDirty || isPending}>
                                                {isPending
                                                    ? 'Saving...'
                                                    : isAddMode
                                                      ? 'Create Category'
                                                      : 'Save Changes'}
                                            </Button>
                                            {!isAddMode && (
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={handleDeleteClick}
                                                    disabled={deleteCategoryMutation.isPending}
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                    Delete Category
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
                            <DialogTitle>Delete Category</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete <strong>{category.name}</strong>? This action cannot be
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
                                disabled={deleteCategoryMutation.isPending}
                            >
                                {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

export default memo(AdminCategoryDetail);
