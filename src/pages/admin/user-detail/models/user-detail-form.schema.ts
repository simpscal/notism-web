import { z } from 'zod';

import type { AdminUserDetailModel } from '@/apis';
import { UserRoleEnum } from '@/app/enums';

export const USER_ROLE_OPTIONS = [
    { value: UserRoleEnum.User, label: 'User' },
    { value: UserRoleEnum.Admin, label: 'Admin' },
] as const;

export const userDetailFormSchema = z.object({
    role: z.nativeEnum(UserRoleEnum, { required_error: 'Role is required' }),
});

export type UserDetailFormValues = z.infer<typeof userDetailFormSchema>;

export function getDefaultUserDetailFormValues(user: AdminUserDetailModel | null): UserDetailFormValues {
    if (!user) {
        return { role: UserRoleEnum.User };
    }
    const role = user.role === UserRoleEnum.Admin ? UserRoleEnum.Admin : UserRoleEnum.User;
    return { role };
}

export function userDetailFormValuesToRequest(values: UserDetailFormValues): { role: string } {
    return { role: values.role };
}
