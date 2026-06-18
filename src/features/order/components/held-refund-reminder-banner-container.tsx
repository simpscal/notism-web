import { useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { REFUND_QUERY_KEYS } from '../constants';

import HeldRefundReminderBanner from './held-refund-reminder-banner';

import { orderApi } from '@/apis';
import { ROUTES } from '@/app/constants';

/**
 * Global held-refund reminder (story #260). Mounted once in the customer app shell
 * (ClientLayout). Owns the held-refunds query and renders a single consolidated,
 * non-dismissible banner whenever the customer has at least one refund held awaiting
 * bank details; clicking it routes to the bank-details settings page. Renders nothing
 * while loading or when no refund is held — it has no loading or error UI of its own.
 */
function HeldRefundReminderBannerContainer() {
    const navigate = useNavigate();

    const { data: heldRefunds } = useQuery({
        queryKey: REFUND_QUERY_KEYS.heldRefunds(),
        queryFn: () => orderApi.getHeldRefunds(),
    });

    const handleAddBankDetails = useCallback(() => {
        navigate(`/${ROUTES.SETTINGS.PAYMENT}`);
    }, [navigate]);

    if (!heldRefunds || heldRefunds.length === 0) {
        return null;
    }

    return (
        <div className='sticky top-0 z-[60]' role='status' aria-live='polite'>
            <HeldRefundReminderBanner held={heldRefunds} onAddBankDetails={handleAddBankDetails} />
        </div>
    );
}

export default memo(HeldRefundReminderBannerContainer);
