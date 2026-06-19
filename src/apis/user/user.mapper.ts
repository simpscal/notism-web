import type { BankAccountModel, UserProfileModel } from './user.model';
import type { BankAccountResponseModel, UserProfileResponseModel } from './user.response';

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

export function toBankAccount(response: BankAccountResponseModel | null): BankAccountModel | null {
    if (!response) {
        return null;
    }

    return {
        bankCode: response.bankCode,
        accountNumber: response.accountNumber,
        accountHolderName: response.accountHolderName,
    };
}
