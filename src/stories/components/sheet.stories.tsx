import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import { Input } from '@/uis/input';
import { Label } from '@/uis/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/uis/sheet';

const meta = {
    title: 'Components/Utilities/Sheet',
    component: Sheet,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant='outline'>{t('storybook.sheet.openSheet')}</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{t('storybook.sheet.editProfile')}</SheetTitle>
                        <SheetDescription>{t('storybook.sheet.editProfileDescription')}</SheetDescription>
                    </SheetHeader>
                    <div style={{ display: 'grid', gap: '16px', padding: '16px 0' }}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 3fr',
                                gap: '16px',
                                alignItems: 'center',
                            }}
                        >
                            <Label htmlFor='name'>{t('storybook.sheet.name')}</Label>
                            <Input id='name' defaultValue='Pedro Duarte' />
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 3fr',
                                gap: '16px',
                                alignItems: 'center',
                            }}
                        >
                            <Label htmlFor='username'>{t('storybook.sheet.username')}</Label>
                            <Input id='username' defaultValue='@peduarte' />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type='submit'>{t('storybook.sheet.saveChanges')}</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    },
};

export const FromLeft: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant='outline'>{t('storybook.sheet.openLeftSheet')}</Button>
                </SheetTrigger>
                <SheetContent side='left'>
                    <SheetHeader>
                        <SheetTitle>{t('storybook.sheet.navigation')}</SheetTitle>
                        <SheetDescription>{t('storybook.sheet.navigationDescription')}</SheetDescription>
                    </SheetHeader>
                    <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Button variant='ghost' style={{ justifyContent: 'flex-start' }}>
                            {t('storybook.sheet.dashboard')}
                        </Button>
                        <Button variant='ghost' style={{ justifyContent: 'flex-start' }}>
                            {t('storybook.sheet.projects')}
                        </Button>
                        <Button variant='ghost' style={{ justifyContent: 'flex-start' }}>
                            {t('storybook.sheet.settings')}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        );
    },
};
