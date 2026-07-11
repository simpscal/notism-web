import {
    LayoutDashboard,
    LogIn,
    LogOut,
    Package,
    Receipt,
    Settings,
    Store,
    Tags,
    UtensilsCrossed,
    Users,
} from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { getDisplayName, getInitials } from '@/app/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Badge } from '@/components/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { NotificationStatus } from '@/core/hooks';
import LiveFeedPill from '@/features/order/components/live-feed-pill';

interface AdminToolbarMobileTopProps {
    liveFeedStatus: NotificationStatus;
}

interface AdminToolbarMobileBottomProps {
    user: UserProfileModel | null;
    onLogout: () => void;
}

function AdminToolbarMobileTop({ liveFeedStatus }: AdminToolbarMobileTopProps) {
    return (
        <NavBar className='z-30 h-14 shrink-0 rounded-full px-4 shadow-soft lg:hidden'>
            <NavBarBrand>
                <Link to={`/${ROUTES.HOME}`} className='text-base font-semibold tracking-tight text-primary'>
                    Notism
                </Link>
                <Badge variant='secondary' className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'>
                    Admin
                </Badge>
            </NavBarBrand>
            <NavBarActions>
                <LiveFeedPill status={liveFeedStatus} />
            </NavBarActions>
        </NavBar>
    );
}

function AdminToolbarMobileBottom({ user, onLogout }: AdminToolbarMobileBottomProps) {
    const { t } = useTranslation();
    const location = useLocation();

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'A';

    const navItems = useMemo(
        () => [
            { label: t('nav.dashboard'), path: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
            { label: t('nav.orders'), path: ROUTES.ADMIN.ORDERS, icon: Package },
            { label: t('nav.refunds'), path: ROUTES.ADMIN.REFUNDS, icon: Receipt },
            { label: t('nav.foods'), path: ROUTES.ADMIN.FOODS, icon: UtensilsCrossed },
            { label: t('admin.categories.title'), path: ROUTES.ADMIN.CATEGORIES, icon: Tags },
            { label: t('admin.users.title'), path: ROUTES.ADMIN.USERS, icon: Users },
        ],
        [t]
    );

    return (
        <NavBar className='z-30 shrink-0 rounded-full px-2 shadow-soft lg:hidden'>
            <NavBarNav className='flex-1 justify-around gap-0'>
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(`/${item.path}`);
                    return (
                        <NavBarItem
                            key={item.path}
                            active={isActive}
                            asChild
                            className='min-h-[44px] min-w-[44px] justify-center px-3'
                        >
                            <NavLink to={`/${item.path}`} end={false} aria-label={item.label}>
                                <Icon className='size-5' aria-hidden />
                            </NavLink>
                        </NavBarItem>
                    );
                })}
            </NavBarNav>

            <NavBarActions>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                aria-label='Admin user menu'
                                className='flex min-h-[44px] min-w-[44px] items-center justify-center px-2'
                            >
                                <Avatar className='size-8'>
                                    <AvatarImage src={user.avatarUrl ?? ''} alt={displayName ?? ''} />
                                    <AvatarFallback className='bg-selected text-[10px] font-semibold text-selected-foreground'>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-60'>
                            <DropdownMenuLabel className='font-normal'>
                                <p className='truncate text-sm font-medium'>{displayName}</p>
                                <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
                                <p className='mt-0.5 truncate text-xs font-medium text-primary'>{user.role}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.SETTINGS.PROFILE}`}>
                                    <Settings className='mr-2 size-4' />
                                    {t('nav.setting')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.FOODS.LIST}`}>
                                    <Store className='mr-2 size-4' />
                                    {t('nav.backToStore')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant='destructive' onClick={onLogout}>
                                <LogOut className='mr-2 size-4' />
                                {t('nav.logOut')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link
                        to={`/${ROUTES.AUTH.LOGIN}`}
                        aria-label={t('nav.logIn')}
                        className='flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-muted-foreground transition-colors hover:text-foreground'
                    >
                        <LogIn className='size-5' />
                    </Link>
                )}
            </NavBarActions>
        </NavBar>
    );
}

const MemoizedAdminToolbarMobileTop = memo(AdminToolbarMobileTop);
const MemoizedAdminToolbarMobileBottom = memo(AdminToolbarMobileBottom);

export {
    MemoizedAdminToolbarMobileTop as AdminToolbarMobileTop,
    MemoizedAdminToolbarMobileBottom as AdminToolbarMobileBottom,
};
