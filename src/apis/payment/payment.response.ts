export interface BankAccountResponseModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}

export interface BankingCheckoutResponseModel {
    checkoutId: string;
    bankAccount: BankAccountResponseModel | null;
}
