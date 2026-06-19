export interface BankAccountModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}

export interface BankingCheckoutModel {
    checkoutId: string;
    bankAccount: BankAccountModel | null;
}
