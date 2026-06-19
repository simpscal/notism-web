import { UserProfileModel } from '@/apis';

export function getInitials(user: UserProfileModel): string {
    const first = user.firstName?.[0] ?? '';
    const last = user.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || 'U';
}

export function getDisplayName(user: UserProfileModel): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
}
