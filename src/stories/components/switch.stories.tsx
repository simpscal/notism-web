import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Label } from '@/uis/label';
import { Switch } from '@/uis/switch';

const meta = {
    title: 'Components/Inputs/Switch',
    component: Switch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        defaultChecked: { control: 'boolean' },
    },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch id='airplane-mode' />
                <Label htmlFor='airplane-mode'>{t('storybook.switch.airplaneMode')}</Label>
            </div>
        );
    },
};

export const Checked: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch id='notifications' defaultChecked />
                <Label htmlFor='notifications'>{t('storybook.switch.enableNotifications')}</Label>
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
                    <Switch id='disabled-off' disabled />
                    <Label htmlFor='disabled-off'>{t('storybook.switch.disabledOff')}</Label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch id='disabled-on' disabled defaultChecked />
                    <Label htmlFor='disabled-on'>{t('storybook.switch.disabledOn')}</Label>
                </div>
            </div>
        );
    },
};
