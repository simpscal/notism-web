import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { useTranslation } from 'react-i18next';

const shadows = [
    { label: 'shadow-xs', class: 'shadow-xs', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { label: 'shadow-sm', class: 'shadow-sm', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
    { label: 'shadow', class: 'shadow', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
    {
        label: 'shadow-md',
        class: 'shadow-md',
        value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    {
        label: 'shadow-lg',
        class: 'shadow-lg',
        value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    {
        label: 'shadow-xl',
        class: 'shadow-xl',
        value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    { label: 'shadow-2xl', class: 'shadow-2xl', value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
];

function ElevationPage() {
    const { t } = useTranslation();
    return (
        <div style={{ padding: '32px', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>
                {t('storybook.tokens.elevation.title')}
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '40px' }}>
                {t('storybook.tokens.elevation.description')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-end' }}>
                {shadows.map(shadow => (
                    <div
                        key={shadow.label}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                    >
                        <div
                            style={{
                                width: '100px',
                                height: '100px',
                                backgroundColor: 'var(--card)',
                                borderRadius: 'var(--radius)',
                                boxShadow: shadow.value,
                                border: '1px solid var(--border)',
                            }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--foreground)',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {shadow.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const meta = {
    title: 'Design Tokens/Elevation',
    component: ElevationPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ElevationPage>;

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
