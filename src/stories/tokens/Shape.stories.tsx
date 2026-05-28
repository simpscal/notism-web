import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// ---------------------------------------------------------------------------
// Sprint 6 radius hierarchy:
//   sm   = calc(--radius - 4px) = 4px   -- Controls (checkboxes, toggles, small inputs)
//   md   = calc(--radius - 2px) = 6px   -- Controls (buttons, badges, chips)
//   lg   = var(--radius)        = 8px   -- Containers (cards, panels, inputs)
//   xl   = calc(--radius + 4px) = 12px  -- Containers (elevated panels, popovers)
//   2xl  = --radius-2xl         = 16px  -- Large containers (hero cards, feature sections)
//   pill = --radius-pill        = 9999px -- Semantic (tags, status indicators, avatars)
//
// Sprint 6 refinement: component radius usage reduced one step across the board
// (rounded-3xl -> rounded-2xl, rounded-2xl -> rounded-xl, rounded-xl -> rounded-lg)
// for a tighter, more refined appearance. Token scale itself unchanged.
// ---------------------------------------------------------------------------

interface RadiusToken {
    label: string;
    cssVar: string;
    twClass: string;
    category: 'Controls' | 'Containers' | 'Semantic';
    description: string;
    useCases: string;
    staticValue?: string;
}

const tokens: RadiusToken[] = [
    {
        label: 'sm',
        cssVar: '--radius-sm',
        twClass: 'rounded-sm',
        category: 'Controls',
        description: '4px -- calc(--radius - 4px)',
        useCases: 'Checkboxes, toggles, small inputs',
    },
    {
        label: 'md',
        cssVar: '--radius-md',
        twClass: 'rounded-md',
        category: 'Controls',
        description: '6px -- calc(--radius - 2px)',
        useCases: 'Buttons, badges, chips',
    },
    {
        label: 'lg',
        cssVar: '--radius-lg',
        twClass: 'rounded-lg',
        category: 'Containers',
        description: '8px -- var(--radius) base',
        useCases: 'Cards, panels, standard inputs, elevated panels (reduced from xl)',
    },
    {
        label: 'xl',
        cssVar: '--radius-xl',
        twClass: 'rounded-xl',
        category: 'Containers',
        description: '12px -- calc(--radius + 4px)',
        useCases: 'Popovers, dropdowns, hero cards (reduced from 2xl)',
    },
    {
        label: '2xl',
        cssVar: '--radius-2xl',
        twClass: 'rounded-container',
        category: 'Containers',
        description: '16px -- --radius-2xl',
        useCases: 'Feature sections, modal dialogs, large containers',
        staticValue: '1rem',
    },
    {
        label: 'pill',
        cssVar: '--radius-pill',
        twClass: 'rounded-pill',
        category: 'Semantic',
        description: '9999px -- --radius-pill',
        useCases: 'Tags, status dots, avatars, pills',
        staticValue: '9999px',
    },
];

const categoryColors: Record<string, string> = {
    Controls: 'bg-info/15 text-info',
    Containers: 'bg-primary/15 text-primary',
    Semantic: 'bg-warning/15 text-warning',
};

// ---------------------------------------------------------------------------
// Shape preview card
// ---------------------------------------------------------------------------

function ShapeCard({ label, cssVar, twClass, category, description, useCases, staticValue }: RadiusToken) {
    const [computed, setComputed] = React.useState('');

    React.useEffect(() => {
        if (staticValue) {
            setComputed(staticValue);
            return;
        }
        const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
        setComputed(val);
    }, [cssVar, staticValue]);

    // Pill gets a wider shape to show the effect properly
    const isPill = label === 'pill';

    return (
        <div className='flex flex-col gap-4'>
            {/* Preview shape */}
            <div className='flex items-center justify-center h-28 bg-muted/30 rounded-lg'>
                <div
                    className={`bg-primary ${twClass} transition-all duration-200 hover:scale-105`}
                    style={{
                        width: isPill ? '120px' : '88px',
                        height: isPill ? '44px' : '88px',
                    }}
                    aria-label={`border-radius-${label}`}
                />
            </div>
            {/* Info */}
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                    <span className='text-base font-bold text-foreground tracking-tight-design'>{label}</span>
                    <span className={`${categoryColors[category]} text-[10px] font-semibold px-2 py-0.5 rounded-pill`}>
                        {category}
                    </span>
                </div>
                <code className='text-xs font-mono text-muted-foreground'>.{twClass}</code>
                <code className='text-[10px] font-mono text-muted-foreground'>{computed || description}</code>
                <p className='text-xs text-muted-foreground/80'>{useCases}</p>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Functional category showcase
// ---------------------------------------------------------------------------

function CategoryShowcase() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Controls */}
            <div className='rounded-lg border border-border/30 overflow-hidden'>
                <div className='px-5 py-3 bg-info/10'>
                    <h3 className='text-sm font-semibold text-foreground'>Controls</h3>
                    <p className='text-xs text-muted-foreground'>sm (4px) & md (6px)</p>
                </div>
                <div className='p-5 flex flex-col gap-3'>
                    <div className='flex gap-2 items-center'>
                        <div className='w-5 h-5 rounded-sm border-2 border-primary bg-primary/10' />
                        <span className='text-xs text-muted-foreground'>Checkbox (sm)</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <span className='bg-primary text-primary-foreground rounded-md px-4 py-1.5 text-sm font-medium'>
                            Button
                        </span>
                        <span className='text-xs text-muted-foreground'>Button (md)</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <span className='bg-muted text-muted-foreground rounded-md px-3 py-1 text-xs font-medium'>
                            Badge
                        </span>
                        <span className='text-xs text-muted-foreground'>Badge (md)</span>
                    </div>
                </div>
            </div>

            {/* Containers */}
            <div className='rounded-lg border border-border/30 overflow-hidden'>
                <div className='px-5 py-3 bg-primary/10'>
                    <h3 className='text-sm font-semibold text-foreground'>Containers</h3>
                    <p className='text-xs text-muted-foreground'>
                        lg (8px), xl (12px), 2xl (16px) -- radius usage reduced one step
                    </p>
                </div>
                <div className='p-5 flex flex-col gap-3'>
                    <div className='shadow-surface bg-card rounded-lg border border-border/20 p-3'>
                        <span className='text-xs text-muted-foreground'>Card (lg)</span>
                    </div>
                    <div className='shadow-elevated bg-card rounded-lg border border-border/20 p-3'>
                        <span className='text-xs text-muted-foreground'>Elevated panel (lg, reduced from xl)</span>
                    </div>
                    <div className='shadow-modal bg-card rounded-xl border border-border/20 p-3'>
                        <span className='text-xs text-muted-foreground'>Hero card (xl, reduced from 2xl)</span>
                    </div>
                </div>
            </div>

            {/* Semantic */}
            <div className='rounded-lg border border-border/30 overflow-hidden'>
                <div className='px-5 py-3 bg-warning/10'>
                    <h3 className='text-sm font-semibold text-foreground'>Semantic</h3>
                    <p className='text-xs text-muted-foreground'>pill (9999px)</p>
                </div>
                <div className='p-5 flex flex-col gap-3'>
                    <div className='flex gap-2 items-center flex-wrap'>
                        <span className='bg-success/15 text-success rounded-pill px-3 py-1 text-xs font-semibold'>
                            Active
                        </span>
                        <span className='bg-warning/15 text-warning rounded-pill px-3 py-1 text-xs font-semibold'>
                            Pending
                        </span>
                        <span className='bg-destructive/15 text-destructive rounded-pill px-3 py-1 text-xs font-semibold'>
                            Closed
                        </span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className='w-8 h-8 rounded-pill bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold'>
                            N
                        </div>
                        <span className='text-xs text-muted-foreground'>Avatar (pill)</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <span className='bg-muted text-muted-foreground rounded-pill px-3 py-1 text-xs'>
                            Category Tag
                        </span>
                        <span className='text-xs text-muted-foreground'>Tag (pill)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function ShapePage() {
    const [baseRadius, setBaseRadius] = React.useState('');

    React.useEffect(() => {
        const val = getComputedStyle(document.documentElement).getPropertyValue('--radius').trim();
        setBaseRadius(val);
    }, []);

    return (
        <div className='p-8 flex flex-col gap-12 bg-background min-h-screen'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold text-foreground tracking-tight-design'>Shape Tokens</h1>
                <p className='mt-2 text-sm text-muted-foreground' style={{ lineHeight: 'var(--leading-body)' }}>
                    Six-step radius hierarchy derived from{' '}
                    <code className='text-xs bg-muted rounded-md px-1.5 py-0.5'>--radius</code>
                    {baseRadius && (
                        <>
                            {' '}
                            = <code className='text-xs bg-muted rounded-md px-1.5 py-0.5'>{baseRadius}</code>
                        </>
                    )}
                    . Organized by function: <strong>Controls</strong> (sm, md) for interactive elements,{' '}
                    <strong>Containers</strong> (lg, xl, 2xl) for layout surfaces, <strong>Semantic</strong> (pill) for
                    status markers and avatars. Component radius usage has been reduced one step (e.g. 3xl to 2xl, 2xl
                    to xl, xl to lg) for a tighter, more refined appearance.
                </p>
            </div>

            {/* Shape grid */}
            <section>
                <h2 className='tracking-caps text-muted-foreground font-semibold mb-6'>Radius Scale</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                    {tokens.map(t => (
                        <ShapeCard key={t.label} {...t} />
                    ))}
                </div>
            </section>

            {/* Functional categories */}
            <section>
                <h2 className='tracking-caps text-muted-foreground font-semibold mb-6'>Functional Categories</h2>
                <CategoryShowcase />
            </section>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + story
// ---------------------------------------------------------------------------

const meta = {
    title: 'Tokens/Shape',
    component: ShapePage,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof ShapePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
