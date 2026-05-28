import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';

const meta = {
    title: 'Components/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Tabs defaultValue='tab1' className='w-[400px]'>
            <TabsList>
                <TabsTrigger value='tab1'>Account</TabsTrigger>
                <TabsTrigger value='tab2'>Password</TabsTrigger>
                <TabsTrigger value='tab3'>Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value='tab1'>
                <p className='text-sm text-muted-foreground pt-2'>Manage your account settings and preferences here.</p>
            </TabsContent>
            <TabsContent value='tab2'>
                <p className='text-sm text-muted-foreground pt-2'>Change your password and security settings here.</p>
            </TabsContent>
            <TabsContent value='tab3'>
                <p className='text-sm text-muted-foreground pt-2'>Configure how and when you receive notifications.</p>
            </TabsContent>
        </Tabs>
    ),
};

export const WithDisabled: Story = {
    render: () => (
        <Tabs defaultValue='active' className='w-[400px]'>
            <TabsList>
                <TabsTrigger value='active'>Active</TabsTrigger>
                <TabsTrigger value='paused'>Paused</TabsTrigger>
                <TabsTrigger value='archived' disabled>
                    Archived
                </TabsTrigger>
            </TabsList>
            <TabsContent value='active'>
                <p className='text-sm text-muted-foreground pt-2'>Showing active items.</p>
            </TabsContent>
            <TabsContent value='paused'>
                <p className='text-sm text-muted-foreground pt-2'>Showing paused items.</p>
            </TabsContent>
            <TabsContent value='archived'>
                <p className='text-sm text-muted-foreground pt-2'>Showing archived items.</p>
            </TabsContent>
        </Tabs>
    ),
};

export const WithCardContent: Story = {
    render: () => (
        <Tabs defaultValue='overview' className='w-[480px]'>
            <TabsList>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='orders'>Orders</TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>A summary of your restaurant performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>
                            Today you've received 42 orders with a total revenue of $1,284.
                        </p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value='orders'>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Orders placed in the last 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col gap-2'>
                            {[
                                { id: '#1042', label: 'Burger Combo' },
                                { id: '#1041', label: 'Pizza Slice' },
                                { id: '#1040', label: 'Salad Bowl' },
                            ].map(order => (
                                <div
                                    key={order.id}
                                    className='flex items-center justify-between text-sm py-1 border-b last:border-0'
                                >
                                    <span>
                                        <span className='font-mono text-xs text-muted-foreground'>{order.id}</span>
                                        {' — '}
                                        {order.label}
                                    </span>
                                    <Badge variant='success'>Done</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value='settings'>
                <Card>
                    <CardHeader>
                        <CardTitle>Restaurant Settings</CardTitle>
                        <CardDescription>Manage your restaurant preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>Settings panel content goes here.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    ),
};

export const WithBadges: Story = {
    render: () => (
        <Tabs defaultValue='all' className='w-[400px]'>
            <TabsList>
                <TabsTrigger value='all' className='gap-1.5'>
                    All
                    <Badge variant='secondary' className='px-1.5 py-0 text-xs'>
                        24
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value='pending' className='gap-1.5'>
                    Pending
                    <Badge variant='destructive' className='px-1.5 py-0 text-xs'>
                        5
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value='completed' className='gap-1.5'>
                    Completed
                    <Badge variant='success' className='px-1.5 py-0 text-xs'>
                        19
                    </Badge>
                </TabsTrigger>
            </TabsList>
            <TabsContent value='all'>
                <p className='text-sm text-muted-foreground pt-2'>Showing all 24 orders.</p>
            </TabsContent>
            <TabsContent value='pending'>
                <p className='text-sm text-muted-foreground pt-2'>Showing 5 pending orders.</p>
            </TabsContent>
            <TabsContent value='completed'>
                <p className='text-sm text-muted-foreground pt-2'>Showing 19 completed orders.</p>
            </TabsContent>
        </Tabs>
    ),
};
