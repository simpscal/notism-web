import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { useTranslation } from 'react-i18next';

const colorTokens = [
    { name: 'primary', var: '--primary', labelKey: 'primary' },
    { name: 'primary-foreground', var: '--primary-foreground', labelKey: 'primaryForeground' },
    { name: 'secondary', var: '--secondary', labelKey: 'secondary' },
    { name: 'secondary-foreground', var: '--secondary-foreground', labelKey: 'secondaryForeground' },
    { name: 'muted', var: '--muted', labelKey: 'muted' },
    { name: 'muted-foreground', var: '--muted-foreground', labelKey: 'mutedForeground' },
    { name: 'accent', var: '--accent', labelKey: 'accent' },
    { name: 'accent-foreground', var: '--accent-foreground', labelKey: 'accentForeground' },
    { name: 'destructive', var: '--destructive', labelKey: 'destructive' },
    { name: 'success', var: '--success', labelKey: 'success' },
    { name: 'warning', var: '--warning', labelKey: 'warning' },
    { name: 'info', var: '--info', labelKey: 'info' },
    { name: 'background', var: '--background', labelKey: 'background' },
    { name: 'foreground', var: '--foreground', labelKey: 'foreground' },
    { name: 'card', var: '--card', labelKey: 'card' },
    { name: 'card-foreground', var: '--card-foreground', labelKey: 'cardForeground' },
    { name: 'popover', var: '--popover', labelKey: 'popover' },
    { name: 'popover-foreground', var: '--popover-foreground', labelKey: 'popoverForeground' },
    { name: 'border', var: '--border', labelKey: 'border' },
    { name: 'input', var: '--input', labelKey: 'input' },
    { name: 'ring', var: '--ring', labelKey: 'ring' },
    { name: 'chart-1', var: '--chart-1', labelKey: 'chart1' },
    { name: 'chart-2', var: '--chart-2', labelKey: 'chart2' },
    { name: 'chart-3', var: '--chart-3', labelKey: 'chart3' },
    { name: 'chart-4', var: '--chart-4', labelKey: 'chart4' },
    { name: 'chart-5', var: '--chart-5', labelKey: 'chart5' },
    { name: 'sidebar', var: '--sidebar', labelKey: 'sidebar' },
    { name: 'sidebar-foreground', var: '--sidebar-foreground', labelKey: 'sidebarForeground' },
    { name: 'sidebar-primary', var: '--sidebar-primary', labelKey: 'sidebarPrimary' },
    { name: 'sidebar-primary-foreground', var: '--sidebar-primary-foreground', labelKey: 'sidebarPrimaryForeground' },
    { name: 'sidebar-accent', var: '--sidebar-accent', labelKey: 'sidebarAccent' },
    { name: 'sidebar-accent-foreground', var: '--sidebar-accent-foreground', labelKey: 'sidebarAccentForeground' },
    { name: 'sidebar-border', var: '--sidebar-border', labelKey: 'sidebarBorder' },
    { name: 'sidebar-ring', var: '--sidebar-ring', labelKey: 'sidebarRing' },
];

function ColorSwatch({ cssVar, label }: { name: string; cssVar: string; label: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', minWidth: '120px' }}>
            <div
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    backgroundColor: `var(${cssVar})`,
                    border: '1px solid var(--border)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
            />
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{label}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>
                    {cssVar}
                </div>
            </div>
        </div>
    );
}

function ColorsPage() {
    const { t } = useTranslation();
    return (
        <div style={{ padding: '32px', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>
                {t('storybook.tokens.colors.title')}
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '32px' }}>
                {t('storybook.tokens.colors.description')}
            </p>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px',
                }}
            >
                {colorTokens.map(token => (
                    <ColorSwatch
                        key={token.name}
                        name={token.name}
                        cssVar={token.var}
                        label={t(`storybook.tokens.colors.labels.${token.labelKey}`)}
                    />
                ))}
            </div>
        </div>
    );
}

const meta = {
    title: 'Design Tokens/Colors',
    component: ColorsPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ColorsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

export const Dark: Story = {
    parameters: {
        themes: {
            themeOverride: 'dark',
        },
    },
};
