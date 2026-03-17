import { memo, type ReactNode, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { QUANTITY_UNIT_OPTIONS, type FoodFormValues } from '../models';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Switch } from '@/components/switch';
import { useAppSelector } from '@/core/hooks';

interface FoodDetailFormProps {
    onSubmit: (values: FoodFormValues) => void;
    children?: ReactNode;
}

function FoodDetailForm({ onSubmit, children }: FoodDetailFormProps) {
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Food Details</CardTitle>
                <CardDescription>Edit the food information below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <Field>
                        <FieldLabel>Name</FieldLabel>
                        <Input {...form.register('name')} placeholder='Food name' aria-invalid={!!errors.name} />
                        {errors.name && <FieldError>{errors.name.message}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Input
                            {...form.register('description')}
                            placeholder='Description'
                            aria-invalid={!!errors.description}
                        />
                        {errors.description && <FieldError>{errors.description.message}</FieldError>}
                    </Field>
                    <div className='grid gap-6 sm:grid-cols-2'>
                        <Field>
                            <FieldLabel>Price ($)</FieldLabel>
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
                            <FieldLabel>Discount Price ($)</FieldLabel>
                            <Input
                                type='number'
                                step='0.01'
                                min={0}
                                {...form.register('discountPrice', {
                                    setValueAs: v => (v === '' || v === undefined ? null : Number(v)),
                                })}
                                placeholder='Optional'
                                aria-invalid={!!errors.discountPrice}
                            />
                            {errors.discountPrice && <FieldError>{errors.discountPrice.message}</FieldError>}
                        </Field>
                    </div>
                    <div className='grid gap-6 sm:grid-cols-2'>
                        <Field>
                            <FieldLabel>Category</FieldLabel>
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
                                                <SelectValue placeholder='Select category' />
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
                            <FieldLabel>Quantity Unit</FieldLabel>
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
                                            <SelectValue placeholder='Select unit' />
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
                            <FieldLabel>Available</FieldLabel>
                            <div className='w-fit'>
                                <Switch
                                    checked={form.watch('isAvailable')}
                                    onCheckedChange={checked =>
                                        form.setValue('isAvailable', !!checked, { shouldDirty: true })
                                    }
                                />
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel>Stock Quantity</FieldLabel>
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
