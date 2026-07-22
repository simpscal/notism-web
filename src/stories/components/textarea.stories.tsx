import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Label } from '@/uis/label';
import { Textarea } from '@/uis/textarea';

const meta = {
    title: 'Components/Inputs/Textarea',
    component: Textarea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '320px' }}>
                <Label htmlFor='message'>{t('storybook.textarea.yourMessage')}</Label>
                <Textarea placeholder={t('storybook.textarea.typeMessage')} id='message' />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '320px' }}>
                <Textarea placeholder={t('storybook.textarea.disabled')} disabled />
            </div>
        );
    },
};

export const WithText: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '320px' }}>
                <Textarea defaultValue={t('storybook.textarea.prefilledText')} />
            </div>
        );
    },
};
