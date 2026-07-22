import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from '@/uis/menubar';

const meta = {
    title: 'Components/Navigation/Menubar',
    component: Menubar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>{t('storybook.menubar.file')}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            {t('storybook.menubar.newTab')} <MenubarShortcut>⌘T</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            {t('storybook.menubar.newWindow')} <MenubarShortcut>⌘N</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled>{t('storybook.menubar.newIncognitoWindow')}</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>
                            {t('storybook.menubar.print')} <MenubarShortcut>⌘P</MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{t('storybook.menubar.edit')}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            {t('storybook.menubar.undo')} <MenubarShortcut>⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            {t('storybook.menubar.redo')} <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>
                            {t('storybook.menubar.cut')} <MenubarShortcut>⌘X</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            {t('storybook.menubar.copy')} <MenubarShortcut>⌘C</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            {t('storybook.menubar.paste')} <MenubarShortcut>⌘V</MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{t('storybook.menubar.view')}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            {t('storybook.menubar.zoomIn')} <MenubarShortcut>⌘+</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            {t('storybook.menubar.zoomOut')} <MenubarShortcut>⌘-</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>
                            {t('storybook.menubar.fullScreen')} <MenubarShortcut>⌘⇧F</MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        );
    },
};
