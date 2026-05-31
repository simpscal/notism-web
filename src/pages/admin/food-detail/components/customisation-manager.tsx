import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { memo, useState } from 'react';
import { toast } from 'sonner';

import { adminApi } from '@/apis';
import type { CustomisationGroupModel } from '@/apis/models';
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

interface CustomisationManagerProps {
    foodId: string;
    customisations: CustomisationGroupModel[];
}

interface OptionFormState {
    label: string;
    surcharge: string;
}

function CustomisationManager({ foodId, customisations }: CustomisationManagerProps) {
    const queryClient = useQueryClient();

    const [showAddGroup, setShowAddGroup] = useState(false);
    const [addGroupLabel, setAddGroupLabel] = useState('');
    const [addGroupRequired, setAddGroupRequired] = useState(false);
    const [addGroupError, setAddGroupError] = useState<string | null>(null);

    const [addOptionState, setAddOptionState] = useState<Record<string, OptionFormState>>({});

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'foods', 'detail', foodId] });
    };

    const addGroupMutation = useMutation({
        mutationFn: () =>
            adminApi.addCustomisationGroup(foodId, {
                label: addGroupLabel,
                isRequired: addGroupRequired,
                displayOrder: customisations.length,
            }),
        onSuccess: () => {
            invalidate();
            setAddGroupLabel('');
            setAddGroupRequired(false);
            setAddGroupError(null);
            setShowAddGroup(false);
        },
        onError: (error: unknown) => {
            const msg = extractErrorMessage(error);
            if (msg) {
                setAddGroupError(msg);
            } else {
                toast.error('Failed to add customisation group');
            }
        },
    });

    const deleteGroupMutation = useMutation({
        mutationFn: (groupId: string) => adminApi.deleteCustomisationGroup(foodId, groupId),
        onSuccess: () => {
            invalidate();
        },
        onError: () => {
            toast.error('Failed to delete customisation group');
        },
    });

    const addOptionMutation = useMutation({
        mutationFn: ({ groupId, label, surcharge }: { groupId: string; label: string; surcharge: string }) =>
            adminApi.addCustomisationOption(foodId, groupId, {
                label,
                surcharge: surcharge !== '' ? Number(surcharge) : null,
                displayOrder: customisations.find(g => g.id === groupId)?.options.length ?? 0,
            }),
        onSuccess: (_data, variables) => {
            invalidate();
            setAddOptionState(prev => ({
                ...prev,
                [variables.groupId]: { label: '', surcharge: '' },
            }));
        },
        onError: () => {
            toast.error('Failed to add option');
        },
    });

    const deleteOptionMutation = useMutation({
        mutationFn: ({ groupId, optionId }: { groupId: string; optionId: string }) =>
            adminApi.deleteCustomisationOption(foodId, groupId, optionId),
        onSuccess: () => {
            invalidate();
        },
        onError: () => {
            toast.error('Failed to delete option');
        },
    });

    const getOptionForm = (groupId: string): OptionFormState => addOptionState[groupId] ?? { label: '', surcharge: '' };

    const setOptionForm = (groupId: string, patch: Partial<OptionFormState>) => {
        setAddOptionState(prev => ({
            ...prev,
            [groupId]: { ...getOptionForm(groupId), ...patch },
        }));
    };

    const handleSaveGroup = () => {
        if (!addGroupLabel.trim()) {
            setAddGroupError('Label is required');
            return;
        }
        setAddGroupError(null);
        addGroupMutation.mutate();
    };

    const handleAddOption = (groupId: string) => {
        const form = getOptionForm(groupId);
        if (!form.label.trim()) return;
        addOptionMutation.mutate({ groupId, label: form.label, surcharge: form.surcharge });
    };

    return (
        <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Customisation Groups</h2>

            {customisations.length === 0 && !showAddGroup && (
                <p className='text-muted-foreground text-sm'>No customisation groups yet. Add one below.</p>
            )}

            {customisations.map(group => (
                <Card key={group.id}>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='flex items-center gap-2'>
                            <CardTitle className='text-base'>{group.label}</CardTitle>
                            {group.required && <Badge variant='secondary'>Required</Badge>}
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='icon-sm'
                                    aria-label='Delete group'
                                    disabled={deleteGroupMutation.isPending}
                                >
                                    <Trash2 className='h-4 w-4 text-destructive' />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete customisation group</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete &ldquo;{group.label}&rdquo; and all its options.
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteGroupMutation.mutate(group.id)}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                        {group.options.length > 0 && (
                            <ul className='space-y-2'>
                                {group.options.map(option => (
                                    <li
                                        key={option.value}
                                        className='flex items-center justify-between rounded-md border px-3 py-2 text-sm'
                                    >
                                        <span>{option.label}</span>
                                        <div className='flex items-center gap-2'>
                                            {option.surcharge !== undefined &&
                                                option.surcharge !== null &&
                                                option.surcharge > 0 && (
                                                    <span className='text-muted-foreground'>+{option.surcharge}</span>
                                                )}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon-xs'
                                                        aria-label='Delete option'
                                                        disabled={deleteOptionMutation.isPending}
                                                    >
                                                        <Trash2 className='text-destructive' />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete option</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete &ldquo;{option.label}&rdquo;.
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                deleteOptionMutation.mutate({
                                                                    groupId: group.id,
                                                                    optionId: option.value,
                                                                })
                                                            }
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Add option inline form */}
                        <div className='flex items-end gap-2 pt-1'>
                            <div className='flex-1'>
                                <Input
                                    placeholder='Option label'
                                    value={getOptionForm(group.id).label}
                                    onChange={e => setOptionForm(group.id, { label: e.target.value })}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddOption(group.id);
                                        }
                                    }}
                                />
                            </div>
                            <div className='w-24'>
                                <Input
                                    type='number'
                                    min={0}
                                    step='0.01'
                                    placeholder='Surcharge'
                                    value={getOptionForm(group.id).surcharge}
                                    onChange={e => setOptionForm(group.id, { surcharge: e.target.value })}
                                />
                            </div>
                            <Button
                                size='sm'
                                variant='outline'
                                onClick={() => handleAddOption(group.id)}
                                disabled={addOptionMutation.isPending || !getOptionForm(group.id).label.trim()}
                                aria-label='Add option'
                            >
                                <Plus className='h-4 w-4' />
                                Add option
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Add group section */}
            {showAddGroup ? (
                <Card>
                    <CardContent className='pt-4'>
                        <div className='space-y-4'>
                            <div>
                                <Input
                                    placeholder='Group label'
                                    value={addGroupLabel}
                                    onChange={e => {
                                        setAddGroupLabel(e.target.value);
                                        if (addGroupError) setAddGroupError(null);
                                    }}
                                    aria-invalid={!!addGroupError}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSaveGroup();
                                        }
                                    }}
                                />
                                {addGroupError && <FieldError>{addGroupError}</FieldError>}
                            </div>
                            <div className='flex items-center gap-2'>
                                <Switch
                                    id='add-group-required'
                                    checked={addGroupRequired}
                                    onCheckedChange={setAddGroupRequired}
                                />
                                <Label htmlFor='add-group-required'>Required</Label>
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    size='sm'
                                    onClick={handleSaveGroup}
                                    disabled={addGroupMutation.isPending}
                                    aria-label='Save group'
                                >
                                    {addGroupMutation.isPending ? 'Saving...' : 'Save group'}
                                </Button>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={() => {
                                        setShowAddGroup(false);
                                        setAddGroupLabel('');
                                        setAddGroupRequired(false);
                                        setAddGroupError(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowAddGroup(true)}
                    aria-label='Add customisation group'
                >
                    <Plus className='h-4 w-4' />
                    Add customisation group
                </Button>
            )}
        </div>
    );
}

function extractErrorMessage(error: unknown): string | null {
    if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
    ) {
        return (error as { message: string }).message;
    }
    return null;
}

export default memo(CustomisationManager);
