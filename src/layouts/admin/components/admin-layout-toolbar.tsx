import { LogOut, Moon, Monitor, Settings, Sun } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
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
import { SidebarTrigger } from '@/components/sidebar';
import { useTheme } from '@/core/contexts/theme.context';
import { useIsMobile } from '@/core/hooks';
import { UserProfileViewModel } from '@/features/user/models';

interface AdminLayoutToolbarProps {
    user: UserProfileViewModel | null;
    onLogout: () => void;
}

function AdminLayoutToolbar({ user, onLogout }: AdminLayoutToolbarProps) {
    const isMobile = useIsMobile();
    const { theme, setTheme } = useTheme();

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
                {/* Left side - Menu button & Logo */}
                <div className='flex items-center gap-2 md:gap-4'>
                    <SidebarTrigger />
                    <Link to={ROUTES.HOME} className='cursor-pointer'>
                        <h1 className='text-lg md:text-2xl font-semibold text-primary tracking-tight hover:opacity-80 transition-opacity'>
                            Admin Portal
                        </h1>
                    </Link>
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
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={`/${ROUTES.FOODS.LIST}`}>
                                        <span>Back to Store</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout}>
                                    <LogOut className='h-4 w-4' />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button size={isMobile ? 'sm' : 'default'} asChild>
                            <Link to={`/${ROUTES.AUTH.LOGIN}`}>Log in</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default memo(AdminLayoutToolbar);
