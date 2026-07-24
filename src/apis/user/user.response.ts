import { AuthType } from '@/app/types';

export interface UserProfileResponseModel {
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

export interface BankAccountResponseModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}
