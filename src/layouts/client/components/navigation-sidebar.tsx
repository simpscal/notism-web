import { Package, Palette, User, Shield } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { Link, useMatch } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { UserRoleEnum } from '@/app/enums';
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
    requiresAdmin?: boolean;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        label: 'Orders',
        icon: Package,
        path: `/${ROUTES.ORDERS.LIST}`,
        requiresAuth: true,
    },
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
    {
        label: 'Admin Portal',
        icon: Shield,
        path: `/${ROUTES.ADMIN.ORDERS}`,
        requiresAuth: true,
        requiresAdmin: true,
    },
];

interface NavigationItemButtonProps {
    item: NavigationItem;
    onLinkClick: () => void;
}

function NavigationItemButton({ item, onLinkClick }: NavigationItemButtonProps) {
    const match = useMatch({ path: item.path, end: false });
    const Icon = item.icon;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton isActive={!!match} tooltip={item.label} asChild>
                <Link to={item.path} onClick={onLinkClick}>
                    <Icon className='h-4 w-4' />
                    <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function NavigationSidebar() {
    const user = useAppSelector(state => state.user.user);
    const { isMobile, setOpenMobile } = useSidebar();

    const isAdmin = useMemo(() => user?.role === UserRoleEnum.Admin, [user?.role]);

    const items = NAVIGATION_ITEMS.filter(item => (!item.requiresAuth || !!user) && (!item.requiresAdmin || isAdmin));

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
                            {items.map(item => (
                                <NavigationItemButton key={item.path} item={item} onLinkClick={handleLinkClick} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default memo(NavigationSidebar);
