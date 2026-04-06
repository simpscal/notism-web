export interface BankAccountResponseModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}

export interface SaveBankAccountRequestModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}
