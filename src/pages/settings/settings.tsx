import { Palette, User } from 'lucide-react';
import { memo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { buttonVariants } from '@/components/button';

type SettingsTab = 'profile' | 'appearance';

const SETTINGS_TABS: { value: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'profile', label: 'Profile', icon: User },
    { value: 'appearance', label: 'Appearance', icon: Palette },
];

function Settings() {
    return (
        <div className='container mx-auto max-w-7xl py-8 px-4'>
            <div className='mb-6'>
                <div className='flex flex-wrap gap-2'>
                    {SETTINGS_TABS.map(tab => {
                        const Icon = tab.icon;

                        return (
                            <NavLink
                                key={tab.value}
                                to={`/${ROUTES.SETTINGS.BASE}/${tab.value}`}
                                end={false}
                                className={({ isActive }) =>
                                    buttonVariants({
                                        variant: isActive ? 'default' : 'outline',
                                        size: 'sm',
                                    })
                                }
                            >
                                <Icon className='h-4 w-4' />
                                {tab.label}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            <Outlet />
        </div>
    );
}

export default memo(Settings);
