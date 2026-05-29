import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';

const meta = {
    title: 'Components/Navigation/Tabs',
    component: Tabs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Tabs defaultValue='account' className='w-[400px]'>
            <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='account'>Account</TabsTrigger>
                <TabsTrigger value='password'>Password</TabsTrigger>
            </TabsList>
            <TabsContent value='account'>
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Make changes to your account here. Click save when done.</CardDescription>
                    </CardHeader>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Label htmlFor='name'>Name</Label>
                            <Input id='name' defaultValue='Pedro Duarte' />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Label htmlFor='username'>Username</Label>
                            <Input id='username' defaultValue='@peduarte' />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save changes</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value='password'>
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here. After saving, you will be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Label htmlFor='current'>Current password</Label>
                            <Input id='current' type='password' />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Label htmlFor='new'>New password</Label>
                            <Input id='new' type='password' />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save password</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    ),
};
