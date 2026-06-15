import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// ---------------------------------------------------------------------------
// Implementation reference — story 246 (refund-paid confirmation EMAIL).
//
// This is the transactional EMAIL TEMPLATE sent to the customer when their
// bank-transfer refund becomes Paid — NOT an in-app page. The in-app side of
// 246 (the per-order refund-status panel in CustomerRefundTracking and the
// global RefundPaidBanner) is already composed and approved; this artifact is
// the email that goes out at the same Paid transition, carrying the same facts
// for parity with those surfaces.
//
//   • 246 — when a refund becomes Paid, the customer is emailed confirming the
//     refund has been sent.
//   • 246 — the email carries the same Paid facts the app surfaces: order
//     reference, refund amount (formatVnd), transfer reference, and the date the
//     refund was sent.
//   • Parity CTA — a single primary button back to the order's details page
//     (route `orders/{orderId}`, by slug id), matching the banner's click target.
//
// Customer-visible refund status is Pending | Paid only (a Failed/retrying
// refund is NEVER surfaced) — reused verbatim from the other sprint-7 customer
// surfaces. So this email only ever fires on the Paid (terminal) transition;
// there is no "refund failed" email variant here.
//
// Rendering notes (why this file looks different from the other surfaces):
//   • An email is HTML rendered inside a third-party mail client, NOT the app
//     shell. shadcn/app components and Tailwind utility classes are NOT reliable
//     in email clients, so the email BODY is built with plain semantic HTML +
//     table-based layout + inline styles only (email-safe). Brand colors are
//     reproduced as hex constants tuned to the app's green primary token
//     (src/app/assets/styles/index.css: --primary oklch(50% 0.145 149.6)) so the
//     email reads on-brand without depending on app CSS.
//   • The body is wrapped in a labelled "email client" CHROME (subject, from,
//     to, a ~600px max-width body card) so the reviewer judges it as a real
//     received email, not an app page. The chrome is review scaffolding only and
//     is NOT part of the sent artifact.
//
// States: an email has no loading / error / partial runtime states — it is a
// single rendered artifact sent once. So the stories cover only the default sent
// email plus a worst-case-content variant (long order ref + large amount + long
// transfer reference) to prove the fixed-width layout holds. No invented states.
//
// Mock-only fixtures; no api/model/state imports.
// ---------------------------------------------------------------------------

/** Mirrors src/app/utils/currency.utils.ts — VND formatting used across the app. */
function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Email-safe brand palette — hex parity for the app's oklch tokens. Email
// clients do not support oklch / CSS custom properties, so the on-brand colors
// are inlined as hex tuned to the app green primary + neutral scale.
// ---------------------------------------------------------------------------

const BRAND = {
    primary: '#15803d', // app --primary (green) → email-safe hex parity
    primaryText: '#ffffff', // app --primary-foreground
    successBg: '#ecfdf3', // tinted success surface (banner/badge parity)
    successBorder: '#abefc6',
    successText: '#15803d',
    foreground: '#18181b', // app --foreground
    muted: '#71717a', // app --muted-foreground
    border: '#e4e4e7', // app --border
    cardBg: '#ffffff', // app --card
    pageBg: '#f4f4f5', // app --muted (email page backdrop)
    codeBg: '#f4f4f5',
} as const;

const ORDER_DETAILS_BASE_URL = 'https://app.notism.example/orders';

// ---------------------------------------------------------------------------
// Email domain (mock shapes — matches the Paid facts the app surfaces, 246)
// ---------------------------------------------------------------------------

/**
 * The facts the refund-paid email carries. Identical to what the in-app Paid
 * panel/banner show, so the email and app stay consistent (246).
 */
interface RefundPaidEmailData {
    /** Customer first name for the greeting. */
    customerName: string;
    /** Order slug id — the CTA routes to `orders/{orderId}` (246, by slug). */
    orderId: string;
    /** Customer-facing order reference shown in the body. */
    orderRef: string;
    /** Refund amount sent (rendered via formatVnd). */
    amount: number;
    /** Bank transfer reference recorded on Paid (246). */
    transferReference: string;
    /** Date the refund was sent (246). */
    sentDate: string;
}

// ---------------------------------------------------------------------------
// Fixtures — mirror the CustomerRefundTracking / RefundPaidBanner fixtures so
// the email and the in-app surfaces stay on the same data.
// ---------------------------------------------------------------------------

const PAID_DEFAULT: RefundPaidEmailData = {
    customerName: 'Minh',
    orderId: 'A1B2C3',
    orderRef: 'ORD-20260613-0099',
    amount: 485_000,
    transferReference: 'VCB-TRF-20260613-0099431',
    sentDate: '13 June 2026, 14:27',
};

const PAID_LONG: RefundPaidEmailData = {
    customerName: 'Nguyễn Thị Phương Anh',
    orderId: 'Z9Y8X7W6V5U4',
    orderRef: 'ORD-20260610-0000051-RETRY-02',
    amount: 12_480_000,
    transferReference: 'TECHCOMBANK-TRF-20260610-0000051-RETRY-02-REF-887766554433',
    sentDate: '10 June 2026, 18:40',
};

// ---------------------------------------------------------------------------
// Email body — plain semantic HTML + inline styles only (email-safe). This is
// the actual sent artifact. Table layout + a constrained 600px card.
// ---------------------------------------------------------------------------

function RefundPaidEmailBody({ data }: { data: RefundPaidEmailData }) {
    const ctaHref = `${ORDER_DETAILS_BASE_URL}/${data.orderId}`;

    return (
        <table
            role='presentation'
            width='100%'
            cellPadding={0}
            cellSpacing={0}
            style={{
                backgroundColor: BRAND.pageBg,
                margin: 0,
                padding: '32px 12px',
                fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
            }}
        >
            <tbody>
                <tr>
                    <td align='center'>
                        {/* Constrained body card — ~600px is the email-safe max width. */}
                        <table
                            role='presentation'
                            width={600}
                            cellPadding={0}
                            cellSpacing={0}
                            style={{
                                width: '600px',
                                maxWidth: '100%',
                                backgroundColor: BRAND.cardBg,
                                borderRadius: '12px',
                                border: `1px solid ${BRAND.border}`,
                                overflow: 'hidden',
                            }}
                        >
                            <tbody>
                                {/* Brand header */}
                                <tr>
                                    <td
                                        style={{
                                            padding: '20px 32px',
                                            borderBottom: `1px solid ${BRAND.border}`,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                color: BRAND.primary,
                                                letterSpacing: '-0.01em',
                                            }}
                                        >
                                            Notism
                                        </span>
                                    </td>
                                </tr>

                                {/* Headline — confirms the refund has been sent (246) */}
                                <tr>
                                    <td style={{ padding: '32px 32px 0 32px' }}>
                                        <table role='presentation' cellPadding={0} cellSpacing={0}>
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style={{
                                                            backgroundColor: BRAND.successBg,
                                                            border: `1px solid ${BRAND.successBorder}`,
                                                            borderRadius: '999px',
                                                            padding: '6px 14px',
                                                            fontSize: '13px',
                                                            fontWeight: 600,
                                                            color: BRAND.successText,
                                                        }}
                                                    >
                                                        ✓ Refund sent
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <h1
                                            style={{
                                                margin: '20px 0 0 0',
                                                fontSize: '24px',
                                                lineHeight: '32px',
                                                fontWeight: 700,
                                                color: BRAND.foreground,
                                            }}
                                        >
                                            Your refund is on its way
                                        </h1>

                                        <p
                                            style={{
                                                margin: '12px 0 0 0',
                                                fontSize: '15px',
                                                lineHeight: '24px',
                                                color: BRAND.muted,
                                            }}
                                        >
                                            Hi {data.customerName}, we&apos;ve sent your refund of{' '}
                                            <span style={{ color: BRAND.foreground, fontWeight: 600 }}>
                                                {formatVnd(data.amount)}
                                            </span>{' '}
                                            for order{' '}
                                            <span style={{ color: BRAND.foreground, fontWeight: 600 }}>
                                                {data.orderRef}
                                            </span>{' '}
                                            back to your bank account.
                                        </p>
                                    </td>
                                </tr>

                                {/* Facts block — order ref / amount / transfer ref / sent date (246) */}
                                <tr>
                                    <td style={{ padding: '24px 32px 0 32px' }}>
                                        <table
                                            role='presentation'
                                            width='100%'
                                            cellPadding={0}
                                            cellSpacing={0}
                                            style={{
                                                backgroundColor: BRAND.pageBg,
                                                borderRadius: '10px',
                                                border: `1px solid ${BRAND.border}`,
                                            }}
                                        >
                                            <tbody>
                                                <FactRow label='Order reference' value={data.orderRef} />
                                                <FactRow
                                                    label='Refund amount'
                                                    value={formatVnd(data.amount)}
                                                    emphasis
                                                />
                                                <FactRow label='Date sent' value={data.sentDate} />
                                                <FactRow
                                                    label='Transfer reference'
                                                    value={data.transferReference}
                                                    mono
                                                    last
                                                />
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                {/* Primary CTA — back to the order details page (parity, 246) */}
                                <tr>
                                    <td style={{ padding: '28px 32px 0 32px' }}>
                                        <table role='presentation' cellPadding={0} cellSpacing={0}>
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style={{
                                                            backgroundColor: BRAND.primary,
                                                            borderRadius: '10px',
                                                        }}
                                                    >
                                                        <a
                                                            href={ctaHref}
                                                            style={{
                                                                display: 'inline-block',
                                                                padding: '12px 24px',
                                                                fontSize: '15px',
                                                                fontWeight: 600,
                                                                color: BRAND.primaryText,
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            View order details
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                {/* Helper line */}
                                <tr>
                                    <td style={{ padding: '16px 32px 0 32px' }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: '13px',
                                                lineHeight: '20px',
                                                color: BRAND.muted,
                                            }}
                                        >
                                            It can take a few business days for the amount to appear in your account,
                                            depending on your bank. Keep the transfer reference above if you need to
                                            check with them.
                                        </p>
                                    </td>
                                </tr>

                                {/* Footer */}
                                <tr>
                                    <td style={{ padding: '28px 32px 32px 32px' }}>
                                        <hr
                                            style={{
                                                border: 'none',
                                                borderTop: `1px solid ${BRAND.border}`,
                                                margin: '0 0 16px 0',
                                            }}
                                        />
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                lineHeight: '18px',
                                                color: BRAND.muted,
                                            }}
                                        >
                                            You&apos;re receiving this because a refund was issued on your Notism order.
                                            If you didn&apos;t expect this, please contact our support team.
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

/** A single fact row in the facts table — email-safe inline styling. */
function FactRow({
    label,
    value,
    emphasis = false,
    mono = false,
    last = false,
}: {
    label: string;
    value: string;
    emphasis?: boolean;
    mono?: boolean;
    last?: boolean;
}) {
    return (
        <tr>
            <td
                style={{
                    padding: '12px 16px',
                    borderBottom: last ? 'none' : `1px solid ${BRAND.border}`,
                    verticalAlign: 'top',
                }}
            >
                <div
                    style={{
                        fontSize: '12px',
                        color: BRAND.muted,
                        marginBottom: '4px',
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        fontSize: emphasis ? '18px' : '14px',
                        fontWeight: emphasis ? 700 : 600,
                        color: BRAND.foreground,
                        fontFamily: mono
                            ? "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"
                            : "'Noto Sans', Arial, Helvetica, sans-serif",
                        wordBreak: mono ? 'break-all' : 'normal',
                    }}
                >
                    {value}
                </div>
            </td>
        </tr>
    );
}

// ---------------------------------------------------------------------------
// Email client CHROME — review scaffolding only (subject / from / to). NOT part
// of the sent artifact; it frames the body so the reviewer reads it as a real
// received email rather than an app page.
// ---------------------------------------------------------------------------

interface EmailMeta {
    subject: string;
    fromName: string;
    fromAddress: string;
    toAddress: string;
}

function EmailClientFrame({ meta, children }: { meta: EmailMeta; children: React.ReactNode }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#e4e4e7',
                padding: '24px 12px',
                fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: '760px',
                    margin: '0 auto',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #d4d4d8',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
            >
                {/* Scaffolding banner — make clear this chrome is not the artifact */}
                <div
                    style={{
                        backgroundColor: '#fafafa',
                        borderBottom: '1px dashed #d4d4d8',
                        padding: '6px 16px',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        fontSize: '10px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#a1a1aa',
                    }}
                >
                    email client preview — chrome is review scaffolding, not the sent email
                </div>

                {/* Header rows: subject / from / to */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e4e4e7' }}>
                    <div
                        style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#18181b',
                            marginBottom: '10px',
                        }}
                    >
                        {meta.subject}
                    </div>
                    <div style={{ fontSize: '13px', color: '#52525b', lineHeight: '20px' }}>
                        <div>
                            <span style={{ color: '#a1a1aa' }}>From: </span>
                            <span style={{ fontWeight: 600, color: '#18181b' }}>{meta.fromName}</span>{' '}
                            <span style={{ color: '#71717a' }}>&lt;{meta.fromAddress}&gt;</span>
                        </div>
                        <div>
                            <span style={{ color: '#a1a1aa' }}>To: </span>
                            <span style={{ color: '#52525b' }}>{meta.toAddress}</span>
                        </div>
                    </div>
                </div>

                {/* Rendered email body */}
                <div>{children}</div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Composed surface — the email rendered inside the client frame.
// ---------------------------------------------------------------------------

function buildMeta(data: RefundPaidEmailData): EmailMeta {
    return {
        // Subject wording — see <confirmations>.
        subject: `Your refund for order ${data.orderRef} has been sent`,
        // Sender identity — see <confirmations>.
        fromName: 'Notism',
        fromAddress: 'no-reply@notism.example',
        toAddress: 'customer@example.com',
    };
}

function RefundPaidEmailSurface({ data }: { data: RefundPaidEmailData }) {
    return (
        <EmailClientFrame meta={buildMeta(data)}>
            <RefundPaidEmailBody data={data} />
        </EmailClientFrame>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Refund Paid Email',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — the refund-paid confirmation email as the customer receives it:
 *  confirms the refund was sent and carries order ref, amount, transfer
 *  reference, sent date, and the View-order CTA (246). */
export const Default: Story = {
    name: 'Default — Refund Sent Confirmation (246)',
    render: () => <RefundPaidEmailSurface data={PAID_DEFAULT} />,
};

/** Long content — a long order reference, large amount, and long transfer
 *  reference, proving the fixed-width (~600px) email layout and the mono
 *  transfer-reference cell hold up without overflow. */
export const LongContent: Story = {
    name: 'Variant — Long Reference + Large Amount',
    render: () => <RefundPaidEmailSurface data={PAID_LONG} />,
    parameters: {
        docs: {
            description: {
                story: 'Worst-case content (long order ref, large amount, long transfer reference). An email has no loading / error / partial runtime states — it is a single rendered artifact — so the only meaningful second story is a content-stress variant.',
            },
        },
    },
};
