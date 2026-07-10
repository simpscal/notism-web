import { LogIn, LogOut, Settings, ShoppingCart, User } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { getDisplayName, getInitials } from '@/app/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { NavBar, NavBarActions, NavBarBrand } from '@/components/nav-bar';
import { useAppSelector } from '@/core/hooks';
import { selectCartTotalItems } from '@/store/cart';

interface ClientToolbarMobileProps {
    user: UserProfileModel | null;
    onLogout: () => void;
}

// Condensed mobile toolbar: the same floating NavBar (fixed bottom bar), narrowed
// to the brand, the account affordance, and a brand crimson cart button that
// navigates to the /cart page and carries a running item-count badge.
function ClientToolbarMobile({ user, onLogout }: ClientToolbarMobileProps) {
    const { t } = useTranslation();
    const cartItemCount = useAppSelector(selectCartTotalItems);

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'U';

    return (
        <NavBar className='shrink-0 lg:hidden'>
            <NavBarBrand>
                <Link to={`/${ROUTES.FOODS.LIST}`} className='pl-1 text-lg font-extrabold tracking-tight text-primary'>
                    Notism
                </Link>
            </NavBarBrand>

            <NavBarActions>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button aria-label='User menu' className='rounded-full transition-colors hover:bg-accent'>
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
                    <Link
                        to={`/${ROUTES.AUTH.LOGIN}`}
                        aria-label={t('nav.logIn')}
                        className='flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                    >
                        <LogIn className='size-5' />
                    </Link>
                )}

                <Link
                    to={`/${ROUTES.CART}`}
                    aria-label={`Cart, ${cartItemCount} items`}
                    className='inline-flex h-10 items-center gap-2 rounded-full bg-primary px-3.5 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
                >
                    <span className='relative'>
                        <ShoppingCart className='size-5' aria-hidden />
                        {cartItemCount > 0 && (
                            <span className='absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary'>
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </span>
                    <span className='text-sm font-semibold'>{t('nav.cart')}</span>
                </Link>
            </NavBarActions>
        </NavBar>
    );
}

export default memo(ClientToolbarMobile);
