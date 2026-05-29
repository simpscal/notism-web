import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Settings, Users, FileText, BarChart } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/sidebar';

const navItems = [
    { title: 'Dashboard', url: '#', icon: Home },
    { title: 'Team', url: '#', icon: Users },
    { title: 'Reports', url: '#', icon: BarChart },
    { title: 'Documents', url: '#', icon: FileText },
    { title: 'Settings', url: '#', icon: Settings },
];

function SidebarDemo() {
    return (
        <SidebarProvider style={{ minHeight: '400px', width: '100%' }}>
            <Sidebar>
                <SidebarHeader>
                    <div style={{ padding: '8px 16px', fontWeight: 700, fontSize: '18px' }}>Notism</div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map(item => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <div style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--muted-foreground)' }}>
                        v1.0.0
                    </div>
                </SidebarFooter>
            </Sidebar>
            <main style={{ flex: 1, padding: '16px' }}>
                <SidebarTrigger />
                <div style={{ marginTop: '16px', color: 'var(--muted-foreground)' }}>Main content area</div>
            </main>
        </SidebarProvider>
    );
}

const meta = {
    title: 'Components/Navigation/Sidebar',
    component: SidebarDemo,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SidebarDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
