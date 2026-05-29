import type { Meta, StoryObj } from '@storybook/react-vite';

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
    render: () => (
        <RadioGroup defaultValue='comfortable'>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RadioGroupItem value='default' id='r1' />
                <Label htmlFor='r1'>Default</Label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RadioGroupItem value='comfortable' id='r2' />
                <Label htmlFor='r2'>Comfortable</Label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RadioGroupItem value='compact' id='r3' />
                <Label htmlFor='r3'>Compact</Label>
            </div>
        </RadioGroup>
    ),
};

export const Disabled: Story = {
    render: () => (
        <RadioGroup defaultValue='option-one'>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RadioGroupItem value='option-one' id='o1' />
                <Label htmlFor='o1'>Option One</Label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RadioGroupItem value='option-two' id='o2' disabled />
                <Label htmlFor='o2'>Option Two (disabled)</Label>
            </div>
        </RadioGroup>
    ),
};
