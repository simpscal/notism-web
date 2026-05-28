import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';

const meta = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Card className='w-[360px] shadow-surface rounded-container'>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>A short description of the card content goes here.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-muted-foreground'>
                    This is the main content area of the card. It can contain any content you need — text, images,
                    forms, or other components.
                </p>
            </CardContent>
            <CardFooter className='gap-2'>
                <Button variant='outline' size='sm'>
                    Cancel
                </Button>
                <Button size='sm'>Save</Button>
            </CardFooter>
        </Card>
    ),
};

export const WithAction: Story = {
    render: () => (
        <Card className='w-[360px]'>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
                <CardAction>
                    <Button variant='ghost' size='sm'>
                        Mark all read
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-3'>
                    {['New order received', 'Payment confirmed', 'Item shipped'].map((msg, i) => (
                        <div key={i} className='flex items-center gap-2 text-sm'>
                            <span className='h-2 w-2 rounded-full bg-primary shrink-0' />
                            {msg}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    ),
};

export const SimpleStats: Story = {
    render: () => (
        <div className='grid grid-cols-2 gap-4 w-fit'>
            {[
                { label: 'Total Orders', value: '1,284', change: '+12%' },
                { label: 'Revenue', value: '$42,091', change: '+8.4%' },
                { label: 'Active Users', value: '3,210', change: '+5.1%' },
                { label: 'Avg. Order', value: '$32.80', change: '-1.2%' },
            ].map(({ label, value, change }) => (
                <Card key={label} className='w-[160px] shadow-surface'>
                    <CardHeader>
                        <CardDescription>{label}</CardDescription>
                        <CardTitle className='text-2xl tracking-tight-design'>{value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className='text-xs text-muted-foreground'>{change} from last month</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    ),
};

export const FoodCard: Story = {
    name: 'Food Item Card',
    render: () => (
        <Card className='w-[280px] overflow-hidden gap-0 py-0 shadow-surface rounded-container'>
            <div className='h-40 bg-accent flex items-center justify-center text-4xl'>🍔</div>
            <CardHeader className='pt-4'>
                <div className='flex items-start justify-between gap-2'>
                    <CardTitle>Classic Burger</CardTitle>
                    <Badge variant='success'>Available</Badge>
                </div>
                <CardDescription>
                    Angus beef patty with aged cheddar, lettuce, tomato, and secret sauce.
                </CardDescription>
            </CardHeader>
            <CardFooter className='pb-4 justify-between'>
                <span className='text-lg font-semibold'>$12.99</span>
                <Button size='sm'>Add to cart</Button>
            </CardFooter>
        </Card>
    ),
};

export const NoFooter: Story = {
    render: () => (
        <Card className='w-[360px]'>
            <CardHeader>
                <CardTitle>Read-only Card</CardTitle>
                <CardDescription>This card has no footer or actions.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-muted-foreground'>
                    Cards don't require all sections — compose only the parts you need.
                </p>
            </CardContent>
        </Card>
    ),
};

export const ElevationHierarchy: Story = {
    name: 'Elevation Hierarchy',
    render: () => (
        <div className='flex flex-col gap-6'>
            {[
                { tier: 'Surface', cls: 'shadow-surface', desc: 'Resting cards, list items' },
                { tier: 'Elevated', cls: 'shadow-elevated', desc: 'Popovers, dropdowns, hover cards' },
                { tier: 'Modal', cls: 'shadow-modal', desc: 'Dialogs, sheets, drawers' },
            ].map(({ tier, cls, desc }) => (
                <Card key={tier} className={`w-[360px] rounded-container ${cls}`}>
                    <CardHeader>
                        <div className='flex items-center gap-2'>
                            <CardTitle>{tier}</CardTitle>
                            <Badge variant='outline' className='rounded-pill'>
                                {cls}
                            </Badge>
                        </div>
                        <CardDescription>{desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>
                            Three-tier shadow system using warm oklch-based shadows that harmonize with the cream
                            background.
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    ),
};
