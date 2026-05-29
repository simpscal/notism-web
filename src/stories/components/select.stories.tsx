import type { Meta, StoryObj } from '@storybook/react-vite';

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
    render: () => (
        <Select>
            <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select a fruit' />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value='apple'>Apple</SelectItem>
                    <SelectItem value='banana'>Banana</SelectItem>
                    <SelectItem value='blueberry'>Blueberry</SelectItem>
                    <SelectItem value='grapes'>Grapes</SelectItem>
                    <SelectItem value='pineapple'>Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Select disabled>
            <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Disabled select' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='a'>Option A</SelectItem>
            </SelectContent>
        </Select>
    ),
};
