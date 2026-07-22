import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/uis/dialog';
import { Input } from '@/uis/input';
import { Label } from '@/uis/label';

const meta = {
    title: 'Components/Utilities/Dialog',
    component: Dialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='outline'>{t('storybook.dialog.editProfile')}</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>{t('storybook.dialog.editProfileTitle')}</DialogTitle>
                        <DialogDescription>{t('storybook.dialog.editProfileDescription')}</DialogDescription>
                    </DialogHeader>
                    <div style={{ display: 'grid', gap: '16px', padding: '16px 0' }}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 3fr',
                                gap: '16px',
                                alignItems: 'center',
                            }}
                        >
                            <Label htmlFor='name'>{t('storybook.dialog.name')}</Label>
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
                            <Label htmlFor='username'>{t('storybook.dialog.username')}</Label>
                            <Input id='username' defaultValue='@peduarte' />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='submit'>{t('storybook.dialog.saveChanges')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    },
};

export const Simple: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button>{t('storybook.dialog.openDialog')}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('storybook.dialog.areYouSure')}</DialogTitle>
                        <DialogDescription>{t('storybook.dialog.cannotBeUndone')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline'>{t('common.cancel')}</Button>
                        <Button variant='destructive'>{t('common.delete')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    },
};
