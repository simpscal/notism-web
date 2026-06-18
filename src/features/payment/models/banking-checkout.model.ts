import { BankAccountViewModel } from './bank-account.model';

export interface BankingCheckoutViewModel {
    checkoutId: string;
    bankAccount: BankAccountViewModel | null;
}
