import { CreditCard, Palette, User } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Card } from '@/components/card';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/sidebar';

type SettingsSectionId = 'profile' | 'appearance' | 'payment';

interface SettingsSection {
    id: SettingsSectionId;
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

function Settings() {
    const { t } = useTranslation();
    const location = useLocation();

    const sections: SettingsSection[] = useMemo(
        () => [
            { id: 'profile', to: `/${ROUTES.SETTINGS.PROFILE}`, label: t('settings.tabs.profile'), icon: User },
            {
                id: 'appearance',
                to: `/${ROUTES.SETTINGS.APPEARANCE}`,
                label: t('settings.tabs.appearance'),
                icon: Palette,
            },
            {
                id: 'payment',
                to: `/${ROUTES.SETTINGS.PAYMENT}`,
                label: t('settings.tabs.payment'),
                icon: CreditCard,
            },
        ],
        [t]
    );

    const activeSection = useMemo(
        () => sections.find(section => location.pathname.startsWith(section.to)),
        [sections, location.pathname]
    );

    return (
        <div className='container mx-auto max-w-5xl py-8 px-4'>
            <Card className='overflow-hidden p-0'>
                <SidebarProvider
                    defaultOpen
                    className='min-h-0 items-stretch'
                    style={{ '--sidebar-width': '15rem' } as React.CSSProperties}
                >
                    <Sidebar collapsible='offcanvas' variant='sidebar' className='border-r'>
                        <SidebarHeader className='px-3 pt-3'>
                            <span className='px-1 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/70'>
                                {t('settings.nav.title')}
                            </span>
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel>{t('settings.nav.sectionsLabel')}</SidebarGroupLabel>
                                <SidebarMenu>
                                    {sections.map(section => {
                                        const Icon = section.icon;
                                        const isActive = activeSection?.id === section.id;

                                        return (
                                            <SidebarMenuItem key={section.id}>
                                                <SidebarMenuButton asChild isActive={isActive} tooltip={section.label}>
                                                    <NavLink
                                                        to={section.to}
                                                        aria-current={isActive ? 'page' : undefined}
                                                    >
                                                        <Icon />
                                                        <span>{section.label}</span>
                                                    </NavLink>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>

                    <SidebarInset className='min-w-0 bg-background'>
                        <div className='flex items-center gap-2 border-b px-4 py-3 md:hidden'>
                            <SidebarTrigger aria-label='Open settings sections' />
                            <span className='text-sm font-medium'>{activeSection?.label}</span>
                        </div>
                        <Outlet />
                    </SidebarInset>
                </SidebarProvider>
            </Card>
        </div>
    );
}

export default memo(Settings);
