import type { UserProfileModel } from './user.model';
import type { UserProfileResponseModel } from './user.response';

export function toUserProfile(response: UserProfileResponseModel): UserProfileModel {
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
