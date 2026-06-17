import { memo, useMemo } from 'react';

import { SettingsPaymentSection } from './components';

import { UserRoleEnum } from '@/app/enums';
import { useAppSelector } from '@/core/hooks';

function SettingsPayment() {
    const user = useAppSelector(state => state.user.user);

    const variant = useMemo(() => (user?.role === UserRoleEnum.Admin ? 'admin' : 'customer'), [user?.role]);

    return <SettingsPaymentSection variant={variant} />;
}

export default memo(SettingsPayment);
