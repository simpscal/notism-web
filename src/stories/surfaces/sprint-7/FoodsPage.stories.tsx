import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowUpDown, UtensilsCrossed, X } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardFooter } from '@/components/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Skeleton } from '@/components/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

interface MockFood {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string | null;
    category: string;
    isAvailable: boolean;
}

const FOODS: MockFood[] = [
    {
        id: '1',
        name: 'Grilled Salmon',
        description: 'Norwegian salmon fillet, lemon butter, seasonal vegetables',
        price: 185000,
        discountPrice: 155000,
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
        category: 'Mains',
        isAvailable: true,
    },
    {
        id: '2',
        name: 'Beef Pho',
        description: 'Slow-cooked bone broth, rice noodles, rare beef, fresh herbs',
        price: 95000,
        discountPrice: null,
        imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=400&fit=crop',
        category: 'Soups',
        isAvailable: true,
    },
    {
        id: '3',
        name: 'Banh Mi Thit',
        description: 'Crispy baguette, grilled pork, pickled daikon, chilli, coriander',
        price: 45000,
        discountPrice: null,
        imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop',
        category: 'Sandwiches',
        isAvailable: true,
    },
    {
        id: '4',
        name: 'Margherita Pizza',
        description: 'San Marzano tomato, fior di latte, fresh basil, extra-virgin olive oil',
        price: 135000,
        discountPrice: null,
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
        category: 'Pizza',
        isAvailable: true,
    },
    {
        id: '5',
        name: 'Com Tam Suon',
        description: 'Broken rice, grilled pork chop, shredded pork skin, fried egg',
        price: 75000,
        discountPrice: null,
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop',
        category: 'Rice Dishes',
        isAvailable: false,
    },
    {
        id: '6',
        name: 'Avocado Toast',
        description: 'Sourdough, smashed avocado, poached egg, chilli flakes, microgreens',
        price: 89000,
        discountPrice: 72000,
        imageUrl: 'https://images.unsplash.com/photo-1603046891744-76e6481cf539?w=400&h=400&fit=crop',
        category: 'Breakfast',
        isAvailable: true,
    },
    {
        id: '7',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles, shrimp, tofu, bean sprouts, peanuts',
        price: 120000,
        discountPrice: null,
        imageUrl: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=400&fit=crop',
        category: 'Noodles',
        isAvailable: true,
    },
    {
        id: '8',
        name: 'Chocolate Lava Cake',
        description: 'Warm dark chocolate cake, molten centre, vanilla ice cream',
        price: 65000,
        discountPrice: null,
        imageUrl: null,
        category: 'Desserts',
        isAvailable: true,
    },
];

const CATEGORIES = [
    'All Items',
    'Mains',
    'Soups',
    'Sandwiches',
    'Pizza',
    'Rice Dishes',
    'Breakfast',
    'Noodles',
    'Desserts',
];

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Sub-components (self-contained, no external imports beyond the shared library)
// ---------------------------------------------------------------------------

function FoodPlaceholderSVG({ className = '' }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox='0 0 400 400'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-label='Food placeholder'
        >
            <rect width='400' height='400' fill='currentColor' className='text-muted' />
            <ellipse cx='200' cy='230' rx='100' ry='34' fill='white' fillOpacity='0.12' />
            <ellipse cx='200' cy='222' rx='84' ry='26' fill='white' fillOpacity='0.10' />
            <rect x='164' y='130' width='8' height='76' rx='4' fill='white' fillOpacity='0.30' />
            <rect x='162' y='130' width='12' height='20' rx='2' fill='white' fillOpacity='0.30' />
            <rect x='196' y='122' width='8' height='84' rx='4' fill='white' fillOpacity='0.30' />
            <ellipse cx='228' cy='144' rx='12' ry='8' fill='white' fillOpacity='0.30' />
            <rect x='220' y='144' width='16' height='70' rx='8' fill='white' fillOpacity='0.30' />
        </svg>
    );
}

interface FoodCardProps {
    food: MockFood;
}

function FoodCard({ food }: FoodCardProps) {
    const hasSavings = food.discountPrice !== null && food.discountPrice < food.price;
    const effectivePrice = food.discountPrice ?? food.price;
    const discountPct = hasSavings ? Math.round(((food.price - effectivePrice) / food.price) * 100) : 0;

    return (
        <Card className='group relative flex flex-col overflow-hidden border pt-0 transition-all hover:border-primary/40 hover:shadow-lg'>
            {/* Image */}
            <div className='relative aspect-square cursor-pointer overflow-hidden bg-muted'>
                {food.imageUrl ? (
                    <img
                        src={food.imageUrl}
                        alt={food.name}
                        className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                ) : (
                    <div className='absolute inset-0'>
                        <FoodPlaceholderSVG className='h-full w-full' />
                    </div>
                )}

                {hasSavings && (
                    <div className='absolute top-2 left-2 rounded-full bg-destructive px-2.5 py-0.5 text-xs font-bold text-white shadow-sm'>
                        -{discountPct}%
                    </div>
                )}

                <div className='absolute bottom-2 left-2 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm'>
                    {food.category}
                </div>

                {!food.isAvailable && (
                    <div className='absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]'>
                        <span className='rounded-full bg-background px-3 py-1 text-xs font-semibold text-destructive shadow-sm'>
                            Out of stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <CardFooter className='flex flex-1 flex-col gap-3 p-3 sm:p-4'>
                <div className='flex-1'>
                    <h3 className='mb-1 truncate text-sm font-semibold leading-tight sm:text-base' title={food.name}>
                        {food.name}
                    </h3>
                    <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>{food.description}</p>
                </div>

                <div className='flex items-center justify-between gap-2'>
                    <div className='flex flex-col'>
                        {hasSavings && (
                            <span className='text-xs line-through text-muted-foreground'>{formatVnd(food.price)}</span>
                        )}
                        <span className='text-base font-bold sm:text-lg'>{formatVnd(effectivePrice)}</span>
                    </div>
                    <Button variant='default' size='sm' className='shrink-0' disabled={!food.isAvailable}>
                        Add
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

function FoodCardSkeleton() {
    return (
        <Card className='relative flex flex-col overflow-hidden pt-0'>
            <div className='relative aspect-square overflow-hidden'>
                <Skeleton className='h-full w-full' />
            </div>
            <CardFooter className='flex flex-1 flex-col gap-3 p-3 sm:p-4'>
                <div className='w-full flex-1'>
                    <Skeleton className='mb-1.5 h-5 w-4/5' />
                    <Skeleton className='mb-1 h-3.5 w-full' />
                    <Skeleton className='h-3.5 w-3/5' />
                </div>
                <div className='flex w-full items-center justify-between'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-8 w-20 rounded-md' />
                </div>
            </CardFooter>
        </Card>
    );
}

interface PageShellProps {
    children: React.ReactNode;
    selectedCategory?: string | null;
    totalCount?: number;
    hasFilters?: boolean;
}

function PageShell({ children, selectedCategory = null, totalCount = 0, hasFilters = false }: PageShellProps) {
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

            {/* Hero / banner — placeholder; exists in current system, not changed by this sprint */}
            <div className='flex h-[200px] items-center justify-center border-b border-dashed bg-muted/20'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                    hero / banner placeholder
                </span>
            </div>

            {/* Main content */}
            <div className='container mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-10'>
                {/* Filter + sort control bar */}
                <div className='top-16 z-40 -mx-4 mb-5 border-b bg-background/95 px-4 pb-3 pt-1 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:mb-6'>
                    {/* Row 1: category toggle row (scrolls horizontally on narrow screens) + sort select */}
                    <div className='flex items-center gap-3'>
                        <div className='min-w-0 flex-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                            <ToggleGroup
                                type='single'
                                value={selectedCategory ?? 'All Items'}
                                aria-label='Filter by category'
                                className='w-max flex-nowrap justify-start gap-1.5'
                            >
                                {CATEGORIES.map(cat => (
                                    <ToggleGroupItem
                                        key={cat}
                                        value={cat}
                                        aria-label={cat}
                                        className='shrink-0 rounded-full border px-3.5 text-xs font-medium data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground sm:text-sm'
                                    >
                                        {cat}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>

                        <div className='shrink-0'>
                            <Select defaultValue='default'>
                                <SelectTrigger size='sm' aria-label='Sort dishes' className='h-9 gap-2 rounded-full'>
                                    <ArrowUpDown className='h-3.5 w-3.5 text-muted-foreground' />
                                    <span className='hidden sm:inline'>
                                        <SelectValue placeholder='Sort' />
                                    </span>
                                </SelectTrigger>
                                <SelectContent align='end'>
                                    <SelectItem value='default'>Recommended</SelectItem>
                                    <SelectItem value='price-asc'>Price: Low to High</SelectItem>
                                    <SelectItem value='price-desc'>Price: High to Low</SelectItem>
                                    <SelectItem value='name-asc'>Name: A–Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 2: result count + active-filter indication + clear-all */}
                    <div className='mt-2.5 flex flex-wrap items-center gap-2'>
                        <span className='text-sm text-muted-foreground'>
                            <span className='font-semibold text-foreground'>{totalCount}</span>{' '}
                            {totalCount === 1 ? 'dish found' : 'dishes found'}
                        </span>
                        {selectedCategory && (
                            <>
                                <span className='text-muted-foreground/40' aria-hidden='true'>
                                    •
                                </span>
                                <Badge variant='secondary' className='gap-1 rounded-full pr-1 text-xs'>
                                    {selectedCategory}
                                    <button
                                        type='button'
                                        className='ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-foreground/10 hover:text-destructive'
                                        aria-label={`Remove ${selectedCategory} filter`}
                                    >
                                        <X className='h-3 w-3' />
                                    </button>
                                </Badge>
                            </>
                        )}
                        {hasFilters && (
                            <Button
                                variant='ghost'
                                size='xs'
                                className='ml-auto text-muted-foreground hover:text-foreground'
                            >
                                <X className='mr-1 h-3 w-3' />
                                Clear all
                            </Button>
                        )}
                    </div>
                </div>

                {/* Grid area — full width now that filters live in the top bar */}
                <div className='min-w-0'>{children}</div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story pages
// ---------------------------------------------------------------------------

function DefaultPage() {
    return (
        <PageShell totalCount={FOODS.length}>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:gap-6'>
                {FOODS.map(food => (
                    <FoodCard key={food.id} food={food} />
                ))}
            </div>
        </PageShell>
    );
}

function LoadingPage() {
    return (
        <PageShell totalCount={0}>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:gap-6'>
                {Array.from({ length: 8 }).map((_, i) => (
                    <FoodCardSkeleton key={i} />
                ))}
            </div>
        </PageShell>
    );
}

function EmptyCategoryPage() {
    return (
        <PageShell totalCount={0} selectedCategory='Desserts' hasFilters>
            <div className='flex flex-col items-center justify-center py-20 text-center'>
                <div className='mb-4 rounded-full p-6'>
                    <UtensilsCrossed className='h-12 w-12 text-muted-foreground' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>No dishes found</h3>
                <p className='mb-6 text-muted-foreground'>
                    We couldn&apos;t find any items matching your current filters.
                </p>
                <Button variant='outline'>Clear filters</Button>
            </div>
        </PageShell>
    );
}

const NO_IMAGE_FOODS: MockFood[] = FOODS.map(f => ({ ...f, imageUrl: null }));

function NoImagePlaceholderPage() {
    return (
        <PageShell totalCount={NO_IMAGE_FOODS.length}>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:gap-6'>
                {NO_IMAGE_FOODS.map(food => (
                    <FoodCard key={food.id} food={food} />
                ))}
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Foods Page',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default — Populated Grid',
    render: () => <DefaultPage />,
};

export const Loading: Story = {
    name: 'Loading — Skeleton Grid',
    render: () => <LoadingPage />,
};

export const EmptyCategory: Story = {
    name: 'Empty — Category Filter Returns No Results',
    render: () => <EmptyCategoryPage />,
};

export const NoImagePlaceholder: Story = {
    name: 'No Image — Placeholder Cards',
    render: () => <NoImagePlaceholderPage />,
};
