import { Palette, User } from 'lucide-react';
import { memo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { SettingsSidebar } from './components';

import { ROUTES } from '@/app/constants';
import { SidebarInset, SidebarProvider } from '@/components/sidebar';

type SettingsTab = 'profile' | 'appearance';

const SETTINGS_TABS: { value: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'profile', label: 'Profile', icon: User },
    { value: 'appearance', label: 'Appearance', icon: Palette },
];

function Settings() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = (location.pathname.split('/').pop() || 'profile') as SettingsTab;

    const handleTabChange = (tab: string) => {
        navigate(`/${ROUTES.SETTINGS.BASE}/${tab}`);
    };

    return (
        <SidebarProvider className='h-full' defaultOpen={true}>
            <SettingsSidebar tabs={SETTINGS_TABS} currentTab={currentTab} onTabChange={handleTabChange} />
            <SidebarInset className='h-full'>
                <div className='container mx-auto py-8 px-4 max-w-7xl h-full overflow-auto'>
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default memo(Settings);
