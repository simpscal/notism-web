import { memo } from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/sidebar';

interface SettingsTab {
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface SettingsSidebarProps {
    tabs: SettingsTab[];
    currentTab: string;
    onTabChange: (tab: string) => void;
}

function SettingsSidebar({ tabs, currentTab, onTabChange }: SettingsSidebarProps) {
    return (
        <Sidebar
            collapsible='icon'
            variant='sidebar'
            className='[&_[data-slot=sidebar-container]]:sticky [&_[data-slot=sidebar-container]]:top-0 [&_[data-slot=sidebar-container]]:self-start'
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = currentTab === tab.value;

                                return (
                                    <SidebarMenuItem key={tab.value}>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            onClick={() => onTabChange(tab.value)}
                                            tooltip={tab.label}
                                        >
                                            <Icon className='h-4 w-4' />
                                            <span>{tab.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default memo(SettingsSidebar);
