import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowUpDown, Plus, UtensilsCrossed } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface — Menu browsing (/foods), restyled to DESIGN_THEME.md.
//
// Business functionality is UNCHANGED from the live surface (src/pages/foods):
// a single-select category filter, a sort control, a responsive grid of dish
// cards, and an empty state with a clear-filters CTA. Only the VISUALS + UX
// change to the theme:
//
//   • Menu / list  → image-forward CARD GRID (not a table); each card is filled
//     by the dish photo, carries its name + a CRIMSON price, and is a SINGLE tap
//     target (theme: "Cards, not tables; image-forward; one clear tap target").
//   • Category filter → a real SELECTION PRIMITIVE, never a Button in a selected
//     style: the shared `ToggleGroup variant="segmented"` (single-select). It
//     sits on a muted track, exactly ONE item is on (solid black = selection),
//     and it scrolls horizontally, never wrapping into a block (theme:
//     "Horizontal pill row … horizontal scroll, never wrap").
//   • Colour roles (two-tone) → CRIMSON is reserved for PRICES + discounts only
//     on this browsing surface (there is no final CTA here, so nothing else
//     competes as the loudest red); the selected segment and the item-level add
//     affordance are solid BLACK (structural / selection / control); idle
//     segments are quiet on the muted track (secondary).
//
// Elevation — soft + minimal, one gentle step per level (no heavy rings /
// shadows): dark ambient frame → one large-radius LIGHT-GRAY shell (soft
// shadow) → a WHITE content panel (large radius, hairline, faint shadow) →
// WHITE cards (hairline, little / no shadow).
//
// Chrome: the top nav is owned by the CONSUMER APP SHELL (see the Consumer App
// Shell surface, which renders the shared `NavBar`). This
// surface only redesigns the MENU CONTENT ZONE, so the toolbar appears here as a
// pinned, muted NAV PLACEHOLDER (dashed) — never reimplemented per-surface. The
// shell fills the viewport and the menu content zone scrolls within it.
//
// Mock-only fixtures — no api / model / state / feature imports; self-contained.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shape (mock only — mirrors the live FoodItemViewModel fields the card
// renders: name, price, discountPrice, imageUrl, category, isAvailable).
// ---------------------------------------------------------------------------

interface Dish {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string;
    category: string;
    isAvailable: boolean;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

// Local currency formatter — mirrors the app's `formatVnd` output (`N ₫`,
// grouped thousands) without reaching into the app util layer.
function formatVnd(amount: number): string {
    return `${amount.toLocaleString('en-US')} ₫`;
}

// ---------------------------------------------------------------------------
// Fixtures — realistic Vietnamese menu, prices in thousands of VND. A couple of
// dishes carry a discount and one is sold out, to exercise the card's edges.
// ---------------------------------------------------------------------------

// 'Combos' has no dishes yet — used to drive the empty-filter edge with a real,
// selected segment.
const CATEGORIES = ['Rice', 'Noodles', 'Grilled', 'Sides', 'Drinks', 'Desserts', 'Combos'] as const;

const DISHES: Dish[] = [
    {
        id: 'd1',
        name: 'Phở bò tái',
        price: 65000,
        discountPrice: null,
        category: 'Noodles',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd2',
        name: 'Cơm tấm sườn bì',
        price: 55000,
        discountPrice: 45000,
        category: 'Rice',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd3',
        name: 'Bún chả Hà Nội',
        price: 60000,
        discountPrice: null,
        category: 'Noodles',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd4',
        name: 'Gà nướng sả ớt',
        price: 89000,
        discountPrice: null,
        category: 'Grilled',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd5',
        name: 'Gỏi cuốn tôm thịt',
        price: 40000,
        discountPrice: null,
        category: 'Sides',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd6',
        name: 'Trà đào cam sả',
        price: 30000,
        discountPrice: 25000,
        category: 'Drinks',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd7',
        name: 'Chè khúc bạch',
        price: 35000,
        discountPrice: null,
        category: 'Desserts',
        isAvailable: false,
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd8',
        name: 'Bò lúc lắc',
        price: 95000,
        discountPrice: null,
        category: 'Grilled',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd9',
        name: 'Cơm gà xối mỡ',
        price: 58000,
        discountPrice: null,
        category: 'Rice',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd10',
        name: 'Cà phê sữa đá',
        price: 29000,
        discountPrice: null,
        category: 'Drinks',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd11',
        name: 'Nem lụi Huế',
        price: 48000,
        discountPrice: null,
        category: 'Grilled',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&w=640&q=80',
    },
    {
        id: 'd12',
        name: 'Bánh flan caramel',
        price: 25000,
        discountPrice: null,
        category: 'Desserts',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=640&q=80',
    },
];

// ---------------------------------------------------------------------------
// Derived view — same filter + sort semantics as the live surface, applied to
// the mock list so the grid updates when the category / sort change.
// ---------------------------------------------------------------------------

function selectDishes(category: string | null, sortBy: SortOption): Dish[] {
    const filtered = category ? DISHES.filter(d => d.category === category) : DISHES;
    const effective = (d: Dish) => d.discountPrice ?? d.price;
    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => effective(a) - effective(b));
    else if (sortBy === 'price-desc') sorted.sort((a, b) => effective(b) - effective(a));
    else if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
}

// ---------------------------------------------------------------------------
// Dish photo — fills the card. On load error it falls back to a warm gradient
// with a utensils glyph so the card stays image-forward even offline.
// ---------------------------------------------------------------------------

function DishPhoto({ src, alt }: { src: string; alt: string }) {
    const [failed, setFailed] = React.useState(false);

    if (failed) {
        return (
            <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-accent/40'>
                <UtensilsCrossed className='h-10 w-10 text-muted-foreground/50' aria-hidden />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading='lazy'
            onError={() => setFailed(true)}
            className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100'
        />
    );
}

// ---------------------------------------------------------------------------
// Dish card — image-forward, ONE tap target (theme: menu card grid).
//
// The whole card is a single button: tapping it is the one clear action per
// card. The photo fills the card; the name and a CRIMSON price sit over a
// bottom scrim; a solid-black circular "+" is the item-level add affordance
// (selection / control black), part of the single tap target — not a competing
// second target. Sold-out cards are disabled with a status label.
// ---------------------------------------------------------------------------

function DishCard({ dish, onSelect }: { dish: Dish; onSelect?: (dish: Dish) => void }) {
    const hasDiscount = dish.discountPrice !== null && dish.discountPrice < dish.price;
    const effectivePrice = dish.discountPrice ?? dish.price;
    const discountPct = hasDiscount ? Math.round(((dish.price - effectivePrice) / dish.price) * 100) : 0;

    return (
        <button
            type='button'
            disabled={!dish.isAvailable}
            onClick={() => onSelect?.(dish)}
            aria-label={`${dish.name}, ${formatVnd(effectivePrice)}${dish.isAvailable ? ', add to order' : ', sold out'}`}
            className='group bg-background focus-visible:ring-primary relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-[20px] border border-black/[0.06] text-left transition-shadow duration-200 ease-out hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80'
        >
            <DishPhoto src={dish.imageUrl} alt={dish.name} />

            {/* Bottom scrim so the name + price stay legible over the photo */}
            <div
                className='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent'
                aria-hidden
            />

            {/* Discount — status/price accent, crimson, top-left */}
            {hasDiscount && dish.isAvailable && (
                <Badge className='absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm'>
                    -{discountPct}%
                </Badge>
            )}

            {/* Sold-out — status in words, not colour alone */}
            {!dish.isAvailable && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/45'>
                    <span className='rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm'>
                        Sold out
                    </span>
                </div>
            )}

            {/* Name + crimson price over the scrim */}
            <div className='relative z-10 flex items-end justify-between gap-3 p-4'>
                <div className='min-w-0'>
                    <span className='mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/70'>
                        {dish.category}
                    </span>
                    <h3 className='truncate text-base font-bold leading-tight text-white' title={dish.name}>
                        {dish.name}
                    </h3>
                    <p className='mt-1 flex items-baseline gap-2'>
                        <span className='text-lg font-bold text-primary'>{formatVnd(effectivePrice)}</span>
                        {hasDiscount && (
                            <span className='text-xs text-white/50 line-through'>{formatVnd(dish.price)}</span>
                        )}
                    </p>
                </div>

                {/* Item-level add affordance — solid black, circular (selection / control) */}
                {dish.isAvailable && (
                    <span
                        className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-transform duration-200 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100'
                        aria-hidden
                    >
                        <Plus className='h-5 w-5' />
                    </span>
                )}
            </div>
        </button>
    );
}

// ---------------------------------------------------------------------------
// Category filter — the shared `ToggleGroup variant="segmented"` (single-select).
// A real selection primitive: the group sits on a muted track, exactly ONE item
// is on (aria + data-[state=on] → solid black = selection, never a Button in a
// selected style), and it scrolls horizontally, never wrapping into a block.
// Mirrors the live single-select filter.
// ---------------------------------------------------------------------------

function CategoryFilter({
    selected,
    onSelect,
}: {
    selected: string | null;
    onSelect: (category: string | null) => void;
}) {
    return (
        <div className='min-w-0 flex-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            <ToggleGroup
                type='single'
                variant='segmented'
                value={selected ?? 'all'}
                onValueChange={value => onSelect(value === 'all' || value === '' ? null : value)}
                aria-label='Menu categories'
                className='w-max flex-nowrap'
            >
                <ToggleGroupItem value='all' aria-label='All dishes' className='h-9 flex-none px-4 text-sm font-medium'>
                    All
                </ToggleGroupItem>
                {CATEGORIES.map(category => (
                    <ToggleGroupItem
                        key={category}
                        value={category}
                        aria-label={category}
                        className='h-9 flex-none px-4 text-sm font-medium'
                    >
                        {category}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Sort control — supporting action, idle white pill with a hairline.
// ---------------------------------------------------------------------------

function SortControl({ value, onChange }: { value: SortOption; onChange: (value: SortOption) => void }) {
    return (
        <Select value={value} onValueChange={v => onChange(v as SortOption)}>
            <SelectTrigger size='sm' aria-label='Sort dishes' className='h-9 gap-2 rounded-full'>
                <ArrowUpDown className='h-3.5 w-3.5 text-muted-foreground' />
                <span className='hidden sm:inline'>
                    <SelectValue placeholder='Sort' />
                </span>
            </SelectTrigger>
            <SelectContent align='end'>
                <SelectItem value='default'>Recommended</SelectItem>
                <SelectItem value='price-asc'>Price: low to high</SelectItem>
                <SelectItem value='price-desc'>Price: high to low</SelectItem>
                <SelectItem value='name-asc'>Name: A to Z</SelectItem>
            </SelectContent>
        </Select>
    );
}

// ---------------------------------------------------------------------------
// Empty state — illustration + exactly ONE CTA, no dead end.
// ---------------------------------------------------------------------------

function MenuEmpty({ onClearFilters }: { onClearFilters: () => void }) {
    return (
        <div className='flex flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/20 px-6 py-20 text-center'>
            <span className='mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm'>
                <UtensilsCrossed className='h-7 w-7 text-muted-foreground' aria-hidden />
            </span>
            <h3 className='mb-1.5 text-xl font-semibold text-foreground'>No dishes in this category yet</h3>
            <p className='mb-6 max-w-sm text-sm text-muted-foreground'>
                Nothing here right now — clear the filter to browse the full menu.
            </p>
            <Button onClick={onClearFilters}>Show all dishes</Button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Top nav placeholder — the top nav belongs to the CONSUMER APP SHELL (which
// renders the shared `NavBar`). This surface only redesigns
// the menu content zone, so the toolbar is a pinned, muted placeholder here
// (dashed, mono label) — never reimplemented per-surface.
// ---------------------------------------------------------------------------

function TopNavPlaceholder() {
    return (
        <div className='sticky top-0 z-20 m-3 flex h-14 shrink-0 items-center justify-center rounded-full border border-dashed border-muted-foreground/30 bg-background/60 sm:m-4'>
            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60'>
                consumer top nav placeholder
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Menu content — the implemented surface, on a WHITE content panel: a sticky
// header (title + category filter + sort + result count) over the image-forward
// card grid (or the empty state).
// ---------------------------------------------------------------------------

function MenuContent({
    selectedCategory,
    sortBy,
    onCategoryChange,
    onSortChange,
}: {
    selectedCategory: string | null;
    sortBy: SortOption;
    onCategoryChange: (category: string | null) => void;
    onSortChange: (sort: SortOption) => void;
}) {
    const dishes = selectDishes(selectedCategory, sortBy);

    return (
        <div className='bg-background rounded-3xl border border-black/[0.05] shadow-sm'>
            {/* Sticky header — theme §6 section header: title left, single utility (sort) right, filter below */}
            <div className='bg-background/95 sticky top-0 z-10 rounded-t-3xl border-b border-border/60 px-4 pb-3 pt-4 backdrop-blur sm:px-6 sm:pt-5'>
                <div className='mb-4 flex items-center justify-between gap-3'>
                    <div className='flex items-baseline gap-2'>
                        <h1 className='text-foreground text-xl font-bold tracking-tight sm:text-2xl'>Meal category</h1>
                        <span className='text-muted-foreground text-sm'>
                            {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'}
                        </span>
                    </div>
                    <div className='shrink-0'>
                        <SortControl value={sortBy} onChange={onSortChange} />
                    </div>
                </div>
                <CategoryFilter selected={selectedCategory} onSelect={onCategoryChange} />
            </div>

            <div className='px-4 py-5 sm:px-6 sm:py-6'>
                {dishes.length === 0 ? (
                    <MenuEmpty onClearFilters={() => onCategoryChange(null)} />
                ) : (
                    <div className='grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4'>
                        {dishes.map(dish => (
                            <DishCard key={dish.id} dish={dish} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// App shell — dark ambient frame → one large-radius LIGHT-GRAY shell (soft
// shadow). The shell fills the viewport as a flex column: the nav placeholder
// is pinned at the top and the menu content zone scrolls beneath it, so there
// is a single scroll region and no clipping.
// ---------------------------------------------------------------------------

function MenuShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-frame flex h-screen w-full flex-col p-3 sm:p-6 lg:p-8'>
            <div className='bg-muted mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-[2rem] shadow-[0_24px_70px_-32px_rgba(0,0,0,0.7)]'>
                <TopNavPlaceholder />
                <div className='min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1 sm:px-4 sm:pb-5 lg:px-5'>{children}</div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — live category filter + sort so the grid updates on
// change, keeping one clear tap target per card.
// ---------------------------------------------------------------------------

function MenuHarness({ initialCategory = null }: { initialCategory?: string | null }) {
    const [category, setCategory] = React.useState<string | null>(initialCategory);
    const [sortBy, setSortBy] = React.useState<SortOption>('default');
    return (
        <MenuShell>
            <MenuContent
                selectedCategory={category}
                sortBy={sortBy}
                onCategoryChange={setCategory}
                onSortChange={setSortBy}
            />
        </MenuShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Menu Browsing',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — the full menu on desktop: an image-forward card grid on the light
 * shell, with the "All" segment selected in the segmented category filter and
 * prices in crimson. Each card is a single tap target.
 */
export const Default: Story = {
    name: 'Default — Image-Forward Card Grid',
    render: () => (
        <MenuShell>
            <MenuContent
                selectedCategory={null}
                sortBy='default'
                onCategoryChange={() => undefined}
                onSortChange={() => undefined}
            />
        </MenuShell>
    ),
};

/**
 * Partial — a category is selected (Grilled): exactly one segment is solid black
 * in the segmented filter and the grid is filtered to that category, one clear
 * tap target per card retained.
 */
export const CategorySelected: Story = {
    name: 'Partial — Category Filtered (One Segment Selected)',
    render: () => (
        <MenuShell>
            <MenuContent
                selectedCategory='Grilled'
                sortBy='price-asc'
                onCategoryChange={() => undefined}
                onSortChange={() => undefined}
            />
        </MenuShell>
    ),
};

/**
 * Empty — no dishes match the selected filter (the "Combos" category has none
 * yet, its segment still selected). The grid gives way to an illustration +
 * exactly one CTA to clear the filter and return to the full menu — no dead end.
 */
export const Empty: Story = {
    name: 'Empty — No Dishes Match Filter (One CTA)',
    render: () => (
        <MenuShell>
            <MenuContent
                selectedCategory='Combos'
                sortBy='default'
                onCategoryChange={() => undefined}
                onSortChange={() => undefined}
            />
        </MenuShell>
    ),
};

/**
 * Interactive — change the segmented category filter or the sort and watch the
 * card grid update while every card keeps its single tap target.
 */
export const Interactive: Story = {
    name: 'Interactive — Filter & Sort',
    render: () => <MenuHarness />,
};
