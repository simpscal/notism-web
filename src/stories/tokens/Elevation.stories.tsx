import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// ---------------------------------------------------------------------------
// Sprint 6: 3-tier elevation system via CSS custom properties
//
//   Tier 1 — Surface   (--shadow-surface)   Resting cards, list items
//   Tier 2 — Elevated  (--shadow-elevated)  Dropdowns, popovers, raised panels
//   Tier 3 — Modal     (--shadow-modal)     Dialogs, drawers, full overlays
//
// Shadow opacity reduced across all tiers for a lighter, subtler depth feel:
//   Surface  — light 0.03/0.04 (was 0.04/0.06), dark 0.08/0.06 (was 0.12/0.08)
//   Elevated — light 0.04/0.05 (was 0.06/0.08), dark 0.10/0.08 (was 0.16/0.12)
//   Modal    — light 0.08/0.04 (was 0.10/0.06), dark 0.18/0.08 (was 0.24/0.12)
//
// Plus: glass/frosted surface tokens and modal scrim overlay.
// ---------------------------------------------------------------------------

interface ElevationTier {
    name: string;
    cssVar: string;
    utilityClass: string;
    description: string;
    useCases: string;
}

const tiers: ElevationTier[] = [
    {
        name: 'Surface',
        cssVar: '--shadow-surface',
        utilityClass: 'shadow-surface',
        description: 'Subtle lift -- resting state for cards and list items. Light 0.03/0.04, dark 0.08/0.06 opacity.',
        useCases: 'Cards, list rows, table cells, badges',
    },
    {
        name: 'Elevated',
        cssVar: '--shadow-elevated',
        utilityClass: 'shadow-elevated',
        description: 'Raised panel -- popovers, dropdowns, floating controls. Light 0.04/0.05, dark 0.10/0.08 opacity.',
        useCases: 'Dropdowns, popovers, tooltips, floating action buttons',
    },
    {
        name: 'Modal',
        cssVar: '--shadow-modal',
        utilityClass: 'shadow-modal',
        description:
            'Prominent depth -- dialogs, drawers, full-screen overlays. Light 0.08/0.04, dark 0.18/0.08 opacity.',
        useCases: 'Modal dialogs, drawers, command palette, sheets',
    },
];

// ---------------------------------------------------------------------------
// Shadow tier card
// ---------------------------------------------------------------------------

function ShadowTierCard({ name, cssVar, utilityClass, description, useCases }: ElevationTier) {
    const [shadowValue, setShadowValue] = React.useState('');

    React.useEffect(() => {
        const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
        setShadowValue(val);
    }, [cssVar]);

    return (
        <div className='flex flex-col gap-4'>
            {/* Preview card using utility class */}
            <div
                className={`${utilityClass} bg-card text-card-foreground border border-border/30 rounded-lg p-8 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5`}
            >
                <div className='flex items-center gap-3'>
                    <div className='w-2.5 h-2.5 rounded-full bg-primary' />
                    <span className='text-lg font-bold tracking-tight-design text-foreground'>{name}</span>
                </div>
                <p className='text-sm text-muted-foreground' style={{ lineHeight: 'var(--leading-body)' }}>
                    {description}
                </p>
                <div className='flex gap-2 flex-wrap mt-1'>
                    {useCases.split(', ').map(useCase => (
                        <span
                            key={useCase}
                            className='tracking-caps bg-muted text-muted-foreground rounded-pill px-2.5 py-1'
                        >
                            {useCase}
                        </span>
                    ))}
                </div>
            </div>
            {/* Token info */}
            <div className='flex flex-col gap-1 px-1'>
                <code className='text-xs font-mono text-foreground font-medium'>.{utilityClass}</code>
                <code className='text-[10px] font-mono text-muted-foreground break-all leading-relaxed'>
                    {shadowValue || `var(${cssVar})`}
                </code>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Stacked depth comparison
// ---------------------------------------------------------------------------

function DepthComparison() {
    return (
        <div className='rounded-container border border-border/30 overflow-hidden'>
            <div className='px-6 py-4 bg-muted/50'>
                <h3 className='text-sm font-semibold text-foreground'>Depth Hierarchy</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                    Three tiers stacked to show progressive depth. Warm-tinted shadows with reduced opacity for subtler
                    lift (hue 80 light / hue 155 dark).
                </p>
            </div>
            <div className='p-10 flex items-end gap-6'>
                {tiers.map((tier, i) => (
                    <div
                        key={tier.name}
                        className={`${tier.utilityClass} bg-card border border-border/20 rounded-xl flex items-center justify-center text-sm font-semibold text-foreground`}
                        style={{
                            width: `${140 + i * 20}px`,
                            height: `${80 + i * 24}px`,
                            transform: `translateY(-${i * 4}px)`,
                        }}
                    >
                        Tier {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Glass / frosted surface demo
// ---------------------------------------------------------------------------

function GlassDemo() {
    const [glassTokens, setGlassTokens] = React.useState({ blur: '', bg: '', border: '' });

    React.useEffect(() => {
        const root = document.documentElement;
        const cs = getComputedStyle(root);
        setGlassTokens({
            blur: cs.getPropertyValue('--glass-blur').trim(),
            bg: cs.getPropertyValue('--glass-bg').trim(),
            border: cs.getPropertyValue('--glass-border').trim(),
        });
    }, []);

    return (
        <div className='rounded-container border border-border/30 overflow-hidden'>
            <div className='px-6 py-4 bg-muted/50'>
                <h3 className='text-sm font-semibold text-foreground'>Glass / Frosted Surface</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                    Tier 2 backdrop -- <code className='text-[10px] bg-muted rounded px-1 py-0.5'>.glass</code> utility
                    applies blur, semi-transparent background, and subtle border.
                </p>
            </div>
            {/* Colorful background to show glass effect */}
            <div
                className='relative p-10 min-h-[200px] flex items-center justify-center'
                style={{
                    background:
                        'linear-gradient(135deg, oklch(0.55 0.13 150) 0%, oklch(0.65 0.12 80) 50%, oklch(0.55 0.09 240) 100%)',
                }}
            >
                {/* Decorative circles behind glass */}
                <div
                    className='absolute top-6 left-10 w-20 h-20 rounded-full opacity-40'
                    style={{ background: 'oklch(0.68 0.10 65)' }}
                />
                <div
                    className='absolute bottom-8 right-14 w-16 h-16 rounded-full opacity-30'
                    style={{ background: 'oklch(0.60 0.10 130)' }}
                />
                {/* Glass card */}
                <div className='glass border rounded-xl p-8 max-w-sm relative z-10'>
                    <h4 className='text-lg font-bold text-foreground tracking-tight-design mb-2'>Frosted Panel</h4>
                    <p className='text-sm text-foreground/80' style={{ lineHeight: 'var(--leading-body)' }}>
                        Semi-transparent background with backdrop blur creates depth without occlusion. Ideal for
                        command palettes, floating toolbars, and overlay panels.
                    </p>
                </div>
            </div>
            {/* Token values */}
            <div className='px-6 py-4 bg-card border-t border-border/20 grid grid-cols-3 gap-4'>
                {[
                    { label: '--glass-blur', value: glassTokens.blur || '14px' },
                    { label: '--glass-bg', value: glassTokens.bg || 'oklch(... / 0.75)' },
                    { label: '--glass-border', value: glassTokens.border || 'oklch(... / 0.10)' },
                ].map(({ label, value }) => (
                    <div key={label} className='flex flex-col gap-0.5'>
                        <code className='text-xs font-mono font-medium text-foreground'>{label}</code>
                        <code className='text-[10px] font-mono text-muted-foreground break-all'>{value}</code>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Scrim / modal overlay demo
// ---------------------------------------------------------------------------

function ScrimDemo() {
    const [scrimValue, setScrimValue] = React.useState('');

    React.useEffect(() => {
        const val = getComputedStyle(document.documentElement).getPropertyValue('--scrim').trim();
        setScrimValue(val);
    }, []);

    return (
        <div className='rounded-container border border-border/30 overflow-hidden'>
            <div className='px-6 py-4 bg-muted/50'>
                <h3 className='text-sm font-semibold text-foreground'>Modal Scrim</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                    Tier 3 backdrop overlay -- <code className='text-[10px] bg-muted rounded px-1 py-0.5'>.scrim</code>{' '}
                    dims the page behind modal dialogs. Transitions via{' '}
                    <code className='text-[10px] bg-muted rounded px-1 py-0.5'>--transition-modal</code> (300ms
                    cubic-bezier).
                </p>
            </div>
            {/* Simulated page content behind scrim */}
            <div className='relative min-h-[240px]'>
                {/* Fake page content */}
                <div className='p-8 flex flex-col gap-3'>
                    <div className='h-6 w-48 bg-muted rounded-md' />
                    <div className='h-4 w-72 bg-muted/70 rounded-md' />
                    <div className='h-4 w-64 bg-muted/50 rounded-md' />
                    <div className='grid grid-cols-3 gap-3 mt-2'>
                        <div className='h-20 bg-muted/40 rounded-lg' />
                        <div className='h-20 bg-muted/40 rounded-lg' />
                        <div className='h-20 bg-muted/40 rounded-lg' />
                    </div>
                </div>
                {/* Scrim overlay */}
                <div className='absolute inset-0 scrim flex items-center justify-center'>
                    {/* Modal dialog floating on scrim */}
                    <div className='shadow-modal bg-card border border-border/20 rounded-xl p-8 max-w-xs text-center'>
                        <h4 className='text-lg font-bold text-foreground tracking-tight-design mb-2'>Dialog Title</h4>
                        <p className='text-sm text-muted-foreground mb-4'>
                            Content behind this dialog is dimmed by the scrim overlay.
                        </p>
                        <div className='flex gap-2 justify-center'>
                            <span className='bg-muted text-muted-foreground rounded-lg px-4 py-2 text-sm font-medium'>
                                Cancel
                            </span>
                            <span className='bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium'>
                                Confirm
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Token values */}
            <div className='px-6 py-4 bg-card border-t border-border/20 flex gap-8'>
                <div className='flex flex-col gap-0.5'>
                    <code className='text-xs font-mono font-medium text-foreground'>--scrim</code>
                    <code className='text-[10px] font-mono text-muted-foreground break-all'>
                        {scrimValue || 'oklch(0.20 0.015 80 / 0.45)'}
                    </code>
                </div>
                <div className='flex flex-col gap-0.5'>
                    <code className='text-xs font-mono font-medium text-foreground'>--transition-modal</code>
                    <code className='text-[10px] font-mono text-muted-foreground'>
                        300ms cubic-bezier(0.32, 0.72, 0, 1)
                    </code>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function ElevationPage() {
    return (
        <div className='p-8 flex flex-col gap-12 bg-background min-h-screen'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold text-foreground tracking-tight-design'>Elevation Tokens</h1>
                <p className='mt-2 text-sm text-muted-foreground' style={{ lineHeight: 'var(--leading-body)' }}>
                    Three-tier warm shadow system: <strong>Surface</strong> (resting), <strong>Elevated</strong>{' '}
                    (raised), <strong>Modal</strong> (prominent). Shadows use warm-tinted oklch colors (hue 80 in light,
                    hue 155 in dark) with reduced opacity across all tiers for a lighter, subtler depth hierarchy.
                    Complemented by glass/frosted tokens and a modal scrim overlay.
                </p>
            </div>

            {/* Shadow tiers */}
            <section>
                <h2 className='tracking-caps text-muted-foreground font-semibold mb-6'>Shadow Tiers</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {tiers.map(tier => (
                        <ShadowTierCard key={tier.name} {...tier} />
                    ))}
                </div>
            </section>

            {/* Depth comparison */}
            <DepthComparison />

            {/* Glass demo */}
            <GlassDemo />

            {/* Scrim demo */}
            <ScrimDemo />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + story
// ---------------------------------------------------------------------------

const meta = {
    title: 'Tokens/Elevation',
    component: ElevationPage,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof ElevationPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
