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
import { UserProfileViewModel } from '@/features/user/models';

interface ClientLayoutToolbarProps {
    user: UserProfileViewModel | null;
    onLogout: () => void;
    onSettingsClick: () => void;
}

function ClientLayoutToolbar({ user, onLogout, onSettingsClick }: ClientLayoutToolbarProps) {
    const getUserInitials = () => {
        if (!user) return 'U';
        const firstInitial = user.firstName?.[0] || '';
        const lastInitial = user.lastName?.[0] || '';
        return (firstInitial + lastInitial).toUpperCase() || 'U';
    };

    return (
        <header className='border-b bg-background sticky top-0 z-50'>
            <div className='flex h-16 items-center justify-between px-4 md:px-6'>
                {/* Logo/Brand - Left */}
                <h1 className='text-2xl font-semibold text-primary tracking-tight'>Brand Name</h1>

                {/* Right side - User Avatar or Login/Signup */}
                <div className='flex items-center gap-4'>
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
                                    <Link to={`/${ROUTES.PROFILE}`}>Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onSettingsClick}>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Button variant='ghost' asChild>
                                <Link to={`/${ROUTES.AUTH.LOGIN}`}>Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link to={`/${ROUTES.AUTH.SIGNUP}`}>Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default ClientLayoutToolbar;
