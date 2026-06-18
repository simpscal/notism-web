import type { BankAccountResponseModel, BankingCheckoutResponseModel } from '../models';

import type { BankAccountViewModel, BankingCheckoutViewModel } from '@/features/payment/models';

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

export function toBankingCheckout(response: BankingCheckoutResponseModel): BankingCheckoutViewModel {
    return {
        checkoutId: response.checkoutId,
        bankAccount: toBankAccount(response.bankAccount),
    };
}
