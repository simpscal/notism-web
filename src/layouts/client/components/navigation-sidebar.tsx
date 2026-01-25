import { Palette, User } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/sidebar';
import { useAppSelector } from '@/core/hooks';

interface NavigationItem {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
    requiresAuth?: boolean;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        label: 'Profile',
        icon: User,
        path: `/${ROUTES.SETTINGS.PROFILE}`,
        requiresAuth: true,
    },
    {
        label: 'Appearance',
        icon: Palette,
        path: `/${ROUTES.SETTINGS.APPEARANCE}`,
        requiresAuth: true,
    },
];

function NavigationSidebar() {
    const location = useLocation();
    const user = useAppSelector(state => state.user.user);
    const { isMobile, setOpenMobile } = useSidebar();

    const items = NAVIGATION_ITEMS.filter(item => !item.requiresAuth || !!user);

    const handleLinkClick = useCallback(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [isMobile, setOpenMobile]);

    if (!isMobile) {
        return null;
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <Sidebar collapsible='offcanvas' variant='sidebar'>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton isActive={isActive} tooltip={item.label} asChild>
                                            <Link to={item.path} onClick={handleLinkClick}>
                                                <Icon className='h-4 w-4' />
                                                <span>{item.label}</span>
                                            </Link>
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

export default memo(NavigationSidebar);
