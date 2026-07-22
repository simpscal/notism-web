import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/uis/card';
import { Input } from '@/uis/input';
import { Label } from '@/uis/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/uis/tabs';

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
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Tabs defaultValue='account' className='w-[400px]'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='account'>{t('storybook.tabs.account')}</TabsTrigger>
                    <TabsTrigger value='password'>{t('storybook.tabs.password')}</TabsTrigger>
                </TabsList>
                <TabsContent value='account'>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('storybook.tabs.account')}</CardTitle>
                            <CardDescription>{t('storybook.tabs.accountDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Label htmlFor='name'>{t('storybook.tabs.name')}</Label>
                                <Input id='name' defaultValue='Pedro Duarte' />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Label htmlFor='username'>{t('storybook.tabs.username')}</Label>
                                <Input id='username' defaultValue='@peduarte' />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>{t('storybook.tabs.saveChanges')}</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value='password'>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('storybook.tabs.password')}</CardTitle>
                            <CardDescription>{t('storybook.tabs.passwordDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Label htmlFor='current'>{t('storybook.tabs.currentPassword')}</Label>
                                <Input id='current' type='password' />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Label htmlFor='new'>{t('storybook.tabs.newPassword')}</Label>
                                <Input id='new' type='password' />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>{t('storybook.tabs.savePassword')}</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        );
    },
};
