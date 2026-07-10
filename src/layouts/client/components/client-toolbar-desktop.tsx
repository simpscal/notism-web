import { Globe, Home, LogIn, LogOut, Moon, Settings, ShoppingBag, ShoppingCart, Sun, User } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useLanguageToggle } from '@/app/i18n/use-language-toggle';
import { getDisplayName, getInitials } from '@/app/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
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
import { useAppSelector } from '@/core/hooks';
import { selectCartTotalItems } from '@/store/cart';

interface ClientToolbarDesktopProps {
    user: UserProfileModel | null;
    onLogout: () => void;
}

function ClientToolbarDesktop({ user, onLogout }: ClientToolbarDesktopProps) {
    const { t } = useTranslation();
    const location = useLocation();
    const cartItemCount = useAppSelector(selectCartTotalItems);
    const { theme, setTheme } = useTheme();
    const { currentLanguage, toggleLanguage } = useLanguageToggle();

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'U';
    const isDark = theme === 'dark';
    const langLabel = currentLanguage === 'en' ? 'EN' : 'VI';

    const navItems = useMemo(
        () => [
            { label: t('nav.home'), path: ROUTES.FOODS.LIST, icon: Home },
            ...(user ? [{ label: t('nav.orders'), path: ROUTES.ORDERS.LIST, icon: ShoppingCart }] : []),
        ],
        [t, user]
    );

    const handleThemeToggle = useCallback(() => {
        setTheme(isDark ? 'light' : 'dark');
    }, [isDark, setTheme]);

    return (
        <NavBar className='hidden shrink-0 lg:flex'>
            <NavBarBrand>
                <Link
                    to={`/${ROUTES.FOODS.LIST}`}
                    className='pl-2 text-lg font-extrabold tracking-tight text-primary transition-opacity hover:opacity-80'
                >
                    Notism
                </Link>
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

            <NavBarActions>
                <button
                    type='button'
                    aria-label={`Language: ${langLabel}`}
                    onClick={toggleLanguage}
                    className='flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                >
                    <Globe className='size-4' aria-hidden />
                    {langLabel}
                </button>

                <button
                    type='button'
                    aria-label={t('nav.theme')}
                    onClick={handleThemeToggle}
                    className='flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                >
                    {isDark ? <Sun className='size-4' aria-hidden /> : <Moon className='size-4' aria-hidden />}
                </button>

                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                aria-label='User menu'
                                className='flex items-center gap-2 rounded-full px-1 py-1 transition-colors hover:bg-accent'
                            >
                                <Avatar className='size-9'>
                                    <AvatarImage src={user.avatarUrl ?? ''} alt={displayName ?? ''} />
                                    <AvatarFallback className='bg-selected text-xs font-semibold text-selected-foreground'>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-56'>
                            <DropdownMenuLabel className='font-normal'>
                                <p className='truncate text-sm font-medium'>{displayName}</p>
                                <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.SETTINGS.PROFILE}`}>
                                    <User className='mr-2 size-4' />
                                    {t('settings.profile.title')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.ORDERS.LIST}`}>
                                    <ShoppingCart className='mr-2 size-4' />
                                    {t('nav.orders')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/${ROUTES.SETTINGS.BASE}`}>
                                    <Settings className='mr-2 size-4' />
                                    {t('nav.setting')}
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
                    <Button size='sm' variant='outline' className='gap-2' asChild>
                        <Link to={`/${ROUTES.AUTH.LOGIN}`}>
                            <LogIn className='size-4' />
                            {t('nav.logIn')}
                        </Link>
                    </Button>
                )}

                <Link
                    to={`/${ROUTES.CART}`}
                    aria-label={`Cart, ${cartItemCount} items`}
                    className='inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
                >
                    <ShoppingBag className='size-4' aria-hidden />
                    {t('nav.cart')}
                    {cartItemCount > 0 && (
                        <span className='flex size-5 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px] font-bold'>
                            {cartItemCount > 99 ? '99+' : cartItemCount}
                        </span>
                    )}
                </Link>
            </NavBarActions>
        </NavBar>
    );
}

export default memo(ClientToolbarDesktop);
