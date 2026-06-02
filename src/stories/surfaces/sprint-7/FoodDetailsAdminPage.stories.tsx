import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';
import { Switch } from '@/components/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CustomisationOption {
    id: string;
    label: string;
    surcharge: number | null;
}

interface CustomisationGroup {
    id: string;
    label: string;
    required: boolean;
    options: CustomisationOption[];
}

interface AdminFoodItem {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    customisationGroups: CustomisationGroup[];
}

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

const MOCK_FOOD: AdminFoodItem = {
    id: 'food-1',
    name: 'Grilled Salmon',
    category: 'Mains',
    basePrice: 185000,
    customisationGroups: [
        {
            id: 'group-size',
            label: 'Portion size',
            required: true,
            options: [
                { id: 'opt-regular', label: 'Regular (180 g)', surcharge: null },
                { id: 'opt-large', label: 'Large (260 g)', surcharge: 30000 },
            ],
        },
        {
            id: 'group-spice',
            label: 'Spice level',
            required: false,
            options: [
                { id: 'opt-mild', label: 'Mild', surcharge: null },
                { id: 'opt-medium', label: 'Medium', surcharge: null },
                { id: 'opt-hot', label: 'Hot', surcharge: null },
            ],
        },
    ],
};

// ---------------------------------------------------------------------------
// Admin shell layout
// ---------------------------------------------------------------------------

function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {/* Nav — placeholder; exists in current system, not changed by this sprint */}
            <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
                <div className='h-px w-6 bg-muted-foreground/30' />
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    nav placeholder
                </span>
                <div className='h-px w-6 bg-muted-foreground/30' />
            </div>

            {/* Page content */}
            <div className='mx-auto max-w-5xl px-6 py-8'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Customisation groups table
// ---------------------------------------------------------------------------

interface GroupsTableProps {
    groups: CustomisationGroup[];
    onDeleteGroup?: (groupId: string) => void;
    onDeleteOption?: (groupId: string, optionId: string) => void;
    onAddOption?: (groupId: string) => void;
}

function CustomisationGroupsTable({ groups, onDeleteGroup, onDeleteOption, onAddOption }: GroupsTableProps) {
    if (groups.length === 0) {
        return (
            <div className='rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground'>
                No customisation groups yet. Add one to get started.
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {groups.map(group => (
                <div key={group.id} className='overflow-hidden rounded-lg border'>
                    {/* Group header row */}
                    <div className='flex items-center justify-between bg-muted/40 px-4 py-3'>
                        <div className='flex items-center gap-3'>
                            <span className='text-sm font-semibold text-foreground'>{group.label}</span>
                            <Badge variant={group.required ? 'default' : 'secondary'} className='text-xs'>
                                {group.required ? 'Required' : 'Optional'}
                            </Badge>
                        </div>
                        <div className='flex items-center gap-2'>
                            {onAddOption && (
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-7 gap-1 text-xs'
                                    onClick={() => onAddOption(group.id)}
                                >
                                    <Plus className='h-3 w-3' />
                                    Add option
                                </Button>
                            )}
                            {onDeleteGroup && (
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-7 text-destructive hover:bg-destructive/10 hover:text-destructive'
                                    onClick={() => onDeleteGroup(group.id)}
                                >
                                    <Trash2 className='h-3.5 w-3.5' />
                                </Button>
                            )}
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
                                <TableRow key={opt.id}>
                                    <TableCell className='text-sm font-medium'>{opt.label}</TableCell>
                                    <TableCell className='text-sm text-muted-foreground'>
                                        {opt.surcharge ? (
                                            <span className='font-semibold text-primary'>
                                                +{formatVnd(opt.surcharge)}
                                            </span>
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        {onDeleteOption && (
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='h-7 w-7 text-muted-foreground hover:text-destructive'
                                                onClick={() => onDeleteOption(group.id, opt.id)}
                                            >
                                                <Trash2 className='h-3.5 w-3.5' />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story: Default
// ---------------------------------------------------------------------------

function DefaultAdminPage() {
    const [groups, setGroups] = useState<CustomisationGroup[]>(MOCK_FOOD.customisationGroups);

    const handleDeleteGroup = (groupId: string) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
    };

    const handleDeleteOption = (groupId: string, optionId: string) => {
        setGroups(prev =>
            prev.map(g => (g.id === groupId ? { ...g, options: g.options.filter(o => o.id !== optionId) } : g))
        );
    };

    return (
        <AdminShell>
            {/* Food header */}
            <div className='mb-8 flex items-start justify-between'>
                <div>
                    <div className='mb-1 flex items-center gap-2'>
                        <Badge variant='outline' className='text-xs'>
                            {MOCK_FOOD.category}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>ID: {MOCK_FOOD.id}</span>
                    </div>
                    <h1 className='text-2xl font-bold text-foreground'>{MOCK_FOOD.name}</h1>
                    <p className='mt-1 text-sm text-muted-foreground'>
                        Base price:{' '}
                        <span className='font-semibold text-foreground'>{formatVnd(MOCK_FOOD.basePrice)}</span>
                    </p>
                </div>
                <Button variant='outline' size='sm' className='gap-2'>
                    <Pencil className='h-3.5 w-3.5' />
                    Edit food
                </Button>
            </div>

            <Separator className='mb-8' />

            {/* Customisation section */}
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h2 className='text-base font-semibold text-foreground'>Customisation groups</h2>
                        <p className='text-xs text-muted-foreground'>
                            {groups.length} group{groups.length !== 1 ? 's' : ''} configured
                        </p>
                    </div>
                    <Button size='sm' className='gap-2'>
                        <Plus className='h-4 w-4' />
                        Add group
                    </Button>
                </div>

                <CustomisationGroupsTable
                    groups={groups}
                    onDeleteGroup={handleDeleteGroup}
                    onDeleteOption={handleDeleteOption}
                    onAddOption={() => {}}
                />
            </div>
        </AdminShell>
    );
}

// ---------------------------------------------------------------------------
// Story: AddGroup — dialog open
// ---------------------------------------------------------------------------

function AddGroupPage() {
    const [label, setLabel] = useState('');
    const [required, setRequired] = useState(false);

    return (
        <AdminShell>
            <div className='mb-8 flex items-start justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-foreground'>{MOCK_FOOD.name}</h1>
                    <p className='mt-1 text-sm text-muted-foreground'>
                        Base price:{' '}
                        <span className='font-semibold text-foreground'>{formatVnd(MOCK_FOOD.basePrice)}</span>
                    </p>
                </div>
            </div>

            <Separator className='mb-8' />

            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-base font-semibold text-foreground'>Customisation groups</h2>
                    <Button size='sm' className='gap-2'>
                        <Plus className='h-4 w-4' />
                        Add group
                    </Button>
                </div>

                <CustomisationGroupsTable
                    groups={MOCK_FOOD.customisationGroups}
                    onDeleteGroup={() => {}}
                    onDeleteOption={() => {}}
                    onAddOption={() => {}}
                />
            </div>

            {/* Add group dialog — shown open */}
            <Dialog open>
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
                                value={label}
                                onChange={e => setLabel(e.target.value)}
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
                            <Switch id='group-required' checked={required} onCheckedChange={setRequired} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant='outline'>Cancel</Button>
                        <Button disabled={!label.trim()}>Save group</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminShell>
    );
}

// ---------------------------------------------------------------------------
// Story: AddOption — dialog open
// ---------------------------------------------------------------------------

function AddOptionPage() {
    const [optLabel, setOptLabel] = useState('');
    const [surcharge, setSurcharge] = useState('');

    return (
        <AdminShell>
            <div className='mb-8 flex items-start justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-foreground'>{MOCK_FOOD.name}</h1>
                    <p className='mt-1 text-sm text-muted-foreground'>
                        Base price:{' '}
                        <span className='font-semibold text-foreground'>{formatVnd(MOCK_FOOD.basePrice)}</span>
                    </p>
                </div>
            </div>

            <Separator className='mb-8' />

            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-base font-semibold text-foreground'>Customisation groups</h2>
                </div>

                <CustomisationGroupsTable
                    groups={MOCK_FOOD.customisationGroups}
                    onDeleteGroup={() => {}}
                    onDeleteOption={() => {}}
                    onAddOption={() => {}}
                />
            </div>

            {/* Add option dialog — shown open, targeting "Portion size" group */}
            <Dialog open>
                <DialogContent className='sm:max-w-[420px]'>
                    <DialogHeader>
                        <DialogTitle>Add option to Portion size</DialogTitle>
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
                                value={surcharge}
                                onChange={e => setSurcharge(e.target.value)}
                                min={0}
                            />
                            <p className='text-xs text-muted-foreground'>
                                Enter the additional amount customers pay for this option. Leave blank if there is no
                                surcharge.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant='outline'>Cancel</Button>
                        <Button disabled={!optLabel.trim()}>Save option</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Loading skeleton
// ---------------------------------------------------------------------------

function AdminLoadingPage() {
    return (
        <AdminShell>
            <div className='mb-8 flex items-start justify-between'>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-8 w-56' />
                    <Skeleton className='h-4 w-36' />
                </div>
                <Skeleton className='h-8 w-24 rounded-md' />
            </div>

            <Separator className='mb-8' />

            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                        <Skeleton className='h-5 w-48' />
                        <Skeleton className='h-3 w-28' />
                    </div>
                    <Skeleton className='h-8 w-28 rounded-md' />
                </div>

                {/* Skeleton group 1 */}
                <div className='overflow-hidden rounded-lg border'>
                    <div className='flex items-center justify-between bg-muted/40 px-4 py-3'>
                        <Skeleton className='h-5 w-32' />
                        <div className='flex gap-2'>
                            <Skeleton className='h-7 w-24 rounded-md' />
                            <Skeleton className='h-7 w-7 rounded-md' />
                        </div>
                    </div>
                    <div className='divide-y'>
                        {[1, 2].map(i => (
                            <div key={i} className='flex items-center justify-between px-4 py-3'>
                                <Skeleton className='h-4 w-40' />
                                <Skeleton className='h-4 w-16' />
                                <Skeleton className='h-7 w-7 rounded-md' />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skeleton group 2 */}
                <div className='overflow-hidden rounded-lg border'>
                    <div className='flex items-center justify-between bg-muted/40 px-4 py-3'>
                        <Skeleton className='h-5 w-24' />
                        <div className='flex gap-2'>
                            <Skeleton className='h-7 w-24 rounded-md' />
                            <Skeleton className='h-7 w-7 rounded-md' />
                        </div>
                    </div>
                    <div className='divide-y'>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='flex items-center justify-between px-4 py-3'>
                                <Skeleton className='h-4 w-32' />
                                <Skeleton className='h-4 w-12' />
                                <Skeleton className='h-7 w-7 rounded-md' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Food Details Admin Page',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default — Customisation Groups',
    render: () => <DefaultAdminPage />,
};

export const AddGroup: Story = {
    name: 'Add Customisation Group — Dialog Open',
    render: () => <AddGroupPage />,
};

export const AddOption: Story = {
    name: 'Add Option to Group — Dialog Open',
    render: () => <AddOptionPage />,
};

export const Loading: Story = {
    name: 'Loading — Skeleton',
    render: () => <AdminLoadingPage />,
};
