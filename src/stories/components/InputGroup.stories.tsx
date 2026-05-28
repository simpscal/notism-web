import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
} from '@/components/input-group';

const meta = {
    title: 'Components/InputGroup',
    component: InputGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLeadingIcon: Story = {
    render: () => (
        <InputGroup className='w-[300px]'>
            <InputGroupAddon align='inline-start'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <circle cx='11' cy='11' r='8' />
                    <path d='m21 21-4.35-4.35' />
                </svg>
            </InputGroupAddon>
            <InputGroupInput placeholder='Search…' />
        </InputGroup>
    ),
};

export const WithTrailingIcon: Story = {
    render: () => (
        <InputGroup className='w-[300px]'>
            <InputGroupInput type='email' placeholder='you@example.com' />
            <InputGroupAddon align='inline-end'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <rect width='20' height='16' x='2' y='4' rx='2' />
                    <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
                </svg>
            </InputGroupAddon>
        </InputGroup>
    ),
};

export const WithBothIcons: Story = {
    render: () => (
        <InputGroup className='w-[300px]'>
            <InputGroupAddon align='inline-start'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <circle cx='11' cy='11' r='8' />
                    <path d='m21 21-4.35-4.35' />
                </svg>
            </InputGroupAddon>
            <InputGroupInput placeholder='Search locations…' />
            <InputGroupAddon align='inline-end'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
                    <circle cx='12' cy='10' r='3' />
                </svg>
            </InputGroupAddon>
        </InputGroup>
    ),
};

export const WithClearButton: Story = {
    render: () => (
        <InputGroup className='w-[300px]'>
            <InputGroupAddon align='inline-start'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <circle cx='11' cy='11' r='8' />
                    <path d='m21 21-4.35-4.35' />
                </svg>
            </InputGroupAddon>
            <InputGroupInput defaultValue='React components' />
            <InputGroupAddon align='inline-end' className='pointer-events-auto'>
                <InputGroupButton size='icon-xs' variant='ghost' aria-label='Clear search'>
                    ✕
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    ),
};

export const WithPrefix: Story = {
    render: () => (
        <div className='flex flex-col gap-4 w-[300px]'>
            <InputGroup>
                <InputGroupAddon align='inline-start'>
                    <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput type='number' placeholder='0.00' />
            </InputGroup>
            <InputGroup>
                <InputGroupAddon align='inline-start'>
                    <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder='yoursite.com' />
            </InputGroup>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-4 w-[320px]'>
            <div>
                <p className='text-xs text-muted-foreground mb-1.5'>Leading icon</p>
                <InputGroup>
                    <InputGroupAddon align='inline-start'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <circle cx='11' cy='11' r='8' />
                            <path d='m21 21-4.35-4.35' />
                        </svg>
                    </InputGroupAddon>
                    <InputGroupInput placeholder='Leading icon' />
                </InputGroup>
            </div>
            <div>
                <p className='text-xs text-muted-foreground mb-1.5'>Trailing icon</p>
                <InputGroup>
                    <InputGroupInput placeholder='Trailing icon' />
                    <InputGroupAddon align='inline-end'>✓</InputGroupAddon>
                </InputGroup>
            </div>
            <div>
                <p className='text-xs text-muted-foreground mb-1.5'>With action button</p>
                <InputGroup>
                    <InputGroupInput placeholder='Enter value…' />
                    <InputGroupAddon align='inline-end' className='pointer-events-auto'>
                        <InputGroupButton size='icon-xs' variant='ghost'>
                            →
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div>
                <p className='text-xs text-muted-foreground mb-1.5'>Currency prefix</p>
                <InputGroup>
                    <InputGroupAddon align='inline-start'>
                        <InputGroupText>€</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput type='number' placeholder='0.00' />
                </InputGroup>
            </div>
        </div>
    ),
};
