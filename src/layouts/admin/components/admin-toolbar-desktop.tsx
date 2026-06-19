import { LogIn, LogOut, Moon, Settings, Store, Sun } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { cn, getDisplayName, getInitials } from '@/app/utils';
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
import { useTheme } from '@/core/contexts/theme.context';

interface AdminToolbarDesktopProps {
    user: UserProfileModel | null;
    onLogout: () => void;
}

function AdminToolbarDesktop({ user, onLogout }: AdminToolbarDesktopProps) {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'A';

    const isDark = theme === 'dark';

    const handleThemeToggle = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    const navItems = [
        { label: t('nav.dashboard'), path: `/${ROUTES.ADMIN.DASHBOARD}` },
        { label: t('nav.orders'), path: `/${ROUTES.ADMIN.ORDERS}` },
        { label: t('nav.refunds'), path: `/${ROUTES.ADMIN.REFUNDS}` },
        { label: t('nav.foods'), path: `/${ROUTES.ADMIN.FOODS}` },
        { label: t('admin.categories.title'), path: `/${ROUTES.ADMIN.CATEGORIES}` },
        { label: t('admin.users.title'), path: `/${ROUTES.ADMIN.USERS}` },
    ];

    return (
        <header className='sticky top-0 z-50 hidden h-16 w-full border-b bg-background lg:flex'>
            <div className='mx-auto flex h-full w-full max-w-7xl items-center px-6'>
                {/* Left — brand */}
                <div className='flex flex-1 items-center gap-2'>
                    <Link
                        to={`/${ROUTES.HOME}`}
                        className='text-primary font-semibold tracking-tight text-lg hover:opacity-80 transition-opacity'
                    >
                        Notism
                    </Link>
                    <Badge
                        variant='secondary'
                        className='text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0'
                    >
                        Admin
                    </Badge>
                </div>

                {/* Center — nav links */}
                <nav className='flex items-center gap-1'>
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={false}
                            className={({ isActive }) =>
                                cn(
                                    'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right — controls */}
                <div className='flex flex-1 items-center justify-end gap-2'>
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
                                    aria-label='Admin user menu'
                                    className='flex items-center gap-2 rounded-full px-2 py-1 hover:bg-accent/50 transition-colors'
                                >
                                    <Avatar className='h-9 w-9 rounded-full'>
                                        <AvatarImage src={user.avatarUrl ?? ''} alt={displayName ?? ''} />
                                        <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='hidden lg:block text-left min-w-0 max-w-[160px]'>
                                        <p className='text-sm font-medium truncate leading-none mb-0.5'>
                                            {displayName}
                                        </p>
                                        <p className='text-[10px] text-muted-foreground truncate leading-none'>
                                            {user.role}
                                        </p>
                                    </div>
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
                        <Button size='sm' asChild>
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

export default memo(AdminToolbarDesktop);
