import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
} from '@/components/sidebar';

const meta = {
    title: 'Components/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const navMain = [
    { label: 'Dashboard', icon: '▦', active: false },
    { label: 'Orders', icon: '◉', active: true, badge: '12' },
    { label: 'Menu', icon: '☰', active: false },
    { label: 'Analytics', icon: '↗', active: false },
    { label: 'Customers', icon: '◯', active: false },
];

const navSettings = [
    { label: 'Profile', icon: '◯' },
    { label: 'Billing', icon: '◈' },
    { label: 'Notifications', icon: '◎' },
];

export const Default: Story = {
    render: () => (
        <SidebarProvider>
            <div className='flex h-[560px] w-full'>
                <Sidebar collapsible='icon'>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size='lg'>
                                    <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold'>
                                        N
                                    </div>
                                    <div className='flex flex-col leading-tight'>
                                        <span className='text-sm font-semibold'>Notism</span>
                                        <span className='text-xs text-muted-foreground'>Restaurant</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Main</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navMain.map(item => (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                                                <span>{item.icon}</span>
                                                <span>{item.label}</span>
                                            </SidebarMenuButton>
                                            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarSeparator />

                        <SidebarGroup>
                            <SidebarGroupLabel>Settings</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navSettings.map(item => (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton tooltip={item.label}>
                                                <span>{item.icon}</span>
                                                <span>{item.label}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size='lg'>
                                    <div className='flex aspect-square size-8 items-center justify-center rounded-full bg-muted text-sm font-medium'>
                                        JD
                                    </div>
                                    <div className='flex flex-col leading-tight'>
                                        <span className='text-sm font-medium'>Jane Doe</span>
                                        <span className='text-xs text-muted-foreground'>Admin</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset>
                    <header className='flex h-14 items-center gap-2 border-b px-4'>
                        <SidebarTrigger />
                        <span className='text-sm text-muted-foreground'>Dashboard</span>
                    </header>
                    <main className='p-4'>
                        <p className='text-sm text-muted-foreground'>Main content area</p>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    ),
};

export const WithSubMenu: Story = {
    render: () => (
        <SidebarProvider>
            <div className='flex h-[480px] w-full'>
                <Sidebar collapsible='none'>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size='lg'>
                                    <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold'>
                                        N
                                    </div>
                                    <span className='text-sm font-semibold'>Notism</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton isActive>
                                            <span>▦</span>
                                            <span>Dashboard</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <span>◉</span>
                                            <span>Orders</span>
                                        </SidebarMenuButton>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton isActive>Pending</SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton>Completed</SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton>Cancelled</SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <span>☰</span>
                                            <span>Menu</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <span>↗</span>
                                            <span>Analytics</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>

                <SidebarInset>
                    <header className='flex h-14 items-center border-b px-4'>
                        <span className='text-sm font-medium'>Orders / Pending</span>
                    </header>
                    <main className='p-4'>
                        <p className='text-sm text-muted-foreground'>Order list content</p>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    ),
};

export const Floating: Story = {
    render: () => (
        <SidebarProvider>
            <div className='flex h-[480px] w-full bg-muted/30'>
                <Sidebar variant='floating' collapsible='none'>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <span className='font-bold'>N</span>
                                    <span className='text-sm font-semibold'>Notism</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navMain.map(item => (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton isActive={item.active}>
                                                <span>{item.icon}</span>
                                                <span>{item.label}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <main className='p-6'>
                        <p className='text-sm text-muted-foreground'>Floating sidebar variant</p>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    ),
};

export const GlassSidebar: Story = {
    name: 'Glass Frosted Sidebar',
    render: () => (
        <SidebarProvider>
            <div className='relative flex h-[480px] w-full'>
                {/* Background imagery to demonstrate glass blur */}
                <div className='absolute inset-0 grid grid-cols-6 gap-3 p-8 opacity-30'>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className='h-14 rounded-lg bg-primary/30' />
                    ))}
                </div>
                {/* Glass sidebar panel */}
                <aside className='relative z-10 w-[--sidebar-width] glass border-r flex flex-col'>
                    <div className='p-4 border-b' style={{ borderColor: 'var(--glass-border)' }}>
                        <div className='flex items-center gap-2'>
                            <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold'>
                                N
                            </div>
                            <div className='flex flex-col leading-tight'>
                                <span className='text-sm font-semibold'>Notism</span>
                                <span className='text-xs text-muted-foreground'>Restaurant</span>
                            </div>
                        </div>
                    </div>
                    <nav className='flex flex-col gap-1 p-3 flex-1'>
                        <p className='text-xs tracking-caps text-muted-foreground px-2 mb-2'>Navigation</p>
                        {navMain.map(item => (
                            <a
                                key={item.label}
                                href='#'
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                    item.active
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-foreground hover:bg-accent'
                                }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </aside>
                <main className='relative z-10 flex-1 p-6'>
                    <p className='text-sm text-muted-foreground'>
                        Glass sidebar using backdrop blur with --glass-bg and --glass-border tokens.
                    </p>
                </main>
            </div>
        </SidebarProvider>
    ),
};
