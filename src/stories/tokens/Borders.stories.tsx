import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { useTranslation } from 'react-i18next';

const borderWidths = [
    { label: 'border (1px)', width: '1px' },
    { label: 'border-2 (2px)', width: '2px' },
    { label: 'border-4 (4px)', width: '4px' },
];

const ringExamples = [
    { label: 'ring', style: { outline: '2px solid var(--ring)', outlineOffset: '2px' } },
    { label: 'ring-2', style: { outline: '2px solid var(--ring)', outlineOffset: '2px' } },
    { label: 'ring-offset-2', style: { outline: '2px solid var(--ring)', outlineOffset: '4px' } },
    { label: 'ring-primary', style: { outline: '2px solid var(--primary)', outlineOffset: '2px' } },
    { label: 'ring-destructive', style: { outline: '2px solid var(--destructive)', outlineOffset: '2px' } },
];

function BordersPage() {
    const { t } = useTranslation();
    return (
        <div style={{ padding: '32px', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>
                {t('storybook.tokens.borders.title')}
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '40px' }}>
                {t('storybook.tokens.borders.description')}
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
                    {t('storybook.tokens.borders.borderWidths')}
                </h2>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {borderWidths.map(b => (
                        <div
                            key={b.label}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
                        >
                            <div
                                style={{
                                    width: '100px',
                                    height: '60px',
                                    borderRadius: 'var(--radius)',
                                    backgroundColor: 'var(--card)',
                                    border: `${b.width} solid var(--border)`,
                                }}
                            />
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: 'var(--foreground)',
                                    fontFamily: 'monospace',
                                    fontWeight: 600,
                                }}
                            >
                                {b.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

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
                    {t('storybook.tokens.borders.borderColors')}
                </h2>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'border-border', color: 'var(--border)' },
                        { label: 'border-primary', color: 'var(--primary)' },
                        { label: 'border-destructive', color: 'var(--destructive)' },
                        { label: 'border-muted', color: 'var(--muted-foreground)' },
                        { label: 'border-input', color: 'var(--input)' },
                    ].map(b => (
                        <div
                            key={b.label}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
                        >
                            <div
                                style={{
                                    width: '100px',
                                    height: '60px',
                                    borderRadius: 'var(--radius)',
                                    backgroundColor: 'var(--card)',
                                    border: `2px solid ${b.color}`,
                                }}
                            />
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: 'var(--foreground)',
                                    fontFamily: 'monospace',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                }}
                            >
                                {b.label}
                            </div>
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
                    {t('storybook.tokens.borders.focusRingExamples')}
                </h2>
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    {ringExamples.map(ring => (
                        <div
                            key={ring.label}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                        >
                            <div
                                style={{
                                    width: '80px',
                                    height: '40px',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--primary)',
                                    ...ring.style,
                                }}
                            />
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: 'var(--foreground)',
                                    fontFamily: 'monospace',
                                    fontWeight: 600,
                                }}
                            >
                                {ring.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const meta = {
    title: 'Design Tokens/Borders',
    component: BordersPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BordersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
    parameters: {
        themes: {
            themeOverride: 'dark',
        },
    },
};
