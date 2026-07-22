import type { Meta, StoryObj } from '@storybook/react-vite';
import { Camera, CreditCard, Mail, MapPin, Palette, Phone, RefreshCw, Trash2, Upload, User } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/uis/avatar';
import { Button } from '@/uis/button';
import { Card } from '@/uis/card';
import ErrorState from '@/uis/error-state';
import { Field, FieldError, FieldLabel } from '@/uis/field';
import { Input } from '@/uis/input';
import { Label } from '@/uis/label';
import { RadioGroup, RadioGroupItem } from '@/uis/radio-group';
import { Separator } from '@/uis/separator';
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
} from '@/uis/sidebar';
import { Skeleton } from '@/uis/skeleton';
import { Toaster } from '@/uis/sonner';

// ---------------------------------------------------------------------------
// Settings — Sprint 4 (Settings UI polish & layout redesign — REVISION 2)
//
// Surface route family: /settings/{profile,appearance,payment}
// Stories 207 (two-pane layout + section nav + role gating),
// 208 (profile polish), 209 (appearance polish), 210 (admin payment polish).
//
// Flow is preserved from the current system: same routes, same section
// switching, same form CTAs. Only the layout + section UI is redesigned.
//
// Layout: modern two-pane settings panel built on the inventory Sidebar
// system. The whole settings area is one elevated Card. Inside it a scoped
// SidebarProvider drives a persistent left section-nav (desktop) that becomes
// the component's built-in mobile Sheet (opened via SidebarTrigger) — no
// separate Select, no horizontal overflow. The right pane is a SidebarInset
// that swaps section content. Active section uses SidebarMenuButton isActive
// and carries aria-current='page'.
//
// Save confirmation uses the live sonner toast pattern: toast.success(...).
// Validation errors stay inline beneath the field. Everything composes ONLY
// inventory components from src/uis/.
// ---------------------------------------------------------------------------

type SectionId = 'profile' | 'appearance' | 'payment';

interface NavSection {
    id: SectionId;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    adminOnly?: boolean;
}

const SECTIONS: NavSection[] = [
    { id: 'profile', label: 'Profile', description: 'Personal information', icon: User },
    { id: 'appearance', label: 'Appearance', description: 'Theme & display', icon: Palette },
    { id: 'payment', label: 'Payment', description: 'Bank account', icon: CreditCard, adminOnly: true },
];

function visibleSections(isAdmin: boolean) {
    return SECTIONS.filter(s => !s.adminOnly || isAdmin);
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    avatarUrl: string | null;
}

const PROFILE: ProfileData = {
    firstName: 'Mai',
    lastName: 'Nguyen',
    email: 'mai.nguyen@example.com',
    phone: '+84 90 123 4567',
    location: 'Ho Chi Minh City, Vietnam',
    avatarUrl: null,
};

interface BankAccount {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}

const BANK_ACCOUNT: BankAccount = {
    bankCode: 'Vietcombank',
    accountNumber: '0123456789',
    accountHolderName: 'NGUYEN VAN A',
};

function getInitials(first: string, last: string) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || 'U';
}

// ---------------------------------------------------------------------------
// Page shell — sticky nav placeholder + settings layout
// ---------------------------------------------------------------------------

function NavPlaceholder() {
    return (
        <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
            <div className='h-px w-6 bg-muted-foreground/30' />
            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                nav placeholder
            </span>
            <div className='h-px w-6 bg-muted-foreground/30' />
        </div>
    );
}

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-muted/30' style={{ height: '100vh', overflowY: 'auto' }}>
            <NavPlaceholder />
            <div className='container mx-auto max-w-5xl px-4 py-8 sm:py-10'>{children}</div>
            {/* Toast outlet — save confirmations render here (sonner, bottom-right) */}
            <Toaster />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Section navigation — inventory Sidebar, scoped to the settings panel.
//
// collapsible='none' on the desktop column is NOT used because we want the
// component's built-in mobile Sheet. Instead the panel runs a scoped
// SidebarProvider with collapsible='offcanvas': on desktop the sidebar reads
// as a persistent left column; on mobile it collapses to the built-in Sheet
// opened by SidebarTrigger. variant='sidebar' keeps it flush inside the card.
// ---------------------------------------------------------------------------

function SettingsSidebarNav({ active, isAdmin }: { active: SectionId; isAdmin: boolean }) {
    const sections = visibleSections(isAdmin);

    return (
        <Sidebar collapsible='offcanvas' variant='sidebar' className='border-r'>
            <SidebarHeader className='px-3 pt-3'>
                <span className='px-1 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/70'>
                    Settings
                </span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Sections</SidebarGroupLabel>
                    <SidebarMenu>
                        {sections.map(section => {
                            const Icon = section.icon;
                            const isActive = section.id === active;

                            return (
                                <SidebarMenuItem key={section.id}>
                                    <SidebarMenuButton asChild isActive={isActive} tooltip={section.label}>
                                        <a href={`#${section.id}`} aria-current={isActive ? 'page' : undefined}>
                                            <Icon />
                                            <span>{section.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

// ---------------------------------------------------------------------------
// Shared section header (right pane)
// ---------------------------------------------------------------------------

function PaneHeading({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className='space-y-1'>
            <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>
            {subtitle && <p className='text-sm text-muted-foreground'>{subtitle}</p>}
        </div>
    );
}

function PaneFooter({ children }: { children: React.ReactNode }) {
    return <div className='flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4'>{children}</div>;
}

// ---------------------------------------------------------------------------
// Profile section (story 208)
// ---------------------------------------------------------------------------

interface ProfileSectionProps {
    data: ProfileData;
    showError?: boolean;
}

function ProfileSection({ data, showError = false }: ProfileSectionProps) {
    const hasAvatar = data.avatarUrl !== null;

    return (
        <div className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                <PaneHeading title='Profile' subtitle='Manage your account information and preferences.' />

                {/* Avatar group */}
                <div className='flex flex-col items-start gap-5 sm:flex-row sm:items-center'>
                    <div className='relative'>
                        <Avatar className='h-20 w-20 border border-border shadow-sm'>
                            <AvatarImage src={data.avatarUrl ?? undefined} alt={`${data.firstName} ${data.lastName}`} />
                            <AvatarFallback className='bg-primary/10 text-lg font-semibold text-primary'>
                                {getInitials(data.firstName, data.lastName)}
                            </AvatarFallback>
                        </Avatar>
                        <span className='absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow'>
                            <Camera className='h-3 w-3' />
                        </span>
                    </div>

                    <div className='flex-1 space-y-2.5'>
                        <div>
                            <h3 className='text-sm font-medium'>Profile photo</h3>
                            <p className='mt-0.5 text-xs text-muted-foreground'>JPG, PNG or GIF. Max size 5MB.</p>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <Button type='button' variant='outline' size='sm'>
                                <Upload className='h-4 w-4' />
                                {hasAvatar ? 'Change' : 'Upload'}
                            </Button>
                            {hasAvatar && (
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    className='text-destructive hover:text-destructive'
                                >
                                    <Trash2 className='h-4 w-4' />
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Name group */}
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <Field>
                        <FieldLabel htmlFor='firstName'>First name</FieldLabel>
                        <Input id='firstName' defaultValue={data.firstName} placeholder='Enter your first name' />
                    </Field>
                    <Field data-invalid={showError}>
                        <FieldLabel htmlFor='lastName'>Last name</FieldLabel>
                        <Input
                            id='lastName'
                            defaultValue={showError ? '' : data.lastName}
                            placeholder='Enter your last name'
                            aria-invalid={showError}
                        />
                        {showError && <FieldError>Last name is required</FieldError>}
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor='email' className='flex items-center gap-2'>
                        <Mail className='h-4 w-4' />
                        Email
                    </FieldLabel>
                    <Input
                        id='email'
                        type='email'
                        defaultValue={data.email}
                        disabled
                        className='cursor-not-allowed bg-muted'
                    />
                </Field>

                <Separator />

                {/* Contact group — optional fields */}
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <Field>
                        <FieldLabel htmlFor='phone' className='flex items-center gap-2'>
                            <Phone className='h-4 w-4' />
                            Phone number
                        </FieldLabel>
                        <Input id='phone' type='tel' defaultValue={data.phone} placeholder='+84 90 123 4567' />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='location' className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            Location
                        </FieldLabel>
                        <Input id='location' defaultValue={data.location} placeholder='City, Country' />
                    </Field>
                </div>
            </div>

            <PaneFooter>
                <Button type='button' variant='outline'>
                    Cancel
                </Button>
                <Button type='button' onClick={() => toast.success('Profile updated successfully')}>
                    Save changes
                </Button>
            </PaneFooter>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Appearance section (story 209) — GitHub-style theme previews
//
// Each theme card shows a tiny mockup built from divs (fake window chrome bar
// + a sidebar bar + content bars), tinted to represent the theme. No images.
// ---------------------------------------------------------------------------

type ThemeValue = 'light' | 'dark' | 'system';

/** Light-surface preview mockup (used directly and as the left half of System). */
function LightPreview() {
    return (
        <div className='flex h-full w-full flex-col bg-[#ffffff]'>
            {/* window chrome bar */}
            <div className='flex h-3 items-center gap-1 border-b border-[#e5e7eb] bg-[#f3f4f6] px-1.5'>
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
            </div>
            {/* body: sidebar + content */}
            <div className='flex flex-1'>
                <div className='flex w-1/3 flex-col gap-1 bg-[#f3f4f6] p-1.5'>
                    <span className='h-1 w-full rounded-full bg-[#cbd5e1]' />
                    <span className='h-1 w-2/3 rounded-full bg-[#cbd5e1]' />
                    <span className='h-1 w-3/4 rounded-full bg-[#cbd5e1]' />
                </div>
                <div className='flex flex-1 flex-col gap-1 p-1.5'>
                    <span className='h-1 w-3/4 rounded-full bg-[#94a3b8]' />
                    <span className='h-1 w-full rounded-full bg-[#cbd5e1]' />
                    <span className='h-1 w-1/2 rounded-full bg-[#cbd5e1]' />
                </div>
            </div>
        </div>
    );
}

/** Dark-surface preview mockup (used directly and as the right half of System). */
function DarkPreview() {
    return (
        <div className='flex h-full w-full flex-col bg-[#0d1117]'>
            {/* window chrome bar */}
            <div className='flex h-3 items-center gap-1 border-b border-[#30363d] bg-[#161b22] px-1.5'>
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
            </div>
            {/* body: sidebar + content */}
            <div className='flex flex-1'>
                <div className='flex w-1/3 flex-col gap-1 bg-[#161b22] p-1.5'>
                    <span className='h-1 w-full rounded-full bg-[#30363d]' />
                    <span className='h-1 w-2/3 rounded-full bg-[#30363d]' />
                    <span className='h-1 w-3/4 rounded-full bg-[#30363d]' />
                </div>
                <div className='flex flex-1 flex-col gap-1 p-1.5'>
                    <span className='h-1 w-3/4 rounded-full bg-[#8b949e]' />
                    <span className='h-1 w-full rounded-full bg-[#30363d]' />
                    <span className='h-1 w-1/2 rounded-full bg-[#30363d]' />
                </div>
            </div>
        </div>
    );
}

/** System preview — diagonal split showing both light and dark halves. */
function SystemPreview() {
    return (
        <div className='relative h-full w-full overflow-hidden'>
            {/* full dark base */}
            <div className='absolute inset-0'>
                <DarkPreview />
            </div>
            {/* light half clipped on the diagonal */}
            <div className='absolute inset-0' style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
                <LightPreview />
            </div>
            {/* diagonal seam */}
            <div
                className='pointer-events-none absolute inset-0'
                aria-hidden
                style={{
                    background:
                        'linear-gradient(to top right, transparent calc(50% - 0.5px), rgba(120,120,120,0.6) 50%, transparent calc(50% + 0.5px))',
                }}
            />
        </div>
    );
}

const THEME_OPTIONS: {
    value: ThemeValue;
    label: string;
    description: string;
    Preview: React.ComponentType;
}[] = [
    { value: 'light', label: 'Light', description: 'Bright, high-contrast', Preview: LightPreview },
    { value: 'dark', label: 'Dark', description: 'Dimmed, easy on the eyes', Preview: DarkPreview },
    { value: 'system', label: 'System', description: 'Match your OS theme', Preview: SystemPreview },
];

function AppearanceSection({ current = 'system' }: { current?: ThemeValue }) {
    const [theme, setTheme] = useState<ThemeValue>(current);

    return (
        <div className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                <PaneHeading title='Appearance' subtitle='Customize how the application looks on this device.' />

                <fieldset className='space-y-3'>
                    <legend className='text-sm font-medium'>Theme</legend>
                    <p className='text-xs text-muted-foreground'>
                        Currently applied: <span className='font-medium capitalize text-foreground'>{theme}</span>
                    </p>
                    <RadioGroup
                        value={theme}
                        onValueChange={value => setTheme(value as ThemeValue)}
                        className='grid grid-cols-1 gap-3 sm:grid-cols-3'
                    >
                        {THEME_OPTIONS.map(option => {
                            const Preview = option.Preview;
                            const isSelected = theme === option.value;

                            return (
                                <Label
                                    key={option.value}
                                    htmlFor={`theme-${option.value}`}
                                    className={
                                        'flex cursor-pointer flex-col gap-3 rounded-lg border p-3 transition-colors ' +
                                        (isSelected
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-border hover:bg-accent')
                                    }
                                >
                                    {/* GitHub-style visual theme preview */}
                                    <div
                                        className={
                                            'aspect-[4/3] w-full overflow-hidden rounded-md border ' +
                                            (isSelected ? 'border-primary/40' : 'border-border')
                                        }
                                        aria-hidden
                                    >
                                        <Preview />
                                    </div>
                                    <div className='flex items-center justify-between gap-2'>
                                        <div className='min-w-0'>
                                            <span className='block text-sm font-medium text-foreground'>
                                                {option.label}
                                            </span>
                                            <p className='mt-0.5 truncate text-xs font-normal text-muted-foreground'>
                                                {option.description}
                                            </p>
                                        </div>
                                        <RadioGroupItem
                                            value={option.value}
                                            id={`theme-${option.value}`}
                                            className='shrink-0'
                                        />
                                    </div>
                                </Label>
                            );
                        })}
                    </RadioGroup>
                </fieldset>
            </div>

            <PaneFooter>
                <Button type='button' onClick={() => toast.success('Appearance preferences saved')}>
                    Save changes
                </Button>
            </PaneFooter>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Payment section (story 210) — admin only
// ---------------------------------------------------------------------------

type PaymentState = 'default' | 'loading' | 'error';

function PaymentSection({ state = 'default' }: { state?: PaymentState }) {
    if (state === 'loading') {
        return (
            <div className='flex flex-col'>
                <div className='space-y-6 px-6 py-6'>
                    <div className='space-y-1'>
                        <Skeleton className='h-6 w-28' />
                        <Skeleton className='h-4 w-72' />
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className='space-y-2'>
                            <Skeleton className='h-4 w-32' />
                            <Skeleton className='h-9 w-full rounded-md' />
                        </div>
                    ))}
                </div>
                <PaneFooter>
                    <Skeleton className='h-9 w-20 rounded-md' />
                    <Skeleton className='h-9 w-28 rounded-md' />
                </PaneFooter>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className='px-6 py-10'>
                <ErrorState
                    title='Failed to load bank account'
                    description='An error occurred while loading your bank account details. Please try again.'
                    iconSize='sm'
                    action={
                        <Button variant='outline'>
                            <RefreshCw className='h-4 w-4' />
                            Retry
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                <PaneHeading
                    title='Payment'
                    subtitle='Configure your bank details to enable QR code payments for orders.'
                />

                <Field>
                    <FieldLabel htmlFor='bankCode'>Bank name</FieldLabel>
                    <Input id='bankCode' defaultValue={BANK_ACCOUNT.bankCode} placeholder='e.g. Vietcombank' />
                </Field>
                <Field>
                    <FieldLabel htmlFor='accountNumber'>Account number</FieldLabel>
                    <Input id='accountNumber' defaultValue={BANK_ACCOUNT.accountNumber} placeholder='e.g. 1234567890' />
                </Field>
                <Field>
                    <FieldLabel htmlFor='accountHolderName'>Account holder name</FieldLabel>
                    <Input
                        id='accountHolderName'
                        defaultValue={BANK_ACCOUNT.accountHolderName}
                        placeholder='e.g. Nguyen Van A'
                    />
                </Field>
            </div>

            <PaneFooter>
                <Button type='button' variant='outline'>
                    Cancel
                </Button>
                <Button type='button' onClick={() => toast.success('Bank account saved successfully')}>
                    Save changes
                </Button>
            </PaneFooter>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Two-pane settings panel — one elevated card: inventory Sidebar + inset pane.
//
// A scoped SidebarProvider (defaultOpen, no global app shell) drives the
// section nav. SidebarInset hosts the right content pane. The SidebarTrigger
// lives in the pane's mobile bar and opens the component's built-in Sheet on
// small screens — replacing the old hand-built Select.
// ---------------------------------------------------------------------------

interface SettingsPanelProps {
    active: SectionId;
    isAdmin: boolean;
    activeLabel: string;
    children: React.ReactNode;
}

function SettingsPanel({ active, isAdmin, activeLabel, children }: SettingsPanelProps) {
    return (
        <div>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold tracking-tight'>Settings</h1>
                <p className='mt-1 text-sm text-muted-foreground'>
                    Manage your profile, appearance, and account preferences.
                </p>
            </div>

            <Card className='overflow-hidden p-0'>
                <SidebarProvider
                    defaultOpen
                    className='min-h-0 items-stretch'
                    style={{ '--sidebar-width': '15rem' } as React.CSSProperties}
                >
                    <SettingsSidebarNav active={active} isAdmin={isAdmin} />

                    <SidebarInset className='min-w-0 bg-background'>
                        {/* Mobile bar — SidebarTrigger opens the built-in Sheet nav */}
                        <div className='flex items-center gap-2 border-b px-4 py-3 md:hidden'>
                            <SidebarTrigger aria-label='Open settings sections' />
                            <span className='text-sm font-medium'>{activeLabel}</span>
                        </div>
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </Card>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 4/Settings',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Story 207 + 208: Profile (default, customer view) ----------------------

export const ProfileDefault: Story = {
    name: 'Profile — Default (customer)',
    render: () => (
        <PageShell>
            <SettingsPanel active='profile' isAdmin={false} activeLabel='Profile'>
                <ProfileSection data={PROFILE} />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 208: Profile validation error (stays inline) ---------------------

export const ProfileValidationError: Story = {
    name: 'Profile — Inline Validation Error',
    render: () => (
        <PageShell>
            <SettingsPanel active='profile' isAdmin={false} activeLabel='Profile'>
                <ProfileSection data={PROFILE} showError />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 208: Profile save success (toast) --------------------------------

export const ProfileSaved: Story = {
    name: 'Profile — Save (toast confirmation)',
    parameters: {
        docs: {
            description: {
                story: 'Click "Save changes" to fire the sonner success toast (bottom-right). Save confirmation is a toast, not an inline banner.',
            },
        },
    },
    render: () => (
        <PageShell>
            <SettingsPanel active='profile' isAdmin={false} activeLabel='Profile'>
                <ProfileSection data={PROFILE} />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 208 edge: empty optional fields, long name, no avatar ------------

export const ProfileEdgeCases: Story = {
    name: 'Profile — Edge (empty optionals, long name)',
    render: () => (
        <PageShell>
            <SettingsPanel active='profile' isAdmin={false} activeLabel='Profile'>
                <ProfileSection
                    data={{
                        firstName: 'Maximilian',
                        lastName: 'Hohenzollern-Sigmaringen',
                        email: 'maximilian.hohenzollern@example.com',
                        phone: '',
                        location: '',
                        avatarUrl: null,
                    }}
                />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 209: Appearance --------------------------------------------------

export const AppearanceDefault: Story = {
    name: 'Appearance — Theme Selection (system selected)',
    render: () => (
        <PageShell>
            <SettingsPanel active='appearance' isAdmin={false} activeLabel='Appearance'>
                <AppearanceSection current='system' />
            </SettingsPanel>
        </PageShell>
    ),
};

export const AppearanceDarkSelected: Story = {
    name: 'Appearance — Dark Selected',
    render: () => (
        <PageShell>
            <SettingsPanel active='appearance' isAdmin={false} activeLabel='Appearance'>
                <AppearanceSection current='dark' />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 210: Admin Payment (default) -------------------------------------

export const PaymentAdminDefault: Story = {
    name: 'Payment — Admin Default',
    render: () => (
        <PageShell>
            <SettingsPanel active='payment' isAdmin activeLabel='Payment'>
                <PaymentSection state='default' />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 210: Payment loading ---------------------------------------------

export const PaymentLoading: Story = {
    name: 'Payment — Loading',
    render: () => (
        <PageShell>
            <SettingsPanel active='payment' isAdmin activeLabel='Payment'>
                <PaymentSection state='loading' />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 210: Payment error with retry ------------------------------------

export const PaymentError: Story = {
    name: 'Payment — Error with Retry',
    render: () => (
        <PageShell>
            <SettingsPanel active='payment' isAdmin activeLabel='Payment'>
                <PaymentSection state='error' />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 210: Payment save success (toast) --------------------------------

export const PaymentSaved: Story = {
    name: 'Payment — Save (toast confirmation)',
    parameters: {
        docs: {
            description: {
                story: 'Click "Save changes" to fire the sonner success toast. Save confirmation is a toast, not an inline banner.',
            },
        },
    },
    render: () => (
        <PageShell>
            <SettingsPanel active='payment' isAdmin activeLabel='Payment'>
                <PaymentSection state='default' />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 210: Payment unauthorized (customer — Payment hidden) ------------

export const PaymentUnauthorized: Story = {
    name: 'Payment — Unauthorized (customer, hidden from nav)',
    parameters: {
        docs: {
            description: {
                story: 'Customers never see the Payment section: it is absent from the sidebar nav and the content pane shows an unauthorized empty state.',
            },
        },
    },
    render: () => (
        <PageShell>
            <SettingsPanel active='appearance' isAdmin={false} activeLabel='Payment'>
                <div className='px-6 py-10'>
                    <ErrorState
                        title='You don’t have access to this section'
                        description='Payment settings are available to administrators only.'
                        iconSize='sm'
                    />
                </div>
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 207 + 210: Customer view (no Payment in nav) ---------------------

export const CustomerNavNoPayment: Story = {
    name: 'Nav — Customer (Payment hidden)',
    render: () => (
        <PageShell>
            <SettingsPanel active='appearance' isAdmin={false} activeLabel='Appearance'>
                <AppearanceSection current='light' />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 207 + 210: Admin view (Payment visible in nav) -------------------

export const AdminNavWithPayment: Story = {
    name: 'Nav — Admin (Payment visible)',
    render: () => (
        <PageShell>
            <SettingsPanel active='profile' isAdmin activeLabel='Profile'>
                <ProfileSection data={PROFILE} />
            </SettingsPanel>
        </PageShell>
    ),
};

// --- Story 207: Mobile layout (sidebar collapses to built-in Sheet) ---------

export const MobileProfile: Story = {
    name: 'Mobile — Profile (sidebar collapses to Sheet)',
    parameters: {
        viewport: { defaultViewport: 'mobile1' },
    },
    render: () => (
        <PageShell>
            <SettingsPanel active='profile' isAdmin activeLabel='Profile'>
                <ProfileSection data={PROFILE} />
            </SettingsPanel>
        </PageShell>
    ),
};

export const MobilePaymentAdmin: Story = {
    name: 'Mobile — Admin Payment (sidebar collapses to Sheet)',
    parameters: {
        viewport: { defaultViewport: 'mobile1' },
    },
    render: () => (
        <PageShell>
            <SettingsPanel active='payment' isAdmin activeLabel='Payment'>
                <PaymentSection state='default' />
            </SettingsPanel>
        </PageShell>
    ),
};
