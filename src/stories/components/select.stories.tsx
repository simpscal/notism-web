import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/select';

const meta = {
    title: 'Components/Selection/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Select>
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder={t('storybook.select.selectFruit')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{t('storybook.select.fruits')}</SelectLabel>
                        <SelectItem value='apple'>{t('storybook.select.apple')}</SelectItem>
                        <SelectItem value='banana'>{t('storybook.select.banana')}</SelectItem>
                        <SelectItem value='blueberry'>{t('storybook.select.blueberry')}</SelectItem>
                        <SelectItem value='grapes'>{t('storybook.select.grapes')}</SelectItem>
                        <SelectItem value='pineapple'>{t('storybook.select.pineapple')}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    },
};

export const Disabled: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Select disabled>
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder={t('storybook.select.disabledSelect')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='a'>{t('storybook.select.optionA')}</SelectItem>
                </SelectContent>
            </Select>
        );
    },
};
