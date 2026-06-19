export interface UpdateProfileRequestModel {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    location?: string | null;
}
