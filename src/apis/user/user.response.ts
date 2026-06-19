import { AuthTypeEnum } from '@/app/enums';

export interface UserProfileResponseModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    role?: string;
    phoneNumber?: string;
    location?: string;
    authType?: AuthTypeEnum;
}

export interface BankAccountResponseModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}
