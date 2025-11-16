import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/configs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserProfileVM } from '@/features/user/models';

interface DefaultLayoutToolbarProps {
    user: UserProfileVM | null;
    onLogout: () => void;
    onSettingsClick: () => void;
}

function DefaultLayoutToolbar({ user, onLogout, onSettingsClick }: DefaultLayoutToolbarProps) {
    const getUserInitials = () => {
        if (!user) return 'U';
        const firstInitial = user.firstName?.[0] || '';
        const lastInitial = user.lastName?.[0] || '';
        return (firstInitial + lastInitial).toUpperCase() || 'U';
    };

    return (
        <header className='border-b bg-background sticky top-0 z-50'>
            <div className='flex h-16 items-center justify-between px-4 md:px-6'>
                {/* Logo/Brand */}
                <div className='flex items-center gap-2'>
                    <h1 className='text-xl font-bold'>Notism</h1>
                </div>

                {/* Right side - User Avatar */}
                <div className='flex items-center gap-4'>
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
                                <Link to={`/${ROUTES.profile}`}>Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onSettingsClick}>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

export default DefaultLayoutToolbar;
