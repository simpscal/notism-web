import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Camera,
    Check,
    CreditCard,
    Heart,
    LayoutGrid,
    Mail,
    MapPin,
    Palette,
    Phone,
    ReceiptText,
    RefreshCw,
    Search,
    ShoppingBag,
    Trash2,
    Upload,
    User,
    UtensilsCrossed,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import ErrorState from '@/components/error-state';
import { Field, FieldDescription, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';

// ---------------------------------------------------------------------------
// Surface: Account settings (route /settings/*) — RESTYLE to DESIGN_THEME.md.
//
// Business behaviour is UNCHANGED from src/pages/settings/*. This story mirrors
// the same three tabbed sections (profile, appearance, payment — customer bank
// account), the same fields, the same flow (persistent section rail + one
// content pane), and the same states (default / loading / error / success). It
// only changes the VISUALS + UX to the theme:
//
//   • Elevation — soft + minimal, one gentle step per level: dark ambient frame
//     → ONE large-radius light-gray shell → white settings panel (hairline,
//     faint shadow) → white cards + section-rail (hairline, little/no shadow).
//     No heavy rings or drop shadows; whitespace separates before a border does.
//   • Toolbar — a real floating, large-radius rounded app bar sits INSIDE the
//     shell with margin all around: brand left, nav centre (active = white pill
//     + black icon/label), search + a black Cart pill right. On mobile it stays
//     a rounded floating bar (condensed), never full-bleed.
//   • Scrolling — the shell fills the viewport; the toolbar is pinned; only the
//     settings content pane scrolls within the shell (min-h/flex, no fixed
//     heights, no double scrollbars).
//   • Forms — single column, max ~40rem, labels ABOVE fields, roomy 8px-grid
//     density, heavy consistent rounding (radius 20–24). Never multi-column.
//   • Two-tone — Save is the primary STRUCTURAL action, so it is a BLACK pill
//     (there is no commerce / final-payment step here, so no red appears on this
//     surface). Idle secondaries (Cancel, Change, Retry, Remove) are white pills
//     with a hairline; disabled reads ink-tertiary text on bg-subtle. The
//     appearance theme picker is a Segmented Choice whose chosen pill is BLACK
//     fill (selection control).
//
// Self-contained: mock-only fixtures, no i18n / api / store / model imports.
// Only the settings surface is fully implemented; the surrounding app is the
// real floating toolbar (an unchanged shell region, rendered on-theme).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mock fixtures — shape mirrors the real settings surface (user + bank account)
// ---------------------------------------------------------------------------

const MOCK_USER = {
    firstName: 'Mai',
    lastName: 'Tran',
    email: 'mai.tran@example.com',
    location: 'District 1, Ho Chi Minh City',
    avatarUrl: null as string | null,
};

const MOCK_BANK_ACCOUNT = {
    bankCode: 'Vietcombank',
    accountNumber: '0071000123456',
    accountHolderName: 'TRAN THI MAI',
};

type ThemeValue = 'light' | 'dark' | 'system';

type SectionId = 'profile' | 'appearance' | 'payment';

interface SettingsSection {
    id: SectionId;
    label: string;
    icon: LucideIcon;
}

const SECTIONS: SettingsSection[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'payment', label: 'Payment', icon: CreditCard },
];

// ---------------------------------------------------------------------------
// Eyebrow micro-label — UPPERCASE, letter-spaced, muted (theme treatment).
// ---------------------------------------------------------------------------

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className='text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>{children}</span>
    );
}

// ---------------------------------------------------------------------------
// Pane heading — one heading per pane + quiet body subtitle.
// ---------------------------------------------------------------------------

function PaneHeading({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className='space-y-1.5'>
            <h2 className='text-xl font-semibold tracking-tight text-foreground'>{title}</h2>
            <p className='text-sm text-muted-foreground'>{subtitle}</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Pane footer — the single black primary (Save) sits alone on the right;
// secondary actions are idle white pills with a hairline. A hairline top
// divider only.
// ---------------------------------------------------------------------------

function PaneFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex items-center justify-end gap-3 border-t border-border/70 px-6 py-5 sm:px-10'>
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Theme preview mockups (appearance tab) — self-contained, decorative.
// ---------------------------------------------------------------------------

function LightPreview() {
    return (
        <div className='flex h-full w-full flex-col bg-[#ffffff]'>
            <div className='flex h-3 items-center gap-1 border-b border-[#e5e7eb] bg-[#f3f4f6] px-1.5'>
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
            </div>
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

function DarkPreview() {
    return (
        <div className='flex h-full w-full flex-col bg-[#0d1117]'>
            <div className='flex h-3 items-center gap-1 border-b border-[#30363d] bg-[#161b22] px-1.5'>
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
            </div>
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

function SystemPreview() {
    return (
        <div className='relative h-full w-full overflow-hidden'>
            <div className='absolute inset-0'>
                <DarkPreview />
            </div>
            <div className='absolute inset-0' style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
                <LightPreview />
            </div>
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

const THEME_OPTIONS: { value: ThemeValue; label: string; description: string; Preview: React.ComponentType }[] = [
    { value: 'light', label: 'Light', description: 'Bright surface, always on', Preview: LightPreview },
    { value: 'dark', label: 'Dark', description: 'Dim surface, easy at night', Preview: DarkPreview },
    { value: 'system', label: 'System', description: 'Match your device', Preview: SystemPreview },
];

// ===========================================================================
// TAB PANES — each mirrors a source section, restyled to the theme
// ===========================================================================

// ---- Profile ---------------------------------------------------------------

function ProfilePane() {
    const initials = `${MOCK_USER.firstName.charAt(0)}${MOCK_USER.lastName.charAt(0)}`.toUpperCase();

    return (
        <form className='flex flex-col' onSubmit={e => e.preventDefault()}>
            <div className='space-y-9 px-6 py-9 sm:px-10'>
                <PaneHeading title='Profile' subtitle='Update your personal details and how others see you.' />

                {/* Avatar group — Change / Remove are idle white pills; Remove
                    (destructive) is kept here, apart from the primary Save action. */}
                <div className='flex flex-col items-start gap-5 rounded-2xl border border-border/70 bg-muted/30 p-5 sm:flex-row sm:items-center'>
                    <div className='relative'>
                        <Avatar className='h-20 w-20 border border-border shadow-sm'>
                            <AvatarImage src={MOCK_USER.avatarUrl ?? undefined} alt='' className='object-cover' />
                            <AvatarFallback className='bg-muted text-lg font-semibold text-foreground'>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className='absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background shadow'>
                            <Camera className='h-3 w-3' />
                        </span>
                    </div>
                    <div className='flex-1 space-y-3'>
                        <div>
                            <h3 className='text-sm font-medium text-foreground'>Profile photo</h3>
                            <p className='mt-0.5 text-xs text-muted-foreground'>PNG or JPG, up to 5&nbsp;MB.</p>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <Button type='button' variant='outline' size='sm' className='rounded-full'>
                                <Upload className='h-4 w-4' />
                                Change
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                className='rounded-full text-muted-foreground hover:text-foreground'
                            >
                                <Trash2 className='h-4 w-4' />
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Single-column form — labels above fields (theme form pattern). */}
                <div className='space-y-6'>
                    <Field>
                        <FieldLabel htmlFor='firstName'>First name</FieldLabel>
                        <Input id='firstName' defaultValue={MOCK_USER.firstName} placeholder='Enter your first name' />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor='lastName'>Last name</FieldLabel>
                        <Input id='lastName' defaultValue={MOCK_USER.lastName} placeholder='Enter your last name' />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor='email' className='flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            Email
                        </FieldLabel>
                        <Input
                            id='email'
                            type='email'
                            value={MOCK_USER.email}
                            disabled
                            readOnly
                            className='cursor-not-allowed bg-muted'
                        />
                    </Field>
                </div>

                <Separator />

                <div className='space-y-6'>
                    <Field>
                        <FieldLabel htmlFor='phone' className='flex items-center gap-2'>
                            <Phone className='h-4 w-4' />
                            Phone number
                        </FieldLabel>
                        <Input id='phone' type='tel' placeholder='Add a phone number' />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor='location' className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            Location
                        </FieldLabel>
                        <Input id='location' defaultValue={MOCK_USER.location} placeholder='Add your location' />
                    </Field>
                </div>
            </div>

            <PaneFooter>
                <Button type='button' variant='outline' className='rounded-full'>
                    Cancel
                </Button>
                <Button
                    type='submit'
                    className='bg-selected text-selected-foreground hover:bg-selected/90 rounded-full'
                >
                    Save changes
                </Button>
            </PaneFooter>
        </form>
    );
}

// ---- Appearance ------------------------------------------------------------

function AppearancePane() {
    const [selected, setSelected] = React.useState<ThemeValue>('system');

    const active = THEME_OPTIONS.find(option => option.value === selected) ?? THEME_OPTIONS[0];
    const ActivePreview = active.Preview;

    return (
        <div className='flex flex-col'>
            <div className='space-y-9 px-6 py-9 sm:px-10'>
                <PaneHeading title='Appearance' subtitle='Choose how Notism looks on this device.' />

                <fieldset className='space-y-4'>
                    <div className='flex flex-col gap-1'>
                        <Eyebrow>Theme</Eyebrow>
                        <p className='text-xs text-muted-foreground'>
                            Currently applied:{' '}
                            <span className='font-medium capitalize text-foreground'>{selected}</span>
                        </p>
                    </div>

                    {/* Segmented Choice (§5) — a single-select pill row; the chosen pill
                        reads BLACK fill (theme: black = selected). No crimson here. */}
                    <RadioGroup
                        value={selected}
                        onValueChange={value => setSelected(value as ThemeValue)}
                        className='flex flex-wrap gap-2'
                    >
                        {THEME_OPTIONS.map(option => {
                            const isSelected = selected === option.value;

                            return (
                                <label
                                    key={option.value}
                                    htmlFor={`theme-${option.value}`}
                                    className={[
                                        'inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors',
                                        isSelected
                                            ? 'border-transparent bg-selected text-selected-foreground shadow-sm'
                                            : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                                    ].join(' ')}
                                >
                                    <RadioGroupItem
                                        value={option.value}
                                        id={`theme-${option.value}`}
                                        className='sr-only'
                                    />
                                    {isSelected ? <Check className='h-4 w-4' aria-hidden /> : null}
                                    {option.label}
                                </label>
                            );
                        })}
                    </RadioGroup>

                    {/* Live preview of the chosen theme — soft-rounded, hairline framed. */}
                    <div className='space-y-2'>
                        <div className='overflow-hidden rounded-2xl border border-border shadow-sm'>
                            <div className='aspect-[16/7] w-full' aria-hidden>
                                <ActivePreview />
                            </div>
                        </div>
                        <p className='text-xs text-muted-foreground'>{active.description}.</p>
                    </div>
                </fieldset>
            </div>

            <PaneFooter>
                <Button
                    type='button'
                    className='bg-selected text-selected-foreground hover:bg-selected/90 rounded-full'
                >
                    Save changes
                </Button>
            </PaneFooter>
        </div>
    );
}

// ---- Payment (customer bank account) --------------------------------------

function PaymentPane() {
    return (
        <form className='flex flex-col' onSubmit={e => e.preventDefault()}>
            <div className='space-y-9 px-6 py-9 sm:px-10'>
                <PaneHeading
                    title='Payout account'
                    subtitle='Where we send refunds. Make sure these details match your bank exactly.'
                />

                <div className='space-y-6'>
                    <Field>
                        <FieldLabel htmlFor='bankCode'>Bank</FieldLabel>
                        <Input id='bankCode' defaultValue={MOCK_BANK_ACCOUNT.bankCode} placeholder='e.g. Vietcombank' />
                        <FieldDescription>Pick the bank your account is held with.</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor='accountNumber'>Account number</FieldLabel>
                        <Input
                            id='accountNumber'
                            inputMode='numeric'
                            defaultValue={MOCK_BANK_ACCOUNT.accountNumber}
                            placeholder='Enter your account number'
                        />
                        <FieldDescription>Digits only, no spaces or dashes.</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor='accountHolderName'>Account holder name</FieldLabel>
                        <Input
                            id='accountHolderName'
                            defaultValue={MOCK_BANK_ACCOUNT.accountHolderName}
                            placeholder='Enter the name on the account'
                        />
                    </Field>
                </div>
            </div>

            <PaneFooter>
                <Button type='button' variant='outline' className='rounded-full'>
                    Cancel
                </Button>
                <Button
                    type='submit'
                    className='bg-selected text-selected-foreground hover:bg-selected/90 rounded-full'
                >
                    Save changes
                </Button>
            </PaneFooter>
        </form>
    );
}

// ---- Payment — loading (skeletons mirror source PaymentLoadingState) -------

function PaymentLoadingPane() {
    return (
        <div className='flex flex-col'>
            <div className='space-y-9 px-6 py-9 sm:px-10'>
                <div className='space-y-2'>
                    <Skeleton className='h-6 w-40' />
                    <Skeleton className='h-4 w-72' />
                </div>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className='space-y-2'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-9 w-full rounded-md' />
                    </div>
                ))}
            </div>
            <PaneFooter>
                <Skeleton className='h-9 w-24 rounded-full' />
                <Skeleton className='h-9 w-32 rounded-full' />
            </PaneFooter>
        </div>
    );
}

// ---- Payment — error (mirrors source ErrorState + Retry) ------------------

function PaymentErrorPane() {
    return (
        <div className='px-6 py-8 sm:px-10'>
            <ErrorState
                title="We couldn't load your payout account"
                description='Check your connection and try again — your saved details are safe.'
                iconSize='sm'
                action={
                    <Button variant='outline' className='rounded-full'>
                        <RefreshCw className='h-4 w-4' />
                        Retry
                    </Button>
                }
            />
        </div>
    );
}

// ---- Payment — success (saved confirmation banner) ------------------------

function PaymentSuccessPane() {
    return (
        <div className='flex flex-col'>
            <div className='space-y-9 px-6 py-9 sm:px-10'>
                <PaneHeading
                    title='Payout account'
                    subtitle='Where we send refunds. Make sure these details match your bank exactly.'
                />

                <div className='flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-4 py-3'>
                    <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success'>
                        <Check className='h-4 w-4' aria-hidden />
                    </span>
                    <p className='text-sm text-foreground'>
                        Payout account saved. Refunds will go to this account from now on.
                    </p>
                </div>

                <div className='space-y-6'>
                    <Field>
                        <FieldLabel htmlFor='bankCodeS'>Bank</FieldLabel>
                        <Input id='bankCodeS' defaultValue={MOCK_BANK_ACCOUNT.bankCode} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='accountNumberS'>Account number</FieldLabel>
                        <Input id='accountNumberS' defaultValue={MOCK_BANK_ACCOUNT.accountNumber} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='accountHolderNameS'>Account holder name</FieldLabel>
                        <Input id='accountHolderNameS' defaultValue={MOCK_BANK_ACCOUNT.accountHolderName} />
                    </Field>
                </div>
            </div>

            <PaneFooter>
                <Button type='button' variant='outline' className='rounded-full'>
                    Cancel
                </Button>
                {/* Save is idle (no unsaved changes) — mirrors the disabled-until-dirty
                    source. Disabled reads ink-tertiary text on bg-subtle (§8). */}
                <Button
                    type='button'
                    disabled
                    className='bg-selected text-selected-foreground hover:bg-selected/90 rounded-full disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100'
                >
                    Save changes
                </Button>
            </PaneFooter>
        </div>
    );
}

// ===========================================================================
// APP SHELL — dark ambient frame → light-gray shell → floating toolbar +
// scrollable white settings panel
// ===========================================================================

// The centre nav mirrors the app's real top-level destinations; Account is the
// active branch that owns Settings. Unchanged by this sprint — rendered on-theme.
const TOOLBAR_NAV: { id: string; label: string; icon: LucideIcon }[] = [
    { id: 'menu', label: 'Menu', icon: LayoutGrid },
    { id: 'orders', label: 'Orders', icon: ReceiptText },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'account', label: 'Account', icon: User },
];

const ACTIVE_NAV = 'account';

/**
 * Floating rounded toolbar — the real reference app bar. Large-radius, light,
 * floats inside the shell with margin all around: brand left, nav centre
 * (active = white pill + black icon/label), search + a black Cart pill right.
 * On mobile it stays rounded and condensed, never full-bleed.
 */
function AppToolbar() {
    return (
        <header className='shrink-0'>
            <div className='flex h-16 items-center gap-3 rounded-[1.5rem] border border-border/60 bg-muted/50 px-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:px-4'>
                {/* Brand */}
                <a
                    href='#'
                    className='flex items-center gap-2 rounded-full px-1.5 py-1 font-bold tracking-tight text-foreground'
                >
                    <span className='flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm'>
                        <UtensilsCrossed className='h-4 w-4' aria-hidden />
                    </span>
                    <span className='hidden text-base text-primary sm:inline'>Notism</span>
                </a>

                {/* Centre nav — active takes a white pill + black icon/label */}
                <nav className='mx-auto hidden items-center gap-1 md:flex'>
                    {TOOLBAR_NAV.map(item => {
                        const Icon = item.icon;
                        const isActive = item.id === ACTIVE_NAV;
                        return (
                            <a
                                key={item.id}
                                href='#'
                                aria-current={isActive ? 'page' : undefined}
                                className={[
                                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground',
                                ].join(' ')}
                            >
                                <Icon className='h-4 w-4' aria-hidden />
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

                {/* Trailing — search + the brand-red Cart pill */}
                <div className='ml-auto flex items-center gap-2 md:ml-0'>
                    <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        aria-label='Search'
                        className='rounded-full border-border/70 bg-background'
                    >
                        <Search className='h-4 w-4' />
                    </Button>
                    <Button type='button' className='rounded-full px-4'>
                        <ShoppingBag className='h-4 w-4' />
                        Cart
                    </Button>
                </div>
            </div>
        </header>
    );
}

/**
 * The on-theme app shell: a dark ambient frame (decorative line-art, behind
 * everything) → ONE large-radius light-gray shell that fills the viewport. The
 * toolbar is pinned; only the content region scrolls (flex + min-h-0).
 */
function AppShell({ active, children }: { active: SectionId; children: React.ReactNode }) {
    return (
        <div className='relative flex h-screen w-full flex-col bg-[#17140f] p-3 sm:p-5'>
            {/* Decorative low-contrast line-art motif — behind the shell, never interactive. */}
            <div
                aria-hidden
                className='pointer-events-none absolute inset-0 opacity-[0.06]'
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, #f5f0e6 1px, transparent 0), radial-gradient(circle at 24px 24px, #f5f0e6 1px, transparent 0)',
                    backgroundSize: '48px 48px',
                }}
            />

            {/* One large-radius light-gray shell — fills the frame. */}
            <div className='relative flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-[2rem] bg-[oklch(0.955_0.002_286)] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-4'>
                <AppToolbar />

                {/* Scroll region — the only scroller; the toolbar stays pinned above. */}
                <div className='min-h-0 flex-1 overflow-y-auto'>
                    <div className='mx-auto w-full max-w-5xl px-1 pb-4 sm:px-2'>
                        <div className='mb-5 space-y-1 px-1 pt-1'>
                            <Eyebrow>Account</Eyebrow>
                            <h1 className='text-2xl font-bold tracking-tight text-foreground'>Settings</h1>
                        </div>

                        {/* White settings panel — hairline + faint shadow (one gentle step). */}
                        <Card className='overflow-hidden rounded-[1.5rem] border-border/70 p-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'>
                            <div className='grid grid-cols-1 md:grid-cols-[15rem_minmax(0,1fr)]'>
                                {/* Section rail — reference panel language: faint rail, active =
                                    white pill + hairline + soft shadow + black icon/label. */}
                                <nav className='flex flex-col gap-1 border-b border-border/70 bg-muted/40 p-3 md:border-b-0 md:border-r'>
                                    <span className='px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                                        Sections
                                    </span>
                                    {SECTIONS.map(section => {
                                        const Icon = section.icon;
                                        const isActive = section.id === active;
                                        return (
                                            <button
                                                key={section.id}
                                                type='button'
                                                aria-current={isActive ? 'page' : undefined}
                                                className={[
                                                    'inline-flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors',
                                                    isActive
                                                        ? 'border border-border/70 bg-background text-foreground shadow-sm'
                                                        : 'text-muted-foreground hover:text-foreground',
                                                ].join(' ')}
                                            >
                                                <Icon className='h-4 w-4' aria-hidden />
                                                {section.label}
                                            </button>
                                        );
                                    })}
                                </nav>

                                {/* Content pane — single focused column, max ~40rem forms. */}
                                <div className='min-w-0 bg-background'>
                                    <div className='mx-auto max-w-[40rem]'>{children}</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===========================================================================
// Meta + Stories
// ===========================================================================

const meta = {
    title: 'Surfaces/Sprint 11/Account Settings',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ section: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Profile tab (default) — single-column form, labels above fields, the avatar
 * group's Change/Remove as idle white pills, and one black "Save changes"
 * primary in the footer. "Remove" stays up in the avatar group, apart from Save.
 */
export const Profile: Story = {
    name: 'Profile — Default',
    render: () => (
        <AppShell active='profile'>
            <ProfilePane />
        </AppShell>
    ),
};

/**
 * Appearance tab — a Segmented Choice theme picker under an UPPERCASE eyebrow.
 * The chosen pill reads black fill (selection control); the single primary
 * action, "Save changes", is a black pill.
 */
export const Appearance: Story = {
    name: 'Appearance — Theme Picker',
    render: () => (
        <AppShell active='appearance'>
            <AppearancePane />
        </AppShell>
    ),
};

/**
 * Payment tab (default) — the customer bank-account form: single column, labels
 * above fields with hints, Cancel as a white pill and one black "Save changes".
 */
export const Payment: Story = {
    name: 'Payment — Bank Account',
    render: () => (
        <AppShell active='payment'>
            <PaymentPane />
        </AppShell>
    ),
};

/**
 * Payment — loading. The payout account is being fetched; skeletons stand in for
 * the heading, the three fields, and the footer actions (mirrors the source
 * PaymentLoadingState).
 */
export const PaymentLoading: Story = {
    name: 'Payment — Loading',
    render: () => (
        <AppShell active='payment'>
            <PaymentLoadingPane />
        </AppShell>
    ),
};

/**
 * Payment — error. The payout account failed to load; a compact error state with
 * a white-pill Retry (the copy says what to do next, per the theme's voice).
 */
export const PaymentError: Story = {
    name: 'Payment — Load Error',
    render: () => (
        <AppShell active='payment'>
            <PaymentErrorPane />
        </AppShell>
    ),
};

/**
 * Payment — success. The account was saved: a confirmation banner sits above the
 * (now pristine) form, and Save is idle until the next change — mirroring the
 * source's disabled-until-dirty behaviour.
 */
export const PaymentSuccess: Story = {
    name: 'Payment — Saved',
    render: () => (
        <AppShell active='payment'>
            <PaymentSuccessPane />
        </AppShell>
    ),
};
