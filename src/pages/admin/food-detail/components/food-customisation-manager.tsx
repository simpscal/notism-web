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

    const handleOpenAddOption = useCallback((groupId: string) => {
        setTargetGroupId(groupId);
        setOptLabel('');
        setOptSurcharge('');
        setAddOptionOpen(true);
    }, []);

    const { mutate: deleteGroup } = deleteGroupMutation;
    const { mutate: deleteOption } = deleteOptionMutation;
    const { mutate: saveGroup } = addGroupMutation;
    const { mutate: saveOption } = addOptionMutation;

    const handleDeleteGroup = useCallback(
        (groupId: string) => {
            deleteGroup(groupId);
        },
        [deleteGroup]
    );

    const handleDeleteOption = useCallback(
        (groupId: string, optionId: string) => {
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
                    <p className='text-xs text-muted-foreground'>
                        {t('admin.customisationManager.subtitle', {
                            defaultValue: 'Manage options customers can choose from.',
                        })}
                    </p>
                </div>
                <Button variant='outline' size='sm' onClick={() => setAddGroupOpen(true)}>
                    <Plus className='h-4 w-4' />
                    Add group
                </Button>
            </div>

            {/* Empty state */}
            {localGroups.length === 0 && (
                <div className='rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground'>
                    No customisation groups yet. Add one to get started.
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
                                        {group.required ? 'Required' : 'Optional'}
                                    </Badge>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-7 gap-1 text-xs'
                                        onClick={() => handleOpenAddOption(group.id)}
                                    >
                                        <Plus className='h-3 w-3' />
                                        Add option
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
                                                <AlertDialogTitle>Remove group?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently remove <strong>{group.label}</strong> and all
                                                    its options.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteGroup(group.id)}>
                                                    Remove
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
                                        <TableHead className='w-[50%]'>Option label</TableHead>
                                        <TableHead>Surcharge</TableHead>
                                        <TableHead className='w-[80px] text-right'>Remove</TableHead>
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
                                                            <AlertDialogTitle>Remove option?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently remove{' '}
                                                                <strong>{opt.label}</strong>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteOption(group.id, opt.value)}
                                                            >
                                                                Remove
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
                        <DialogTitle>Add customisation group</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-5 py-2'>
                        <div className='space-y-1.5'>
                            <Label htmlFor='group-label'>Group label</Label>
                            <Input
                                id='group-label'
                                placeholder='e.g. Portion size, Spice level'
                                value={groupLabel}
                                onChange={e => setGroupLabel(e.target.value)}
                            />
                            <p className='text-xs text-muted-foreground'>
                                This label is shown to customers on the food details page.
                            </p>
                        </div>
                        <div className='flex items-center justify-between rounded-lg border px-4 py-3'>
                            <div>
                                <p className='text-sm font-medium'>Required selection</p>
                                <p className='text-xs text-muted-foreground'>
                                    Customers must choose an option before adding to cart.
                                </p>
                            </div>
                            <Switch id='group-required' checked={groupRequired} onCheckedChange={setGroupRequired} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setAddGroupOpen(false)}>
                            Cancel
                        </Button>
                        <Button disabled={!groupLabel.trim() || addGroupMutation.isPending} onClick={handleSaveGroup}>
                            Save group
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add option dialog */}
            <Dialog open={addOptionOpen} onOpenChange={setAddOptionOpen}>
                <DialogContent className='sm:max-w-[420px]'>
                    <DialogHeader>
                        <DialogTitle>Add option to {targetGroupLabel}</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-5 py-2'>
                        <div className='space-y-1.5'>
                            <Label htmlFor='option-label'>Option label</Label>
                            <Input
                                id='option-label'
                                placeholder='e.g. Extra large (340 g)'
                                value={optLabel}
                                onChange={e => setOptLabel(e.target.value)}
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label htmlFor='option-surcharge'>Surcharge (₫)</Label>
                            <Input
                                id='option-surcharge'
                                type='number'
                                placeholder='Leave blank for no surcharge'
                                value={optSurcharge}
                                onChange={e => setOptSurcharge(e.target.value)}
                                min={0}
                            />
                            <p className='text-xs text-muted-foreground'>
                                Enter the additional amount customers pay for this option. Leave blank if there is no
                                surcharge.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setAddOptionOpen(false)}>
                            Cancel
                        </Button>
                        <Button disabled={!optLabel.trim() || addOptionMutation.isPending} onClick={handleSaveOption}>
                            Save option
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(FoodCustomisationManager);
