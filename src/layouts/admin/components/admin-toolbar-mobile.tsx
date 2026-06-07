import { LogIn, LogOut, Menu, Moon, Package, Sun, Tags, UtensilsCrossed, Users } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { cn, getDisplayName, getInitials } from '@/app/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Separator } from '@/components/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet';
import { useTheme } from '@/core/contexts/theme.context';
import { UserProfileViewModel } from '@/features/user/models';

interface AdminToolbarMobileProps {
    user: UserProfileViewModel | null;
    onLogout: () => void;
}

function AdminToolbarMobile({ user, onLogout }: AdminToolbarMobileProps) {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'A';

    const isDark = theme === 'dark';

    const handleThemeToggle = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    const handleLogout = useCallback(() => {
        setMobileSheetOpen(false);
        onLogout();
    }, [onLogout]);

    const navItems = useMemo(
        () => [
            { label: t('nav.orders'), path: `/${ROUTES.ADMIN.ORDERS}`, icon: Package },
            { label: t('nav.foods'), path: `/${ROUTES.ADMIN.FOODS}`, icon: UtensilsCrossed },
            { label: t('admin.categories.title'), path: `/${ROUTES.ADMIN.CATEGORIES}`, icon: Tags },
            { label: t('admin.users.title'), path: `/${ROUTES.ADMIN.USERS}`, icon: Users },
        ],
        [t]
    );

    return (
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            {/* Sheet content — nav drawer from left */}
            <SheetContent side='left' className='w-72 px-0 flex flex-col lg:hidden'>
                <SheetHeader className='px-4 pb-2'>
                    <div className='flex items-center gap-2'>
                        <SheetTitle className='text-primary font-semibold tracking-tight text-lg'>Notism</SheetTitle>
                        <Badge
                            variant='secondary'
                            className='text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0'
                        >
                            Admin
                        </Badge>
                    </div>
                </SheetHeader>

                {user && (
                    <div className='flex items-start gap-3 border-t border-b px-4 py-4 mb-2'>
                        <Avatar className='h-9 w-9 rounded-full shrink-0 mt-0.5'>
                            <AvatarImage src={user.avatarUrl ?? ''} alt={displayName ?? ''} />
                            <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                            <p className='text-sm font-medium truncate'>{displayName}</p>
                            <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                            <p className='mt-0.5 text-xs text-primary font-medium truncate'>{user.role}</p>
                        </div>
                    </div>
                )}

                <nav className='flex flex-col gap-1 px-2'>
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={false}
                            onClick={() => setMobileSheetOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                )
                            }
                        >
                            <item.icon className='h-5 w-5 shrink-0' />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className='mt-auto px-2 pb-4'>
                    <Separator className='mb-4' />
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className='flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors'
                        >
                            <LogOut className='h-5 w-5 shrink-0' />
                            {t('nav.logOut')}
                        </button>
                    ) : (
                        <Button className='w-full gap-2' asChild>
                            <Link to={`/${ROUTES.AUTH.LOGIN}`} onClick={() => setMobileSheetOpen(false)}>
                                <LogIn className='h-4 w-4' />
                                {t('nav.logIn')}
                            </Link>
                        </Button>
                    )}
                </div>
            </SheetContent>

            {/* Fixed bottom bar */}
            <div className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 lg:hidden'>
                {/* Menu / Sheet trigger */}
                <SheetTrigger asChild>
                    <button
                        aria-label='Open admin navigation'
                        className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-foreground transition-colors'
                    >
                        <Menu className='h-6 w-6' />
                        <span className='text-[10px] font-medium'>Nav</span>
                    </button>
                </SheetTrigger>

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
        </Sheet>
    );
}

export default memo(AdminToolbarMobile);
