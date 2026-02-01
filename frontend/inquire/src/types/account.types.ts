import type { Currency } from './currency.type';

export interface Account {
  id: string;
  currency: Currency;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountBalance {
  accountId: string;
  currency: Currency;
  balance: number;
}

