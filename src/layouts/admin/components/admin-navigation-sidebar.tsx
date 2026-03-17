import { Package, Tags, UtensilsCrossed, Users } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { Link, useMatch } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from '@/components/sidebar';
import { useAppSelector } from '@/core/hooks';

interface NavigationItem {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        label: 'Orders',
        icon: Package,
        path: `/${ROUTES.ADMIN.ORDERS}`,
    },
    {
        label: 'Foods',
        icon: UtensilsCrossed,
        path: `/${ROUTES.ADMIN.FOODS}`,
    },
    {
        label: 'Categories',
        icon: Tags,
        path: `/${ROUTES.ADMIN.CATEGORIES}`,
    },
    {
        label: 'Users',
        icon: Users,
        path: `/${ROUTES.ADMIN.USERS}`,
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

function AdminNavigationSidebar() {
    const user = useAppSelector(state => state.user.user);
    const { isMobile, setOpenMobile } = useSidebar();

    const items = useMemo(() => {
        return NAVIGATION_ITEMS;
    }, []);

    const handleLinkClick = useCallback(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [isMobile, setOpenMobile]);

    if (items.length === 0 || !user) {
        return null;
    }

    return (
        <Sidebar
            collapsible='icon'
            variant='sidebar'
            className='[&_[data-slot=sidebar-container]]:sticky [&_[data-slot=sidebar-container]]:top-0 [&_[data-slot=sidebar-container]]:self-start'
        >
            <SidebarHeader>
                <div className='flex items-center gap-2 py-1.5'>
                    <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                        <Package className='size-4' />
                    </div>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>Admin Portal</span>
                        <span className='truncate text-xs text-muted-foreground'>Management</span>
                    </div>
                </div>
            </SidebarHeader>
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
            <SidebarRail />
        </Sidebar>
    );
}

export default memo(AdminNavigationSidebar);
