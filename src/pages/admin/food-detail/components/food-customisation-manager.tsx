import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { adminApi } from '@/apis';
import type { CustomisationGroupModel, CustomisationOptionModel } from '@/apis/models';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/alert-dialog';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { FieldError } from '@/components/field';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Switch } from '@/components/switch';

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const addGroupSchema = z.object({
    label: z.string().min(1, 'Label is required').max(100, 'Max 100 characters'),
    isRequired: z.boolean(),
});

const addOptionSchema = z.object({
    label: z.string().min(1, 'Label is required').max(100, 'Max 100 characters'),
    surcharge: z.string().optional(),
});

type AddGroupFormValues = z.infer<typeof addGroupSchema>;
type AddOptionFormValues = z.infer<typeof addOptionSchema>;

// ---------------------------------------------------------------------------
// AddGroupForm
// ---------------------------------------------------------------------------

interface AddGroupFormProps {
    onSubmit: (values: AddGroupFormValues) => void;
    onCancel: () => void;
    isPending: boolean;
}

function AddGroupForm({ onSubmit, onCancel, isPending }: AddGroupFormProps) {
    const { t } = useTranslation();

    const form = useForm<AddGroupFormValues>({
        resolver: zodResolver(addGroupSchema),
        defaultValues: { label: '', isRequired: false },
    });

    return (
        <Card>
            <CardContent className='pt-4'>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <Input
                            placeholder={t('admin.customisationManager.groupLabel')}
                            {...form.register('label')}
                            aria-invalid={!!form.formState.errors.label}
                        />
                        {form.formState.errors.label && <FieldError>{form.formState.errors.label.message}</FieldError>}
                    </div>
                    <div className='flex items-center gap-2'>
                        <Controller
                            control={form.control}
                            name='isRequired'
                            render={({ field }) => (
                                <Switch
                                    id='add-group-required'
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor='add-group-required'>{t('admin.customisationManager.required')}</Label>
                    </div>
                    <div className='flex gap-2'>
                        <Button type='submit' size='sm' disabled={isPending}>
                            {isPending ? t('common.saving') : t('admin.customisationManager.saveGroup')}
                        </Button>
                        <Button type='button' size='sm' variant='outline' onClick={onCancel}>
                            {t('common.cancel')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// AddOptionForm
// ---------------------------------------------------------------------------

interface AddOptionFormProps {
    onSubmit: (values: AddOptionFormValues) => void;
    isPending: boolean;
}

function AddOptionForm({ onSubmit, isPending }: AddOptionFormProps) {
    const { t } = useTranslation();

    const form = useForm<AddOptionFormValues>({
        resolver: zodResolver(addOptionSchema),
        defaultValues: { label: '', surcharge: '' },
    });

    const handleSubmit = form.handleSubmit(values => {
        onSubmit(values);
        form.reset();
    });

    return (
        <form onSubmit={handleSubmit} className='flex items-start gap-2 pt-1'>
            <div className='flex-1'>
                <Input
                    placeholder={t('admin.customisationManager.optionLabel')}
                    {...form.register('label')}
                    aria-invalid={!!form.formState.errors.label}
                />
                {form.formState.errors.label && <FieldError>{form.formState.errors.label.message}</FieldError>}
            </div>
            <div className='w-32'>
                <Input
                    type='number'
                    min={0}
                    step='0.01'
                    placeholder={t('admin.customisationManager.surcharge')}
                    {...form.register('surcharge')}
                />
            </div>
            <Button
                type='submit'
                size='sm'
                variant='outline'
                disabled={isPending}
                aria-label={t('admin.customisationManager.addOption')}
            >
                <Plus className='h-4 w-4' />
                {t('admin.customisationManager.addOption')}
            </Button>
        </form>
    );
}

// ---------------------------------------------------------------------------
// OptionRow
// ---------------------------------------------------------------------------

interface OptionRowProps {
    groupId: string;
    option: CustomisationOptionModel;
    onDeleteOption: (groupId: string, optionId: string) => void;
    isDeletePending: boolean;
}

function OptionRow({ groupId, option, onDeleteOption, isDeletePending }: OptionRowProps) {
    const { t } = useTranslation();

    const handleDeleteOption = useCallback(() => {
        onDeleteOption(groupId, option.value);
    }, [onDeleteOption, groupId, option.value]);

    return (
        <li className='flex items-center justify-between rounded-md border px-3 py-2 text-sm'>
            <span>{option.label}</span>
            <div className='flex items-center gap-2'>
                {option.surcharge != null && option.surcharge > 0 && (
                    <span className='text-muted-foreground'>+{option.surcharge}</span>
                )}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon-xs'
                            aria-label={t('admin.customisationManager.deleteOptionAriaLabel')}
                            disabled={isDeletePending}
                        >
                            <Trash2 className='text-destructive' />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('admin.customisationManager.deleteOptionTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('admin.customisationManager.deleteOptionDescription', {
                                    label: option.label,
                                })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteOption}>{t('common.delete')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </li>
    );
}

// ---------------------------------------------------------------------------
// GroupCard
// ---------------------------------------------------------------------------

interface GroupCardProps {
    group: CustomisationGroupModel;
    onDeleteGroup: (groupId: string) => void;
    onAddOption: (groupId: string, values: AddOptionFormValues) => void;
    onDeleteOption: (groupId: string, optionId: string) => void;
    isDeleteGroupPending: boolean;
    isAddOptionPending: boolean;
    isDeleteOptionPending: boolean;
}

function GroupCard({
    group,
    onDeleteGroup,
    onAddOption,
    onDeleteOption,
    isDeleteGroupPending,
    isAddOptionPending,
    isDeleteOptionPending,
}: GroupCardProps) {
    const { t } = useTranslation();

    const handleDeleteGroup = useCallback(() => {
        onDeleteGroup(group.id);
    }, [onDeleteGroup, group.id]);

    const handleAddOption = useCallback(
        (values: AddOptionFormValues) => {
            onAddOption(group.id, values);
        },
        [onAddOption, group.id]
    );

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                    <CardTitle className='text-base'>{group.label}</CardTitle>
                    {group.required && <Badge variant='secondary'>{t('admin.customisationManager.required')}</Badge>}
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon-sm'
                            aria-label={t('admin.customisationManager.deleteGroupAriaLabel')}
                            disabled={isDeleteGroupPending}
                        >
                            <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('admin.customisationManager.deleteGroupTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('admin.customisationManager.deleteGroupDescription', {
                                    label: group.label,
                                })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteGroup}>{t('common.delete')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent className='space-y-3'>
                {group.options.length > 0 && (
                    <ul className='space-y-2'>
                        {group.options.map(option => (
                            <OptionRow
                                key={option.value}
                                groupId={group.id}
                                option={option}
                                onDeleteOption={onDeleteOption}
                                isDeletePending={isDeleteOptionPending}
                            />
                        ))}
                    </ul>
                )}
                <AddOptionForm onSubmit={handleAddOption} isPending={isAddOptionPending} />
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// FoodCustomisationManager
// ---------------------------------------------------------------------------

interface FoodCustomisationManagerProps {
    foodId: string;
    customisations: CustomisationGroupModel[];
}

function FoodCustomisationManager({ foodId, customisations }: FoodCustomisationManagerProps) {
    const { t } = useTranslation();
    const [localGroups, setLocalGroups] = useState<CustomisationGroupModel[]>(customisations);
    const [showAddGroup, setShowAddGroup] = useState(false);

    useEffect(() => {
        setLocalGroups(customisations);
    }, [customisations]);

    const addGroupMutation = useMutation({
        mutationFn: (values: AddGroupFormValues) =>
            adminApi.addCustomisationGroup(foodId, {
                label: values.label,
                isRequired: values.isRequired,
                displayOrder: localGroups.length,
            }),
        onSuccess: created => {
            setLocalGroups(prev => [
                ...prev,
                { id: created.id, label: created.label, required: created.isRequired, options: [] },
            ]);
            setShowAddGroup(false);
        },
    });

    const deleteGroupMutation = useMutation({
        mutationFn: (groupId: string) => adminApi.deleteCustomisationGroup(foodId, groupId),
        onSuccess: (_, groupId) => {
            setLocalGroups(prev => prev.filter(g => g.id !== groupId));
        },
    });

    const addOptionMutation = useMutation({
        mutationFn: ({ groupId, values }: { groupId: string; values: AddOptionFormValues }) =>
            adminApi.addCustomisationOption(foodId, groupId, {
                label: values.label,
                surcharge: values.surcharge !== '' ? Number(values.surcharge) : null,
                displayOrder: localGroups.find(g => g.id === groupId)?.options.length ?? 0,
            }),
        onSuccess: (created, { groupId }) => {
            const newOption: CustomisationOptionModel = {
                value: created.id,
                label: created.label,
                ...(created.surcharge != null && created.surcharge > 0 && { surcharge: created.surcharge }),
            };
            setLocalGroups(prev =>
                prev.map(g => (g.id === groupId ? { ...g, options: [...g.options, newOption] } : g))
            );
        },
    });

    const deleteOptionMutation = useMutation({
        mutationFn: ({ groupId, optionId }: { groupId: string; optionId: string }) =>
            adminApi.deleteCustomisationOption(foodId, groupId, optionId),
        onSuccess: (_, { groupId, optionId }) => {
            setLocalGroups(prev =>
                prev.map(g => (g.id === groupId ? { ...g, options: g.options.filter(o => o.value !== optionId) } : g))
            );
        },
    });

    const handleShowAddGroup = useCallback(() => {
        setShowAddGroup(true);
    }, []);

    const handleAddGroup = useCallback(
        (values: AddGroupFormValues) => {
            addGroupMutation.mutate(values);
        },
        [addGroupMutation.mutate]
    );

    const handleCancelAddGroup = useCallback(() => {
        setShowAddGroup(false);
    }, []);

    const handleDeleteGroup = useCallback(
        (groupId: string) => {
            deleteGroupMutation.mutate(groupId);
        },
        [deleteGroupMutation.mutate]
    );

    const handleAddOption = useCallback(
        (groupId: string, values: AddOptionFormValues) => {
            addOptionMutation.mutate({ groupId, values });
        },
        [addOptionMutation.mutate]
    );

    const handleDeleteOption = useCallback(
        (groupId: string, optionId: string) => {
            deleteOptionMutation.mutate({ groupId, optionId });
        },
        [deleteOptionMutation.mutate]
    );

    return (
        <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>{t('admin.customisationManager.title')}</h2>

            {localGroups.length === 0 && !showAddGroup && (
                <p className='text-sm text-muted-foreground'>{t('admin.customisationManager.empty')}</p>
            )}

            {localGroups.map(group => (
                <GroupCard
                    key={group.id}
                    group={group}
                    onDeleteGroup={handleDeleteGroup}
                    onAddOption={handleAddOption}
                    onDeleteOption={handleDeleteOption}
                    isDeleteGroupPending={deleteGroupMutation.isPending}
                    isAddOptionPending={addOptionMutation.isPending}
                    isDeleteOptionPending={deleteOptionMutation.isPending}
                />
            ))}

            {showAddGroup ? (
                <AddGroupForm
                    onSubmit={handleAddGroup}
                    onCancel={handleCancelAddGroup}
                    isPending={addGroupMutation.isPending}
                />
            ) : (
                <Button
                    variant='outline'
                    size='sm'
                    onClick={handleShowAddGroup}
                    aria-label={t('admin.customisationManager.addGroup')}
                >
                    <Plus className='h-4 w-4' />
                    {t('admin.customisationManager.addGroup')}
                </Button>
            )}
        </div>
    );
}

export default memo(FoodCustomisationManager);
