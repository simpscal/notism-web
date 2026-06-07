import { UserProfileViewModel } from '@/features/user/models';

export function getInitials(user: UserProfileViewModel): string {
    const first = user.firstName?.[0] ?? '';
    const last = user.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || 'U';
}

export function getDisplayName(user: UserProfileViewModel): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
}
