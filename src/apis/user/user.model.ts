import { AuthTypeEnum } from '@/app/enums';

export interface UserProfileModel {
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
