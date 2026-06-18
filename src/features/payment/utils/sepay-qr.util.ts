export const SEPAY_QR_BASE_URL = 'https://qr.sepay.vn/img';

interface SepayQrParams {
    bank: string;
    acc: string;
    amount: number;
    des: string;
}

/**
 * "N"-format GUID: 32 lowercase hex chars, no hyphens. The SePay outbound webhook
 * matches a refund by `content.Trim().Split('-')[0]` + `Guid.TryParseExact(.., "N")`,
 * so this is the exact token shape the transfer description must lead with (#250).
 */
export function toNFormatGuid(value: string): string {
    return value.replace(/-/g, '').toLowerCase();
}

export function buildSepayQrUrl({ bank, acc, amount, des }: SepayQrParams): string {
    const params = new URLSearchParams({
        bank,
        acc,
        amount: String(amount),
        des,
    });

    return `${SEPAY_QR_BASE_URL}?${params.toString()}`;
}
