import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ArrowLeft,
    ChefHat,
    Eye,
    ImagePlus,
    LayoutGrid,
    MoreVertical,
    Plus,
    Search,
    Trash2,
    UtensilsCrossed,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import ErrorState from '@/components/error-state';
import { Field, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
import Spinner from '@/components/spinner';
import { Switch } from '@/components/switch';
import {
    SortableTableHead,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TablePagination,
    TableRow,
    useTableSort,
} from '@/components/table';
import { Textarea } from '@/components/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface: Admin Menu Management (foods + categories) — restyle-only (sprint 11).
//
// Conformed to DESIGN_THEME.md. Business behaviour is UNCHANGED from the existing
// admin foods / food-detail / categories / category-detail surfaces: same table
// columns, same debounced search, same one Add action per view, same single-column
// editor + image upload, same delete confirm dialog. Only the visual + UX
// treatment changes.
//
// Chrome ownership (delta): this surface is an admin PAGE BODY rendered inside
// the AdminAppShell, which owns the real chrome via the shared NavBar. So the top
// nav here is a labelled, muted, dashed sticky PLACEHOLDER — never a re-implemented
// bar — consistent with sibling AdminRefunds / AdminUserManagement / AdminOrderDetail.
//
// Selection controls (delta): single-selects are real selections, never a Button
// in a "selected" style. The editor's Category and Quantity-unit choices are
// ToggleGroup variant="segmented" (active = solid `selected` ink fill). Buttons are
// reserved for ACTIONS only — the one Add / Save per view, row actions, destructive
// Delete.
//
// Two-tone hierarchy (§1/§2): RED (`primary`) is reserved for PRICES only — the one
// loudest thing per screen; every price is crimson. Every structural primary (the
// one Add / Save per view) is a BLACK `selected` pill, not red; availability reads
// as a WORD label + status colour. Elevation (§4): FULL-BLEED — no dark ambient
// frame, no enclosing floating light-gray shell; content sits edge-to-edge on the
// app's neutral canvas (`bg-muted`), with white content / table panels (hairline)
// carrying the only structure, one gentle step per level. Layout (§6): admin volume
// stays a sortable TABLE with search + pagination; the editor is a single-column
// form (labels above fields) with the image upload beneath. States (§8): hover
// darkens; the destructive Delete lives apart from the primary and always routes
// through an explicit confirm dialog.
//
// Mock-only fixtures + local state. No api / model / store imports.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shapes (mock only — mirrors the foods/categories table + editor
// shapes, not the real models).
// ---------------------------------------------------------------------------

interface FoodRow {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    category: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
}

interface CategoryRow {
    id: string;
    name: string;
    foodCount: number;
}

const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`;

const DESCRIPTION_MAX_LENGTH = 50;
const truncate = (text: string) =>
    text.length <= DESCRIPTION_MAX_LENGTH ? text : `${text.slice(0, DESCRIPTION_MAX_LENGTH)}…`;

// ---------------------------------------------------------------------------
// Fixtures — dish names + đồng prices mirror the app's menu content.
// ---------------------------------------------------------------------------

const FOODS: FoodRow[] = [
    {
        id: 'food-1',
        name: 'Margherita pizza',
        description: 'San Marzano tomato, fresh mozzarella, basil on a slow-proved base',
        price: 145_000,
        discountPrice: 125_000,
        category: 'Pizza',
        isAvailable: true,
        stockQuantity: 24,
        quantityUnit: 'g',
    },
    {
        id: 'food-2',
        name: 'Truffle fries',
        description: 'Hand-cut fries, black truffle, parmesan, garlic aioli',
        price: 85_000,
        discountPrice: null,
        category: 'Sides',
        isAvailable: true,
        stockQuantity: 60,
        quantityUnit: 'g',
    },
    {
        id: 'food-3',
        name: 'Iced oat latte',
        description: 'Double espresso, barista oat milk, over ice',
        price: 45_000,
        discountPrice: null,
        category: 'Drinks',
        isAvailable: true,
        stockQuantity: 120,
        quantityUnit: 'ml',
    },
    {
        id: 'food-4',
        name: 'Burrata & heirloom tomato',
        description: 'Creamy burrata, heirloom tomatoes, basil oil, sourdough',
        price: 165_000,
        discountPrice: 149_000,
        category: 'Starters',
        isAvailable: false,
        stockQuantity: 0,
        quantityUnit: 'g',
    },
    {
        id: 'food-5',
        name: 'Tiramisu',
        description: 'Mascarpone, espresso-soaked savoiardi, cocoa',
        price: 75_000,
        discountPrice: null,
        category: 'Dessert',
        isAvailable: true,
        stockQuantity: 18,
        quantityUnit: 'g',
    },
];

const CATEGORIES: CategoryRow[] = [
    { id: 'cat-1', name: 'Pizza', foodCount: 8 },
    { id: 'cat-2', name: 'Starters', foodCount: 6 },
    { id: 'cat-3', name: 'Sides', foodCount: 5 },
    { id: 'cat-4', name: 'Drinks', foodCount: 12 },
    { id: 'cat-5', name: 'Dessert', foodCount: 4 },
];

const CATEGORY_OPTIONS = ['Pizza', 'Starters', 'Sides', 'Drinks', 'Dessert'];
const UNIT_OPTIONS = [
    { value: 'g', label: 'g (gram)' },
    { value: 'ml', label: 'ml (milliliters)' },
];

// ---------------------------------------------------------------------------
// Nav placeholder — the admin top nav is owned by the AdminAppShell (which
// carries the shared NavBar); this page body does not re-implement it. It renders
// as a labelled, muted, dashed sticky bar pinned at the top of the shell —
// consistent with sibling AdminRefunds / AdminUserManagement / AdminOrderDetail.
// ---------------------------------------------------------------------------

function NavPlaceholder() {
    return (
        <div className='sticky top-0 z-20 shrink-0 px-3 pt-3 sm:px-5 sm:pt-5'>
            <div className='flex h-14 items-center justify-center rounded-full border border-dashed border-border bg-card/60'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60'>
                    admin top nav placeholder
                </span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Shell — FULL-BLEED. No dark ambient frame, no enclosing floating light-gray
// shell; a single edge-to-edge column on the app's neutral canvas (bg-muted).
// White content / table panels carry the only structure. The nav placeholder is
// pinned at the top; only the page content scrolls beneath it (single scroll
// region, no double scrollbars).
// ---------------------------------------------------------------------------

function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen w-full flex-col overflow-hidden bg-muted'>
            <NavPlaceholder />

            {/* Only the page content scrolls */}
            <div className='min-h-0 flex-1 overflow-y-auto'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Surface header — eyebrow micro-label (UPPERCASE) + one display H1 per page +
// quiet supporting line (theme: typography hierarchy).
// ---------------------------------------------------------------------------

function SurfaceHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
    return (
        <div className='mb-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>{eyebrow}</p>
            <h1 className='mt-1 text-2xl font-bold tracking-tight text-foreground'>{title}</h1>
            <p className='mt-1 text-sm text-muted-foreground'>{subtitle}</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Foods table — on-theme admin table. Search (left) + exactly ONE black
// primary Add (right); price columns crimson; availability as a status badge;
// row actions in a dropdown where Delete is destructive and apart from the
// primary. Mirrors the existing foods columns + sorting.
// ---------------------------------------------------------------------------

function FoodsToolbar({ search, onSearch }: { search: string; onSearch: (v: string) => void }) {
    return (
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
            <InputGroup className='max-w-sm flex-1'>
                <InputGroupInput
                    type='search'
                    aria-label='Search foods'
                    placeholder='Search foods'
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                />
                <InputGroupAddon>
                    <Search className='size-4' />
                </InputGroupAddon>
            </InputGroup>
            {/* The single BLACK structural primary for this view (red stays on prices). */}
            <Button>
                <Plus />
                Add food
            </Button>
        </div>
    );
}

function FoodRowActions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon-sm'>
                    <MoreVertical className='size-4' />
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem>
                    <Eye className='size-4' />
                    View
                </DropdownMenuItem>
                {/* Destructive, set apart from the primary via the menu + confirm flow. */}
                <DropdownMenuItem variant='destructive'>
                    <Trash2 className='size-4' />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function FoodsTableView({ rows }: { rows: FoodRow[] }) {
    const { sortBy, sortOrder, handleSort } = useTableSort<string>();

    return (
        // White table container — a flat surface panel (hairline only, no shadow;
        // soft shadow is reserved for floating chrome). Wide table scrolls
        // horizontally inside its own container (overflow-x-auto also clips the radius).
        <div className='overflow-x-auto rounded-[1.25rem] border bg-card'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableTableHead
                            field='name'
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            className='min-w-[180px]'
                        >
                            Name
                        </SortableTableHead>
                        <TableHead className='min-w-[220px]'>Description</TableHead>
                        <SortableTableHead field='price' sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                            Price
                        </SortableTableHead>
                        <SortableTableHead
                            field='discountPrice'
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                        >
                            Discount
                        </SortableTableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead className='text-right'>Stock</TableHead>
                        <TableHead className='w-[64px] text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(food => (
                        <TableRow key={food.id}>
                            <TableCell className='font-semibold text-foreground'>{food.name}</TableCell>
                            <TableCell
                                className='max-w-[240px] truncate text-muted-foreground'
                                title={food.description}
                            >
                                {truncate(food.description)}
                            </TableCell>
                            {/* Every price is crimson (theme: price emphasis). */}
                            <TableCell className='font-semibold text-primary'>{formatVnd(food.price)}</TableCell>
                            <TableCell
                                className={
                                    food.discountPrice != null ? 'font-semibold text-primary' : 'text-muted-foreground'
                                }
                            >
                                {food.discountPrice != null ? formatVnd(food.discountPrice) : '—'}
                            </TableCell>
                            <TableCell>
                                <Badge variant='outline' className='rounded-full font-normal'>
                                    {food.category}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {food.isAvailable ? (
                                    <Badge variant='success' className='rounded-full'>
                                        Available
                                    </Badge>
                                ) : (
                                    <Badge variant='secondary' className='rounded-full'>
                                        Sold out
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className='text-right tabular-nums text-muted-foreground'>
                                {food.stockQuantity} {food.quantityUnit}
                            </TableCell>
                            <TableCell className='text-right'>
                                <FoodRowActions />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Categories table — the simpler admin table (Name + count + actions). Same
// toolbar grammar: search + one black primary Add.
// ---------------------------------------------------------------------------

function CategoriesTableView({ rows }: { rows: CategoryRow[] }) {
    return (
        <div className='overflow-x-auto rounded-[1.25rem] border bg-card'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='min-w-[220px]'>Name</TableHead>
                        <TableHead>Dishes</TableHead>
                        <TableHead className='w-[64px] text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(category => (
                        <TableRow key={category.id}>
                            <TableCell className='font-semibold text-foreground'>{category.name}</TableCell>
                            <TableCell className='text-muted-foreground'>{category.foodCount} dishes</TableCell>
                            <TableCell className='text-right'>
                                <FoodRowActions />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Delete confirm dialog — the explicit confirm every destructive action routes
// through. Cancel (idle) and Delete (destructive) are the footer pair; the
// destructive action is never adjacent to a page primary (theme).
// ---------------------------------------------------------------------------

function DeleteConfirmDialog({
    open,
    onOpenChange,
    itemName,
    kind,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemName: string;
    kind: string;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {kind}</DialogTitle>
                    <DialogDescription>
                        Delete “{itemName}”? This can’t be undone — it’s removed from the menu right away.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Keep it
                    </Button>
                    <Button variant='destructive' onClick={() => onOpenChange(false)}>
                        <Trash2 />
                        Delete {kind}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ---------------------------------------------------------------------------
// Food editor — SINGLE-COLUMN form (max ~40rem, labels above fields), image
// upload beneath, one black primary Save. The destructive Delete lives in a
// separate danger area, apart from the primary, and opens the confirm dialog.
// Category + unit are real single-selects (ToggleGroup variant="segmented"),
// never a Button in a selected style.
// ---------------------------------------------------------------------------

function ImageTile({ label, onRemove }: { label: string; onRemove?: () => void }) {
    return (
        <div className='group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-muted text-muted-foreground'>
            <UtensilsCrossed className='size-7' aria-hidden />
            <span className='sr-only'>{label}</span>
            {onRemove && (
                <Button
                    type='button'
                    variant='destructive'
                    size='icon-sm'
                    className='absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100'
                    onClick={onRemove}
                    aria-label={`Remove ${label}`}
                >
                    <Trash2 className='size-4' />
                </Button>
            )}
        </div>
    );
}

function FoodEditorView({ mode }: { mode: 'create' | 'edit' }) {
    const isCreate = mode === 'create';
    const [available, setAvailable] = React.useState(true);
    const [category, setCategory] = React.useState(isCreate ? '' : 'Pizza');
    const [unit, setUnit] = React.useState('g');
    const [images, setImages] = React.useState(isCreate ? [] : ['Margherita pizza 1', 'Margherita pizza 2']);
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    return (
        <div className='mx-auto max-w-2xl'>
            <Button variant='ghost' className='mb-6 -ml-2'>
                <ArrowLeft />
                Back to foods
            </Button>

            <SurfaceHeader
                eyebrow={isCreate ? 'NEW DISH' : 'EDIT DISH'}
                title={isCreate ? 'Add a food' : 'Margherita pizza'}
                subtitle='Name it, price it, and add a photo so it looks great on the menu.'
            />

            {/* Single-column form, max ~40rem, labels above fields. */}
            <Card className='rounded-[1.25rem] shadow-none'>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>The essentials diners see on the menu.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className='space-y-6' onSubmit={e => e.preventDefault()}>
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Input
                                defaultValue={isCreate ? '' : 'Margherita pizza'}
                                placeholder='e.g. Margherita pizza'
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea
                                rows={3}
                                defaultValue={
                                    isCreate ? '' : 'San Marzano tomato, fresh mozzarella, basil on a slow-proved base'
                                }
                                placeholder='Tell diners what makes it good'
                            />
                        </Field>

                        <div className='grid gap-6 sm:grid-cols-2'>
                            <Field>
                                <FieldLabel>Price</FieldLabel>
                                <Input type='number' min={0} step={1000} defaultValue={isCreate ? '' : 145000} />
                            </Field>
                            <Field>
                                <FieldLabel>Discount price</FieldLabel>
                                <Input
                                    type='number'
                                    min={0}
                                    step={1000}
                                    defaultValue={isCreate ? '' : 125000}
                                    placeholder='Optional'
                                />
                            </Field>
                        </div>

                        {/* Category — Segmented Choice (single-select); active = solid `selected` ink fill. */}
                        <Field>
                            <FieldLabel htmlFor='category-toggle'>Category</FieldLabel>
                            <ToggleGroup
                                id='category-toggle'
                                type='single'
                                variant='segmented'
                                value={category}
                                onValueChange={value => value && setCategory(value)}
                                className='w-full'
                            >
                                {CATEGORY_OPTIONS.map(option => (
                                    <ToggleGroupItem
                                        key={option}
                                        value={option}
                                        aria-label={option}
                                        className='flex-1 px-3'
                                    >
                                        {option}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </Field>

                        {/* Quantity unit — Segmented Choice (single-select); active = solid `selected` ink fill. */}
                        <Field>
                            <FieldLabel htmlFor='unit-toggle'>Quantity unit</FieldLabel>
                            <ToggleGroup
                                id='unit-toggle'
                                type='single'
                                variant='segmented'
                                value={unit}
                                onValueChange={value => value && setUnit(value)}
                                className='w-full max-w-xs'
                            >
                                {UNIT_OPTIONS.map(option => (
                                    <ToggleGroupItem key={option.value} value={option.value} className='flex-1'>
                                        {option.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </Field>

                        <div className='grid gap-6 sm:grid-cols-2'>
                            <Field>
                                <FieldLabel>Available</FieldLabel>
                                <div className='w-fit'>
                                    <Switch checked={available} onCheckedChange={setAvailable} />
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel>Stock quantity</FieldLabel>
                                <Input type='number' min={0} defaultValue={isCreate ? '' : 24} />
                            </Field>
                        </div>

                        {/* One BLACK structural primary for the editor (red stays on prices). */}
                        <div>
                            <Button type='submit'>{isCreate ? 'Add food' : 'Save changes'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Image upload — beneath the form in the single column. */}
            <Card className='mt-6 rounded-[1.25rem] shadow-none'>
                <CardHeader>
                    <CardTitle>Photos</CardTitle>
                    <CardDescription>A top-down shot makes the dish the hero on the menu.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {images.length > 0 ? (
                        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                            {images.map((label, index) => (
                                <ImageTile
                                    key={label}
                                    label={label}
                                    onRemove={() => setImages(prev => prev.filter((_, i) => i !== index))}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className='text-sm text-muted-foreground'>No photos yet — add one so diners can see it.</p>
                    )}
                    <Button type='button' variant='outline'>
                        <ImagePlus />
                        Upload image
                    </Button>
                </CardContent>
            </Card>

            {/* Danger area — destructive set APART from the primary; opens confirm (edit only). */}
            {!isCreate && (
                <Card className='mt-6 rounded-[1.25rem] border-destructive/30 shadow-none'>
                    <CardHeader>
                        <CardTitle className='text-base'>Danger zone</CardTitle>
                        <CardDescription>Removing a dish takes it off the menu for good.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button type='button' variant='destructive' onClick={() => setDeleteOpen(true)}>
                            <Trash2 />
                            Delete food
                        </Button>
                    </CardContent>
                </Card>
            )}

            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                itemName='Margherita pizza'
                kind='food'
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Foods list page — search + table + pagination, wired for local interaction so
// the search filters and the delete confirm opens from a row.
// ---------------------------------------------------------------------------

function FoodsListPage() {
    const [search, setSearch] = React.useState('');
    const filtered = FOODS.filter(f => f.name.toLowerCase().includes(search.trim().toLowerCase()));

    return (
        <div className='px-3 py-6 sm:px-5'>
            <SurfaceHeader eyebrow='MENU' title='Foods' subtitle='Curate the dishes diners can order.' />
            <FoodsToolbar search={search} onSearch={setSearch} />
            {filtered.length > 0 ? (
                <>
                    <FoodsTableView rows={filtered} />
                    <div className='mt-4'>
                        <TablePagination page={1} totalPages={3} onPageChange={() => undefined} />
                    </div>
                </>
            ) : (
                <div className='rounded-[1.25rem] border border-dashed bg-muted/10 py-16'>
                    <div className='mx-auto flex max-w-sm flex-col items-center text-center'>
                        <span className='mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <ChefHat className='size-5' aria-hidden />
                        </span>
                        <p className='text-sm font-medium text-foreground'>No foods match “{search}”</p>
                        <p className='mt-1 text-sm text-muted-foreground'>Try another name, or add a new dish.</p>
                        <Button className='mt-4'>
                            <Plus />
                            Add food
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Categories list page.
// ---------------------------------------------------------------------------

function CategoriesListPage() {
    const [search, setSearch] = React.useState('');
    const filtered = CATEGORIES.filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase()));

    return (
        <div className='px-3 py-6 sm:px-5'>
            <SurfaceHeader eyebrow='MENU' title='Categories' subtitle='Group dishes so the menu is easy to browse.' />
            <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                <InputGroup className='max-w-sm flex-1'>
                    <InputGroupInput
                        type='search'
                        aria-label='Search categories'
                        placeholder='Search categories'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <InputGroupAddon>
                        <Search className='size-4' />
                    </InputGroupAddon>
                </InputGroup>
                <Button>
                    <Plus />
                    Add category
                </Button>
            </div>
            {filtered.length > 0 ? (
                <CategoriesTableView rows={filtered} />
            ) : (
                <div className='rounded-[1.25rem] border border-dashed bg-muted/10 py-16'>
                    <div className='mx-auto flex max-w-sm flex-col items-center text-center'>
                        <span className='mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <LayoutGrid className='size-5' aria-hidden />
                        </span>
                        <p className='text-sm font-medium text-foreground'>No categories match “{search}”</p>
                        <p className='mt-1 text-sm text-muted-foreground'>Try another name, or add a new one.</p>
                        <Button className='mt-4'>
                            <Plus />
                            Add category
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Admin Menu Management',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Foods table (default) — the foods list restyled on-theme: eyebrow + display
 * H1, a search field and exactly ONE black primary Add, a sortable admin table
 * with crimson prices and a status badge for availability, and per-row actions
 * where Delete is destructive and apart from the primary. The admin top nav is
 * the shell-owned placeholder.
 */
export const FoodsTable: Story = {
    name: 'Foods Table (Default)',
    render: () => (
        <AdminShell>
            <FoodsListPage />
        </AdminShell>
    ),
};

/**
 * Foods empty — search matches nothing: an illustration + a single Add CTA, no
 * dead end (theme: empty/onboarding).
 */
export const FoodsEmpty: Story = {
    name: 'Foods Table (Empty)',
    render: () => (
        <AdminShell>
            <div className='px-3 py-6 sm:px-5'>
                <SurfaceHeader eyebrow='MENU' title='Foods' subtitle='Curate the dishes diners can order.' />
                <FoodsToolbar search='pho' onSearch={() => undefined} />
                <div className='rounded-[1.25rem] border border-dashed bg-muted/10 py-16'>
                    <div className='mx-auto flex max-w-sm flex-col items-center text-center'>
                        <span className='mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <ChefHat className='size-5' aria-hidden />
                        </span>
                        <p className='text-sm font-medium text-foreground'>No foods match “pho”</p>
                        <p className='mt-1 text-sm text-muted-foreground'>Try another name, or add a new dish.</p>
                        <Button className='mt-4'>
                            <Plus />
                            Add food
                        </Button>
                    </div>
                </div>
            </div>
        </AdminShell>
    ),
};

/**
 * Foods loading — the list is fetching; a centered spinner holds the content
 * zone while the shell chrome stays put.
 */
export const FoodsLoading: Story = {
    name: 'Foods Table (Loading)',
    render: () => (
        <AdminShell>
            <div className='px-3 py-6 sm:px-5'>
                <SurfaceHeader eyebrow='MENU' title='Foods' subtitle='Curate the dishes diners can order.' />
                <div className='flex min-h-[360px] items-center justify-center rounded-[1.25rem] border bg-card'>
                    <Spinner size='lg' />
                </div>
            </div>
        </AdminShell>
    ),
};

/**
 * Foods error — the list failed to load; the on-theme error state says what to
 * do next rather than only what failed (theme: voice).
 */
export const FoodsError: Story = {
    name: 'Foods Table (Error)',
    render: () => (
        <AdminShell>
            <div className='px-3 py-6 sm:px-5'>
                <SurfaceHeader eyebrow='MENU' title='Foods' subtitle='Curate the dishes diners can order.' />
                <div className='flex min-h-[360px] items-center justify-center rounded-[1.25rem] border bg-card'>
                    <ErrorState
                        title='Couldn’t load foods'
                        description='Check your connection and try again in a moment.'
                        iconSize='sm'
                        action={<Button variant='outline'>Try again</Button>}
                    />
                </div>
            </div>
        </AdminShell>
    ),
};

/**
 * Food editor (add) — the single-column create form: labels above fields, image
 * upload beneath, one black primary Add. Category + unit are segmented
 * single-selects. No danger zone in create mode.
 */
export const FoodEditorAdd: Story = {
    name: 'Food Editor Form (Add)',
    render: () => (
        <AdminShell>
            <div className='px-3 py-6 sm:px-5'>
                <FoodEditorView mode='create' />
            </div>
        </AdminShell>
    ),
};

/**
 * Food editor (edit) — the single-column edit form with existing values +
 * photos, one black primary Save, and a separate danger area for the
 * destructive Delete (apart from the primary, routes through confirm).
 */
export const FoodEditorEdit: Story = {
    name: 'Food Editor Form (Edit)',
    render: () => (
        <AdminShell>
            <div className='px-3 py-6 sm:px-5'>
                <FoodEditorView mode='edit' />
            </div>
        </AdminShell>
    ),
};

/**
 * Categories table — the categories list restyled on-theme: same toolbar
 * grammar (search + one black Add) and the simpler admin table.
 */
export const CategoriesTable: Story = {
    name: 'Categories Table',
    render: () => (
        <AdminShell>
            <CategoriesListPage />
        </AdminShell>
    ),
};

/**
 * Delete confirm — the explicit confirm dialog every destructive action routes
 * through. Keep it (idle) and Delete (destructive) are the footer pair; the
 * destructive button is never adjacent to a page primary.
 */
export const DeleteConfirm: Story = {
    name: 'Delete Confirm Dialog',
    render: () => {
        function DeleteConfirmHarness() {
            const [open, setOpen] = React.useState(true);
            return (
                <AdminShell>
                    <div className='px-3 py-6 sm:px-5'>
                        <SurfaceHeader eyebrow='MENU' title='Foods' subtitle='Curate the dishes diners can order.' />
                        <FoodsToolbar search='' onSearch={() => undefined} />
                        <FoodsTableView rows={FOODS} />
                        {!open && (
                            <div className='mt-4'>
                                <Button variant='outline' onClick={() => setOpen(true)}>
                                    <Trash2 />
                                    Reopen delete confirm
                                </Button>
                            </div>
                        )}
                    </div>
                    <DeleteConfirmDialog open={open} onOpenChange={setOpen} itemName='Margherita pizza' kind='food' />
                </AdminShell>
            );
        }
        return <DeleteConfirmHarness />;
    },
};
