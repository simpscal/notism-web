import {
    LayoutDashboard,
    LogIn,
    LogOut,
    Moon,
    Package,
    RotateCcw,
    Settings,
    Store,
    Sun,
    UtensilsCrossed,
} from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { cn, getDisplayName, getInitials } from '@/app/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { useTheme } from '@/core/contexts/theme.context';

interface AdminToolbarMobileProps {
    user: UserProfileModel | null;
    onLogout: () => void;
}

function AdminToolbarMobile({ user, onLogout }: AdminToolbarMobileProps) {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'A';

    const isDark = theme === 'dark';

    const handleThemeToggle = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    return (
        <>
            {/* Fixed bottom bar */}
            <div className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 lg:hidden'>
                {/* Dashboard shortcut */}
                <NavLink
                    to={`/${ROUTES.ADMIN.DASHBOARD}`}
                    aria-label={t('nav.dashboard')}
                    className={({ isActive }) =>
                        cn(
                            'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 transition-colors',
                            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )
                    }
                >
                    <LayoutDashboard className='h-6 w-6' />
                    <span className='text-[10px] font-medium'>{t('nav.dashboard')}</span>
                </NavLink>

                {/* Orders shortcut */}
                <NavLink
                    to={`/${ROUTES.ADMIN.ORDERS}`}
                    aria-label={t('nav.orders')}
                    className={({ isActive }) =>
                        cn(
                            'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 transition-colors',
                            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )
                    }
                >
                    <Package className='h-6 w-6' />
                    <span className='text-[10px] font-medium'>{t('nav.orders')}</span>
                </NavLink>

                {/* Refunds shortcut */}
                <NavLink
                    to={`/${ROUTES.ADMIN.REFUNDS}`}
                    aria-label={t('nav.refunds')}
                    className={({ isActive }) =>
                        cn(
                            'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 transition-colors',
                            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )
                    }
                >
                    <RotateCcw className='h-6 w-6' />
                    <span className='text-[10px] font-medium'>{t('nav.refunds')}</span>
                </NavLink>

                {/* Foods shortcut */}
                <NavLink
                    to={`/${ROUTES.ADMIN.FOODS}`}
                    aria-label={t('nav.foods')}
                    className={({ isActive }) =>
                        cn(
                            'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 transition-colors',
                            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )
                    }
                >
                    <UtensilsCrossed className='h-6 w-6' />
                    <span className='text-[10px] font-medium'>{t('nav.foods')}</span>
                </NavLink>

                {/* Theme toggle */}
                <button
                    aria-label='Toggle theme'
                    onClick={handleThemeToggle}
                    className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-foreground transition-colors'
                >
                    {isDark ? <Sun className='h-6 w-6' /> : <Moon className='h-6 w-6' />}
                    <span className='text-[10px] font-medium'>{t('nav.theme')}</span>
                </button>

                {/* Avatar / Login */}
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                aria-label='Admin user menu'
                                className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 transition-colors'
                            >
                                <Avatar className='h-8 w-8 rounded-full'>
                                    <AvatarImage src={user.avatarUrl ?? ''} alt={displayName ?? ''} />
                                    <AvatarFallback className='bg-primary text-primary-foreground text-[10px] font-semibold'>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className='max-w-[52px] truncate text-[10px] font-medium text-muted-foreground'>
                                    {user.firstName || displayName?.split(' ')[0]}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-60'>
                            <DropdownMenuLabel className='font-normal'>
                                <p className='text-sm font-medium truncate'>{displayName}</p>
                                <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                                <p className='mt-0.5 text-xs text-primary font-medium truncate'>{user.role}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.SETTINGS.PROFILE}`}>
                                    <Settings className='mr-2 h-4 w-4' />
                                    {t('nav.setting')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.FOODS.LIST}`}>
                                    <Store className='mr-2 h-4 w-4' />
                                    {t('nav.backToStore')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant='destructive' onClick={onLogout}>
                                <LogOut className='mr-2 h-4 w-4' />
                                {t('nav.logOut')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link
                        to={`/${ROUTES.AUTH.LOGIN}`}
                        aria-label={t('nav.logIn')}
                        className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-primary transition-colors'
                    >
                        <LogIn className='h-6 w-6' />
                        <span className='text-[10px] font-medium'>{t('nav.logIn')}</span>
                    </Link>
                )}
            </div>
        </>
    );
}

export default memo(AdminToolbarMobile);
