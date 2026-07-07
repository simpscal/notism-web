import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Search, ShoppingBag } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Button } from '@/components/button';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';

const meta = {
    title: 'Components/Navigation/NavBar',
    component: NavBar,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const BrandMark = ({ label = 'Acme' }: { label?: string }) => (
    <span className='px-1 text-lg font-extrabold tracking-tight text-primary'>{label}</span>
);

/**
 * Default — a floating rounded bar with a brand slot, a centered single-select
 * nav region (the active item is a white pill with the primary accent — a real
 * navigation selection, never a Button in a selected style), and a trailing
 * actions slot. One unified bar serves every surface.
 */
export const Default: Story = {
    render: args => (
        <NavBar {...args}>
            <NavBarBrand>
                <BrandMark />
            </NavBarBrand>
            <NavBarNav className='flex-1 justify-center'>
                <NavBarItem active>
                    <Home className='size-4' aria-hidden />
                    Home
                </NavBarItem>
                <NavBarItem>
                    <ShoppingBag className='size-4' aria-hidden />
                    Orders
                </NavBarItem>
            </NavBarNav>
            <NavBarActions>
                <Button variant='ghost' size='icon-sm' aria-label='Search'>
                    <Search />
                </Button>
                <Avatar className='size-9'>
                    <AvatarFallback className='bg-selected text-xs font-semibold text-selected-foreground'>
                        TM
                    </AvatarFallback>
                </Avatar>
            </NavBarActions>
        </NavBar>
    ),
};

/**
 * AsChild — nav items render as anchors (or router links) via `asChild` while
 * keeping the active selection semantics (aria-current) and token styling.
 */
export const AsLinks: Story = {
    render: args => (
        <NavBar {...args}>
            <NavBarBrand>
                <BrandMark />
            </NavBarBrand>
            <NavBarNav className='flex-1 justify-center'>
                <NavBarItem asChild active>
                    <a href='#home'>
                        <Home className='size-4' aria-hidden />
                        Home
                    </a>
                </NavBarItem>
                <NavBarItem asChild>
                    <a href='#orders'>
                        <ShoppingBag className='size-4' aria-hidden />
                        Orders
                    </a>
                </NavBarItem>
            </NavBarNav>
            <NavBarActions>
                <Button variant='ghost' size='icon-sm' aria-label='Search'>
                    <Search />
                </Button>
            </NavBarActions>
        </NavBar>
    ),
};
