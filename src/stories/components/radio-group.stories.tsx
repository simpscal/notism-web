import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';

const meta = {
    title: 'Components/Selection/RadioGroup',
    component: RadioGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <RadioGroup defaultValue='comfortable'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RadioGroupItem value='default' id='r1' />
                    <Label htmlFor='r1'>{t('storybook.radioGroup.default')}</Label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RadioGroupItem value='comfortable' id='r2' />
                    <Label htmlFor='r2'>{t('storybook.radioGroup.comfortable')}</Label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RadioGroupItem value='compact' id='r3' />
                    <Label htmlFor='r3'>{t('storybook.radioGroup.compact')}</Label>
                </div>
            </RadioGroup>
        );
    },
};

export const Disabled: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <RadioGroup defaultValue='option-one'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RadioGroupItem value='option-one' id='o1' />
                    <Label htmlFor='o1'>{t('storybook.radioGroup.optionOne')}</Label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RadioGroupItem value='option-two' id='o2' disabled />
                    <Label htmlFor='o2'>{t('storybook.radioGroup.optionTwoDisabled')}</Label>
                </div>
            </RadioGroup>
        );
    },
};
