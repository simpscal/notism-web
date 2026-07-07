import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    AlertTriangle,
    ArrowLeft,
    CakeSlice,
    Check,
    CupSoda,
    Minus,
    Plus,
    Salad,
    Sandwich,
    Search,
    ShoppingBag,
    UtensilsCrossed,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import Banner from '@/components/banner';
import { Button } from '@/components/button';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface — DishDetail (/foods/:id), styled to DESIGN_THEME.md.
//
// Business behaviour mirrors src/pages/food-detail — the same single-select
// option groups (SIZE, BUILD YOUR MEAL) read as pills, the same quantity
// stepper, the same add-to-order flow with a success banner, and the same
// required-option gating. Visuals follow the theme:
//
//   • Elevation ladder — dark ambient FRAME → one large-radius light-gray
//     SHELL → white content PANEL (hairline + faint shadow) → white cards /
//     tiles (hairline, little to no shadow). One gentle step per level; no
//     heavy rings or shadows.
//   • Floating toolbar — the shared, domain-blind NavBar (consumer variant): a
//     large-radius rounded bar that floats inside the shell with margin all
//     around. Brand left, nav centre (the active tab is a real navigation
//     selection via NavBarItem's aria-current — a white pill with a crimson
//     icon + label, never a Button in a selected style), search + the Cart
//     action right. Pinned above the scroll zone; condensed on mobile.
//   • Scrolling — the shell fills the viewport; only the content zone scrolls
//     within it; the toolbar stays pinned. No double scrollbars.
//   • Item detail — one large dish image is the single focus, one
//     display-weight title, an always-visible Add control. Options sit under
//     UPPERCASE eyebrow labels: SIZE is a single-select ToggleGroup (segmented
//     variant) — a muted track whose chosen pill fills BLACK, never a Button in
//     a selected style; BUILD YOUR MEAL is an Icon Toggle Grid of square tiles
//     with a black-circle checkmark badge when selected (native radiogroup, no
//     Button component). Quantity uses circular −/+ steppers. The dish price is the one
//     loudest CRIMSON element; Add to order is the BLACK split-pill (price left |
//     divider | label right) — never red. The Cart action lives in the NavBar's
//     actions slot for the viewport.
//
// Story-only: mock fixtures + a local interaction harness. No api / model /
// state / feature imports; composed only from @/components/*.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shapes (mock only — mirrors the CustomisationGroupModel data shape)
// ---------------------------------------------------------------------------

interface OptionFixture {
    value: string;
    label: string;
    surcharge?: number;
}

interface OptionGroupFixture {
    id: string;
    /** UPPERCASE eyebrow label — SIZE, BUILD YOUR MEAL. */
    label: string;
    required: boolean;
    /**
     * How the single-select group renders per the theme's named components:
     *   • 'segmented' → Segmented Choice (row of pills, active = black fill).
     *   • 'grid'      → Icon Toggle Grid (square tiles, black checkmark badge).
     */
    presentation: 'segmented' | 'grid';
    options: OptionFixture[];
}

interface DishFixture {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string;
    quantityUnit: string;
    stockQuantity: number;
    isAvailable: boolean;
    customisations: OptionGroupFixture[];
}

// ---------------------------------------------------------------------------
// Fixture — a single hero dish with two single-select option groups.
// ---------------------------------------------------------------------------

const DISH: DishFixture = {
    id: 'food-crispy-chicken',
    name: 'Crispy chicken burger',
    description:
        'Buttermilk-brined chicken thigh, double-fried for crunch, stacked with pickles and house sauce in a toasted brioche bun.',
    category: 'Burgers',
    price: 89000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    quantityUnit: '1 burger',
    stockQuantity: 24,
    isAvailable: true,
    customisations: [
        {
            id: 'size',
            label: 'Size',
            required: true,
            presentation: 'segmented',
            options: [
                { value: 'single', label: 'Single' },
                { value: 'double', label: 'Double', surcharge: 25000 },
                { value: 'triple', label: 'Triple', surcharge: 45000 },
            ],
        },
        {
            id: 'meal',
            label: 'Build your meal',
            required: false,
            presentation: 'grid',
            options: [
                { value: 'solo', label: 'Burger only' },
                { value: 'fries', label: '+ Fries', surcharge: 20000 },
                { value: 'combo', label: '+ Fries & drink', surcharge: 35000 },
            ],
        },
    ],
};

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Consumer nav model — the menu categories from the reference toolbar. The
// active item takes the crimson accent (theme: active nav = crimson).
// ---------------------------------------------------------------------------

interface NavItem {
    key: string;
    label: string;
    icon: typeof UtensilsCrossed;
}

const NAV_ITEMS: NavItem[] = [
    { key: 'main', label: 'Main dishes', icon: UtensilsCrossed },
    { key: 'vegan', label: 'Vegan', icon: Salad },
    { key: 'street', label: 'Street food', icon: Sandwich },
    { key: 'desserts', label: 'Desserts', icon: CakeSlice },
    { key: 'drinks', label: 'Drinks', icon: CupSoda },
];

// ---------------------------------------------------------------------------
// Ambient frame — the dark charcoal backdrop with a low-contrast, purely
// decorative line-art motif. Never carries controls or content; always sits
// BEHIND the light shell. Fixed to the viewport so the shell (and only its
// content zone) does the scrolling.
// ---------------------------------------------------------------------------

function AmbientLineArt() {
    return (
        <svg
            aria-hidden
            className='pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]'
            preserveAspectRatio='xMidYMid slice'
        >
            <defs>
                <pattern id='dish-shell-motif' width='180' height='180' patternUnits='userSpaceOnUse'>
                    <circle cx='40' cy='40' r='26' fill='none' stroke='currentColor' strokeWidth='1.5' />
                    <path d='M40 14v52M14 40h52' stroke='currentColor' strokeWidth='1.5' />
                    <path
                        d='M120 120c22 0 34-14 34-32M120 120c-20 0-34-12-34-30M120 120v34'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                    />
                </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#dish-shell-motif)' />
        </svg>
    );
}

function AmbientFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative flex h-screen w-full overflow-hidden bg-[#131316] p-3 sm:p-4 lg:p-6'>
            <AmbientLineArt />
            <div className='relative z-10 flex min-h-0 w-full'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Floating toolbar — the shared, domain-blind NavBar (consumer variant): a
// large-radius rounded white bar that FLOATS inside the shell (the shell padding
// gives it margin on all sides; never edge-to-edge). Brand slot left · nav-items
// region center (the active tab is a real navigation selection — a white pill w/
// crimson icon+label via NavBarItem's aria-current, never a Button in a selected
// style) · actions slot right (search + the Cart action). Nav collapses on
// mobile; the bar stays a floating pill (never full-bleed).
// ---------------------------------------------------------------------------

function ShellTopbar({ activeNav = 'main' }: { activeNav?: string }) {
    return (
        <div className='shrink-0 p-3 sm:p-4'>
            <NavBar>
                <NavBarBrand>
                    <span className='px-1 text-lg font-bold tracking-tight text-primary'>Notism</span>
                </NavBarBrand>

                <NavBarNav className='hidden flex-1 justify-center lg:flex'>
                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        return (
                            <NavBarItem key={item.key} active={item.key === activeNav}>
                                <Icon className='size-4' aria-hidden />
                                {item.label}
                            </NavBarItem>
                        );
                    })}
                </NavBarNav>

                <NavBarActions>
                    <button
                        type='button'
                        aria-label='Search the menu'
                        className='flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground'
                    >
                        <Search className='size-4' aria-hidden />
                    </button>
                    {/* Cart pill — the toolbar's cart action (an action Button, not a selected-state control). */}
                    <Button className='rounded-full px-4'>
                        <ShoppingBag className='size-4' aria-hidden />
                        Cart
                    </Button>
                </NavBarActions>
            </NavBar>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Shell — one large-radius light-gray shell filling the frame. Holds the
// pinned toolbar plus a single scrolling content zone.
// ---------------------------------------------------------------------------

function DishShell({ children }: { children: React.ReactNode }) {
    return (
        <AmbientFrame>
            <div className='flex min-h-0 w-full flex-col overflow-hidden rounded-[2rem] bg-secondary/60 sm:rounded-[2.5rem]'>
                <ShellTopbar />
                <div className='min-h-0 flex-1 overflow-y-auto'>{children}</div>
            </div>
        </AmbientFrame>
    );
}

// ---------------------------------------------------------------------------
// Content panel — the white surface the dish content lives on: hairline +
// faint shadow, one gentle step above the light-gray shell.
// ---------------------------------------------------------------------------

function ContentPanel({ children }: { children: React.ReactNode }) {
    return (
        <div className='mx-auto w-full max-w-6xl px-3 pb-6 sm:px-4 lg:px-6'>
            <div className='rounded-[1.75rem] bg-card p-5 shadow-sm ring-1 ring-border/60 sm:p-8 lg:p-10'>
                {children}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Eyebrow — the shared micro-label treatment (UPPERCASE, small, letter-spaced,
// muted). Used for the category and every option group.
// ---------------------------------------------------------------------------

function Eyebrow({ children }: { children: React.ReactNode }) {
    return <span className='text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground'>{children}</span>;
}

// ---------------------------------------------------------------------------
// Group header — the shared UPPERCASE eyebrow + optional Required tag, reused by
// both the Segmented Choice row and the Icon Toggle Grid.
// ---------------------------------------------------------------------------

function GroupHeader({ group }: { group: OptionGroupFixture }) {
    return (
        <div className='flex items-center gap-2'>
            <Eyebrow>{group.label}</Eyebrow>
            {group.required && (
                <Badge variant='secondary' className='rounded-full px-2 py-0 text-[10px] font-medium'>
                    Required
                </Badge>
            )}
        </div>
    );
}

interface OptionGroupProps {
    group: OptionGroupFixture;
    selected?: string;
    onSelect?: (groupId: string, value: string) => void;
}

// ---------------------------------------------------------------------------
// Segmented Choice (§5) — SIZE as a single-select ToggleGroup (segmented
// variant): a muted rounded track whose chosen pill fills solid black
// (data-[state=on] → bg-selected). Exactly one selected per row, expressed as a
// real toggle selection — never a Button in a "selected" style. Guarding the
// empty value keeps the required size from clearing on a re-click.
// ---------------------------------------------------------------------------

function SegmentedChoice({ group, selected, onSelect }: OptionGroupProps) {
    return (
        <div className='space-y-3'>
            <GroupHeader group={group} />
            <ToggleGroup
                type='single'
                variant='segmented'
                value={selected ?? ''}
                onValueChange={value => value && onSelect?.(group.id, value)}
                aria-label={group.label}
            >
                {group.options.map(opt => (
                    <ToggleGroupItem key={opt.value} value={opt.value} className='h-11 gap-1.5 px-5'>
                        <span className='font-medium'>{opt.label}</span>
                        {opt.surcharge ? <span className='text-xs opacity-70'>+{formatVnd(opt.surcharge)}</span> : null}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Icon Toggle Grid (§5) — BUILD YOUR MEAL square rounded tiles. Idle = white +
// hairline; selected = darkened border + a black-circle checkmark badge pinned
// bottom-right. Single-select here (preserves the surface's option-group
// behaviour); the same tile pattern serves multi-select add-ons elsewhere.
// ---------------------------------------------------------------------------

const MEAL_ICONS: Record<string, typeof Sandwich> = {
    solo: Sandwich,
    fries: UtensilsCrossed,
    combo: CupSoda,
};

function IconToggleGrid({ group, selected, onSelect }: OptionGroupProps) {
    return (
        <div className='space-y-3'>
            <GroupHeader group={group} />
            <div className='grid grid-cols-3 gap-3' role='radiogroup' aria-label={group.label}>
                {group.options.map(opt => {
                    const isSelected = selected === opt.value;
                    const Icon = MEAL_ICONS[opt.value] ?? UtensilsCrossed;
                    return (
                        <button
                            key={opt.value}
                            type='button'
                            role='radio'
                            aria-checked={isSelected}
                            onClick={() => onSelect?.(group.id, opt.value)}
                            className={[
                                'relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-3 text-center transition-colors',
                                isSelected
                                    ? 'border-foreground ring-1 ring-foreground'
                                    : 'border-border hover:border-foreground/40',
                            ].join(' ')}
                        >
                            <Icon
                                className={isSelected ? 'size-7 text-foreground' : 'size-7 text-muted-foreground'}
                                aria-hidden
                            />
                            <span className='text-xs font-medium leading-tight text-foreground'>{opt.label}</span>
                            {opt.surcharge ? (
                                <span className='text-[11px] text-muted-foreground'>+{formatVnd(opt.surcharge)}</span>
                            ) : null}
                            {isSelected && (
                                <span className='absolute bottom-2 right-2 flex size-5 items-center justify-center rounded-full bg-selected text-selected-foreground motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-200 motion-safe:ease-out'>
                                    <Check className='size-3' />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function OptionGroup({ group, selected, onSelect }: OptionGroupProps) {
    const Renderer = group.presentation === 'grid' ? IconToggleGrid : SegmentedChoice;
    return <Renderer group={group} selected={selected} onSelect={onSelect} />;
}

// ---------------------------------------------------------------------------
// Quantity Stepper (§5) — circular −/+ buttons flanking the numeral. Product-page
// context → white on hairline (the cart-row context inverts to white-on-black).
// ---------------------------------------------------------------------------

interface QuantityStepperProps {
    quantity: number;
    max: number;
    onDecrement?: () => void;
    onIncrement?: () => void;
}

function QuantityStepper({ quantity, max, onDecrement, onIncrement }: QuantityStepperProps) {
    return (
        <div className='flex items-center gap-4' aria-label='Quantity'>
            <Button
                type='button'
                variant='outline'
                size='icon'
                className='rounded-full'
                aria-label='Decrease quantity'
                disabled={quantity <= 1}
                onClick={onDecrement}
            >
                <Minus className='h-4 w-4' />
            </Button>
            <span className='w-8 text-center text-lg font-bold tabular-nums text-foreground' aria-live='polite'>
                {quantity}
            </span>
            <Button
                type='button'
                variant='outline'
                size='icon'
                className='rounded-full'
                aria-label='Increase quantity'
                disabled={quantity >= max}
                onClick={onIncrement}
            >
                <Plus className='h-4 w-4' />
            </Button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Dish content zone — the fully-implemented surface. Single focus: large image
// (left) + title / price / options / add control (right).
// ---------------------------------------------------------------------------

interface DishContentProps {
    dish: DishFixture;
    selections: Record<string, string>;
    quantity: number;
    added: boolean;
    onSelect?: (groupId: string, value: string) => void;
    onDecrement?: () => void;
    onIncrement?: () => void;
    onAdd?: () => void;
    onDismiss?: () => void;
}

function DishContent({
    dish,
    selections,
    quantity,
    added,
    onSelect,
    onDecrement,
    onIncrement,
    onAdd,
    onDismiss,
}: DishContentProps) {
    const surcharge = dish.customisations.reduce((sum, group) => {
        const chosen = selections[group.id];
        const opt = group.options.find(o => o.value === chosen);
        return sum + (opt?.surcharge ?? 0);
    }, 0);
    const effectivePrice = dish.discountPrice ?? dish.price;
    const unitPrice = effectivePrice + surcharge;
    const total = unitPrice * quantity;

    const requiredMet = dish.customisations.filter(g => g.required).every(g => !!selections[g.id]);

    return (
        <div>
            {/* Back to menu — existing flow, preserved */}
            <button
                type='button'
                className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
                <ArrowLeft className='h-4 w-4' />
                Back to menu
            </button>

            {/* Add-to-order feedback — animates 150–250ms ease-out, motion-safe
                only so reduced-motion falls back to instant */}
            {added && (
                <div className='mb-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 motion-safe:duration-200 motion-safe:ease-out'>
                    <Banner
                        variant='success'
                        icon={<Check className='h-5 w-5' />}
                        message={
                            <span>
                                Added {quantity} × {dish.name} to your order
                                <span className='ml-2 font-normal text-success/80'>{formatVnd(total)}</span>
                            </span>
                        }
                        action={
                            <Button variant='outline' size='sm' className='rounded-full'>
                                View order
                            </Button>
                        }
                        onClose={onDismiss}
                    />
                </div>
            )}

            <div className='grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14'>
                {/* Single focus — large dish image (a white tile with a hairline) */}
                <div className='relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary ring-1 ring-border/60'>
                    <img src={dish.imageUrl} alt={dish.name} className='absolute inset-0 h-full w-full object-cover' />
                    {!dish.isAvailable && (
                        <div className='absolute inset-0 flex items-center justify-center bg-card/80'>
                            <span className='rounded-full bg-muted px-6 py-3 text-lg font-semibold uppercase tracking-widest text-foreground'>
                                Sold out
                            </span>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className='flex flex-col'>
                    <div className='mb-3'>
                        <Eyebrow>{dish.category}</Eyebrow>
                    </div>

                    {/* One display-weight title — Display 32–40px, one per page */}
                    <h1 className='text-[2rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2.5rem]'>
                        {dish.name}
                    </h1>

                    <p className='mt-4 text-base leading-relaxed text-muted-foreground'>{dish.description}</p>

                    <div className='mt-5 flex flex-wrap gap-2'>
                        <Badge variant='secondary' className='rounded-full px-3 py-1 text-xs font-medium'>
                            {dish.quantityUnit}
                        </Badge>
                        <Badge variant='secondary' className='rounded-full px-3 py-1 text-xs font-medium'>
                            {dish.stockQuantity} left
                        </Badge>
                    </div>

                    {/* Price — the single loudest red on the screen (crimson, bold) */}
                    <div className='mt-6 flex items-baseline gap-3'>
                        <span className='text-3xl font-bold tabular-nums text-primary'>{formatVnd(unitPrice)}</span>
                        {surcharge > 0 && (
                            <span className='text-sm text-muted-foreground'>
                                base {formatVnd(effectivePrice)} + {formatVnd(surcharge)}
                            </span>
                        )}
                    </div>

                    <Separator className='my-7' />

                    {/* Option groups under eyebrow labels */}
                    <div className='space-y-7'>
                        {dish.customisations.map(group => (
                            <OptionGroup
                                key={group.id}
                                group={group}
                                selected={selections[group.id]}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>

                    {/* Quantity + always-visible add control */}
                    <div className='sticky bottom-0 z-10 mt-8 border-t border-border bg-card pt-5 pb-1 sm:static sm:border-t-0 sm:pb-0'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <QuantityStepper
                                quantity={quantity}
                                max={dish.stockQuantity}
                                onDecrement={onDecrement}
                                onIncrement={onIncrement}
                            />
                            {/* Add to order (§5 Primary CTA) — BLACK split-pill: price
                                (left) | thin divider | action label (right). Never red;
                                the loudest red on the screen is the dish price above.
                                Add-feedback settles in 150–250ms ease-out. */}
                            <Button
                                type='button'
                                className='bg-selected text-selected-foreground hover:bg-selected/90 h-14 flex-1 gap-0 rounded-full p-0 text-base transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:active:scale-[0.98]'
                                disabled={!dish.isAvailable || !requiredMet}
                                onClick={onAdd}
                            >
                                <span className='flex h-full items-center px-6 font-bold tabular-nums'>
                                    {formatVnd(total)}
                                </span>
                                <span className='h-7 w-px shrink-0 bg-selected-foreground/25' aria-hidden />
                                <span className='flex h-full flex-1 items-center justify-center gap-2 px-6 font-semibold'>
                                    <ShoppingBag className='h-5 w-5' />
                                    Add to order
                                </span>
                            </Button>
                        </div>
                        {!requiredMet && (
                            <p className='mt-3 text-xs text-muted-foreground'>
                                Choose a size to add this to your order.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page shell — floating toolbar (pinned) + scrolling dish content panel.
// ---------------------------------------------------------------------------

function DishDetailPage(props: Omit<DishContentProps, 'dish'> & { dish?: DishFixture }) {
    const { dish = DISH, ...rest } = props;
    return (
        <DishShell>
            <ContentPanel>
                <DishContent dish={dish} {...rest} />
            </ContentPanel>
        </DishShell>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — real selection / quantity / add state so the reviewer
// can drive the whole flow: pick options, step quantity, add → feedback.
// ---------------------------------------------------------------------------

function InteractiveDishDetail() {
    const [selections, setSelections] = React.useState<Record<string, string>>({});
    const [quantity, setQuantity] = React.useState(1);
    const [added, setAdded] = React.useState(false);

    const handleSelect = (groupId: string, value: string) => {
        setSelections(prev => ({ ...prev, [groupId]: value }));
        setAdded(false);
    };

    const handleAdd = () => {
        setAdded(true);
        setSelections({});
        setQuantity(1);
    };

    return (
        <DishDetailPage
            selections={selections}
            quantity={quantity}
            added={added}
            onSelect={handleSelect}
            onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
            onIncrement={() => setQuantity(q => Math.min(DISH.stockQuantity, q + 1))}
            onAdd={handleAdd}
            onDismiss={() => setAdded(false)}
        />
    );
}

// ---------------------------------------------------------------------------
// Loading / error states — mirror the current surface's states, wrapped in the
// same shell + content panel so the elevation ladder is consistent.
// ---------------------------------------------------------------------------

function DishDetailSkeleton() {
    return (
        <DishShell>
            <ContentPanel>
                <Skeleton className='mb-6 h-5 w-28' />
                <div className='grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14'>
                    <Skeleton className='aspect-[4/5] w-full rounded-3xl' />
                    <div className='flex flex-col gap-4'>
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='h-12 w-3/4' />
                        <Skeleton className='h-16 w-full' />
                        <Skeleton className='h-9 w-40' />
                        {/* Segmented Choice row */}
                        <div className='flex gap-2'>
                            <Skeleton className='h-11 w-24 rounded-full' />
                            <Skeleton className='h-11 w-24 rounded-full' />
                            <Skeleton className='h-11 w-24 rounded-full' />
                        </div>
                        {/* Icon Toggle Grid */}
                        <div className='grid grid-cols-3 gap-3'>
                            <Skeleton className='aspect-square rounded-2xl' />
                            <Skeleton className='aspect-square rounded-2xl' />
                            <Skeleton className='aspect-square rounded-2xl' />
                        </div>
                        <Skeleton className='mt-4 h-14 w-full rounded-full' />
                    </div>
                </div>
            </ContentPanel>
        </DishShell>
    );
}

function DishDetailError() {
    return (
        <DishShell>
            <ContentPanel>
                <div className='mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center px-4 text-center'>
                    <span className='mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
                        <AlertTriangle className='h-6 w-6' />
                    </span>
                    <h1 className='text-xl font-bold text-foreground'>We couldn’t load this dish</h1>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        Something went wrong on our end. Head back to the menu and try again.
                    </p>
                    <Button className='bg-selected text-selected-foreground hover:bg-selected/90 mt-6 rounded-full'>
                        <UtensilsCrossed className='h-4 w-4' />
                        Back to menu
                    </Button>
                </div>
            </ContentPanel>
        </DishShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Dish Detail',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — the dish page opens with the large image as the single focus, one
 * display-weight title, a crimson price, and both option groups under their
 * UPPERCASE eyebrow labels (SIZE, BUILD YOUR MEAL). Nothing is selected yet, so
 * the always-visible black Add control is gated on the required Size (hint
 * shown). The SIZE segmented ToggleGroup sits idle in its muted track; the
 * floating NavBar is pinned above the scrolling content panel.
 */
export const Default: Story = {
    name: 'Default — Dish With Grouped Options',
    render: () => <DishDetailPage selections={{}} quantity={1} added={false} />,
};

/**
 * Partial — a size is chosen (the segmented ToggleGroup fills that pill black) and the
 * quantity has been stepped to 2 via the circular −/+ steppers. The crimson
 * price and the Add total reflect the surcharge × quantity, and the Add control
 * is now enabled.
 */
export const SizeSelectedQuantityChanged: Story = {
    name: 'Partial — Size Selected + Quantity Changed',
    render: () => <DishDetailPage selections={{ size: 'double' }} quantity={2} added={false} />,
};

/**
 * Success — add-to-order feedback: the success banner animates in (150–250ms
 * ease-out, motion-safe only → instant for reduced-motion) confirming the item
 * and total. Selections reset to the default single-focus state, ready for the
 * next add.
 */
export const AddedToOrder: Story = {
    name: 'Success — Add-To-Order Feedback',
    render: () => <DishDetailPage selections={{}} quantity={2} added={true} />,
};

/**
 * Interactive — drive the whole flow: pick a size (segmented ToggleGroup) and a
 * meal tile, step the quantity, then Add to order to see the feedback banner animate in.
 */
export const Interactive: Story = {
    name: 'Interactive — Customise & Add',
    render: () => <InteractiveDishDetail />,
};

/**
 * Loading — the dish is being fetched; the content panel shows skeletons in the
 * same single-focus layout (mirrors the current surface's loading state).
 */
export const Loading: Story = {
    name: 'Loading — Fetching Dish',
    render: () => <DishDetailSkeleton />,
};

/**
 * Error — the dish failed to load; a single recovery CTA points back to the menu
 * (mirrors the current surface's error state).
 */
export const Error: Story = {
    name: 'Error — Dish Failed To Load',
    render: () => <DishDetailError />,
};
