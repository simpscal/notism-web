import type { BankAccountModel, BankingCheckoutModel } from './payment.model';
import type { BankAccountResponseModel, BankingCheckoutResponseModel } from './payment.response';

export function toBankAccount(response: BankAccountResponseModel | null): BankAccountModel | null {
    if (!response) {
        return null;
    }

    return {
        bankCode: response.bankCode,
        accountNumber: response.accountNumber,
        accountHolderName: response.accountHolderName,
    };
}

export function toBankingCheckout(response: BankingCheckoutResponseModel): BankingCheckoutModel {
    return {
        checkoutId: response.checkoutId,
        bankAccount: toBankAccount(response.bankAccount),
    };
}
