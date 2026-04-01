import {
    LogOut,
    Menu,
    Moon,
    Monitor,
    Package,
    Palette,
    Settings,
    ShoppingCart,
    Sun,
    Shield,
    UtensilsCrossed,
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { UserRoleEnum } from '@/app/enums';
import { cn } from '@/app/utils';
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
import { LanguageSwitcher } from '@/components/language-switcher';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet';
import { useTheme } from '@/core/contexts/theme.context';
import { useAppSelector, useIsMobile } from '@/core/hooks';
import { UserProfileViewModel } from '@/features/user/models';
import { selectCartTotalItems } from '@/store/cart';

interface ClientLayoutToolbarProps {
    user: UserProfileViewModel | null;
    onLogout: () => void;
}

function ClientLayoutToolbar({ user, onLogout }: ClientLayoutToolbarProps) {
    const { t } = useTranslation();
    const cartItemCount = useAppSelector(selectCartTotalItems);
    const isMobile = useIsMobile();
    const { theme, setTheme } = useTheme();
    const isAdmin = useMemo(() => user?.role === UserRoleEnum.Admin, [user?.role]);

    const getUserInitials = () => {
        if (!user) return 'U';
        const firstInitial = user.firstName?.[0] || '';
        const lastInitial = user.lastName?.[0] || '';
        return (firstInitial + lastInitial).toUpperCase() || 'U';
    };

    const handleThemeToggle = useCallback(() => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    }, [theme, setTheme]);

    const getThemeIcon = () => {
        if (theme === 'light') {
            return Sun;
        } else if (theme === 'dark') {
            return Moon;
        } else {
            return Monitor;
        }
    };

    const ThemeIcon = getThemeIcon();

    const navItems = useMemo(() => {
        const items: Array<{ label: string; path: string }> = [
            { label: t('nav.foods'), path: `/${ROUTES.FOODS.LIST}` },
        ];

        if (user) {
            items.push({ label: t('nav.orders'), path: `/${ROUTES.ORDERS.LIST}` });
            items.push({ label: t('nav.appearance'), path: `/${ROUTES.SETTINGS.APPEARANCE}` });
        }

        if (isAdmin) {
            items.push({ label: t('nav.adminPortal'), path: `/${ROUTES.ADMIN.ORDERS}` });
        }

        return items;
    }, [isAdmin, user, t]);

    return (
        <header className='border-b bg-background sticky top-0 z-50'>
            <div className='flex h-16 items-center justify-between px-4 md:px-6'>
                {/* Left side - mobile menu + brand + desktop nav */}
                <div className='flex items-center gap-2 md:gap-4'>
                    {isMobile && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant='ghost' size='icon' aria-label='Open menu'>
                                    <Menu className='h-5 w-5' />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side='left' className='p-0'>
                                <SheetHeader className='px-4 pt-4'>
                                    <SheetTitle className='text-primary text-lg'>Notism</SheetTitle>
                                </SheetHeader>
                                <div className='mt-4 grid gap-1 px-2'>
                                    {navItems.map(item => {
                                        return (
                                            <SheetClose asChild key={item.path}>
                                                <NavLink
                                                    to={item.path}
                                                    end={false}
                                                    className={({ isActive }) =>
                                                        cn(
                                                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                                            isActive
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                                        )
                                                    }
                                                >
                                                    {item.path === `/${ROUTES.FOODS.LIST}` ? (
                                                        <UtensilsCrossed className='h-4 w-4 text-current' />
                                                    ) : item.path === `/${ROUTES.SETTINGS.APPEARANCE}` ? (
                                                        <Palette className='h-4 w-4 text-current' />
                                                    ) : (
                                                        <Package className='h-4 w-4 text-current' />
                                                    )}
                                                    <span>{item.label}</span>
                                                </NavLink>
                                            </SheetClose>
                                        );
                                    })}
                                </div>
                                <div className='mt-4 border-t px-2 pt-3'>
                                    {user ? (
                                        <SheetClose asChild>
                                            <Link
                                                to={`/${ROUTES.SETTINGS.PROFILE}`}
                                                className='flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary'
                                            >
                                                <Settings className='h-4 w-4' />
                                                <span>{t('settings.profile.title')}</span>
                                            </Link>
                                        </SheetClose>
                                    ) : (
                                        <SheetClose asChild>
                                            <Link
                                                to={`/${ROUTES.AUTH.LOGIN}`}
                                                className='flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'
                                            >
                                                {t('nav.logIn')}
                                            </Link>
                                        </SheetClose>
                                    )}
                                </div>
                                <div className='mt-4 border-t px-2 pt-3'>
                                    <LanguageSwitcher />
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}

                    <Link to={`/${ROUTES.FOODS.LIST}`} className='cursor-pointer'>
                        <h1 className='text-lg font-semibold text-primary tracking-tight hover:opacity-80 transition-opacity md:text-2xl'>
                            Notism
                        </h1>
                    </Link>

                    <nav className='hidden items-center gap-2 md:flex'>
                        {navItems
                            .filter(item => item.path !== `/${ROUTES.ADMIN.ORDERS}`)
                            .map(item => {
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={false}
                                        className={({ isActive }) =>
                                            cn(
                                                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                            )
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                    </nav>
                </div>

                {/* Right side - Cart, Theme Toggle, Language Switcher & User Avatar or Login/Signup */}
                <div className='flex items-center gap-2 md:gap-4'>
                    {/* Cart Icon */}
                    <Button variant='ghost' size='icon' className='relative' asChild>
                        <Link to={`/${ROUTES.CART}`}>
                            <ShoppingCart className='h-5 w-5' />
                            {cartItemCount > 0 && (
                                <Badge className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0'>
                                    {cartItemCount > 99 ? '99+' : cartItemCount}
                                </Badge>
                            )}
                        </Link>
                    </Button>

                    {/* Language Switcher */}
                    {!isMobile && <LanguageSwitcher />}

                    {/* Theme Toggle */}
                    {!isMobile && (
                        <Button variant='ghost' size='icon' onClick={handleThemeToggle} title={`Theme: ${theme}`}>
                            <ThemeIcon className='h-5 w-5' />
                        </Button>
                    )}

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
                                    <Avatar className='h-10 w-10'>
                                        <AvatarImage src={user?.avatarUrl || ''} alt={user?.email} />
                                        <AvatarFallback className='bg-primary text-primary-foreground'>
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-56' align='end' forceMount>
                                <DropdownMenuLabel className='font-normal'>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='text-sm font-medium leading-none'>
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to={`/${ROUTES.ORDERS.LIST}`}>
                                        <Package className='h-4 w-4' />
                                        <span>{t('nav.orders')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={`/${ROUTES.SETTINGS.PROFILE}`}>
                                        <Settings className='h-4 w-4' />
                                        <span>{t('nav.setting')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to={`/${ROUTES.ADMIN.ORDERS}`}>
                                                <Shield className='h-4 w-4' />
                                                <span>{t('nav.adminPortal')}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout}>
                                    <LogOut className='h-4 w-4' />
                                    <span>{t('nav.logOut')}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button size={isMobile ? 'sm' : 'default'} asChild>
                            <Link to={`/${ROUTES.AUTH.LOGIN}`}>{t('nav.logIn')}</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default memo(ClientLayoutToolbar);
