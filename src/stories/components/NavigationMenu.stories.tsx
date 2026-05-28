import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/navigation-menu';

const meta = {
    title: 'Components/NavigationMenu',
    component: NavigationMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='grid gap-1 p-4 w-[320px]'>
                            <li>
                                <NavigationMenuLink href='#' className='block'>
                                    <div className='text-sm font-medium'>Introduction</div>
                                    <div className='text-xs text-muted-foreground'>
                                        An overview of the platform features.
                                    </div>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href='#' className='block'>
                                    <div className='text-sm font-medium'>Getting Started</div>
                                    <div className='text-xs text-muted-foreground'>
                                        Step-by-step guide to set up your first project.
                                    </div>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href='#' className='block'>
                                    <div className='text-sm font-medium'>Components</div>
                                    <div className='text-xs text-muted-foreground'>
                                        Explore the available UI components.
                                    </div>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='grid grid-cols-2 gap-1 p-4 w-[400px]'>
                            {[
                                { name: 'Orders', desc: 'Manage incoming orders' },
                                { name: 'Menu Builder', desc: 'Create and edit your menu' },
                                { name: 'Analytics', desc: 'Track sales and trends' },
                                { name: 'Inventory', desc: 'Stock and supply management' },
                            ].map(item => (
                                <li key={item.name}>
                                    <NavigationMenuLink href='#' className='block'>
                                        <div className='text-sm font-medium'>{item.name}</div>
                                        <div className='text-xs text-muted-foreground'>{item.desc}</div>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink href='#' className={navigationMenuTriggerStyle()}>
                        Documentation
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};

export const WithActiveLink: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href='#' data-active='true' className={navigationMenuTriggerStyle()}>
                        Home
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href='#' className={navigationMenuTriggerStyle()}>
                        Orders
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href='#' className={navigationMenuTriggerStyle()}>
                        Reports
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href='#' className={navigationMenuTriggerStyle()}>
                        Settings
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};

export const WithoutViewport: Story = {
    render: () => (
        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>File</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='grid gap-1 p-2 w-[180px]'>
                            <li>
                                <NavigationMenuLink href='#'>New</NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href='#'>Open</NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href='#'>Save</NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Edit</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='grid gap-1 p-2 w-[180px]'>
                            <li>
                                <NavigationMenuLink href='#'>Undo</NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href='#'>Redo</NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};

export const GlassDropdown: Story = {
    name: 'Glass Frosted Dropdown',
    render: () => (
        <div className='relative min-h-[320px]'>
            {/* Background pattern to show glass blur effect */}
            <div className='absolute inset-0 grid grid-cols-4 gap-2 p-4 opacity-40'>
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className='h-12 rounded-lg bg-primary/20' />
                ))}
            </div>
            <div className='relative pt-4 px-4'>
                <p className='text-xs tracking-caps text-muted-foreground mb-4'>Glass utility on navigation dropdown</p>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className='grid gap-1 p-4 w-[320px] glass rounded-lg border shadow-elevated'>
                                    {[
                                        { name: 'Menu Builder', desc: 'Create and manage your food menu' },
                                        { name: 'Order Queue', desc: 'Real-time order tracking' },
                                        { name: 'Analytics', desc: 'Sales trends and insights' },
                                    ].map(item => (
                                        <li key={item.name}>
                                            <NavigationMenuLink href='#' className='block'>
                                                <div className='text-sm font-medium'>{item.name}</div>
                                                <div className='text-xs text-muted-foreground'>{item.desc}</div>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    ),
};
