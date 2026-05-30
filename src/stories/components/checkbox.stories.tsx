import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';

const meta = {
    title: 'Components/Inputs/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox id='default-cb' />
                <Label htmlFor='default-cb'>{t('storybook.checkbox.acceptTerms')}</Label>
            </div>
        );
    },
};

export const Checked: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox id='checked-cb' defaultChecked />
                <Label htmlFor='checked-cb'>{t('storybook.checkbox.checkedByDefault')}</Label>
            </div>
        );
    },
};

export const Disabled: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox id='disabled-cb' disabled />
                    <Label htmlFor='disabled-cb'>{t('storybook.checkbox.disabledUnchecked')}</Label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox id='disabled-checked-cb' disabled defaultChecked />
                    <Label htmlFor='disabled-checked-cb'>{t('storybook.checkbox.disabledChecked')}</Label>
                </div>
            </div>
        );
    },
};
