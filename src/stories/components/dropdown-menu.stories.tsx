import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreditCard, Keyboard, LifeBuoy, LogOut, Settings, User, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/uis/dropdown-menu';

const meta = {
    title: 'Components/Navigation/DropdownMenu',
    component: DropdownMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline'>{t('storybook.dropdownMenu.openMenu')}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                    <DropdownMenuLabel>{t('storybook.dropdownMenu.myAccount')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <User />
                            <span>{t('storybook.dropdownMenu.profile')}</span>
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard />
                            <span>{t('storybook.dropdownMenu.billing')}</span>
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings />
                            <span>{t('storybook.dropdownMenu.settings')}</span>
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Keyboard />
                            <span>{t('storybook.dropdownMenu.keyboardShortcuts')}</span>
                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Users />
                            <span>{t('storybook.dropdownMenu.team')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LifeBuoy />
                        <span>{t('storybook.dropdownMenu.support')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogOut />
                        <span>{t('storybook.dropdownMenu.logOut')}</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};

export const WithCheckboxes: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline'>{t('storybook.dropdownMenu.options')}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-48'>
                    <DropdownMenuLabel>{t('storybook.dropdownMenu.appearance')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <span>{t('storybook.dropdownMenu.statusBar')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>{t('storybook.dropdownMenu.activityBar')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>{t('storybook.dropdownMenu.panel')}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};
