import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';

const meta = {
    title: 'Components/Inputs/InputGroup',
    component: InputGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '300px' }}>
                <InputGroup>
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupInput placeholder={`${t('common.search')}...`} />
                </InputGroup>
            </div>
        );
    },
};

export const WithEndAddon: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '300px' }}>
                <InputGroup>
                    <InputGroupInput placeholder={t('storybook.inputGroup.email')} />
                    <InputGroupAddon align='inline-end'>
                        <Mail />
                    </InputGroupAddon>
                </InputGroup>
            </div>
        );
    },
};

export const BothAddons: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '300px' }}>
                <InputGroup>
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupInput placeholder={`${t('common.search')}...`} />
                    <InputGroupAddon align='inline-end'>
                        <Mail />
                    </InputGroupAddon>
                </InputGroup>
            </div>
        );
    },
};
