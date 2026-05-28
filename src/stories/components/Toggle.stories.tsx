import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle } from '@/components/toggle';

const meta = {
    title: 'Components/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outline'],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg'],
        },
        pressed: { control: 'boolean' },
        disabled: { control: 'boolean' },
        children: { control: 'text' },
    },
    args: {
        children: 'Toggle',
        variant: 'default',
        size: 'default',
        disabled: false,
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = {
    args: {
        pressed: true,
        children: 'Pressed',
    },
};

export const Unpressed: Story = {
    args: {
        pressed: false,
        children: 'Unpressed',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: 'Disabled',
    },
};

export const DisabledPressed: Story = {
    args: {
        disabled: true,
        pressed: true,
        children: 'Disabled (on)',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline',
    },
};

export const OutlinePressed: Story = {
    args: {
        variant: 'outline',
        pressed: true,
        children: 'Outline pressed',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Small',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Large',
    },
};

export const WithIcon: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            <Toggle aria-label='Bold'>
                <strong>B</strong>
            </Toggle>
            <Toggle aria-label='Italic'>
                <em>I</em>
            </Toggle>
            <Toggle aria-label='Underline' pressed>
                <u>U</u>
            </Toggle>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-4'>
            {(['default', 'outline'] as const).map(variant => (
                <div key={variant} className='flex items-center gap-3'>
                    <span className='w-20 text-xs text-muted-foreground capitalize'>{variant}</span>
                    {(['sm', 'default', 'lg'] as const).map(size => (
                        <Toggle key={size} variant={variant} size={size}>
                            {size}
                        </Toggle>
                    ))}
                    <Toggle variant={variant} pressed>
                        Pressed
                    </Toggle>
                    <Toggle variant={variant} disabled>
                        Off
                    </Toggle>
                </div>
            ))}
        </div>
    ),
};
