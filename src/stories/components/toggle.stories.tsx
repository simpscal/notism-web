import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bold, Italic, Underline } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Toggle } from '@/uis/toggle';

const meta = {
    title: 'Components/Inputs/Toggle',
    component: Toggle,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outline'],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg'],
        },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        'aria-label': 'Toggle bold',
        children: <Bold />,
    },
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Toggle aria-label='Toggle bold default'>
                <Bold />
            </Toggle>
            <Toggle variant='outline' aria-label='Toggle bold outline'>
                <Bold />
            </Toggle>
        </div>
    ),
};

export const WithText: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Toggle aria-label='Toggle italic'>
                    <Italic />
                    {t('storybook.toggle.withTextItalic')}
                </Toggle>
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => (
        <Toggle aria-label='Toggle disabled' disabled>
            <Underline />
        </Toggle>
    ),
};
