import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const weights = [
    { label: 'Regular (400)', value: 400 },
    { label: 'Medium (500)', value: 500 },
    { label: 'SemiBold (600)', value: 600 },
    { label: 'Bold (700)', value: 700 },
];

const sizes = [
    { label: 'xs', value: '0.75rem', lineHeight: '1rem' },
    { label: 'sm', value: '0.875rem', lineHeight: '1.25rem' },
    { label: 'base', value: '1rem', lineHeight: '1.5rem' },
    { label: 'lg', value: '1.125rem', lineHeight: '1.75rem' },
    { label: 'xl', value: '1.25rem', lineHeight: '1.75rem' },
    { label: '2xl', value: '1.5rem', lineHeight: '2rem' },
];

function TypographyPage() {
    return (
        <div style={{ padding: '32px', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>
                Typography
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '40px' }}>
                Noto Sans — the primary typeface at all defined weights and semantic sizes.
            </p>

            <section style={{ marginBottom: '48px' }}>
                <h2
                    style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '24px',
                    }}
                >
                    Font Weights
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {weights.map(w => (
                        <div key={w.value} style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                            <span
                                style={{
                                    width: '140px',
                                    fontSize: '11px',
                                    color: 'var(--muted-foreground)',
                                    fontFamily: 'monospace',
                                    flexShrink: 0,
                                }}
                            >
                                {w.label}
                            </span>
                            <span
                                style={{
                                    fontFamily: 'Noto Sans, sans-serif',
                                    fontWeight: w.value,
                                    fontSize: '20px',
                                    color: 'var(--foreground)',
                                }}
                            >
                                The quick brown fox jumps over the lazy dog
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2
                    style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '24px',
                    }}
                >
                    Font Sizes
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {sizes.map(s => (
                        <div
                            key={s.label}
                            style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '16px',
                                paddingBottom: '20px',
                                borderBottom: '1px solid var(--border)',
                            }}
                        >
                            <div style={{ width: '80px', flexShrink: 0 }}>
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--muted-foreground)',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    text-{s.label}
                                </div>
                                <div
                                    style={{
                                        fontSize: '10px',
                                        color: 'var(--muted-foreground)',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {s.value}
                                </div>
                            </div>
                            <span
                                style={{
                                    fontFamily: 'Noto Sans, sans-serif',
                                    fontSize: s.value,
                                    lineHeight: s.lineHeight,
                                    color: 'var(--foreground)',
                                }}
                            >
                                The quick brown fox jumps over the lazy dog
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const meta = {
    title: 'Design Tokens/Typography',
    component: TypographyPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TypographyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
