import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/uis/card';

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
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Card style={{ width: '380px' }}>
                <CardHeader>
                    <CardTitle>{t('storybook.card.title')}</CardTitle>
                    <CardDescription>{t('storybook.card.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t('storybook.card.content')}</p>
                </CardContent>
                <CardFooter>
                    <Button variant='outline' style={{ marginRight: '8px' }}>
                        {t('common.cancel')}
                    </Button>
                    <Button>{t('storybook.card.submit')}</Button>
                </CardFooter>
            </Card>
        );
    },
};

export const Simple: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Card style={{ width: '380px' }}>
                <CardContent>
                    <p>{t('storybook.card.simpleContent')}</p>
                </CardContent>
            </Card>
        );
    },
};

export const WithoutFooter: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Card style={{ width: '380px' }}>
                <CardHeader>
                    <CardTitle>{t('storybook.card.notification')}</CardTitle>
                    <CardDescription>{t('storybook.card.unreadMessages')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t('storybook.card.messagesWaiting')}</p>
                </CardContent>
            </Card>
        );
    },
};
