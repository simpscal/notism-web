import { apiClient } from './client';
import { toBankAccount } from './mappers';
import { BankAccountResponseModel, SaveBankAccountRequestModel } from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const paymentApi = {
    getBankAccount: async () => {
        const response = await apiClient.get<BankAccountResponseModel | null>(API_ENDPOINTS.PAYMENT.BANK_ACCOUNT);
        return toBankAccount(response);
    },

    saveBankAccount: (data: SaveBankAccountRequestModel) => {
        return apiClient.put<void>(API_ENDPOINTS.PAYMENT.BANK_ACCOUNT, data);
    },

    createBankingCheckout: (data: { cartItemIds: string[]; totalAmount: number }) => {
        return apiClient.post<{ checkoutId: string }>(API_ENDPOINTS.PAYMENT.BANKING_CHECKOUT, data);
    },
};
