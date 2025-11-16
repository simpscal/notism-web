export interface UserProfileVM {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
}

export interface UpdateProfileRM {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
}
