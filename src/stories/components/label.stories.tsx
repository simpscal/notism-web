import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@/uis/checkbox';
import { Label } from '@/uis/label';

const meta = {
    title: 'Components/Inputs/Label',
    component: Label,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        htmlFor: 'email',
    },
    render: function Render(args) {
        const { t } = useTranslation();
        return <Label {...args}>{t('storybook.label.emailAddress')}</Label>;
    },
};

export const WithCheckbox: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox id='cb-label' />
                <Label htmlFor='cb-label'>{t('storybook.label.acceptTerms')}</Label>
            </div>
        );
    },
};
