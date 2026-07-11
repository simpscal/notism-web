import {
    LayoutDashboard,
    LogIn,
    LogOut,
    Moon,
    Package,
    Receipt,
    Settings,
    Store,
    Sun,
    Tags,
    UtensilsCrossed,
    Users,
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { getDisplayName, getInitials } from '@/app/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { useTheme } from '@/core/contexts/theme.context';
import { NotificationStatus } from '@/core/hooks';
import LiveFeedPill from '@/features/order/components/live-feed-pill';

interface AdminToolbarDesktopProps {
    user: UserProfileModel | null;
    onLogout: () => void;
    liveFeedStatus: NotificationStatus;
}

function AdminToolbarDesktop({ user, onLogout, liveFeedStatus }: AdminToolbarDesktopProps) {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const location = useLocation();

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'A';
    const isDark = theme === 'dark';

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

    const handleThemeToggle = useCallback(() => {
        setTheme(isDark ? 'light' : 'dark');
    }, [isDark, setTheme]);

    return (
        <NavBar className='z-30 hidden h-16 shrink-0 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] lg:flex lg:px-6'>
            <NavBarBrand className='pl-1'>
                <Link
                    to={`/${ROUTES.HOME}`}
                    className='text-lg font-semibold tracking-tight text-primary transition-opacity hover:opacity-80'
                >
                    Notism
                </Link>
                <Badge variant='secondary' className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'>
                    Admin
                </Badge>
            </NavBarBrand>

            <NavBarNav className='flex-1 justify-center'>
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(`/${item.path}`);
                    return (
                        <NavBarItem key={item.path} active={isActive} asChild>
                            <NavLink to={`/${item.path}`} end={false}>
                                <Icon className='size-4' aria-hidden />
                                {item.label}
                            </NavLink>
                        </NavBarItem>
                    );
                })}
            </NavBarNav>

            <NavBarActions className='gap-3'>
                <LiveFeedPill status={liveFeedStatus} />

                <button
                    type='button'
                    aria-label='Toggle theme'
                    onClick={handleThemeToggle}
                    className='flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                >
                    {isDark ? <Sun className='size-4' aria-hidden /> : <Moon className='size-4' aria-hidden />}
                </button>

                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                aria-label='Admin user menu'
                                className='rounded-full transition-colors hover:bg-accent'
                            >
                                <Avatar className='size-9'>
                                    <AvatarImage src={user.avatarUrl ?? ''} alt={displayName ?? ''} />
                                    <AvatarFallback className='bg-selected text-xs font-semibold text-selected-foreground'>
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
                    <Button size='sm' asChild>
                        <Link to={`/${ROUTES.AUTH.LOGIN}`}>
                            <LogIn className='size-4' />
                            {t('nav.logIn')}
                        </Link>
                    </Button>
                )}
            </NavBarActions>
        </NavBar>
    );
}

export default memo(AdminToolbarDesktop);
