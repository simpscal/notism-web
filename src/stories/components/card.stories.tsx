import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';

const meta = {
    title: 'Components/Layout/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Card style={{ width: '380px' }}>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card content. This is a simple card component.</p>
            </CardContent>
            <CardFooter>
                <Button variant='outline' style={{ marginRight: '8px' }}>
                    Cancel
                </Button>
                <Button>Submit</Button>
            </CardFooter>
        </Card>
    ),
};

export const Simple: Story = {
    render: () => (
        <Card style={{ width: '380px' }}>
            <CardContent>
                <p>A simple card with just content.</p>
            </CardContent>
        </Card>
    ),
};

export const WithoutFooter: Story = {
    render: () => (
        <Card style={{ width: '380px' }}>
            <CardHeader>
                <CardTitle>Notification</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Messages are waiting in your inbox.</p>
            </CardContent>
        </Card>
    ),
};
