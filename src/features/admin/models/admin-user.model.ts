export interface AdminUserViewModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string | null;
    location: string | null;
    createdAt: string;
}

export interface AdminUsersViewModel {
    items: AdminUserViewModel[];
    totalCount: number;
}

export interface AdminUserDetailViewModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string | null;
    location: string | null;
    createdAt: string;
}
