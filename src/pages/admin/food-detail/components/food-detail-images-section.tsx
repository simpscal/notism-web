import { ImagePlus, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/uis/card';

interface FoodDetailImagesSectionProps {
    foodName: string;
    imageUrls: string[];
    pendingImageFiles: File[];
    onExistingImagesChange: (imageUrls: string[]) => void;
    onPendingImagesChange: (files: File[]) => void;
    isDisabled: boolean;
}

function FoodDetailImagesSection({
    foodName,
    imageUrls,
    pendingImageFiles,
    onExistingImagesChange,
    onPendingImagesChange,
    isDisabled,
}: FoodDetailImagesSectionProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingPreviewUrls, setPendingPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        const urls = pendingImageFiles.map(f => URL.createObjectURL(f));
        setPendingPreviewUrls(urls);
        return () => {
            urls.forEach(u => URL.revokeObjectURL(u));
        };
    }, [pendingImageFiles]);

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            if (files.length > 0) {
                onPendingImagesChange([...pendingImageFiles, ...files]);
            }
            e.target.value = '';
        },
        [pendingImageFiles, onPendingImagesChange]
    );

    const handleRemoveExistingImage = useCallback(
        (index: number) => () => {
            onExistingImagesChange(imageUrls.filter((_, i) => i !== index));
        },
        [imageUrls, onExistingImagesChange]
    );

    const handleRemovePendingImage = useCallback(
        (index: number) => () => {
            onPendingImagesChange(pendingImageFiles.filter((_, i) => i !== index));
        },
        [pendingImageFiles, onPendingImagesChange]
    );

    const hasImages = imageUrls.length > 0 || pendingImageFiles.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('admin.foods.imagesTitle')}</CardTitle>
                <CardDescription>{t('admin.foods.imagesDescription')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                {hasImages ? (
                    <div className='grid grid-cols-2 gap-4'>
                        {imageUrls.map((url, index) => (
                            <div
                                key={`${url}-${index}`}
                                className='group relative aspect-square overflow-hidden rounded-md border bg-muted'
                            >
                                <img
                                    src={url}
                                    alt={`${foodName} ${index + 1}`}
                                    className='h-full w-full object-cover'
                                />
                                <Button
                                    type='button'
                                    variant='destructive'
                                    size='icon-sm'
                                    className='absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100'
                                    onClick={handleRemoveExistingImage(index)}
                                    aria-label={`Remove image ${index + 1}`}
                                >
                                    <Trash2 className='h-4 w-4' />
                                </Button>
                            </div>
                        ))}
                        {pendingPreviewUrls.map((previewUrl, index) => (
                            <div
                                key={`pending-${index}`}
                                className='group relative aspect-square overflow-hidden rounded-md border border-dashed border-muted-foreground/30 bg-muted'
                            >
                                <img
                                    src={previewUrl}
                                    alt={`Pending ${index + 1}`}
                                    className='h-full w-full object-cover'
                                />
                                <Button
                                    type='button'
                                    variant='destructive'
                                    size='icon-sm'
                                    className='absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100'
                                    onClick={handleRemovePendingImage(index)}
                                    disabled={isDisabled}
                                    aria-label={`Remove pending image ${index + 1}`}
                                >
                                    <Trash2 className='h-4 w-4' />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-sm text-muted-foreground'>{t('admin.foods.noImages')}</p>
                )}
                <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    multiple
                    className='sr-only'
                    onChange={handleFileChange}
                />
                <Button type='button' variant='outline' onClick={handleUploadClick} disabled={isDisabled}>
                    <ImagePlus className='h-4 w-4' />
                    {t('admin.foods.uploadImage')}
                </Button>
            </CardContent>
        </Card>
    );
}

export default memo(FoodDetailImagesSection);
