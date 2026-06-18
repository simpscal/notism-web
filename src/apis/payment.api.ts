import { apiClient } from './client';
import { toBankAccount, toBankingCheckout } from './mappers';
import { BankAccountResponseModel, BankingCheckoutResponseModel, SaveBankAccountRequestModel } from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const paymentApi = {
    getBankAccount: async () => {
        const response = await apiClient.get<BankAccountResponseModel | null>(API_ENDPOINTS.PAYMENT.BANK_ACCOUNT);
        return toBankAccount(response);
    },

    saveBankAccount: (data: SaveBankAccountRequestModel) => {
        return apiClient.put<void>(API_ENDPOINTS.PAYMENT.BANK_ACCOUNT, data);
    },

    createBankingCheckout: async (data: { cartItemIds: string[]; totalAmount: number }) => {
        const response = await apiClient.post<BankingCheckoutResponseModel>(
            API_ENDPOINTS.PAYMENT.BANKING_CHECKOUT,
            data
        );
        return toBankingCheckout(response);
    },
};
