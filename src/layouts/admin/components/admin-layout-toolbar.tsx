import { LogOut, Menu, Moon, Monitor, Package, Settings, Sun, Tags, UtensilsCrossed, Users } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { cn } from '@/app/utils';
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
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet';
import { useTheme } from '@/core/contexts/theme.context';
import { useIsMobile } from '@/core/hooks';
import { UserProfileViewModel } from '@/features/user/models';

interface AdminLayoutToolbarProps {
    user: UserProfileViewModel | null;
    onLogout: () => void;
}

function AdminLayoutToolbar({ user, onLogout }: AdminLayoutToolbarProps) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const { theme, setTheme } = useTheme();

    const adminNavItems = [
        { label: t('nav.orders'), path: `/${ROUTES.ADMIN.ORDERS}`, icon: Package },
        { label: t('nav.foods'), path: `/${ROUTES.ADMIN.FOODS}`, icon: UtensilsCrossed },
        { label: t('admin.categories.title'), path: `/${ROUTES.ADMIN.CATEGORIES}`, icon: Tags },
        { label: t('admin.users.title'), path: `/${ROUTES.ADMIN.USERS}`, icon: Users },
    ] as const;

    const getUserInitials = () => {
        if (!user) return 'A';
        const firstInitial = user.firstName?.[0] || '';
        const lastInitial = user.lastName?.[0] || '';
        return (firstInitial + lastInitial).toUpperCase() || 'A';
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

    return (
        <header className='border-b bg-background sticky top-0 z-50'>
            <div className='flex h-16 items-center justify-between px-4 md:px-6'>
                {/* Left side - mobile menu + brand + desktop nav */}
                <div className='flex items-center gap-2 md:gap-4'>
                    {isMobile && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant='ghost' size='icon' aria-label='Open admin menu'>
                                    <Menu className='h-5 w-5' />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side='left' className='p-0'>
                                <SheetHeader className='px-4 pt-4'>
                                    <SheetTitle className='text-primary text-lg'>{t('nav.adminPortal')}</SheetTitle>
                                </SheetHeader>
                                <div className='mt-4 grid gap-1 px-2'>
                                    {adminNavItems.map(item => {
                                        const Icon = item.icon;
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
                                                    <Icon className='h-4 w-4 text-current' />
                                                    <span>{item.label}</span>
                                                </NavLink>
                                            </SheetClose>
                                        );
                                    })}
                                </div>
                                <div className='mt-4 border-t px-2 pt-3'>
                                    <SheetClose asChild>
                                        <Link
                                            to={`/${ROUTES.FOODS.LIST}`}
                                            className='flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary'
                                        >
                                            <span>{t('nav.backToStore')}</span>
                                        </Link>
                                    </SheetClose>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}

                    <Link to={ROUTES.HOME} className='cursor-pointer'>
                        <h1 className='text-lg md:text-2xl font-semibold text-primary tracking-tight hover:opacity-80 transition-opacity'>
                            {t('nav.adminPortal')}
                        </h1>
                    </Link>

                    <nav className='hidden items-center gap-2 md:flex'>
                        {adminNavItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
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
                                    <Icon className='h-4 w-4 text-current' />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* Right side - Theme Toggle & User Avatar */}
                <div className='flex items-center gap-2 md:gap-4'>
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
                                    <Link to={`/${ROUTES.SETTINGS.PROFILE}`}>
                                        <Settings className='h-4 w-4' />
                                        <span>{t('nav.setting')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={`/${ROUTES.FOODS.LIST}`}>
                                        <span>{t('nav.backToStore')}</span>
                                    </Link>
                                </DropdownMenuItem>
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

export default memo(AdminLayoutToolbar);
