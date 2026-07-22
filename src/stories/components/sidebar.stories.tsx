import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Settings, Users, FileText, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
} from '@/uis/sidebar';

const navItems = [
    { titleKey: 'storybook.sidebar.dashboard', url: '#', icon: Home },
    { titleKey: 'storybook.sidebar.team', url: '#', icon: Users },
    { titleKey: 'storybook.sidebar.reports', url: '#', icon: BarChart },
    { titleKey: 'storybook.sidebar.documents', url: '#', icon: FileText },
    { titleKey: 'storybook.sidebar.settings', url: '#', icon: Settings },
];

function SidebarDemo() {
    const { t } = useTranslation();
    return (
        <SidebarProvider style={{ minHeight: '400px', width: '100%' }}>
            <Sidebar>
                <SidebarHeader>
                    <div style={{ padding: '8px 16px', fontWeight: 700, fontSize: '18px' }}>
                        {t('storybook.sidebar.brand')}
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>{t('storybook.sidebar.application')}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map(item => (
                                    <SidebarMenuItem key={item.titleKey}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{t(item.titleKey)}</span>
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
                <div style={{ marginTop: '16px', color: 'var(--muted-foreground)' }}>
                    {t('storybook.sidebar.mainContent')}
                </div>
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
