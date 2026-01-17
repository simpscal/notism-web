export interface UserProfileResponseModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
}

export interface UpdateProfileRequestModel {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
}
