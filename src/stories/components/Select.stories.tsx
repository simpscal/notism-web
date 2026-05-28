import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/components/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/select';

const meta = {
    title: 'Components/Select',
    component: Select,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Select>
            <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='pizza'>Pizza</SelectItem>
                <SelectItem value='burger'>Burger</SelectItem>
                <SelectItem value='sushi'>Sushi</SelectItem>
                <SelectItem value='salad'>Salad</SelectItem>
                <SelectItem value='dessert'>Dessert</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const WithDefaultValue: Story = {
    render: () => (
        <Select defaultValue='burger'>
            <SelectTrigger className='w-[200px]'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='pizza'>Pizza</SelectItem>
                <SelectItem value='burger'>Burger</SelectItem>
                <SelectItem value='sushi'>Sushi</SelectItem>
                <SelectItem value='salad'>Salad</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const WithGroups: Story = {
    render: () => (
        <Select>
            <SelectTrigger className='w-[220px]'>
                <SelectValue placeholder='Select a dish' />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Mains</SelectLabel>
                    <SelectItem value='margherita'>Margherita Pizza</SelectItem>
                    <SelectItem value='beef-burger'>Beef Burger</SelectItem>
                    <SelectItem value='pasta'>Pasta Carbonara</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Sides</SelectLabel>
                    <SelectItem value='fries'>Fries</SelectItem>
                    <SelectItem value='salad'>Garden Salad</SelectItem>
                    <SelectItem value='soup'>Tomato Soup</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Desserts</SelectLabel>
                    <SelectItem value='tiramisu'>Tiramisu</SelectItem>
                    <SelectItem value='cheesecake'>Cheesecake</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

export const SmallSize: Story = {
    render: () => (
        <Select>
            <SelectTrigger size='sm' className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All orders</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='preparing'>Preparing</SelectItem>
                <SelectItem value='ready'>Ready</SelectItem>
                <SelectItem value='delivered'>Delivered</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Select disabled>
            <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Select an option' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='a'>Option A</SelectItem>
                <SelectItem value='b'>Option B</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const WithLabel: Story = {
    render: () => (
        <div className='flex flex-col gap-2'>
            <Label htmlFor='category-select'>Category</Label>
            <Select>
                <SelectTrigger id='category-select' className='w-[200px]'>
                    <SelectValue placeholder='Choose category' />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='appetizer'>Appetizer</SelectItem>
                    <SelectItem value='main'>Main Course</SelectItem>
                    <SelectItem value='dessert'>Dessert</SelectItem>
                    <SelectItem value='beverage'>Beverage</SelectItem>
                </SelectContent>
            </Select>
        </div>
    ),
};

export const WithDisabledItem: Story = {
    render: () => (
        <Select>
            <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Select size' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='small'>Small</SelectItem>
                <SelectItem value='medium'>Medium</SelectItem>
                <SelectItem value='large' disabled>
                    Large (out of stock)
                </SelectItem>
                <SelectItem value='xl'>Extra Large</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const ElevatedDropdown: Story = {
    name: 'Elevated Shadow Tier',
    render: () => (
        <div className='pb-48'>
            <p className='text-xs tracking-caps text-muted-foreground mb-4'>
                SelectContent uses shadow-elevated (Tier 2) for its dropdown panel
            </p>
            <Select defaultOpen defaultValue='preparing'>
                <SelectTrigger className='w-[220px]'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className='shadow-elevated'>
                    <SelectGroup>
                        <SelectLabel>Order Status</SelectLabel>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='preparing'>Preparing</SelectItem>
                        <SelectItem value='ready'>Ready for Pickup</SelectItem>
                        <SelectItem value='delivered'>Delivered</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                        <SelectLabel>Special</SelectLabel>
                        <SelectItem value='cancelled' disabled>
                            Cancelled
                        </SelectItem>
                        <SelectItem value='refunded'>Refunded</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    ),
};
