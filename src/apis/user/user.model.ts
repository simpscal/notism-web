import { AuthType } from '@/app/types';

export interface UserProfileModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    role?: string;
    phoneNumber?: string;
    location?: string;
    authType?: AuthType;
}

export interface BankAccountModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}
