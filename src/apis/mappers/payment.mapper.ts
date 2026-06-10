import type { BankAccountResponseModel } from '../models';

import type { BankAccountViewModel } from '@/features/payment/models';

export function toBankAccount(response: BankAccountResponseModel | null): BankAccountViewModel | null {
    if (!response) {
        return null;
    }

    return {
        bankCode: response.bankCode,
        accountNumber: response.accountNumber,
        accountHolderName: response.accountHolderName,
    };
}
