import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search, Mail } from 'lucide-react';

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
    render: () => (
        <div style={{ width: '300px' }}>
            <InputGroup>
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupInput placeholder='Search...' />
            </InputGroup>
        </div>
    ),
};

export const WithEndAddon: Story = {
    render: () => (
        <div style={{ width: '300px' }}>
            <InputGroup>
                <InputGroupInput placeholder='Email' />
                <InputGroupAddon align='inline-end'>
                    <Mail />
                </InputGroupAddon>
            </InputGroup>
        </div>
    ),
};

export const BothAddons: Story = {
    render: () => (
        <div style={{ width: '300px' }}>
            <InputGroup>
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupInput placeholder='Search by email...' />
                <InputGroupAddon align='inline-end'>
                    <Mail />
                </InputGroupAddon>
            </InputGroup>
        </div>
    ),
};
