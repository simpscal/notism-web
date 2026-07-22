import { Home, LogIn, LogOut, Moon, Settings, ShoppingCart, Sun, User } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { cn, getDisplayName, getInitials } from '@/app/utils';
import { useTheme } from '@/core/contexts/theme.context';
import { useAppSelector } from '@/core/hooks';
import { selectCartTotalItems } from '@/store/cart';
import { Avatar, AvatarFallback, AvatarImage } from '@/uis/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/uis/dropdown-menu';

interface ClientToolbarMobileProps {
    user: UserProfileModel | null;
    onLogout: () => void;
}

function ClientToolbarMobile({ user, onLogout }: ClientToolbarMobileProps) {
    const { t } = useTranslation();
    const cartItemCount = useAppSelector(selectCartTotalItems);
    const { theme, setTheme } = useTheme();

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'U';

    const isDark = theme === 'dark';

    const handleThemeToggle = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    return (
        <>
            {/* Fixed bottom bar */}
            <div className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 lg:hidden'>
                {/* Home */}
                <NavLink
                    to={`/${ROUTES.FOODS.LIST}`}
                    aria-label='Home'
                    className={({ isActive }) =>
                        cn(
                            'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 transition-colors',
                            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )
                    }
                >
                    <Home className='h-6 w-6' />
                    <span className='text-[10px] font-medium'>{t('nav.home')}</span>
                </NavLink>

                {/* Cart */}
                <Link
                    to={`/${ROUTES.CART}`}
                    aria-label={`Cart, ${cartItemCount} items`}
                    className='relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-foreground transition-colors'
                >
                    <div className='relative'>
                        <ShoppingCart className='h-6 w-6' />
                        {cartItemCount > 0 && (
                            <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold'>
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </div>
                    <span className='text-[10px] font-medium'>{t('nav.cart')}</span>
                </Link>

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
                                aria-label='User menu'
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
                        <DropdownMenuContent align='end' className='w-56'>
                            <DropdownMenuLabel className='font-normal'>
                                <p className='text-sm font-medium truncate'>{displayName}</p>
                                <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.SETTINGS.PROFILE}`}>
                                    <User className='mr-2 h-4 w-4' />
                                    {t('settings.profile.title')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.ORDERS.LIST}`}>
                                    <ShoppingCart className='mr-2 h-4 w-4' />
                                    {t('nav.orders')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.SETTINGS.BASE}`}>
                                    <Settings className='mr-2 h-4 w-4' />
                                    {t('nav.setting')}
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
                        aria-label='Login'
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

export default memo(ClientToolbarMobile);
