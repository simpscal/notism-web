import { LayoutDashboard, LogIn, LogOut, Package, Receipt, Settings, Store, UtensilsCrossed } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { getDisplayName, getInitials } from '@/app/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Badge } from '@/components/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { NotificationStatus } from '@/core/hooks';
import LiveFeedPill from '@/features/order/components/live-feed-pill';

interface AdminToolbarMobileTopProps {
    liveFeedStatus: NotificationStatus;
}

interface AdminToolbarMobileBottomProps {
    user: UserProfileModel | null;
    onLogout: () => void;
}

// Floating top strip — brand + Admin badge and the portal-wide live new-order
// feed pill, kept visible on every route. A detached rounded bar (no flat
// edge-pinned strip); the nav itself lives in the bottom bar.
function AdminToolbarMobileTop({ liveFeedStatus }: AdminToolbarMobileTopProps) {
    return (
        <header className='z-30 flex h-14 shrink-0 items-center justify-between rounded-full border border-border bg-card px-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] lg:hidden'>
            <div className='flex items-center gap-2'>
                <Link to={`/${ROUTES.HOME}`} className='text-base font-semibold tracking-tight text-primary'>
                    Notism
                </Link>
                <Badge variant='secondary' className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'>
                    Admin
                </Badge>
            </div>
            <LiveFeedPill status={liveFeedStatus} />
        </header>
    );
}

// Floating bottom nav bar — the first four icon+label nav shortcuts plus the
// account affordance, pinned within thumb reach. A detached rounded bar; the
// active shortcut is a real navigation selection (aria-current) promoted to the
// ink accent. No order sidebar.
function AdminToolbarMobileBottom({ user, onLogout }: AdminToolbarMobileBottomProps) {
    const { t } = useTranslation();

    const displayName = user ? getDisplayName(user) : null;
    const initials = user ? getInitials(user) : 'A';

    const navItems = useMemo(
        () => [
            { label: t('nav.dashboard'), path: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
            { label: t('nav.orders'), path: ROUTES.ADMIN.ORDERS, icon: Package },
            { label: t('nav.refunds'), path: ROUTES.ADMIN.REFUNDS, icon: Receipt },
            { label: t('nav.foods'), path: ROUTES.ADMIN.FOODS, icon: UtensilsCrossed },
        ],
        [t]
    );

    return (
        <div className='z-30 flex h-16 shrink-0 items-center justify-around rounded-full border border-border bg-card px-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)] lg:hidden'>
            {navItems.map(item => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.path}
                        to={`/${item.path}`}
                        end={false}
                        aria-label={item.label}
                        className='group flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-2 text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground'
                    >
                        <span className='flex size-8 items-center justify-center rounded-full transition-colors group-aria-[current=page]:bg-selected group-aria-[current=page]:text-selected-foreground'>
                            <Icon className='size-5' aria-hidden />
                        </span>
                        <span className='text-[10px] font-medium'>{item.label}</span>
                    </NavLink>
                );
            })}

            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            aria-label='Admin user menu'
                            className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-2'
                        >
                            <Avatar className='size-8'>
                                <AvatarImage src={user.avatarUrl ?? ''} alt={displayName ?? ''} />
                                <AvatarFallback className='bg-selected text-[10px] font-semibold text-selected-foreground'>
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className='max-w-[52px] truncate text-[10px] font-medium text-muted-foreground'>
                                {user.firstName || displayName?.split(' ')[0]}
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-60'>
                        <DropdownMenuLabel className='font-normal'>
                            <p className='truncate text-sm font-medium'>{displayName}</p>
                            <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
                            <p className='mt-0.5 truncate text-xs font-medium text-primary'>{user.role}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to={`/${ROUTES.SETTINGS.PROFILE}`}>
                                <Settings className='mr-2 size-4' />
                                {t('nav.setting')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={`/${ROUTES.FOODS.LIST}`}>
                                <Store className='mr-2 size-4' />
                                {t('nav.backToStore')}
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
                    className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-2 text-muted-foreground transition-colors hover:text-foreground'
                >
                    <LogIn className='size-5' />
                    <span className='text-[10px] font-medium'>{t('nav.logIn')}</span>
                </Link>
            )}
        </div>
    );
}

const MemoizedAdminToolbarMobileTop = memo(AdminToolbarMobileTop);
const MemoizedAdminToolbarMobileBottom = memo(AdminToolbarMobileBottom);

export {
    MemoizedAdminToolbarMobileTop as AdminToolbarMobileTop,
    MemoizedAdminToolbarMobileBottom as AdminToolbarMobileBottom,
};
