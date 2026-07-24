import { z } from 'zod';

import type { AdminUserDetailModel } from '@/apis';
import { UserRoleType } from '@/app/types';

export const USER_ROLE_OPTIONS = [
    { value: UserRoleType.User, label: 'User' },
    { value: UserRoleType.Admin, label: 'Admin' },
] as const;

export const userDetailFormSchema = z.object({
    role: z.nativeEnum(UserRoleType, { required_error: 'Role is required' }),
});

export type UserDetailFormValues = z.infer<typeof userDetailFormSchema>;

export function getDefaultUserDetailFormValues(user: AdminUserDetailModel | null): UserDetailFormValues {
    if (!user) {
        return { role: UserRoleType.User };
    }
    const role = user.role === UserRoleType.Admin ? UserRoleType.Admin : UserRoleType.User;
    return { role };
}

export function userDetailFormValuesToRequest(values: UserDetailFormValues): { role: string } {
    return { role: values.role };
}
