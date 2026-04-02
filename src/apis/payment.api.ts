import { apiClient } from './client';
import { BankAccountResponseModel, SaveBankAccountRequestModel } from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const paymentApi = {
    getBankAccount: () => {
        return apiClient.get<BankAccountResponseModel | null>(API_ENDPOINTS.PAYMENT.BANK_ACCOUNT);
    },

    saveBankAccount: (data: SaveBankAccountRequestModel) => {
        return apiClient.put<void>(API_ENDPOINTS.PAYMENT.BANK_ACCOUNT, data);
    },
};
