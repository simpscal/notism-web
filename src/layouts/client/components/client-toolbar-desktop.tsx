import { Globe, Home, LogIn, LogOut, Moon, Settings, ShoppingCart, Sun, User } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { cn, getDisplayName, getInitials } from '@/app/utils';
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
import { useTheme } from '@/core/contexts/theme.context';
import { useAppSelector } from '@/core/hooks';
import { UserProfileViewModel } from '@/features/user/models';
import { selectCartTotalItems } from '@/store/cart';

interface ClientToolbarDesktopProps {
    user: UserProfileViewModel | null;
    onLogout: () => void;
}

function ClientToolbarDesktop({ user, onLogout }: ClientToolbarDesktopProps) {
    const { t, i18n } = useTranslation();
    const cartItemCount = useAppSelector(selectCartTotalItems);
    const { theme, setTheme } = useTheme();

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'U';

    const isDark = theme === 'dark';

    const handleThemeToggle = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    const handleLangToggle = useCallback(() => {
        const next = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(next);
    }, [i18n]);

    const langLabel = i18n.language === 'en' ? 'EN' : 'VI';

    const getNavLinkClassName = useCallback(
        ({ isActive }: { isActive: boolean }) =>
            cn(
                'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            ),
        []
    );

    const desktopNavItems = useMemo(
        () => [
            { label: t('nav.home'), path: `/${ROUTES.FOODS.LIST}`, icon: Home },
            ...(user ? [{ label: t('nav.orders'), path: `/${ROUTES.ORDERS.LIST}`, icon: ShoppingCart }] : []),
        ],
        [t, user]
    );

    return (
        <header className='sticky top-0 z-50 hidden h-16 w-full border-b bg-background lg:flex'>
            <div className='mx-auto flex h-full w-full max-w-7xl items-center px-6'>
                {/* Left — brand */}
                <div className='flex flex-1 items-center'>
                    <Link
                        to={`/${ROUTES.FOODS.LIST}`}
                        className='text-primary font-semibold tracking-tight text-lg hover:opacity-80 transition-opacity'
                    >
                        Notism
                    </Link>
                </div>

                {/* Center — nav links */}
                <nav className='flex items-center gap-1'>
                    {desktopNavItems.map(item => (
                        <NavLink
                            key={item.path + item.label}
                            to={item.path}
                            end={false}
                            className={getNavLinkClassName}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right — controls */}
                <div className='flex flex-1 items-center justify-end gap-2'>
                    {/* Cart */}
                    <Link
                        to={`/${ROUTES.CART}`}
                        aria-label={`Cart, ${cartItemCount} items`}
                        className='relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors'
                    >
                        <ShoppingCart className='h-5 w-5' />
                        {cartItemCount > 0 && (
                            <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold'>
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </Link>

                    {/* Language toggle */}
                    <button
                        aria-label={`Language: ${langLabel}`}
                        onClick={handleLangToggle}
                        className='flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors'
                    >
                        <Globe className='h-4 w-4' />
                        <span>{langLabel}</span>
                    </button>

                    {/* Theme toggle */}
                    <button
                        aria-label='Toggle theme'
                        onClick={handleThemeToggle}
                        className='flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors'
                    >
                        {isDark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
                    </button>

                    {/* User / Login */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    aria-label='User menu'
                                    className='flex items-center gap-2 rounded-full px-2 py-1 hover:bg-accent/50 transition-colors'
                                >
                                    <Avatar className='h-9 w-9 rounded-full'>
                                        <AvatarImage src={user.avatarUrl ?? ''} alt={displayName ?? ''} />
                                        <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className='max-w-[140px] truncate text-sm font-medium text-foreground hidden lg:block'>
                                        {displayName}
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
                        <Button size='sm' className='gap-2' asChild>
                            <Link to={`/${ROUTES.AUTH.LOGIN}`}>
                                <LogIn className='h-4 w-4' />
                                {t('nav.logIn')}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default memo(ClientToolbarDesktop);
