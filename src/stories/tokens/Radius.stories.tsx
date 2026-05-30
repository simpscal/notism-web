import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

const radiusTokens = [
    { labelKey: 'radiusSm', var: '--radius-sm', computed: 'calc(var(--radius) - 4px)', tailwind: 'rounded-sm' },
    { labelKey: 'radiusMd', var: '--radius-md', computed: 'calc(var(--radius) - 2px)', tailwind: 'rounded-md' },
    { labelKey: 'radiusLg', var: '--radius', computed: '0.75rem', tailwind: 'rounded-lg' },
    { labelKey: 'radiusXl', var: '--radius-xl', computed: 'calc(var(--radius) + 4px)', tailwind: 'rounded-xl' },
    { labelKey: 'full', var: 'none', computed: '9999px', tailwind: 'rounded-full' },
];

function RadiusPage() {
    const { t } = useTranslation();
    return (
        <div style={{ padding: '32px', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>
                {t('storybook.tokens.radius.title')}
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '40px' }}>
                {t('storybook.tokens.radius.descriptionBefore')}{' '}
                <code
                    style={{
                        fontFamily: 'monospace',
                        backgroundColor: 'var(--muted)',
                        padding: '2px 4px',
                        borderRadius: '4px',
                    }}
                >
                    --radius: 0.75rem
                </code>{' '}
                {t('storybook.tokens.radius.descriptionAfter')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-end' }}>
                {radiusTokens.map((token, i) => (
                    <div
                        key={token.labelKey}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
                    >
                        <div
                            style={{
                                width: `${60 + i * 20}px`,
                                height: `${60 + i * 20}px`,
                                backgroundColor: 'var(--primary)',
                                borderRadius: token.computed,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>
                                {t(`storybook.tokens.radius.labels.${token.labelKey}`)}
                            </div>
                            {token.var !== 'none' && (
                                <div
                                    style={{
                                        fontSize: '10px',
                                        color: 'var(--muted-foreground)',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {token.var}
                                </div>
                            )}
                            <div
                                style={{
                                    fontSize: '10px',
                                    color: 'var(--muted-foreground)',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {token.computed}
                            </div>
                            <div
                                style={{
                                    fontSize: '10px',
                                    color: 'var(--muted-foreground)',
                                    fontFamily: 'monospace',
                                    marginTop: '2px',
                                }}
                            >
                                {token.tailwind}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const meta = {
    title: 'Design Tokens/Radius',
    component: RadiusPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof RadiusPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
