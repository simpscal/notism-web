import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const colorTokens = [
    { name: 'primary', var: '--primary', label: 'Primary' },
    { name: 'primary-foreground', var: '--primary-foreground', label: 'Primary Foreground' },
    { name: 'secondary', var: '--secondary', label: 'Secondary' },
    { name: 'secondary-foreground', var: '--secondary-foreground', label: 'Secondary Foreground' },
    { name: 'muted', var: '--muted', label: 'Muted' },
    { name: 'muted-foreground', var: '--muted-foreground', label: 'Muted Foreground' },
    { name: 'accent', var: '--accent', label: 'Accent' },
    { name: 'accent-foreground', var: '--accent-foreground', label: 'Accent Foreground' },
    { name: 'destructive', var: '--destructive', label: 'Destructive' },
    { name: 'success', var: '--success', label: 'Success' },
    { name: 'warning', var: '--warning', label: 'Warning' },
    { name: 'info', var: '--info', label: 'Info' },
    { name: 'background', var: '--background', label: 'Background' },
    { name: 'foreground', var: '--foreground', label: 'Foreground' },
    { name: 'card', var: '--card', label: 'Card' },
    { name: 'card-foreground', var: '--card-foreground', label: 'Card Foreground' },
    { name: 'popover', var: '--popover', label: 'Popover' },
    { name: 'popover-foreground', var: '--popover-foreground', label: 'Popover Foreground' },
    { name: 'border', var: '--border', label: 'Border' },
    { name: 'input', var: '--input', label: 'Input' },
    { name: 'ring', var: '--ring', label: 'Ring' },
    { name: 'chart-1', var: '--chart-1', label: 'Chart 1' },
    { name: 'chart-2', var: '--chart-2', label: 'Chart 2' },
    { name: 'chart-3', var: '--chart-3', label: 'Chart 3' },
    { name: 'chart-4', var: '--chart-4', label: 'Chart 4' },
    { name: 'chart-5', var: '--chart-5', label: 'Chart 5' },
    { name: 'sidebar', var: '--sidebar', label: 'Sidebar' },
    { name: 'sidebar-foreground', var: '--sidebar-foreground', label: 'Sidebar Foreground' },
    { name: 'sidebar-primary', var: '--sidebar-primary', label: 'Sidebar Primary' },
    { name: 'sidebar-primary-foreground', var: '--sidebar-primary-foreground', label: 'Sidebar Primary Foreground' },
    { name: 'sidebar-accent', var: '--sidebar-accent', label: 'Sidebar Accent' },
    { name: 'sidebar-accent-foreground', var: '--sidebar-accent-foreground', label: 'Sidebar Accent Foreground' },
    { name: 'sidebar-border', var: '--sidebar-border', label: 'Sidebar Border' },
    { name: 'sidebar-ring', var: '--sidebar-ring', label: 'Sidebar Ring' },
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
    return (
        <div style={{ padding: '32px', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>
                Color Tokens
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '32px' }}>
                All CSS custom property color tokens for light and dark modes.
            </p>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px',
                }}
            >
                {colorTokens.map(token => (
                    <ColorSwatch key={token.name} name={token.name} cssVar={token.var} label={token.label} />
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
