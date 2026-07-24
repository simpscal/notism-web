import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
    FoodCustomisationManager,
    FoodDetailError,
    FoodDetailForm,
    FoodDetailImagesSection,
    FoodDetailSkeleton,
} from './components';
import { foodFormSchema, getDefaultFormValues, type FoodFormValues } from './models';

import { ADMIN_QUERY_KEYS, adminApi, storageApi } from '@/apis';
import type { AdminFoodDetailImageModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { PresignedUrlUploadType } from '@/app/types';
import { Button } from '@/uis/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/uis/dialog';

const IS_CREATE_MODE_ID = 'new';

function AdminFoodDetail() {
    const { t } = useTranslation();
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const isCreateMode = id === undefined || id === IS_CREATE_MODE_ID;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pendingImageFiles, setPendingImageFiles] = useState<File[]>([]);
    const [desiredImages, setDesiredImages] = useState<
        Pick<AdminFoodDetailImageModel, 'fileKey' | 'imageUrl' | 'altText'>[]
    >([]);

    const { data: food, isLoading } = useQuery({
        queryKey: ADMIN_QUERY_KEYS.foodDetail(id ?? ''),
        queryFn: () => {
            return adminApi.getFoodById(id!);
        },
        enabled: !!id && id !== IS_CREATE_MODE_ID,
    });

    const form = useForm<FoodFormValues>({
        resolver: zodResolver(foodFormSchema),
        mode: 'onChange',
        defaultValues: getDefaultFormValues(null),
    });

    const createFoodMutation = useMutation({
        mutationFn: (
            payload: FoodFormValues & { images?: { fileKey: string; displayOrder: number; altText?: string }[] }
        ) => {
            return adminApi.createFood({
                name: payload.name,
                description: payload.description,
                price: payload.price,
                discountPrice: payload.discountPrice ?? undefined,
                category: payload.category,
                isAvailable: payload.isAvailable,
                stockQuantity: payload.stockQuantity,
                quantityUnit: payload.quantityUnit,
                ...(payload.images && payload.images.length > 0 && { images: payload.images }),
            });
        },
        onSuccess: () => {
            toast.success(t('admin.foods.addedSuccess'));
            navigate(`/${ROUTES.ADMIN.FOODS}`);
        },
    });

    const updateFoodMutation = useMutation({
        mutationFn: (
            payload: FoodFormValues & { images?: { fileKey: string; displayOrder: number; altText?: string }[] }
        ) => {
            return adminApi.updateFood(id!, {
                name: payload.name,
                description: payload.description,
                price: payload.price,
                discountPrice: payload.discountPrice ?? undefined,
                category: payload.category,
                isAvailable: payload.isAvailable,
                stockQuantity: payload.stockQuantity,
                quantityUnit: payload.quantityUnit,
                ...(payload.images !== undefined && { images: payload.images }),
            });
        },
        onSuccess: () => {
            toast.success(t('admin.foods.updatedSuccess'));
            navigate(`/${ROUTES.ADMIN.FOODS}`);
        },
    });

    const deleteFoodMutation = useMutation({
        mutationFn: () => {
            return adminApi.deleteFood(id!);
        },
        onSuccess: () => {
            toast.success(t('admin.foods.deletedSuccess'));
            navigate(`/${ROUTES.ADMIN.FOODS}`);
        },
    });

    const uploadPendingImagesMutation = useMutation({
        mutationFn: async (files: File[]): Promise<string[]> => {
            const keys: string[] = [];
            for (const file of files) {
                const presigned = await storageApi.getPresignedUrl(file.name, file.type, PresignedUrlUploadType.Food);
                await storageApi.uploadToPresignedUrl(presigned.uploadUrl, file);
                keys.push(presigned.fileKey);
            }
            return keys;
        },
    });

    const hasPendingImages = useMemo(() => {
        if (pendingImageFiles.length > 0) return true;

        if (isCreateMode) return false;

        const current = (food?.images ?? []).sort((a, b) => a.displayOrder - b.displayOrder);

        return (
            desiredImages.length !== current.length ||
            desiredImages.some((img, i) => img.fileKey !== current[i]?.fileKey)
        );
    }, [isCreateMode, food?.images, desiredImages, pendingImageFiles.length]);

    useEffect(() => {
        if (!food) {
            return;
        }

        form.reset(getDefaultFormValues(food));
        if (food.images?.length) {
            setDesiredImages(
                [...food.images]
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(({ fileKey, imageUrl, altText }) => ({
                        fileKey,
                        imageUrl,
                        altText,
                    }))
            );
        } else {
            setDesiredImages([]);
        }
    }, [food, form]);

    const handleSubmit = useCallback(
        async (values: FoodFormValues) => {
            const imagesToSend: { fileKey: string; displayOrder: number; altText?: string }[] = desiredImages.map(
                (img, displayOrder) => ({ fileKey: img.fileKey, displayOrder, altText: img.altText })
            );
            if (pendingImageFiles.length > 0) {
                try {
                    const keys = await uploadPendingImagesMutation.mutateAsync(pendingImageFiles);
                    setPendingImageFiles([]);
                    keys.forEach((fileKey, i) => {
                        imagesToSend.push({
                            fileKey,
                            displayOrder: desiredImages.length + i,
                            altText: undefined,
                        });
                    });
                } catch {
                    return;
                }
            }

            if (isCreateMode) {
                createFoodMutation.mutate({
                    ...values,
                    ...(imagesToSend.length > 0 && { images: imagesToSend }),
                });
                return;
            }

            const currentFileKeys = (food?.images ?? [])
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map(i => i.fileKey);
            const desiredFileKeys = imagesToSend.map(i => i.fileKey);
            const hasImageChanges =
                desiredFileKeys.length !== currentFileKeys.length ||
                desiredFileKeys.some((key, i) => key !== currentFileKeys[i]);

            updateFoodMutation.mutate({
                ...values,
                ...(hasImageChanges && { images: imagesToSend }),
            });
        },
        [isCreateMode, food, desiredImages, pendingImageFiles]
    );

    const handleDeleteClick = useCallback(() => {
        setDeleteDialogOpen(true);
    }, []);

    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        deleteFoodMutation.mutate();
    }, []);

    const handleExistingImagesChange = useCallback((newImageUrls: string[]) => {
        setDesiredImages(prev => {
            if (prev.length <= newImageUrls.length) return prev;

            const removedIndex = prev.findIndex((img, i) => newImageUrls[i] !== img.imageUrl);
            const idx = removedIndex === -1 ? prev.length - 1 : removedIndex;
            return prev.filter((_, i) => i !== idx);
        });
    }, []);

    const handlePendingImagesChange = useCallback((files: File[]) => {
        setPendingImageFiles(files);
    }, []);

    if (!isCreateMode && isLoading) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.ADMIN.FOODS}`}>
                        <ArrowLeft className='h-4 w-4' />
                        {t('admin.foodForm.backToFoods')}
                    </Link>
                </Button>
                <FoodDetailSkeleton />
            </div>
        );
    }

    if (!isCreateMode && !food) {
        return <FoodDetailError />;
    }

    const displayName = isCreateMode ? form.watch('name') || 'New food' : food!.name;
    const isSubmitPending =
        uploadPendingImagesMutation.isPending || updateFoodMutation.isPending || createFoodMutation.isPending;
    const isFormDisabled =
        uploadPendingImagesMutation.isPending || updateFoodMutation.isPending || createFoodMutation.isPending;

    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ADMIN.FOODS}`}>
                    <ArrowLeft className='h-4 w-4' />
                    {t('admin.foodForm.backToFoods')}
                </Link>
            </Button>

            <div className='mx-auto max-w-4xl space-y-6'>
                <div className='grid gap-6 lg:grid-cols-3'>
                    <div className='space-y-6 lg:col-span-2'>
                        <FormProvider {...form}>
                            <FoodDetailForm onSubmit={handleSubmit}>
                                <div className='flex gap-4'>
                                    <Button
                                        type='submit'
                                        disabled={
                                            isCreateMode
                                                ? !form.formState.isValid || isSubmitPending
                                                : (!hasPendingImages && !form.formState.isDirty) || isSubmitPending
                                        }
                                    >
                                        {isSubmitPending
                                            ? t('common.saving')
                                            : isCreateMode
                                              ? t('admin.foodForm.addFood')
                                              : t('admin.foodForm.saveChanges')}
                                    </Button>
                                    {!isCreateMode && (
                                        <Button
                                            type='button'
                                            variant='destructive'
                                            onClick={handleDeleteClick}
                                            disabled={deleteFoodMutation.isPending}
                                        >
                                            <Trash2 className='h-4 w-4' />
                                            {t('admin.foods.deleteFood')}
                                        </Button>
                                    )}
                                </div>
                            </FoodDetailForm>
                        </FormProvider>
                    </div>

                    <div className='space-y-6'>
                        <FoodDetailImagesSection
                            foodName={displayName}
                            pendingImageFiles={pendingImageFiles}
                            imageUrls={desiredImages.map(i => i.imageUrl).filter(Boolean) as string[]}
                            onExistingImagesChange={handleExistingImagesChange}
                            onPendingImagesChange={handlePendingImagesChange}
                            isDisabled={isFormDisabled}
                        />
                    </div>
                </div>
            </div>

            {!isCreateMode && food && (
                <div className='mx-auto mt-6 max-w-4xl'>
                    <FoodCustomisationManager foodId={id!} customisations={food.customisations ?? []} />
                </div>
            )}

            {!isCreateMode && food && (
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('admin.foods.deleteFood')}</DialogTitle>
                            <DialogDescription>
                                {t('admin.foods.deleteFoodConfirm', { name: food.name })}
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
            )}
        </div>
    );
}

export default memo(AdminFoodDetail);
