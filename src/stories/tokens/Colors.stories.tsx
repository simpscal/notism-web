import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SwatchDef {
    variable: string;
    label: string;
    tw?: string;
}

interface GroupDef {
    title: string;
    description: string;
    swatches: SwatchDef[];
}

// ---------------------------------------------------------------------------
// Token groups -- mirroring index.css semantic grouping
// Sprint 6: pushed primary saturation (oklch 0.55 0.13 150), dark mode
// forest green surfaces, warm cream editorial light mode, border opacity
// tokens, semantic triad (success / warning / info).
// ---------------------------------------------------------------------------

const groups: GroupDef[] = [
    {
        title: 'Surfaces',
        description: 'Warm cream (light) / deep forest green (dark) -- editorial clarity with organic warmth.',
        swatches: [
            { variable: '--background', label: 'background', tw: 'bg-background' },
            { variable: '--foreground', label: 'foreground', tw: 'bg-foreground' },
            { variable: '--card', label: 'card', tw: 'bg-card' },
            { variable: '--card-foreground', label: 'card-foreground', tw: 'bg-card-foreground' },
            { variable: '--popover', label: 'popover', tw: 'bg-popover' },
            { variable: '--popover-foreground', label: 'popover-foreground', tw: 'bg-popover-foreground' },
        ],
    },
    {
        title: 'Primary',
        description:
            'Confident sage green with pushed saturation -- oklch(0.55 0.13 150) light, lifted to 0.65 in dark.',
        swatches: [
            { variable: '--primary', label: 'primary', tw: 'bg-primary' },
            { variable: '--primary-foreground', label: 'primary-foreground', tw: 'bg-primary-foreground' },
        ],
    },
    {
        title: 'Secondary & Muted',
        description: 'Warm parchment tints (light) / toasted neutral dark surfaces (dark).',
        swatches: [
            { variable: '--secondary', label: 'secondary', tw: 'bg-secondary' },
            { variable: '--secondary-foreground', label: 'secondary-foreground', tw: 'bg-secondary-foreground' },
            { variable: '--muted', label: 'muted', tw: 'bg-muted' },
            { variable: '--muted-foreground', label: 'muted-foreground', tw: 'bg-muted-foreground' },
            { variable: '--accent', label: 'accent', tw: 'bg-accent' },
            { variable: '--accent-foreground', label: 'accent-foreground', tw: 'bg-accent-foreground' },
        ],
    },
    {
        title: 'Semantic',
        description: 'Functional triad harmonized with the herbal palette -- destructive, success, warning, info.',
        swatches: [
            { variable: '--destructive', label: 'destructive', tw: 'bg-destructive' },
            { variable: '--destructive-foreground', label: 'destructive-fg', tw: 'bg-destructive-foreground' },
            { variable: '--success', label: 'success', tw: 'bg-success' },
            { variable: '--warning', label: 'warning', tw: 'bg-warning' },
            { variable: '--info', label: 'info', tw: 'bg-info' },
        ],
    },
    {
        title: 'Border & Input',
        description: 'Warm-neutral hairlines at 0.08-0.12 opacity (light), halved in dark. Divider at 6%/3%.',
        swatches: [
            { variable: '--border', label: 'border', tw: 'bg-border' },
            { variable: '--input', label: 'input', tw: 'bg-input' },
            { variable: '--border-divider', label: 'border-divider' },
            { variable: '--ring', label: 'ring', tw: 'bg-ring' },
        ],
    },
    {
        title: 'Chart Palette',
        description: 'Herbal / earthy five-color palette -- sage, fern, warm sand, deep herb, golden wheat.',
        swatches: [
            { variable: '--chart-1', label: 'sage', tw: 'bg-chart-1' },
            { variable: '--chart-2', label: 'fern', tw: 'bg-chart-2' },
            { variable: '--chart-3', label: 'warm sand', tw: 'bg-chart-3' },
            { variable: '--chart-4', label: 'deep herb', tw: 'bg-chart-4' },
            { variable: '--chart-5', label: 'golden wheat', tw: 'bg-chart-5' },
        ],
    },
    {
        title: 'Sidebar',
        description: 'Warm light surface slightly deeper than page (light) / deep forest, deeper than card (dark).',
        swatches: [
            { variable: '--sidebar', label: 'sidebar', tw: 'bg-sidebar' },
            { variable: '--sidebar-foreground', label: 'sidebar-fg', tw: 'bg-sidebar-foreground' },
            { variable: '--sidebar-primary', label: 'sidebar-primary', tw: 'bg-sidebar-primary' },
            {
                variable: '--sidebar-primary-foreground',
                label: 'sidebar-primary-fg',
                tw: 'bg-sidebar-primary-foreground',
            },
            { variable: '--sidebar-accent', label: 'sidebar-accent', tw: 'bg-sidebar-accent' },
            { variable: '--sidebar-accent-foreground', label: 'sidebar-accent-fg', tw: 'bg-sidebar-accent-foreground' },
            { variable: '--sidebar-border', label: 'sidebar-border', tw: 'bg-sidebar-border' },
            { variable: '--sidebar-ring', label: 'sidebar-ring', tw: 'bg-sidebar-ring' },
        ],
    },
];

// ---------------------------------------------------------------------------
// Swatch component -- reads live computed value from CSS variable
// ---------------------------------------------------------------------------

function Swatch({ variable, label, tw }: SwatchDef) {
    const [value, setValue] = React.useState('');

    React.useEffect(() => {
        const computed = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
        setValue(computed);
    }, [variable]);

    return (
        <div className='group flex flex-col gap-2 min-w-0'>
            <div
                className={`w-14 h-14 rounded-lg border border-border/40 transition-transform duration-200 group-hover:scale-110 ${tw ?? ''}`}
                style={!tw ? { background: `var(${variable})` } : undefined}
                aria-label={label}
            />
            <div className='flex flex-col gap-0.5'>
                <span className='text-xs font-semibold text-foreground truncate'>{label}</span>
                <code className='text-[10px] text-muted-foreground break-all leading-tight font-mono'>
                    {value || `var(${variable})`}
                </code>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Primary hero -- large showcase of the primary color with saturation info
// ---------------------------------------------------------------------------

function PrimaryHero() {
    const [lightVal, setLightVal] = React.useState('');

    React.useEffect(() => {
        const val = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        setLightVal(val);
    }, []);

    return (
        <div className='rounded-container overflow-hidden shadow-elevated'>
            <div className='bg-primary px-8 py-10 flex flex-col gap-3'>
                <span className='text-primary-foreground text-2xl font-bold tracking-tight-design'>
                    Primary -- Sage Green
                </span>
                <span className='text-primary-foreground/80 text-sm font-medium font-mono'>
                    {lightVal || 'oklch(0.55 0.13 150)'}
                </span>
                <span className='text-primary-foreground/60 text-xs'>
                    Pushed saturation (0.13 chroma) at hue 150 -- confident, organic, editorial.
                </span>
            </div>
            <div className='bg-card px-8 py-4 border-t border-border/30'>
                <div className='flex gap-3 items-center'>
                    <div className='w-5 h-5 rounded-full bg-primary' />
                    <span className='text-xs text-muted-foreground'>
                        Light: oklch(0.55 0.13 150) | Dark: oklch(0.65 0.13 150)
                    </span>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Dark mode surface showcase
// ---------------------------------------------------------------------------

function DarkModeShowcase() {
    return (
        <div className='rounded-container border border-border/30 overflow-hidden'>
            <div className='px-6 py-4 bg-muted/50'>
                <h3 className='text-sm font-semibold text-foreground'>Dark Mode: Forest Green Surfaces</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                    Dark surfaces use deep forest green undertones (hue 150-155) instead of neutral charcoal, creating a
                    candlelit dinner atmosphere.
                </p>
            </div>
            <div className='p-6 grid grid-cols-3 gap-3'>
                {[
                    { label: 'Background', token: '--background', note: 'oklch(0.14 0.015 155)' },
                    { label: 'Card', token: '--card', note: 'oklch(0.18 0.018 152)' },
                    { label: 'Secondary', token: '--secondary', note: 'oklch(0.22 0.016 140)' },
                ].map(({ label, token, note }) => (
                    <div key={token} className='flex flex-col gap-2 items-center text-center'>
                        <div
                            className='w-full h-16 rounded-lg border border-border/20'
                            style={{ background: `var(${token})` }}
                        />
                        <span className='text-xs font-medium text-foreground'>{label}</span>
                        <code className='text-[10px] text-muted-foreground font-mono'>{note}</code>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function ColorsPage() {
    return (
        <div className='p-8 flex flex-col gap-12 bg-background min-h-screen'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold text-foreground tracking-tight-design'>Color Tokens</h1>
                <p className='mt-2 text-sm text-muted-foreground' style={{ lineHeight: 'var(--leading-body)' }}>
                    Semantic color palette grounded in warm cream surfaces (light) and deep forest green (dark). Primary
                    sage green at pushed saturation (oklch 0.55 0.13 hue 150). All values read live via{' '}
                    <code className='text-xs bg-muted rounded-md px-1.5 py-0.5'>getComputedStyle</code>.
                </p>
            </div>

            {/* Primary hero */}
            <PrimaryHero />

            {/* Dark mode showcase */}
            <DarkModeShowcase />

            {/* Token groups */}
            {groups.map(group => (
                <section key={group.title}>
                    <div className='mb-5'>
                        <h2 className='tracking-caps text-muted-foreground font-semibold mb-1'>{group.title}</h2>
                        <p className='text-xs text-muted-foreground'>{group.description}</p>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        {group.swatches.map(s => (
                            <Swatch key={s.variable} {...s} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + story
// ---------------------------------------------------------------------------

const meta = {
    title: 'Tokens/Colors',
    component: ColorsPage,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof ColorsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
