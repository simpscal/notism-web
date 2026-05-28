import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';

const meta = {
    title: 'Components/RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue='standard'>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='standard' id='standard' />
                <Label htmlFor='standard'>Standard delivery</Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='express' id='express' />
                <Label htmlFor='express'>Express delivery</Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='pickup' id='pickup' />
                <Label htmlFor='pickup'>Pickup in store</Label>
            </div>
        </RadioGroup>
    ),
};

export const WithDisabledOption: Story = {
    render: () => (
        <RadioGroup defaultValue='online'>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='online' id='online' />
                <Label htmlFor='online'>Online payment</Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='cash' id='cash' />
                <Label htmlFor='cash'>Cash on delivery</Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='crypto' id='crypto' disabled />
                <Label htmlFor='crypto' className='opacity-50 cursor-not-allowed'>
                    Cryptocurrency (unavailable)
                </Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='bank' id='bank' />
                <Label htmlFor='bank'>Bank transfer</Label>
            </div>
        </RadioGroup>
    ),
};

export const NoSelection: Story = {
    render: () => (
        <RadioGroup>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='small' id='small' />
                <Label htmlFor='small'>Small (250ml)</Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='medium' id='medium' />
                <Label htmlFor='medium'>Medium (500ml)</Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='large' id='large' />
                <Label htmlFor='large'>Large (750ml)</Label>
            </div>
        </RadioGroup>
    ),
};

export const Horizontal: Story = {
    render: () => (
        <RadioGroup defaultValue='veg' className='flex flex-row gap-6'>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='veg' id='veg' />
                <Label htmlFor='veg'>Vegetarian</Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='non-veg' id='non-veg' />
                <Label htmlFor='non-veg'>Non-vegetarian</Label>
            </div>
            <div className='flex items-center gap-2'>
                <RadioGroupItem value='vegan' id='vegan' />
                <Label htmlFor='vegan'>Vegan</Label>
            </div>
        </RadioGroup>
    ),
};
