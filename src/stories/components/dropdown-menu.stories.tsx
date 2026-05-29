import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreditCard, Keyboard, LifeBuoy, LogOut, Settings, User, Users } from 'lucide-react';

import { Button } from '@/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';

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
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard />
                        <span>Billing</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Keyboard />
                        <span>Keyboard shortcuts</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Users />
                        <span>Team</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LifeBuoy />
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const WithCheckboxes: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48'>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <span>Status Bar</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Activity Bar</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Panel</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};
