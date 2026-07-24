import { memo, useMemo } from 'react';

import { SettingsPaymentSection } from './components';

import { UserRoleType } from '@/app/types';
import { useAppSelector } from '@/core/hooks';

function SettingsPayment() {
    const user = useAppSelector(state => state.user.user);

    const variant = useMemo(() => (user?.role === UserRoleType.Admin ? 'admin' : 'customer'), [user?.role]);

    return <SettingsPaymentSection variant={variant} />;
}

export default memo(SettingsPayment);
