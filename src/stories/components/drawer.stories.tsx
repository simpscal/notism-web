import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/drawer';

const meta = {
    title: 'Components/Utilities/Drawer',
    component: Drawer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant='outline'>{t('storybook.drawer.openDrawer')}</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{t('storybook.drawer.moveGoal')}</DrawerTitle>
                        <DrawerDescription>{t('storybook.drawer.moveGoalDescription')}</DrawerDescription>
                    </DrawerHeader>
                    <div style={{ padding: '16px' }}>
                        <p>{t('storybook.drawer.content')}</p>
                    </div>
                    <DrawerFooter>
                        <Button>{t('storybook.drawer.submit')}</Button>
                        <DrawerClose asChild>
                            <Button variant='outline'>{t('common.cancel')}</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    },
};
