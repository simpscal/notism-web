import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreditCard, Palette, RefreshCw, User } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import ErrorState from '@/components/error-state';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
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
import { Skeleton } from '@/components/skeleton';
import { Toaster } from '@/components/sonner';
import Spinner from '@/components/spinner';

// ---------------------------------------------------------------------------
// Implementation reference — story 254 (customer captures their bank/payment
// details). NEW customer-facing surface, slug customer-bank-details.
//
// These are the customer's GENERAL bank/payment details, held in their account
// settings — NOT a refund-specific pane. They happen to be the account refunds
// are sent to, but the page is framed as ordinary payment settings: it is where
// the customer keeps the bank account on file for their account.
//
// It composes as the "Payment" section of the existing Settings shell
// (src/pages/settings/settings.tsx, route settings/payment). The shell is a
// Card-wrapped SidebarProvider with the section nav on the left and the active
// pane on the right (Outlet); the customer-visible sections are Profile,
// Appearance, Payment. The existing settings/payment pane
// (settings-payment-section.tsx) is currently gated adminOnly (it configures
// the restaurant's bank for COLLECTING QR payments). This surface composes the
// CUSTOMER's own bank/payment details as a Payment section pane consistent with
// that existing pattern — same shell, same nav, same field shape (bank name,
// account number, account holder name), same component vocabulary, same
// Field / FieldLabel / FieldError + footer Save / Cancel layout — so the pane
// reads identically to the rest of the customer's account settings.
//
// Generic payment/bank-details framing throughout — no "refund payout" labels
// or refund-specific copy. The bank-name hint notes it must match the bank as
// recognised by the payment provider (SePay).
//
// Six UI states are covered:
//   • default (filled, editable) — saved details shown, can edit (254 AC2).
//   • empty (first-time setup)    — no details yet, blank form (no banner).
//   • saving (loading)            — submit in flight, controls disabled.
//   • error (validation)          — missing/invalid field, inline messages,
//                                   not saved (254 AC3).
//   • partial (load error)        — failed to load existing details + retry.
//   • success                     — save-success TOAST via the app Toaster
//                                   (sonner), not an inline banner (254 AC1).
//
// Only the Payment pane is implemented; the rest of the account area (other nav
// sections, mobile trigger) is the real shell composed around it. Mock-only
// fixtures, no api/model/store imports.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Form shape (mock — mirrors bankAccountSchema in settings-payment-section.tsx)
// ---------------------------------------------------------------------------

interface BankDetails {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}

interface FieldErrors {
    bankCode?: string;
    accountNumber?: string;
    accountHolderName?: string;
}

const EMPTY_DETAILS: BankDetails = {
    bankCode: '',
    accountNumber: '',
    accountHolderName: '',
};

const SAVED_DETAILS: BankDetails = {
    bankCode: 'Vietcombank',
    accountNumber: '1023456789',
    accountHolderName: 'Nguyen Van A',
};

/** Mirrors the inline validation in the live section: each field required. */
function validate(values: BankDetails): FieldErrors {
    const errors: FieldErrors = {};
    if (!values.bankCode.trim()) errors.bankCode = 'Bank name is required';
    if (!values.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    else if (!/^\d{6,19}$/.test(values.accountNumber.trim()))
        errors.accountNumber = 'Enter a valid account number (digits only)';
    if (!values.accountHolderName.trim()) errors.accountHolderName = 'Account holder name is required';
    return errors;
}

// ---------------------------------------------------------------------------
// Settings shell — faithful to src/pages/settings/settings.tsx.
// ---------------------------------------------------------------------------

interface NavSection {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
}

// Account settings nav — the customer-visible sections. The customer's
// bank/payment details live in the "Payment" section (settings/payment), so
// Payment is the active nav item.
const NAV_SECTIONS: NavSection[] = [
    { id: 'profile', label: 'Profile', icon: User, active: false },
    { id: 'appearance', label: 'Appearance', icon: Palette, active: false },
    { id: 'payment', label: 'Payment', icon: CreditCard, active: true },
];

function SettingsShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {/* Top nav — placeholder; exists in current system, not changed by this sprint */}
            <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
                <div className='h-px w-6 bg-muted-foreground/30' />
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    nav placeholder
                </span>
                <div className='h-px w-6 bg-muted-foreground/30' />
            </div>

            <div className='container mx-auto max-w-5xl px-4 py-8'>
                <Card className='overflow-hidden p-0'>
                    <SidebarProvider
                        defaultOpen
                        className='min-h-0 items-stretch'
                        style={{ '--sidebar-width': '15rem' } as React.CSSProperties}
                    >
                        <Sidebar collapsible='offcanvas' variant='sidebar' className='border-r'>
                            <SidebarHeader className='px-3 pt-3'>
                                <span className='px-1 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/70'>
                                    Account
                                </span>
                            </SidebarHeader>
                            <SidebarContent>
                                <SidebarGroup>
                                    <SidebarGroupLabel>Sections</SidebarGroupLabel>
                                    <SidebarMenu>
                                        {NAV_SECTIONS.map(section => {
                                            const Icon = section.icon;
                                            return (
                                                <SidebarMenuItem key={section.id}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={section.active}
                                                        tooltip={section.label}
                                                    >
                                                        <a href='#' aria-current={section.active ? 'page' : undefined}>
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

                        <SidebarInset className='min-w-0 bg-background'>
                            <div className='flex items-center gap-2 border-b px-4 py-3 md:hidden'>
                                <SidebarTrigger aria-label='Open account sections' />
                                <span className='text-sm font-medium'>Payment</span>
                            </div>
                            {children}
                        </SidebarInset>
                    </SidebarProvider>
                </Card>
            </div>
            <Toaster />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Pane heading — consistent with the live payment pane.
// ---------------------------------------------------------------------------

function PaneHeading() {
    return (
        <div className='space-y-1'>
            <h2 className='text-lg font-semibold tracking-tight'>Bank account</h2>
            <p className='text-sm text-muted-foreground'>
                The bank account on file for your account. Keep these details up to date so payments to you reach the
                right account.
            </p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// The bank-details form — covers default / empty / saving / validation states.
// ---------------------------------------------------------------------------

interface BankDetailsFormProps {
    initial: BankDetails;
    /** Static validation errors + busy flag, for the error/saving stories. */
    forcedErrors?: FieldErrors;
    forcedSaving?: boolean;
}

function BankDetailsForm({ initial, forcedErrors, forcedSaving = false }: BankDetailsFormProps) {
    const [values, setValues] = React.useState<BankDetails>(initial);
    const [errors, setErrors] = React.useState<FieldErrors>(forcedErrors ?? {});
    const [isSaving, setIsSaving] = React.useState(forcedSaving);

    const busy = isSaving || forcedSaving;

    const set = (key: keyof BankDetails) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues(previous => ({ ...previous, [key]: event.target.value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const nextErrors = validate(values);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            // Invalid → not saved, inline messages stay (254 AC3).
            return;
        }
        setIsSaving(true);
        window.setTimeout(() => {
            setIsSaving(false);
            // Save success surfaces as a toast (254 AC1), not an inline banner.
            toast.success('Bank account details saved');
        }, 900);
    };

    const handleCancel = () => {
        setValues(initial);
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                <PaneHeading />

                <Field data-invalid={!!errors.bankCode}>
                    <FieldLabel htmlFor='bankCode'>Bank name</FieldLabel>
                    <Input
                        id='bankCode'
                        placeholder='e.g. Vietcombank'
                        value={values.bankCode}
                        onChange={set('bankCode')}
                        disabled={busy}
                        aria-invalid={!!errors.bankCode}
                    />
                    {errors.bankCode ? (
                        <FieldError>{errors.bankCode}</FieldError>
                    ) : (
                        <FieldDescription>
                            Type your bank name exactly as recognised by our payment provider (SePay) so it maps to the
                            right account.
                        </FieldDescription>
                    )}
                </Field>

                <Field data-invalid={!!errors.accountNumber}>
                    <FieldLabel htmlFor='accountNumber'>Account number</FieldLabel>
                    <Input
                        id='accountNumber'
                        inputMode='numeric'
                        placeholder='e.g. 1023456789'
                        value={values.accountNumber}
                        onChange={set('accountNumber')}
                        disabled={busy}
                        aria-invalid={!!errors.accountNumber}
                    />
                    {errors.accountNumber ? (
                        <FieldError>{errors.accountNumber}</FieldError>
                    ) : (
                        <FieldDescription>Digits only, exactly as shown in your banking app.</FieldDescription>
                    )}
                </Field>

                <Field data-invalid={!!errors.accountHolderName}>
                    <FieldLabel htmlFor='accountHolderName'>Account holder name</FieldLabel>
                    <Input
                        id='accountHolderName'
                        placeholder='e.g. Nguyen Van A'
                        value={values.accountHolderName}
                        onChange={set('accountHolderName')}
                        disabled={busy}
                        aria-invalid={!!errors.accountHolderName}
                    />
                    {errors.accountHolderName && <FieldError>{errors.accountHolderName}</FieldError>}
                </Field>
            </div>

            <div className='flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4'>
                <Button type='button' variant='outline' onClick={handleCancel} disabled={busy}>
                    Cancel
                </Button>
                <Button type='submit' disabled={busy}>
                    {busy ? (
                        <>
                            <Spinner size='sm' />
                            Saving…
                        </>
                    ) : (
                        'Save changes'
                    )}
                </Button>
            </div>
        </form>
    );
}

// ---------------------------------------------------------------------------
// Loading skeleton — mirrors PaymentLoadingState in the live payment section.
// ---------------------------------------------------------------------------

function BankDetailsLoading() {
    return (
        <div className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                <div className='space-y-1'>
                    <Skeleton className='h-6 w-44' />
                    <Skeleton className='h-4 w-72' />
                </div>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className='space-y-2'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-9 w-full' />
                    </div>
                ))}
            </div>
            <div className='flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4'>
                <Skeleton className='h-9 w-24' />
                <Skeleton className='h-9 w-32' />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Load-error (partial) state — mirrors the ErrorState branch in the live payment section.
// ---------------------------------------------------------------------------

function BankDetailsLoadError() {
    return (
        <div className='px-6 py-10'>
            <ErrorState
                title='Failed to load bank details'
                description='We couldn’t load your saved bank details. Please try again.'
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

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Customer Bank Details',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — saved details shown and editable (254 AC2). Edit and save to run
 *  the full flow → save-success toast. */
export const Default: Story = {
    name: 'Default — Saved Details, Editable (254)',
    render: () => (
        <SettingsShell>
            <BankDetailsForm initial={SAVED_DETAILS} />
        </SettingsShell>
    ),
};

/** Empty — first-time setup, blank form, no inline banner (254 AC1). The
 *  bank-name field's SePay-match hint guides the customer; success on save
 *  surfaces as a toast. */
export const Empty: Story = {
    name: 'Empty — First-Time Setup (254)',
    render: () => (
        <SettingsShell>
            <BankDetailsForm initial={EMPTY_DETAILS} />
        </SettingsShell>
    ),
};

/** Saving — submit in flight, controls disabled, spinner on the primary. */
export const Saving: Story = {
    name: 'Loading — Saving In Flight',
    render: () => (
        <SettingsShell>
            <BankDetailsForm initial={SAVED_DETAILS} forcedSaving />
        </SettingsShell>
    ),
};

/** Validation error — missing/invalid fields are not saved; inline messages
 *  state what's required (254 AC3). */
export const ValidationError: Story = {
    name: 'Error — Validation, Not Saved (254)',
    render: () => (
        <SettingsShell>
            <BankDetailsForm
                initial={{ bankCode: '', accountNumber: '12', accountHolderName: '' }}
                forcedErrors={{
                    bankCode: 'Bank name is required',
                    accountNumber: 'Enter a valid account number (digits only)',
                    accountHolderName: 'Account holder name is required',
                }}
            />
        </SettingsShell>
    ),
};

/** Partial — existing details failed to load; retry offered. */
export const LoadError: Story = {
    name: 'Partial — Load Failed, Retry',
    render: () => (
        <SettingsShell>
            <BankDetailsLoadError />
        </SettingsShell>
    ),
};

/** Loading — pane skeleton while saved details load. */
export const Loading: Story = {
    name: 'Loading — Pane Skeleton',
    render: () => (
        <SettingsShell>
            <BankDetailsLoading />
        </SettingsShell>
    ),
};

/** Success — save succeeds and surfaces as a toast via the app Toaster (sonner),
 *  not an inline banner (254 AC1). The toast is fired on mount so reviewers see
 *  the exact success feedback over the editable details. */
function SavedSuccessHarness() {
    React.useEffect(() => {
        const id = window.setTimeout(() => toast.success('Bank account details saved'), 300);
        return () => window.clearTimeout(id);
    }, []);

    return (
        <SettingsShell>
            <BankDetailsForm initial={SAVED_DETAILS} />
        </SettingsShell>
    );
}

export const Success: Story = {
    name: 'Success — Save-Success Toast (254)',
    parameters: {
        docs: {
            description: {
                story: 'A successful save surfaces as a success toast via the app Toaster (sonner) rather than an inline banner. The toast is fired shortly after mount so reviewers see the exact save-success feedback over the editable details.',
            },
        },
    },
    render: () => <SavedSuccessHarness />,
};
