import { AuthTypeEnum } from '@/app/enums';

export interface UserProfileViewModel {
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
