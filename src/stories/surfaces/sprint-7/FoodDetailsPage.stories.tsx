import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeft, CheckCircle2, Minus, Package, Plus, ShoppingCart, Utensils } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

interface Customisation {
    id: string;
    label: string;
    required: boolean;
    options: { value: string; label: string; surcharge?: number }[];
}

interface MockFoodDetail {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    imageUrls: string[];
    category: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
    customisations?: Customisation[];
}

const FOOD_WITH_CUSTOMISATIONS: MockFoodDetail = {
    id: '1',
    name: 'Grilled Salmon',
    description:
        'Fresh Norwegian salmon fillet char-grilled to perfection. Served with a zesty lemon butter sauce, wilted spinach, and your choice of seasonal roasted vegetables. Rich in omega-3 fatty acids and full of vibrant flavour.',
    price: 185000,
    discountPrice: 155000,
    imageUrls: [
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=600&h=750&fit=crop',
    ],
    category: 'Mains',
    isAvailable: true,
    stockQuantity: 12,
    quantityUnit: 'Plate',
    customisations: [
        {
            id: 'size',
            label: 'Portion size',
            required: true,
            options: [
                { value: 'regular', label: 'Regular (180 g)' },
                { value: 'large', label: 'Large (260 g)', surcharge: 30000 },
            ],
        },
        {
            id: 'spice',
            label: 'Spice level',
            required: false,
            options: [
                { value: 'mild', label: 'Mild' },
                { value: 'medium', label: 'Medium' },
                { value: 'hot', label: 'Hot' },
            ],
        },
        {
            id: 'sauce',
            label: 'Sauce on the side',
            required: false,
            options: [
                { value: 'lemon-butter', label: 'Lemon butter' },
                { value: 'teriyaki', label: 'Teriyaki' },
                { value: 'none', label: 'No sauce' },
            ],
        },
    ],
};

const FOOD_NO_CUSTOMISATIONS: MockFoodDetail = {
    id: '2',
    name: 'Beef Pho',
    description:
        'A classic Vietnamese noodle soup crafted from 12-hour slow-cooked beef bone broth, served with rice noodles, paper-thin slices of rare beef, tendon, tripe, and a generous garnish plate of fresh herbs, bean sprouts, lime, and chilli.',
    price: 95000,
    discountPrice: null,
    imageUrls: ['https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&h=750&fit=crop'],
    category: 'Soups',
    isAvailable: true,
    stockQuantity: 20,
    quantityUnit: 'Bowl',
};

const FOOD_NO_IMAGE: MockFoodDetail = {
    ...FOOD_NO_CUSTOMISATIONS,
    id: '3',
    name: "Chef's Daily Special",
    imageUrls: [],
};

// ---------------------------------------------------------------------------
// Food image with placeholder
// ---------------------------------------------------------------------------

function FoodPlaceholderSVG({ className = '' }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox='0 0 600 750'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-label='Food placeholder'
        >
            <rect width='600' height='750' fill='currentColor' className='text-muted' />
            <ellipse cx='300' cy='520' rx='180' ry='60' fill='white' fillOpacity='0.10' />
            <ellipse cx='300' cy='506' rx='150' ry='46' fill='white' fillOpacity='0.08' />
            <rect x='242' y='310' width='10' height='120' rx='5' fill='white' fillOpacity='0.25' />
            <rect x='239' y='310' width='16' height='30' rx='3' fill='white' fillOpacity='0.25' />
            <rect x='295' y='296' width='10' height='134' rx='5' fill='white' fillOpacity='0.25' />
            <ellipse cx='352' cy='326' rx='18' ry='12' fill='white' fillOpacity='0.25' />
            <rect x='336' y='326' width='20' height='110' rx='10' fill='white' fillOpacity='0.25' />
        </svg>
    );
}

function FoodImageDisplay({ src, alt }: { src?: string | null; alt: string }) {
    const [error, setError] = useState(false);
    if (!src || error) {
        return (
            <div className='absolute inset-0'>
                <FoodPlaceholderSVG className='h-full w-full' />
            </div>
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            className='absolute inset-0 h-full w-full object-cover'
            onError={() => setError(true)}
        />
    );
}

// ---------------------------------------------------------------------------
// Customisation section
// ---------------------------------------------------------------------------

interface CustomisationSectionProps {
    customisations: Customisation[];
    selections: Record<string, string>;
    onChange: (id: string, value: string) => void;
}

function CustomisationSection({ customisations, selections, onChange }: CustomisationSectionProps) {
    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-2'>
                <Separator className='flex-1' />
                <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                    Customise your order
                </span>
                <Separator className='flex-1' />
            </div>

            {customisations.map(cust => (
                <div key={cust.id} className='space-y-2'>
                    <div className='flex items-center gap-2'>
                        <Label className='text-sm font-semibold'>{cust.label}</Label>
                        {cust.required && (
                            <Badge variant='secondary' className='text-xs'>
                                Required
                            </Badge>
                        )}
                    </div>
                    <RadioGroup
                        value={selections[cust.id] ?? ''}
                        onValueChange={val => onChange(cust.id, val)}
                        className='grid gap-2'
                    >
                        {cust.options.map(opt => (
                            <div
                                key={opt.value}
                                className='flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5'
                            >
                                <RadioGroupItem value={opt.value} id={`${cust.id}-${opt.value}`} />
                                <Label
                                    htmlFor={`${cust.id}-${opt.value}`}
                                    className='flex flex-1 cursor-pointer items-center justify-between text-sm font-normal'
                                >
                                    <span>{opt.label}</span>
                                    {opt.surcharge && (
                                        <span className='text-xs font-semibold text-primary'>
                                            +{formatVnd(opt.surcharge)}
                                        </span>
                                    )}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Shared layout shell
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='overflow-x-clip bg-background' style={{ minHeight: '100vh' }}>
            <header className='sticky top-0 z-50 border-b bg-background'>
                <div className='flex h-16 items-center justify-between px-4 md:px-6'>
                    <div className='flex items-center gap-4'>
                        <h1 className='text-lg font-semibold tracking-tight text-primary md:text-2xl'>Notism</h1>
                        <nav className='hidden items-center gap-2 md:flex'>
                            <span className='rounded-md px-3 py-2 text-sm font-medium text-muted-foreground'>
                                Foods
                            </span>
                        </nav>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button variant='ghost' size='icon'>
                            <ShoppingCart className='h-5 w-5' />
                        </Button>
                    </div>
                </div>
            </header>
            <div className='bg-background'>
                <div className='container mx-auto px-4 py-8'>{children}</div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story: Default — with customisations
// ---------------------------------------------------------------------------

function DefaultDetailPage() {
    const food = FOOD_WITH_CUSTOMISATIONS;
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});

    const hasSavings = food.discountPrice !== null && food.discountPrice < food.price;
    const effectivePrice = food.discountPrice ?? food.price;
    const savings = hasSavings ? food.price - effectivePrice : 0;

    const requiredIds = (food.customisations ?? []).filter(c => c.required).map(c => c.id);
    const allRequiredMet = requiredIds.every(id => !!selections[id]);

    const handleSelect = (id: string, value: string) => {
        setSelections(prev => ({ ...prev, [id]: value }));
    };

    return (
        <PageShell>
            <a
                href='#'
                className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                onClick={e => e.preventDefault()}
            >
                <ArrowLeft className='h-4 w-4' />
                Back to menu
            </a>

            <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                {/* Image section */}
                <div className='relative space-y-4'>
                    <div className='relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary shadow-2xl shadow-primary/10 ring-1 ring-border'>
                        <FoodImageDisplay src={food.imageUrls[selectedImage]} alt={food.name} />
                    </div>
                    {food.imageUrls.length > 1 && (
                        <div className='flex justify-center gap-3'>
                            {food.imageUrls.map((url, idx) => (
                                <button
                                    key={idx}
                                    type='button'
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                                        selectedImage === idx
                                            ? 'scale-105 border-primary shadow-md shadow-primary/20'
                                            : 'border-transparent hover:border-muted-foreground/50'
                                    }`}
                                    aria-label={`View image ${idx + 1}`}
                                >
                                    <FoodImageDisplay src={url} alt={`${food.name} thumbnail ${idx + 1}`} />
                                    {selectedImage === idx && <div className='absolute inset-0 bg-primary/20' />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details section */}
                <div className='flex flex-col'>
                    <span className='mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary'>
                        {food.category}
                    </span>

                    <h1 className='mb-2 text-4xl font-bold leading-tight text-foreground lg:text-5xl'>{food.name}</h1>

                    <hr className='border-border my-6' />

                    <p className='mb-6 text-base leading-relaxed text-muted-foreground'>{food.description}</p>

                    <div className='mb-6 flex flex-wrap gap-3'>
                        <div className='flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium'>
                            <Package className='h-4 w-4' />
                            <span>{food.quantityUnit}</span>
                        </div>
                        <div className='flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium'>
                            <Utensils className='h-4 w-4' />
                            <span>{food.stockQuantity} available</span>
                        </div>
                    </div>

                    <hr className='border-border mb-6' />

                    <div className='mb-6'>
                        {hasSavings && (
                            <span className='mb-2 block text-base text-muted-foreground line-through'>
                                {formatVnd(food.price)}
                            </span>
                        )}
                        <div className='flex items-baseline gap-3'>
                            <span className='font-sans text-5xl font-bold text-primary tabular-nums'>
                                {formatVnd(effectivePrice)}
                            </span>
                            {hasSavings && (
                                <span className='rounded-full bg-destructive/20 px-3 py-1 text-sm font-semibold text-destructive'>
                                    Save {formatVnd(savings)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Customisations */}
                    {food.customisations && food.customisations.length > 0 && (
                        <div className='mb-6'>
                            <CustomisationSection
                                customisations={food.customisations}
                                selections={selections}
                                onChange={handleSelect}
                            />
                        </div>
                    )}

                    {/* Sticky CTA — visible on mobile as sticky footer, on desktop inline */}
                    <div className='sticky bottom-0 z-10 -mx-4 border-t bg-background px-4 py-4 sm:static sm:mx-0 sm:border-t-0 sm:p-0'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <div className='flex h-10 shrink-0 items-center justify-between rounded-full bg-muted px-1 py-1'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className='h-4 w-4' />
                                </Button>
                                <span className='w-10 text-center text-sm font-bold text-foreground'>{quantity}</span>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => setQuantity(q => Math.min(food.stockQuantity, q + 1))}
                                    disabled={quantity >= food.stockQuantity}
                                >
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>
                            <Button
                                variant='default'
                                size='lg'
                                disabled={!food.isAvailable || !allRequiredMet}
                                className='flex-1 rounded-full'
                            >
                                <ShoppingCart className='h-5 w-5 shrink-0' />
                                <span className='truncate'>Add to cart — {formatVnd(effectivePrice * quantity)}</span>
                            </Button>
                        </div>
                        {!allRequiredMet && (
                            <p className='mt-2 text-xs text-muted-foreground'>
                                Please select all required options to continue.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: No customisations
// ---------------------------------------------------------------------------

function NoCustomisationsPage() {
    const food = FOOD_NO_CUSTOMISATIONS;
    const [quantity, setQuantity] = useState(1);

    const effectivePrice = food.price;

    return (
        <PageShell>
            <a
                href='#'
                className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                onClick={e => e.preventDefault()}
            >
                <ArrowLeft className='h-4 w-4' />
                Back to menu
            </a>

            <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                {/* Image */}
                <div className='relative'>
                    <div className='relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary shadow-2xl shadow-primary/10 ring-1 ring-border'>
                        <FoodImageDisplay src={food.imageUrls[0]} alt={food.name} />
                    </div>
                </div>

                {/* Details — no customisation section */}
                <div className='flex flex-col'>
                    <span className='mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary'>
                        {food.category}
                    </span>

                    <h1 className='mb-2 text-4xl font-bold leading-tight text-foreground lg:text-5xl'>{food.name}</h1>

                    <hr className='border-border my-6' />

                    <p className='mb-6 text-base leading-relaxed text-muted-foreground'>{food.description}</p>

                    <div className='mb-6 flex flex-wrap gap-3'>
                        <div className='flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium'>
                            <Package className='h-4 w-4' />
                            <span>{food.quantityUnit}</span>
                        </div>
                        <div className='flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium'>
                            <Utensils className='h-4 w-4' />
                            <span>{food.stockQuantity} available</span>
                        </div>
                    </div>

                    <hr className='border-border mb-6' />

                    <div className='mb-8'>
                        <span className='font-sans text-5xl font-bold text-primary tabular-nums'>
                            {formatVnd(effectivePrice)}
                        </span>
                    </div>

                    {/* No customisations — section is entirely absent; CTA follows price directly */}
                    <div className='sticky bottom-0 z-10 -mx-4 border-t bg-background px-4 py-4 sm:static sm:mx-0 sm:border-t-0 sm:p-0'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <div className='flex h-10 shrink-0 items-center justify-between rounded-full bg-muted px-1 py-1'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className='h-4 w-4' />
                                </Button>
                                <span className='w-10 text-center text-sm font-bold text-foreground'>{quantity}</span>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => setQuantity(q => Math.min(food.stockQuantity, q + 1))}
                                    disabled={quantity >= food.stockQuantity}
                                >
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>
                            <Button variant='default' size='lg' className='flex-1 rounded-full'>
                                <ShoppingCart className='h-5 w-5 shrink-0' />
                                <span className='truncate'>Add to cart — {formatVnd(effectivePrice * quantity)}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Disabled add-to-cart (required selection not made)
// ---------------------------------------------------------------------------

function DisabledAddToCartPage() {
    const food = FOOD_WITH_CUSTOMISATIONS;
    // No selections made — required "size" not yet chosen
    const [selections, setSelections] = useState<Record<string, string>>({});

    const effectivePrice = food.discountPrice ?? food.price;
    const requiredIds = (food.customisations ?? []).filter(c => c.required).map(c => c.id);
    const allRequiredMet = requiredIds.every(id => !!selections[id]);

    return (
        <PageShell>
            <a
                href='#'
                className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                onClick={e => e.preventDefault()}
            >
                <ArrowLeft className='h-4 w-4' />
                Back to menu
            </a>

            <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                <div className='relative'>
                    <div className='relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary shadow-2xl shadow-primary/10 ring-1 ring-border'>
                        <FoodImageDisplay src={food.imageUrls[0]} alt={food.name} />
                    </div>
                </div>

                <div className='flex flex-col'>
                    <span className='mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary'>
                        {food.category}
                    </span>

                    <h1 className='mb-2 text-4xl font-bold leading-tight text-foreground lg:text-5xl'>{food.name}</h1>

                    <hr className='border-border my-6' />

                    <p className='mb-6 text-base leading-relaxed text-muted-foreground'>{food.description}</p>

                    <hr className='border-border mb-6' />

                    <div className='mb-6'>
                        <span className='mb-2 block text-base text-muted-foreground line-through'>
                            {formatVnd(food.price)}
                        </span>
                        <span className='font-sans text-5xl font-bold text-primary tabular-nums'>
                            {formatVnd(effectivePrice)}
                        </span>
                    </div>

                    {food.customisations && food.customisations.length > 0 && (
                        <div className='mb-6'>
                            <CustomisationSection
                                customisations={food.customisations}
                                selections={selections}
                                onChange={(id, val) => setSelections(prev => ({ ...prev, [id]: val }))}
                            />
                        </div>
                    )}

                    <div className='sticky bottom-0 z-10 -mx-4 border-t bg-background px-4 py-4 sm:static sm:mx-0 sm:border-t-0 sm:p-0'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <div className='flex h-10 shrink-0 items-center justify-between rounded-full bg-muted px-1 py-1'>
                                <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full' disabled>
                                    <Minus className='h-4 w-4' />
                                </Button>
                                <span className='w-10 text-center text-sm font-bold text-foreground'>1</span>
                                <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full'>
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>
                            <Button
                                variant='default'
                                size='lg'
                                disabled={!allRequiredMet}
                                className='flex-1 rounded-full'
                                aria-disabled={!allRequiredMet}
                            >
                                <ShoppingCart className='h-5 w-5 shrink-0' />
                                <span className='truncate'>Add to cart — {formatVnd(effectivePrice)}</span>
                            </Button>
                        </div>
                        {!allRequiredMet && (
                            <p className='mt-2 text-center text-xs text-muted-foreground sm:text-left'>
                                Select a <strong>Portion size</strong> to continue.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Added to cart (success feedback)
// ---------------------------------------------------------------------------

function AddedToCartPage() {
    const food = FOOD_WITH_CUSTOMISATIONS;
    const effectivePrice = food.discountPrice ?? food.price;
    const quantity = 2;

    return (
        <PageShell>
            <a
                href='#'
                className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                onClick={e => e.preventDefault()}
            >
                <ArrowLeft className='h-4 w-4' />
                Back to menu
            </a>

            {/* Inline success confirmation banner */}
            <div className='mb-6 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-5 py-4 text-sm font-medium text-success'>
                <CheckCircle2 className='h-5 w-5 shrink-0' />
                <div>
                    <span className='font-semibold'>{food.name}</span> &times; {quantity} added to your cart
                    <span className='ml-2 font-normal text-success/80'>
                        — {formatVnd(effectivePrice * quantity)} total
                    </span>
                </div>
                <Button
                    variant='outline'
                    size='sm'
                    className='ml-auto shrink-0 border-success/40 text-success hover:bg-success/10'
                >
                    View cart
                </Button>
            </div>

            <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                <div className='relative'>
                    <div className='relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary shadow-2xl shadow-primary/10 ring-1 ring-border'>
                        <FoodImageDisplay src={food.imageUrls[0]} alt={food.name} />
                    </div>
                </div>

                <div className='flex flex-col'>
                    <span className='mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary'>
                        {food.category}
                    </span>

                    <h1 className='mb-2 text-4xl font-bold leading-tight text-foreground lg:text-5xl'>{food.name}</h1>

                    <hr className='border-border my-6' />

                    <p className='mb-6 text-base leading-relaxed text-muted-foreground'>{food.description}</p>

                    <hr className='border-border mb-6' />

                    <div className='mb-8'>
                        <span className='mb-2 block text-base text-muted-foreground line-through'>
                            {formatVnd(food.price)}
                        </span>
                        <span className='font-sans text-5xl font-bold text-primary tabular-nums'>
                            {formatVnd(effectivePrice)}
                        </span>
                    </div>

                    <div className='sticky bottom-0 z-10 -mx-4 border-t bg-background px-4 py-4 sm:static sm:mx-0 sm:border-t-0 sm:p-0'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <div className='flex h-10 shrink-0 items-center justify-between rounded-full bg-muted px-1 py-1'>
                                <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full' disabled>
                                    <Minus className='h-4 w-4' />
                                </Button>
                                <span className='w-10 text-center text-sm font-bold text-foreground'>{quantity}</span>
                                <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full'>
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>
                            <Button variant='default' size='lg' className='flex-1 rounded-full'>
                                <ShoppingCart className='h-5 w-5 shrink-0' />
                                <span className='truncate'>Add to cart — {formatVnd(effectivePrice * quantity)}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Loading skeleton
// ---------------------------------------------------------------------------

function LoadingPage() {
    return (
        <PageShell>
            <Skeleton className='mb-8 h-8 w-32' />
            <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                <Skeleton className='aspect-[4/5] w-full rounded-3xl' />
                <div className='flex flex-col space-y-6'>
                    <Skeleton className='h-5 w-20' />
                    <Skeleton className='h-12 w-3/4' />
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-3/4' />
                    </div>
                    <div className='flex flex-wrap gap-3'>
                        <Skeleton className='h-8 w-24 rounded-full' />
                        <Skeleton className='h-8 w-32 rounded-full' />
                    </div>
                    <Skeleton className='h-14 w-44' />
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                        <Skeleton className='h-10 w-32 rounded-full' />
                        <Skeleton className='h-10 flex-1 rounded-full' />
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: No image
// ---------------------------------------------------------------------------

function NoImagePage() {
    const food = FOOD_NO_IMAGE;
    const [quantity, setQuantity] = useState(1);
    const effectivePrice = food.price;

    return (
        <PageShell>
            <a
                href='#'
                className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                onClick={e => e.preventDefault()}
            >
                <ArrowLeft className='h-4 w-4' />
                Back to menu
            </a>

            <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                {/* Image section — placeholder shown */}
                <div className='relative'>
                    <div className='relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary shadow-2xl shadow-primary/10 ring-1 ring-border'>
                        <FoodImageDisplay src={null} alt={food.name} />
                    </div>
                </div>

                <div className='flex flex-col'>
                    <span className='mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary'>
                        {food.category}
                    </span>

                    <h1 className='mb-2 text-4xl font-bold leading-tight text-foreground lg:text-5xl'>{food.name}</h1>

                    <hr className='border-border my-6' />

                    <p className='mb-6 text-base leading-relaxed text-muted-foreground'>{food.description}</p>

                    <div className='mb-6 flex flex-wrap gap-3'>
                        <div className='flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium'>
                            <Package className='h-4 w-4' />
                            <span>{food.quantityUnit}</span>
                        </div>
                        <div className='flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium'>
                            <Utensils className='h-4 w-4' />
                            <span>{food.stockQuantity} available</span>
                        </div>
                    </div>

                    <hr className='border-border mb-6' />

                    <div className='mb-8'>
                        <span className='font-sans text-5xl font-bold text-primary tabular-nums'>
                            {formatVnd(effectivePrice)}
                        </span>
                    </div>

                    <div className='sticky bottom-0 z-10 -mx-4 border-t bg-background px-4 py-4 sm:static sm:mx-0 sm:border-t-0 sm:p-0'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <div className='flex h-10 shrink-0 items-center justify-between rounded-full bg-muted px-1 py-1'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className='h-4 w-4' />
                                </Button>
                                <span className='w-10 text-center text-sm font-bold text-foreground'>{quantity}</span>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => setQuantity(q => Math.min(food.stockQuantity, q + 1))}
                                    disabled={quantity >= food.stockQuantity}
                                >
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>
                            <Button variant='default' size='lg' className='flex-1 rounded-full'>
                                <ShoppingCart className='h-5 w-5 shrink-0' />
                                <span className='truncate'>Add to cart — {formatVnd(effectivePrice * quantity)}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Food Details Page',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default — With Customisations',
    render: () => <DefaultDetailPage />,
};

export const NoCustomisations: Story = {
    name: 'No Customisations',
    render: () => <NoCustomisationsPage />,
};

export const DisabledAddToCart: Story = {
    name: 'Disabled Add-to-Cart (Required Selection Pending)',
    render: () => <DisabledAddToCartPage />,
};

export const AddedToCart: Story = {
    name: 'Added to Cart — Success Feedback',
    render: () => <AddedToCartPage />,
};

export const Loading: Story = {
    name: 'Loading — Skeleton',
    render: () => <LoadingPage />,
};

export const NoImage: Story = {
    name: 'No Image — Placeholder',
    render: () => <NoImagePage />,
};

export const Dark: Story = {
    name: 'Default — Dark Mode',
    render: () => <DefaultDetailPage />,
    parameters: {
        themes: { themeOverride: 'dark' },
    },
};
