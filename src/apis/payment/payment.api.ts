import { apiClient } from '../client';

import { toBankAccount, toBankingCheckout } from './payment.mapper';
import { SaveBankAccountRequestModel } from './payment.request';
import { BankAccountResponseModel, BankingCheckoutResponseModel } from './payment.response';

import { API_ENDPOINTS } from '@/app/constants';

export const PAYMENT_QUERY_KEYS = {
    bankAccount: () => ['bank-account'] as const,
};

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
