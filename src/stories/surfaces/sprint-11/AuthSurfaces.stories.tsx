import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeft, MailCheck } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/button';
import { Field, FieldError, FieldLabel } from '@/components/field';
import GoogleLogo from '@/components/google-logo';
import { Input } from '@/components/input';
import { PasswordInput } from '@/components/password-input';
import { Separator } from '@/components/separator';

// ---------------------------------------------------------------------------
// Surface — auth screens (login / signup / request-reset / reset-password),
// re-skinned to DESIGN_THEME.md. Business behaviour is UNCHANGED from the live
// pages: same fields, same Google OAuth on login+signup, same validation, same
// flow (login ⇄ signup, forgot-password → request-reset → check-email, reset →
// back to login). Only the visuals + UX copy move on-theme.
//
// Theme application (DESIGN_THEME.md):
//   • Layering (§4) — a dark charcoal AMBIENT CANVAS (#1A1A1A) with a neutral,
//     low-contrast line-art motif sits behind everything; the form lives on a
//     single raised white CARD floating over it. Elevation is ONE gentle step:
//     the theme's single soft shadow (0 4px 20px rgba(0,0,0,0.05)) + hairline —
//     no heavy rings. No control ever touches the raw dark frame.
//   • Two-tone hierarchy (§1) — the submit is the primary STRUCTURAL action and
//     auth carries NO commerce/price, so it is a BLACK pill (Sign in / Create
//     account / Send reset link / Save new password). Red is reserved for
//     commerce/final CTAs and appears NOWHERE on these surfaces. Google OAuth is
//     a white outline pill; text links stay quiet ink.
//   • Spacing & Shape (§4) — 24px card radius, 16px field radius, full-pill
//     buttons; base 8px rhythm.
//   • Type (§3) — H2 bold heading, regular body.
//   • Form pattern (§6) — single column, max ~26rem, labels ABOVE fields.
//   • States (§8) — validation says what to do NEXT; disabled = ink-tertiary on
//     bg-subtle (inherited from the shared Input/Button controls).
//   • Voice & Copy — sentence case, verb+object buttons. The one eyebrow
//     micro-label ("OR CONTINUE WITH") is the only UPPERCASE treatment.
//
// Mock-only + presentational: no react-hook-form, no api/store/i18n imports.
// Errors are passed in statically so every state renders deterministically.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Ambient frame + raised card — the shared auth shell.
// ---------------------------------------------------------------------------

/** Dark charcoal ambient canvas with a subtle monochrome line-art motif —
 *  the first layer of the theme's frame → shell → card stack. Decorative only:
 *  UI chrome stays neutral so the card pops, and no red ever touches it. The
 *  card always sits above it via a single gentle elevation step. */
function AmbientFrame({ children }: { children: React.ReactNode }) {
    return (
        <div
            className='relative flex min-h-screen w-full items-center justify-center px-4 py-10'
            style={{
                backgroundColor: '#1A1A1A',
                backgroundImage: [
                    'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04), transparent 55%)',
                    'repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 28px)',
                ].join(', '),
            }}
        >
            {/* Quiet language control — mirrors the live layout's top-right switcher */}
            <div className='absolute right-4 top-4 md:right-6 md:top-6'>
                <span className='inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm'>
                    🇬🇧 EN
                </span>
            </div>
            {children}
        </div>
    );
}

/** Raised white card — one gentle elevation step above the ambient frame via
 *  the theme's single soft shadow (§4: 0 4px 20px rgba(0,0,0,0.05)) + hairline
 *  (never a heavy ring), heavy 24px radius as the signature, single-column body
 *  ≤ ~26rem. */
function AuthCard({
    title,
    subtitle,
    children,
    footer,
    showBack,
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    showBack?: boolean;
}) {
    return (
        <div className='w-full max-w-[26rem]'>
            <div
                className='rounded-3xl border border-border bg-card p-7 sm:p-9'
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
            >
                {showBack && (
                    <button
                        type='button'
                        className='mb-5 inline-flex items-center gap-1.5 rounded-full text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                        <ArrowLeft className='h-4 w-4' aria-hidden />
                        Back to sign in
                    </button>
                )}

                {/* Brand — wordmark carries the accent RED as identity (theme §2) */}
                <div className='mb-6 flex flex-col items-center text-center'>
                    <span className='text-2xl font-bold tracking-tight text-primary'>Notism</span>
                    <h1 className='mt-5 text-xl font-bold tracking-tight text-foreground'>{title}</h1>
                    <p className='mt-1.5 text-sm font-normal text-muted-foreground'>{subtitle}</p>
                </div>

                {children}
            </div>

            {footer && <div className='mt-6 text-center text-sm text-white/70'>{footer}</div>}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Field helpers — label ABOVE field, generous rounding, deterministic errors.
// ---------------------------------------------------------------------------

const CONTROL = 'h-11 rounded-2xl';

function TextField({
    id,
    label,
    type = 'text',
    placeholder,
    autoComplete,
    defaultValue,
    error,
    labelAdornment,
}: {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
    defaultValue?: string;
    error?: string;
    labelAdornment?: React.ReactNode;
}) {
    return (
        <Field data-invalid={!!error}>
            {labelAdornment ? (
                <div className='flex items-center justify-between gap-2'>
                    <FieldLabel htmlFor={id}>{label}</FieldLabel>
                    {labelAdornment}
                </div>
            ) : (
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
            )}
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                defaultValue={defaultValue}
                aria-invalid={!!error}
                className={CONTROL}
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}

function PasswordField({
    id,
    label,
    placeholder,
    autoComplete,
    defaultValue,
    error,
    labelAdornment,
}: {
    id: string;
    label: string;
    placeholder?: string;
    autoComplete?: string;
    defaultValue?: string;
    error?: string;
    labelAdornment?: React.ReactNode;
}) {
    return (
        <Field data-invalid={!!error}>
            {labelAdornment ? (
                <div className='flex items-center justify-between gap-2'>
                    <FieldLabel htmlFor={id}>{label}</FieldLabel>
                    {labelAdornment}
                </div>
            ) : (
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
            )}
            <PasswordInput
                id={id}
                placeholder={placeholder}
                autoComplete={autoComplete}
                defaultValue={defaultValue}
                aria-invalid={!!error}
                className={CONTROL}
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}

/** The single primary action per view. On auth the submit is the primary
 *  STRUCTURAL action (no commerce/price), so per the two-tone rule it is BLACK
 *  (the `selected` ink token), a full pill, semibold label. Red is reserved for
 *  commerce/final CTAs elsewhere and never appears here. */
function PrimaryAction({ children }: { children: React.ReactNode }) {
    return (
        <Button type='button' className='h-11 w-full rounded-full text-sm font-semibold'>
            {children}
        </Button>
    );
}

/** Eyebrow-labelled OAuth divider — the one UPPERCASE treatment on the surface. */
function OAuthDivider() {
    return (
        <div className='relative py-1'>
            <div className='absolute inset-0 flex items-center'>
                <Separator />
            </div>
            <div className='relative flex justify-center'>
                <span className='bg-card px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground'>
                    Or continue with
                </span>
            </div>
        </div>
    );
}

/** Google OAuth — a white outline pill (idle secondary), never red or black
 *  fill; the black primary stays the single loudest action per view. */
function GoogleButton() {
    return (
        <Button type='button' variant='outline' className='h-11 w-full gap-2 rounded-full font-semibold'>
            <GoogleLogo className='h-4 w-4' />
            <span>Google</span>
        </Button>
    );
}

/** Quiet text link — inherits its context colour (ink on the card, light on the
 *  dark frame footer) and stays quiet: no red accent, weight + underline signal
 *  the action. */
function QuietLink({ children }: { children: React.ReactNode }) {
    return (
        <button type='button' className='font-semibold text-current underline underline-offset-4 hover:opacity-80'>
            {children}
        </button>
    );
}

// ---------------------------------------------------------------------------
// Screen bodies — each mirrors its live page's fields + flow, re-skinned.
// ---------------------------------------------------------------------------

type LoginErrors = { email?: string; password?: string };

function LoginScreen({ errors }: { errors?: LoginErrors } = {}) {
    return (
        <AmbientFrame>
            <AuthCard
                title='Welcome back'
                subtitle='Sign in to pick up where you left off.'
                footer={
                    <>
                        New to Notism? <QuietLink>Create an account</QuietLink>
                    </>
                }
            >
                <div className='space-y-5'>
                    <TextField
                        id='login-email'
                        label='Email'
                        type='email'
                        placeholder='name@example.com'
                        autoComplete='email'
                        error={errors?.email}
                    />
                    <PasswordField
                        id='login-password'
                        label='Password'
                        placeholder='Enter your password'
                        autoComplete='current-password'
                        error={errors?.password}
                        labelAdornment={<QuietLink>Forgot password?</QuietLink>}
                    />
                    <PrimaryAction>Sign in</PrimaryAction>

                    <OAuthDivider />
                    <GoogleButton />
                </div>
            </AuthCard>
        </AmbientFrame>
    );
}

function SignupScreen() {
    return (
        <AmbientFrame>
            <AuthCard
                title='Create your account'
                subtitle='Set up Notism in under a minute.'
                footer={
                    <>
                        Already have an account? <QuietLink>Sign in</QuietLink>
                    </>
                }
            >
                <div className='space-y-5'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <TextField id='signup-first' label='First name' placeholder='John' autoComplete='given-name' />
                        <TextField id='signup-last' label='Last name' placeholder='Doe' autoComplete='family-name' />
                    </div>
                    <TextField
                        id='signup-email'
                        label='Email'
                        type='email'
                        placeholder='name@example.com'
                        autoComplete='email'
                    />
                    <PasswordField
                        id='signup-password'
                        label='Password'
                        placeholder='Create a password'
                        autoComplete='new-password'
                    />
                    <PrimaryAction>Create account</PrimaryAction>

                    <OAuthDivider />
                    <GoogleButton />
                </div>
            </AuthCard>
        </AmbientFrame>
    );
}

function RequestResetScreen() {
    return (
        <AmbientFrame>
            <AuthCard
                title='Reset your password'
                subtitle='Enter your email and we will send you a reset link.'
                showBack
            >
                <div className='space-y-5'>
                    <TextField
                        id='reset-email'
                        label='Email'
                        type='email'
                        placeholder='name@example.com'
                        autoComplete='email'
                    />
                    <PrimaryAction>Send reset link</PrimaryAction>
                </div>
            </AuthCard>
        </AmbientFrame>
    );
}

function CheckEmailScreen() {
    return (
        <AmbientFrame>
            <AuthCard title='Check your email' subtitle='We sent a reset link to your inbox.' showBack>
                <div className='flex flex-col items-center gap-4 py-2 text-center'>
                    <span className='flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success'>
                        <MailCheck className='h-6 w-6' aria-hidden />
                    </span>
                    <p className='text-sm text-muted-foreground'>
                        Open the link within 30 minutes to choose a new password. No email? Check your spam folder, then
                        request another link.
                    </p>
                </div>
            </AuthCard>
        </AmbientFrame>
    );
}

type ResetErrors = { newPassword?: string; confirmPassword?: string };

function ResetPasswordScreen({ errors }: { errors?: ResetErrors } = {}) {
    return (
        <AmbientFrame>
            <AuthCard title='Set a new password' subtitle='Choose a password you have not used before.' showBack>
                <div className='space-y-5'>
                    <PasswordField
                        id='reset-new'
                        label='New password'
                        placeholder='Enter a new password'
                        autoComplete='new-password'
                        error={errors?.newPassword}
                    />
                    <PasswordField
                        id='reset-confirm'
                        label='Confirm new password'
                        placeholder='Re-enter the new password'
                        autoComplete='new-password'
                        error={errors?.confirmPassword}
                    />
                    <PrimaryAction>Save new password</PrimaryAction>
                </div>
            </AuthCard>
        </AmbientFrame>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories — one export per screen + an error state.
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Auth Surfaces',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Login — single-column form on a raised card over the dark ambient frame.
 * Labels above fields, one BLACK structural primary ("Sign in"); Google OAuth is
 * a white outline pill, and "Forgot password?" / "Create an account" stay quiet
 * ink links. No red anywhere on the surface.
 */
export const Login: Story = {
    name: 'Default — Login',
    render: () => <LoginScreen />,
};

/**
 * Signup — same card pattern with the first/last name row, email, and password.
 * The one black action reads "Create account"; Google OAuth stays secondary.
 */
export const Signup: Story = {
    name: 'Default — Signup',
    render: () => <SignupScreen />,
};

/**
 * Request reset — a single email field and the one black "Send reset link"
 * action, with a quiet "Back to sign in" return preserving the existing flow.
 */
export const RequestReset: Story = {
    name: 'Default — Request Reset',
    render: () => <RequestResetScreen />,
};

/**
 * Reset password — new + confirm password on the raised card, one black
 * "Save new password" action.
 */
export const ResetPassword: Story = {
    name: 'Default — Reset Password',
    render: () => <ResetPasswordScreen />,
};

/**
 * Success — the request-reset confirmation ("Check your email"), matching the
 * live page's post-submit state, with next-step guidance in the body copy.
 */
export const CheckEmailSuccess: Story = {
    name: 'Success — Reset Link Sent',
    render: () => <CheckEmailScreen />,
};

/**
 * Error — login with validation errors. Messages say what to do NEXT (fix the
 * email, enter the password), rendered in the destructive role beneath each
 * field; the single black primary is unchanged.
 */
export const Error: Story = {
    name: 'Error — Login Validation',
    render: () => (
        <LoginScreen
            errors={{
                email: 'Enter a valid email address, like name@example.com.',
                password: 'Enter your password to continue.',
            }}
        />
    ),
};

/**
 * Error — reset password mismatch. The confirm field explains the fix (make the
 * two passwords match) rather than just flagging a failure.
 */
export const ResetPasswordError: Story = {
    name: 'Error — Reset Password Mismatch',
    render: () => (
        <ResetPasswordScreen
            errors={{
                confirmPassword: 'Both passwords must match — re-enter them to continue.',
            }}
        />
    ),
};
