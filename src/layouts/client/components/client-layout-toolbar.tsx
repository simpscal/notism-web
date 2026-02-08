import { LogOut, Package, Settings, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
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
import { SidebarTrigger } from '@/components/sidebar';
import { useAppSelector, useIsMobile } from '@/core/hooks';
import { UserProfileViewModel } from '@/features/user/models';
import { selectCartTotalItems } from '@/store/cart';

interface ClientLayoutToolbarProps {
    user: UserProfileViewModel | null;
    onLogout: () => void;
}

function ClientLayoutToolbar({ user, onLogout }: ClientLayoutToolbarProps) {
    const cartItemCount = useAppSelector(selectCartTotalItems);
    const isMobile = useIsMobile();

    const getUserInitials = () => {
        if (!user) return 'U';
        const firstInitial = user.firstName?.[0] || '';
        const lastInitial = user.lastName?.[0] || '';
        return (firstInitial + lastInitial).toUpperCase() || 'U';
    };

    return (
        <header className='border-b bg-background sticky top-0 z-50'>
            <div className='flex h-16 items-center justify-between px-4 md:px-6'>
                {/* Left side - Menu button (mobile only) & Logo */}
                <div className='flex items-center gap-4'>
                    {isMobile && <SidebarTrigger />}
                    <Link to={ROUTES.HOME} className='cursor-pointer'>
                        <h1 className='text-2xl font-semibold text-primary tracking-tight hover:opacity-80 transition-opacity'>
                            Brand Name
                        </h1>
                    </Link>
                </div>

                {/* Right side - Cart & User Avatar or Login/Signup */}
                <div className='flex items-center gap-4'>
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
                                <DropdownMenuItem asChild>
                                    <Link to={`/${ROUTES.ORDERS.LIST}`}>
                                        <Package className='h-4 w-4' />
                                        <span>My Orders</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to={`/${ROUTES.SETTINGS.PROFILE}`}>
                                        <Settings className='h-4 w-4' />
                                        <span>Setting</span>
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
