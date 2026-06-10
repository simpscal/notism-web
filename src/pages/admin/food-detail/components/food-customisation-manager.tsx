import { useMutation } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Switch } from '@/components/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

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

    // Add group dialog state
    const [addGroupOpen, setAddGroupOpen] = useState(false);
    const [groupLabel, setGroupLabel] = useState('');
    const [groupRequired, setGroupRequired] = useState(false);

    // Add option dialog state
    const [addOptionOpen, setAddOptionOpen] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
    const [optLabel, setOptLabel] = useState('');
    const [optSurcharge, setOptSurcharge] = useState('');

    useEffect(() => {
        setLocalGroups(customisations);
    }, [customisations]);

    const targetGroupLabel = localGroups.find(g => g.id === targetGroupId)?.label ?? '';

    const addGroupMutation = useMutation({
        mutationFn: () =>
            adminApi.addCustomisationGroup(foodId, {
                label: groupLabel.trim(),
                isRequired: groupRequired,
                displayOrder: localGroups.length,
            }),
        onSuccess: created => {
            setLocalGroups(prev => [
                ...prev,
                { id: created.id, label: created.label, required: created.isRequired, options: [] },
            ]);
            setAddGroupOpen(false);
            setGroupLabel('');
            setGroupRequired(false);
        },
    });

    const deleteGroupMutation = useMutation({
        mutationFn: (groupId: string) => adminApi.deleteCustomisationGroup(foodId, groupId),
        onSuccess: (_, groupId) => {
            setLocalGroups(prev => prev.filter(g => g.id !== groupId));
        },
    });

    const addOptionMutation = useMutation({
        mutationFn: () => {
            if (!targetGroupId) return Promise.reject(new Error('No target group'));
            return adminApi.addCustomisationOption(foodId, targetGroupId, {
                label: optLabel.trim(),
                surcharge: optSurcharge !== '' ? Number(optSurcharge) : null,
                displayOrder: localGroups.find(g => g.id === targetGroupId)?.options.length ?? 0,
            });
        },
        onSuccess: created => {
            if (!targetGroupId) return;
            const newOption: CustomisationOptionModel = {
                value: created.id,
                label: created.label,
                ...(created.surcharge != null && created.surcharge > 0 && { surcharge: created.surcharge }),
            };
            setLocalGroups(prev =>
                prev.map(g => (g.id === targetGroupId ? { ...g, options: [...g.options, newOption] } : g))
            );
            setAddOptionOpen(false);
            setOptLabel('');
            setOptSurcharge('');
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

    const { mutate: deleteGroup } = deleteGroupMutation;
    const { mutate: deleteOption } = deleteOptionMutation;
    const { mutate: saveGroup } = addGroupMutation;
    const { mutate: saveOption } = addOptionMutation;

    const handleOpenAddGroup = useCallback(() => {
        setAddGroupOpen(true);
    }, []);

    const handleCloseAddGroup = useCallback(() => {
        setAddGroupOpen(false);
    }, []);

    const handleCloseAddOption = useCallback(() => {
        setAddOptionOpen(false);
    }, []);

    const handleOpenAddOption = useCallback(
        (groupId: string) => () => {
            setTargetGroupId(groupId);
            setOptLabel('');
            setOptSurcharge('');
            setAddOptionOpen(true);
        },
        []
    );

    const handleGroupLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupLabel(e.target.value);
    }, []);

    const handleOptLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setOptLabel(e.target.value);
    }, []);

    const handleOptSurchargeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setOptSurcharge(e.target.value);
    }, []);

    const handleDeleteGroup = useCallback(
        (groupId: string) => () => {
            deleteGroup(groupId);
        },
        [deleteGroup]
    );

    const handleDeleteOption = useCallback(
        (groupId: string, optionId: string) => () => {
            deleteOption({ groupId, optionId });
        },
        [deleteOption]
    );

    const handleSaveGroup = useCallback(() => {
        saveGroup();
    }, [saveGroup]);

    const handleSaveOption = useCallback(() => {
        saveOption();
    }, [saveOption]);

    return (
        <div className='space-y-4'>
            {/* Section header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <p className='text-base font-semibold'>{t('admin.customisationManager.title')}</p>
                </div>
                <Button variant='outline' size='sm' onClick={handleOpenAddGroup}>
                    <Plus className='h-4 w-4' />
                    {t('admin.customisationManager.addGroupButton')}
                </Button>
            </div>

            {/* Empty state */}
            {localGroups.length === 0 && (
                <div className='rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground'>
                    {t('admin.customisationManager.empty')}
                </div>
            )}

            {/* Groups */}
            {localGroups.length > 0 && (
                <div className='space-y-6'>
                    {localGroups.map(group => (
                        <div key={group.id} className='overflow-hidden rounded-lg border'>
                            {/* Group header */}
                            <div className='flex items-center justify-between bg-muted/40 px-4 py-3'>
                                <div className='flex items-center gap-3'>
                                    <span className='text-sm font-semibold text-foreground'>{group.label}</span>
                                    <Badge variant={group.required ? 'default' : 'secondary'} className='text-xs'>
                                        {group.required
                                            ? t('admin.customisationManager.required')
                                            : t('admin.customisationManager.optional')}
                                    </Badge>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-7 gap-1 text-xs'
                                        onClick={handleOpenAddOption(group.id)}
                                    >
                                        <Plus className='h-3 w-3' />
                                        {t('admin.customisationManager.addOption')}
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='h-7 text-destructive hover:bg-destructive/10 hover:text-destructive'
                                                disabled={deleteGroupMutation.isPending}
                                            >
                                                <Trash2 className='h-3.5 w-3.5' />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {t('admin.customisationManager.deleteGroupTitle')}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t('admin.customisationManager.deleteGroupDescription', {
                                                        label: group.label,
                                                    })}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteGroup(group.id)}>
                                                    {t('admin.customisationManager.remove')}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            {/* Options table */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-[50%]'>
                                            {t('admin.customisationManager.optionLabel')}
                                        </TableHead>
                                        <TableHead>{t('admin.customisationManager.surcharge')}</TableHead>
                                        <TableHead className='w-[80px] text-right'>
                                            {t('admin.customisationManager.removeColumn')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {group.options.map(opt => (
                                        <TableRow key={opt.value}>
                                            <TableCell className='text-sm font-medium'>{opt.label}</TableCell>
                                            <TableCell className='text-sm text-muted-foreground'>
                                                {opt.surcharge ? (
                                                    <span className='font-semibold text-primary'>
                                                        +{opt.surcharge.toLocaleString('en-US')} ₫
                                                    </span>
                                                ) : (
                                                    <span>—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            className='h-7 w-7 text-muted-foreground hover:text-destructive'
                                                            disabled={deleteOptionMutation.isPending}
                                                        >
                                                            <Trash2 className='h-3.5 w-3.5' />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                {t('admin.customisationManager.deleteOptionTitle')}
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {t(
                                                                    'admin.customisationManager.deleteOptionDescription',
                                                                    { label: opt.label }
                                                                )}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={handleDeleteOption(group.id, opt.value)}
                                                            >
                                                                {t('admin.customisationManager.remove')}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ))}
                </div>
            )}

            {/* Add group dialog */}
            <Dialog open={addGroupOpen} onOpenChange={setAddGroupOpen}>
                <DialogContent className='sm:max-w-[420px]'>
                    <DialogHeader>
                        <DialogTitle>{t('admin.customisationManager.addGroup')}</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-5 py-2'>
                        <div className='space-y-1.5'>
                            <Label htmlFor='group-label'>{t('admin.customisationManager.groupLabel')}</Label>
                            <Input
                                id='group-label'
                                placeholder={t('admin.customisationManager.groupLabelPlaceholder')}
                                value={groupLabel}
                                onChange={handleGroupLabelChange}
                            />
                            <p className='text-xs text-muted-foreground'>
                                {t('admin.customisationManager.groupLabelHelper')}
                            </p>
                        </div>
                        <div className='flex items-center justify-between rounded-lg border px-4 py-3'>
                            <div>
                                <p className='text-sm font-medium'>
                                    {t('admin.customisationManager.requiredSelection')}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    {t('admin.customisationManager.requiredSelectionHelper')}
                                </p>
                            </div>
                            <Switch id='group-required' checked={groupRequired} onCheckedChange={setGroupRequired} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCloseAddGroup}>
                            {t('common.cancel')}
                        </Button>
                        <Button disabled={!groupLabel.trim() || addGroupMutation.isPending} onClick={handleSaveGroup}>
                            {t('admin.customisationManager.saveGroup')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add option dialog */}
            <Dialog open={addOptionOpen} onOpenChange={setAddOptionOpen}>
                <DialogContent className='sm:max-w-[420px]'>
                    <DialogHeader>
                        <DialogTitle>
                            {t('admin.customisationManager.addOptionTo', { label: targetGroupLabel })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className='space-y-5 py-2'>
                        <div className='space-y-1.5'>
                            <Label htmlFor='option-label'>{t('admin.customisationManager.optionLabel')}</Label>
                            <Input
                                id='option-label'
                                placeholder={t('admin.customisationManager.optionLabelPlaceholder')}
                                value={optLabel}
                                onChange={handleOptLabelChange}
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label htmlFor='option-surcharge'>{t('admin.customisationManager.surcharge')} (₫)</Label>
                            <Input
                                id='option-surcharge'
                                type='number'
                                placeholder={t('admin.customisationManager.surchargePlaceholder')}
                                value={optSurcharge}
                                onChange={handleOptSurchargeChange}
                                min={0}
                            />
                            <p className='text-xs text-muted-foreground'>
                                {t('admin.customisationManager.surchargeHelper')}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCloseAddOption}>
                            {t('common.cancel')}
                        </Button>
                        <Button disabled={!optLabel.trim() || addOptionMutation.isPending} onClick={handleSaveOption}>
                            {t('admin.customisationManager.saveOption')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(FoodCustomisationManager);
