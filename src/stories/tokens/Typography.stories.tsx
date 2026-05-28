import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// ---------------------------------------------------------------------------
// Sprint 6 typography tokens:
//   --tracking-tight: -0.015em  (headings)
//   --tracking-caps: 0.06em + uppercase + 0.6875rem  (labels/section headers)
//   --leading-body: 1.55  (comfortable body reading)
//   --text-body-desktop: 1.0625rem / 17px  (body copy on desktop)
//
// Font stack: Nunito Sans (sans), JetBrains Mono (mono)
// ---------------------------------------------------------------------------

interface ScaleDef {
    label: string;
    twSize: string;
    twWeight: string;
    twLeading: string;
    cssSize: string;
    cssLeading: string;
    sampleText: string;
    useTracking?: boolean;
}

const scale: ScaleDef[] = [
    {
        label: 'xs',
        twSize: 'text-xs',
        twWeight: 'font-normal',
        twLeading: 'leading-4',
        cssSize: '0.75rem / 12px',
        cssLeading: '1rem / 16px',
        sampleText: 'The quick brown fox jumps over the lazy dog',
    },
    {
        label: 'sm',
        twSize: 'text-sm',
        twWeight: 'font-normal',
        twLeading: 'leading-5',
        cssSize: '0.875rem / 14px',
        cssLeading: '1.25rem / 20px',
        sampleText: 'The quick brown fox jumps over the lazy dog',
    },
    {
        label: 'body-desktop',
        twSize: '',
        twWeight: 'font-normal',
        twLeading: '',
        cssSize: '1.0625rem / 17px',
        cssLeading: '--leading-body: 1.55',
        sampleText:
            'Body copy on desktop uses a slightly larger size with generous line height for comfortable reading across long-form content.',
    },
    {
        label: 'base',
        twSize: 'text-base',
        twWeight: 'font-normal',
        twLeading: 'leading-6',
        cssSize: '1rem / 16px',
        cssLeading: '1.5rem / 24px',
        sampleText: 'The quick brown fox jumps over the lazy dog',
    },
    {
        label: 'lg',
        twSize: 'text-lg',
        twWeight: 'font-medium',
        twLeading: 'leading-7',
        cssSize: '1.125rem / 18px',
        cssLeading: '1.75rem / 28px',
        sampleText: 'The quick brown fox jumps over the lazy dog',
        useTracking: true,
    },
    {
        label: 'xl',
        twSize: 'text-xl',
        twWeight: 'font-semibold',
        twLeading: 'leading-7',
        cssSize: '1.25rem / 20px',
        cssLeading: '1.75rem / 28px',
        sampleText: 'The quick brown fox jumps',
        useTracking: true,
    },
    {
        label: '2xl',
        twSize: 'text-2xl',
        twWeight: 'font-semibold',
        twLeading: 'leading-8',
        cssSize: '1.5rem / 24px',
        cssLeading: '2rem / 32px',
        sampleText: 'The quick brown fox',
        useTracking: true,
    },
    {
        label: '3xl',
        twSize: 'text-3xl',
        twWeight: 'font-bold',
        twLeading: 'leading-9',
        cssSize: '1.875rem / 30px',
        cssLeading: '2.25rem / 36px',
        sampleText: 'Notism Design',
        useTracking: true,
    },
    {
        label: '4xl',
        twSize: 'text-4xl',
        twWeight: 'font-bold',
        twLeading: 'leading-10',
        cssSize: '2.25rem / 36px',
        cssLeading: '2.5rem / 40px',
        sampleText: 'Notism',
        useTracking: true,
    },
];

// ---------------------------------------------------------------------------
// Mono specimens -- JetBrains Mono for data-dense contexts
// ---------------------------------------------------------------------------

interface MonoSpecimen {
    label: string;
    useCase: string;
    sampleText: string;
}

const monoSpecimens: MonoSpecimen[] = [
    {
        label: 'price',
        useCase: 'Currency / financial value',
        sampleText: '$1,249.00  EUR899.99  JPY128,500',
    },
    {
        label: 'order-id',
        useCase: 'Order / reference ID',
        sampleText: 'ORD-20240526-A3F9  #NTM-00042187',
    },
    {
        label: 'timestamp',
        useCase: 'ISO timestamp / date-time',
        sampleText: '2024-05-26T14:32:09.421Z',
    },
];

// ---------------------------------------------------------------------------
// Type row component
// ---------------------------------------------------------------------------

function TypeRow({ label, twSize, twWeight, twLeading, cssSize, cssLeading, sampleText, useTracking }: ScaleDef) {
    const isBodyDesktop = label === 'body-desktop';
    const isHeading = useTracking;

    return (
        <div className='flex flex-col gap-2 py-5 border-b border-border/30 last:border-none'>
            {/* Meta row */}
            <div className='flex items-center gap-3 flex-wrap'>
                <span className='inline-flex items-center rounded-pill bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground font-mono'>
                    {label}
                </span>
                <span className='text-xs text-muted-foreground'>
                    {cssSize} · {cssLeading}
                </span>
                {isHeading && (
                    <span className='inline-flex items-center rounded-pill bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold'>
                        tracking-tight
                    </span>
                )}
                {isBodyDesktop && (
                    <span className='inline-flex items-center rounded-pill bg-info/10 text-info px-2 py-0.5 text-[10px] font-semibold'>
                        body-desktop
                    </span>
                )}
            </div>
            {/* Sample text */}
            {isBodyDesktop ? (
                <p
                    className={`${twWeight} text-foreground`}
                    style={{
                        fontSize: 'var(--text-body-desktop)',
                        lineHeight: 'var(--leading-body)',
                    }}
                >
                    {sampleText}
                </p>
            ) : (
                <p
                    className={`${twSize} ${twWeight} ${twLeading} text-foreground ${isHeading ? 'tracking-tight-design' : ''}`}
                >
                    {sampleText}
                </p>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Mono row component
// ---------------------------------------------------------------------------

function MonoRow({ label, useCase, sampleText }: MonoSpecimen) {
    return (
        <div className='flex flex-col gap-2 py-5 border-b border-border/30 last:border-none'>
            <div className='flex items-center gap-3 flex-wrap'>
                <span className='inline-flex items-center rounded-pill bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground font-mono'>
                    {label}
                </span>
                <span className='text-xs text-muted-foreground'>JetBrains Mono · {useCase}</span>
            </div>
            <p className='text-base font-mono font-normal leading-6 text-foreground tabular-nums'>{sampleText}</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Tracking tokens demo
// ---------------------------------------------------------------------------

function TrackingDemo() {
    const [trackingTight, setTrackingTight] = React.useState('');
    const [trackingCaps, setTrackingCaps] = React.useState('');

    React.useEffect(() => {
        const cs = getComputedStyle(document.documentElement);
        setTrackingTight(cs.getPropertyValue('--tracking-tight').trim());
        setTrackingCaps(cs.getPropertyValue('--tracking-caps').trim());
    }, []);

    return (
        <div className='rounded-container border border-border/30 overflow-hidden'>
            <div className='px-6 py-4 bg-muted/50'>
                <h3 className='text-sm font-semibold text-foreground'>Letter Spacing Tokens</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                    Two tracking utilities for typographic hierarchy. Applied via CSS utility classes.
                </p>
            </div>
            <div className='p-6 flex flex-col gap-6'>
                {/* tracking-tight */}
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-3'>
                        <code className='text-xs font-mono font-medium text-foreground'>.tracking-tight-design</code>
                        <code className='text-[10px] font-mono text-muted-foreground'>
                            {trackingTight || '-0.015em'}
                        </code>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-4 rounded-lg bg-muted/30'>
                            <span className='text-xs text-muted-foreground mb-2 block'>Without tracking</span>
                            <h3 className='text-2xl font-bold text-foreground'>Fresh Pasta & Herbs</h3>
                        </div>
                        <div className='p-4 rounded-lg bg-primary/5 border border-primary/10'>
                            <span className='text-xs text-primary mb-2 block'>With tracking-tight</span>
                            <h3 className='text-2xl font-bold text-foreground tracking-tight-design'>
                                Fresh Pasta & Herbs
                            </h3>
                        </div>
                    </div>
                </div>
                {/* tracking-caps */}
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-3'>
                        <code className='text-xs font-mono font-medium text-foreground'>.tracking-caps</code>
                        <code className='text-[10px] font-mono text-muted-foreground'>
                            {trackingCaps || '0.06em'} + uppercase + 0.6875rem
                        </code>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-4 rounded-lg bg-muted/30'>
                            <span className='text-xs text-muted-foreground mb-2 block'>Normal label</span>
                            <span className='text-sm font-semibold text-foreground'>Section Header</span>
                        </div>
                        <div className='p-4 rounded-lg bg-primary/5 border border-primary/10'>
                            <span className='text-xs text-primary mb-2 block'>With tracking-caps</span>
                            <span className='tracking-caps font-semibold text-foreground'>Section Header</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Body reading demo
// ---------------------------------------------------------------------------

function BodyReadingDemo() {
    const [leadingBody, setLeadingBody] = React.useState('');
    const [bodySize, setBodySize] = React.useState('');

    React.useEffect(() => {
        const cs = getComputedStyle(document.documentElement);
        setLeadingBody(cs.getPropertyValue('--leading-body').trim());
        setBodySize(cs.getPropertyValue('--text-body-desktop').trim());
    }, []);

    return (
        <div className='rounded-container border border-border/30 overflow-hidden'>
            <div className='px-6 py-4 bg-muted/50'>
                <h3 className='text-sm font-semibold text-foreground'>Body Typography</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                    Desktop body text uses{' '}
                    <code className='text-[10px] bg-muted rounded px-1 py-0.5'>--text-body-desktop</code> (
                    {bodySize || '1.0625rem'} / 17px) with{' '}
                    <code className='text-[10px] bg-muted rounded px-1 py-0.5'>--leading-body</code> (
                    {leadingBody || '1.55'}) for comfortable long-form reading.
                </p>
            </div>
            <div className='p-6 grid grid-cols-2 gap-6'>
                <div className='flex flex-col gap-2'>
                    <span className='tracking-caps text-muted-foreground font-semibold'>Standard (1rem)</span>
                    <p className='text-base leading-6 text-foreground'>
                        Discover seasonal ingredients sourced from local farms. Our menu changes weekly to showcase the
                        freshest produce, artisanal cheeses, and heritage grains available in the region. Every dish
                        tells a story of terroir and tradition.
                    </p>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='tracking-caps text-primary font-semibold'>Desktop Body (17px / 1.55)</span>
                    <p
                        className='text-foreground'
                        style={{
                            fontSize: 'var(--text-body-desktop)',
                            lineHeight: 'var(--leading-body)',
                        }}
                    >
                        Discover seasonal ingredients sourced from local farms. Our menu changes weekly to showcase the
                        freshest produce, artisanal cheeses, and heritage grains available in the region. Every dish
                        tells a story of terroir and tradition.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function TypographyPage() {
    const [fontFamily, setFontFamily] = React.useState('');

    React.useEffect(() => {
        const ff = getComputedStyle(document.body).fontFamily;
        setFontFamily(ff);
    }, []);

    return (
        <div className='p-8 flex flex-col gap-12 bg-background min-h-screen max-w-4xl'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold text-foreground tracking-tight-design'>Typography Tokens</h1>
                <p className='mt-2 text-sm text-muted-foreground' style={{ lineHeight: 'var(--leading-body)' }}>
                    Font scale xs through 4xl with Nunito Sans (body) and JetBrains Mono (data). Sprint 6 adds{' '}
                    <code className='text-xs bg-muted rounded-md px-1.5 py-0.5'>tracking-tight-design</code> for
                    headings, <code className='text-xs bg-muted rounded-md px-1.5 py-0.5'>tracking-caps</code> for
                    labels, <code className='text-xs bg-muted rounded-md px-1.5 py-0.5'>--leading-body: 1.55</code>, and{' '}
                    <code className='text-xs bg-muted rounded-md px-1.5 py-0.5'>--text-body-desktop: 17px</code>.
                </p>
                <p className='mt-1 text-xs text-muted-foreground'>
                    Computed font:{' '}
                    <code className='text-[10px] bg-muted rounded px-1 py-0.5 font-mono'>
                        {fontFamily || 'loading...'}
                    </code>
                </p>
            </div>

            {/* Type scale */}
            <section>
                <h2 className='tracking-caps text-muted-foreground font-semibold mb-4'>Type Scale</h2>
                <div>
                    {scale.map(s => (
                        <TypeRow key={s.label} {...s} />
                    ))}
                </div>
            </section>

            {/* Tracking demo */}
            <TrackingDemo />

            {/* Body reading demo */}
            <BodyReadingDemo />

            {/* JetBrains Mono section */}
            <section>
                <h2 className='tracking-caps text-muted-foreground font-semibold mb-1'>JetBrains Mono</h2>
                <p className='text-xs text-muted-foreground mb-4'>
                    Monospace typeface for data-dense contexts -- prices, IDs, timestamps, code snippets.
                </p>
                {monoSpecimens.map(s => (
                    <MonoRow key={s.label} {...s} />
                ))}
            </section>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + story
// ---------------------------------------------------------------------------

const meta = {
    title: 'Tokens/Typography',
    component: TypographyPage,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof TypographyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
