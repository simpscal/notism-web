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
    title: 'Components/Navigation/NavigationMenu',
    component: NavigationMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul
                            style={{
                                display: 'grid',
                                gap: '12px',
                                padding: '24px',
                                width: '400px',
                                gridTemplateColumns: '0.75fr 1fr',
                            }}
                        >
                            <li style={{ gridRow: 'span 3' }}>
                                <NavigationMenuLink asChild>
                                    <a
                                        href='/'
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            padding: '24px',
                                            height: '100%',
                                            borderRadius: '6px',
                                            background: 'linear-gradient(to bottom, var(--muted), var(--muted))',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)' }}>
                                            Notism
                                        </div>
                                        <p
                                            style={{
                                                fontSize: '14px',
                                                color: 'var(--muted-foreground)',
                                                marginTop: '8px',
                                            }}
                                        >
                                            A project management tool for modern teams.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                    <a
                                        href='/docs'
                                        style={{
                                            display: 'block',
                                            padding: '12px',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>
                                            Introduction
                                        </div>
                                        <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                                            Learn the core concepts.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                    <a
                                        href='/installation'
                                        style={{
                                            display: 'block',
                                            padding: '12px',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>
                                            Installation
                                        </div>
                                        <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                                            How to install the package.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href='/docs' className={navigationMenuTriggerStyle()}>
                        Documentation
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};
