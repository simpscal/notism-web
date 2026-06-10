import type { UserProfileResponseModel } from '../models';

import type { UserProfileViewModel } from '@/features/user/models';

export function toUserProfile(response: UserProfileResponseModel): UserProfileViewModel {
    return {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        avatarUrl: response.avatarUrl,
        role: response.role,
        phoneNumber: response.phoneNumber,
        location: response.location,
        authType: response.authType,
    };
}
