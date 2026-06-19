export interface UpdateProfileRequestModel {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    location?: string | null;
}

export interface SaveBankAccountRequestModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}
