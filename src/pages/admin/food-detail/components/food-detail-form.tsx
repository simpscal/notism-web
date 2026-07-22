import { memo, type ReactNode, useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { QUANTITY_UNIT_OPTIONS, type FoodFormValues } from '../models';

import { useAppSelector } from '@/core/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/uis/card';
import { Field, FieldError, FieldLabel } from '@/uis/field';
import { Input } from '@/uis/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/uis/select';
import { Switch } from '@/uis/switch';

interface FoodDetailFormProps {
    onSubmit: (values: FoodFormValues) => void;
    children?: ReactNode;
}

function FoodDetailForm({ onSubmit, children }: FoodDetailFormProps) {
    const { t } = useTranslation();
    const form = useFormContext<FoodFormValues>();
    const {
        formState: { errors },
        handleSubmit,
    } = form;

    const storeCategories = useAppSelector(state => state.food.categories) ?? [];
    const categoryOptions = useMemo(
        () => storeCategories.map(c => ({ value: c.id, label: c.name })),
        [storeCategories]
    );

    const handleAvailableChange = useCallback(
        (checked: boolean) => {
            form.setValue('isAvailable', !!checked, { shouldDirty: true });
        },
        [form]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('admin.food.details')}</CardTitle>
                <CardDescription>{t('admin.food.editInformationBelow')}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <Field>
                        <FieldLabel>{t('admin.food.name')}</FieldLabel>
                        <Input
                            {...form.register('name')}
                            placeholder={t('admin.food.namePlaceholder')}
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <FieldError>{errors.name.message}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel>{t('admin.food.description')}</FieldLabel>
                        <Input
                            {...form.register('description')}
                            placeholder={t('admin.food.descriptionPlaceholder')}
                            aria-invalid={!!errors.description}
                        />
                        {errors.description && <FieldError>{errors.description.message}</FieldError>}
                    </Field>
                    <div className='grid gap-6 sm:grid-cols-2'>
                        <Field>
                            <FieldLabel>{t('admin.food.price')}</FieldLabel>
                            <Input
                                type='number'
                                step='0.01'
                                min={0}
                                {...form.register('price')}
                                aria-invalid={!!errors.price}
                            />
                            {errors.price && <FieldError>{errors.price.message}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel>{t('admin.food.discountPrice')}</FieldLabel>
                            <Input
                                type='number'
                                step='0.01'
                                min={0}
                                {...form.register('discountPrice', {
                                    setValueAs: v => (v === '' || v === undefined ? null : Number(v)),
                                })}
                                placeholder={t('admin.food.optional')}
                                aria-invalid={!!errors.discountPrice}
                            />
                            {errors.discountPrice && <FieldError>{errors.discountPrice.message}</FieldError>}
                        </Field>
                    </div>
                    <div className='grid gap-6 sm:grid-cols-2'>
                        <Field>
                            <FieldLabel>{t('admin.food.category')}</FieldLabel>
                            <Controller
                                control={form.control}
                                name='category'
                                render={({ field }) => {
                                    return (
                                        <Select
                                            key={`category-${field.value}`}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            aria-invalid={!!errors.category}
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={t('admin.food.selectCategory')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryOptions.map(opt => (
                                                    <SelectItem key={opt.label} value={opt.label}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    );
                                }}
                            />
                            {errors.category && <FieldError>{errors.category.message}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel>{t('admin.food.quantityUnit')}</FieldLabel>
                            <Controller
                                control={form.control}
                                name='quantityUnit'
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        aria-invalid={!!errors.quantityUnit}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder={t('admin.food.selectUnit')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {QUANTITY_UNIT_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.quantityUnit && <FieldError>{errors.quantityUnit.message}</FieldError>}
                        </Field>
                    </div>
                    <div className='grid gap-6 sm:grid-cols-2'>
                        <Field>
                            <FieldLabel>{t('admin.food.available')}</FieldLabel>
                            <div className='w-fit'>
                                <Switch checked={form.watch('isAvailable')} onCheckedChange={handleAvailableChange} />
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel>{t('admin.food.stockQuantity')}</FieldLabel>
                            <Input
                                type='number'
                                min={0}
                                {...form.register('stockQuantity')}
                                aria-invalid={!!errors.stockQuantity}
                            />
                            {errors.stockQuantity && <FieldError>{errors.stockQuantity.message}</FieldError>}
                        </Field>
                    </div>
                    {children}
                </form>
            </CardContent>
        </Card>
    );
}

export default memo(FoodDetailForm);
