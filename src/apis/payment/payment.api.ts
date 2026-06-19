import { apiClient } from '../client';

import { PAYMENT_ENDPOINTS } from './payment.constant';
import { toBankAccount, toBankingCheckout } from './payment.mapper';
import { SaveBankAccountRequestModel } from './payment.request';
import { BankAccountResponseModel, BankingCheckoutResponseModel } from './payment.response';

export const paymentApi = {
    getBankAccount: async () => {
        const response = await apiClient.get<BankAccountResponseModel | null>(PAYMENT_ENDPOINTS.BANK_ACCOUNT);
        return toBankAccount(response);
    },

    saveBankAccount: (data: SaveBankAccountRequestModel) => {
        return apiClient.put<void>(PAYMENT_ENDPOINTS.BANK_ACCOUNT, data);
    },

    createBankingCheckout: async (data: { cartItemIds: string[]; totalAmount: number }) => {
        const response = await apiClient.post<BankingCheckoutResponseModel>(PAYMENT_ENDPOINTS.BANKING_CHECKOUT, data);
        return toBankingCheckout(response);
    },
};
