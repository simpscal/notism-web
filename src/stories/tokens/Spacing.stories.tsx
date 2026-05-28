import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// ---------------------------------------------------------------------------
// Sprint 6: 8pt grid scale
// The design system uses a constrained set of spacing values anchored to an
// 8pt base grid. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96.
// ---------------------------------------------------------------------------

interface SpacingToken {
    px: number;
    label: string;
    usage: string;
}

const tokens: SpacingToken[] = [
    { px: 4, label: '4', usage: 'Inline gaps, icon padding, tight insets' },
    { px: 8, label: '8', usage: 'Default gap, compact padding, badge insets' },
    { px: 12, label: '12', usage: 'Button padding, input padding, list item gap' },
    { px: 16, label: '16', usage: 'Card padding, section gap, standard inset' },
    { px: 24, label: '24', usage: 'Content area padding, group spacing' },
    { px: 32, label: '32', usage: 'Section margin, large card padding' },
    { px: 48, label: '48', usage: 'Page section spacing, hero padding' },
    { px: 64, label: '64', usage: 'Major section breaks, page top margin' },
    { px: 96, label: '96', usage: 'Maximum breathing room, full-page hero spacing' },
];

const maxBarPx = 96;

// ---------------------------------------------------------------------------
// Row component
// ---------------------------------------------------------------------------

function SpacingRow({ px, usage }: SpacingToken) {
    const percentage = (px / maxBarPx) * 100;

    return (
        <div className='group flex items-center gap-4 py-2.5 border-b border-border/30 last:border-none hover:bg-muted/30 transition-colors duration-150 px-2 -mx-2 rounded-lg'>
            {/* Pixel value */}
            <div className='w-12 text-right'>
                <code className='text-sm font-mono font-bold text-foreground tabular-nums'>{px}</code>
                <span className='text-[10px] text-muted-foreground ml-0.5'>px</span>
            </div>

            {/* Bar visualization */}
            <div className='flex-1 flex items-center'>
                <div className='w-full h-7 bg-muted/40 rounded-md relative overflow-hidden'>
                    <div
                        className='h-full bg-primary/80 rounded-md transition-all duration-500 relative group-hover:bg-primary'
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Grid lines at 8px intervals */}
                        {px >= 16 && (
                            <div className='absolute inset-0 flex'>
                                {Array.from({ length: Math.floor(px / 8) - 1 }, (_, i) => (
                                    <div
                                        key={i}
                                        className='h-full border-r border-primary-foreground/20'
                                        style={{ width: `${(8 / px) * 100}%` }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tailwind class */}
            <div className='w-14 text-right'>
                <code className='text-xs font-mono text-muted-foreground'>{px / 4}</code>
            </div>

            {/* Usage */}
            <div className='w-64 hidden lg:block'>
                <span className='text-xs text-muted-foreground'>{usage}</span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Grid demo -- 8pt base grid visualization
// ---------------------------------------------------------------------------

function GridDemo() {
    return (
        <div className='rounded-container border border-border/30 overflow-hidden'>
            <div className='px-6 py-4 bg-muted/50'>
                <h3 className='text-sm font-semibold text-foreground'>8pt Base Grid</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                    All spacing values are multiples of 4px, anchored to an 8pt grid. Odd steps (4, 12) provide
                    half-grid precision for tight contexts.
                </p>
            </div>
            <div className='p-6'>
                {/* Grid visualization */}
                <div className='relative h-24 bg-muted/20 rounded-lg overflow-hidden'>
                    {/* 8px grid lines */}
                    <div className='absolute inset-0 flex'>
                        {Array.from({ length: 48 }, (_, i) => (
                            <div
                                key={i}
                                className='h-full border-r'
                                style={{
                                    width: '8px',
                                    borderColor:
                                        (i + 1) % 8 === 0
                                            ? 'var(--border)'
                                            : (i + 1) % 2 === 0
                                              ? 'oklch(0.75 0.015 80 / 0.06)'
                                              : 'oklch(0.75 0.015 80 / 0.03)',
                                }}
                            />
                        ))}
                    </div>
                    {/* Stacked spacing examples */}
                    <div className='absolute left-0 top-2 flex flex-col gap-1.5'>
                        {[8, 16, 32, 64].map((size, i) => (
                            <div
                                key={size}
                                className='h-3 bg-primary rounded-sm relative'
                                style={{
                                    width: `${size}px`,
                                    opacity: 0.5 + i * 0.15,
                                }}
                            >
                                <span className='absolute right-1 top-0 text-[8px] text-primary-foreground font-mono font-bold leading-3'>
                                    {size}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Practical spacing demo
// ---------------------------------------------------------------------------

function PracticalDemo() {
    return (
        <div className='rounded-container border border-border/30 overflow-hidden'>
            <div className='px-6 py-4 bg-muted/50'>
                <h3 className='text-sm font-semibold text-foreground'>In Practice</h3>
                <p className='text-xs text-muted-foreground mt-1'>Common spacing patterns using the 8pt grid scale.</p>
            </div>
            <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Compact card */}
                <div className='flex flex-col gap-2'>
                    <span className='tracking-caps text-muted-foreground font-semibold'>Compact (8-12px)</span>
                    <div className='shadow-surface bg-card rounded-lg border border-border/20'>
                        <div className='p-2 flex items-center gap-2'>
                            <div className='w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center'>
                                <div className='w-4 h-4 rounded-sm bg-primary' />
                            </div>
                            <div className='flex flex-col gap-0.5'>
                                <span className='text-xs font-semibold text-foreground'>Item</span>
                                <span className='text-[10px] text-muted-foreground'>gap-2 p-2</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Standard card */}
                <div className='flex flex-col gap-2'>
                    <span className='tracking-caps text-muted-foreground font-semibold'>Standard (16-24px)</span>
                    <div className='shadow-elevated bg-card rounded-xl border border-border/20'>
                        <div className='p-4 flex flex-col gap-3'>
                            <span className='text-sm font-semibold text-foreground'>Card Title</span>
                            <span className='text-xs text-muted-foreground'>p-4 gap-3</span>
                            <div className='h-2 w-full bg-muted rounded-full' />
                        </div>
                    </div>
                </div>

                {/* Spacious section */}
                <div className='flex flex-col gap-2'>
                    <span className='tracking-caps text-muted-foreground font-semibold'>Spacious (32-48px)</span>
                    <div className='shadow-modal bg-card rounded-container border border-border/20'>
                        <div className='p-8 flex flex-col gap-4 text-center'>
                            <span className='text-lg font-bold text-foreground tracking-tight-design'>Hero</span>
                            <span className='text-xs text-muted-foreground'>p-8 gap-4</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function SpacingPage() {
    return (
        <div className='p-8 flex flex-col gap-12 bg-background min-h-screen'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold text-foreground tracking-tight-design'>Spacing Tokens</h1>
                <p className='mt-2 text-sm text-muted-foreground' style={{ lineHeight: 'var(--leading-body)' }}>
                    Constrained 8pt grid scale with 9 steps: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Bar fills are
                    proportional to value; grid lines inside bars mark 8px intervals. Tailwind units shown as multiplier
                    (1 unit = 4px).
                </p>
            </div>

            {/* Scale table */}
            <section>
                <div className='flex items-center gap-4 mb-4'>
                    <h2 className='tracking-caps text-muted-foreground font-semibold'>Scale</h2>
                    <div className='flex gap-4 ml-auto'>
                        <span className='text-[10px] text-muted-foreground font-mono'>px</span>
                        <span className='text-[10px] text-muted-foreground font-mono w-64 hidden lg:block'>
                            Typical usage
                        </span>
                    </div>
                </div>
                <div className='flex flex-col max-w-4xl'>
                    {/* Column headers */}
                    <div className='flex items-center gap-4 pb-2 border-b border-border mb-1 px-2'>
                        <div className='w-12 text-right'>
                            <span className='tracking-caps text-muted-foreground font-semibold'>px</span>
                        </div>
                        <span className='tracking-caps text-muted-foreground font-semibold flex-1'>Bar</span>
                        <span className='tracking-caps text-muted-foreground font-semibold w-14 text-right'>tw</span>
                        <span className='tracking-caps text-muted-foreground font-semibold w-64 hidden lg:block'>
                            Usage
                        </span>
                    </div>

                    {tokens.map(t => (
                        <SpacingRow key={t.px} {...t} />
                    ))}
                </div>
            </section>

            {/* Grid demo */}
            <GridDemo />

            {/* Practical demo */}
            <PracticalDemo />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + story
// ---------------------------------------------------------------------------

const meta = {
    title: 'Tokens/Spacing',
    component: SpacingPage,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof SpacingPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
