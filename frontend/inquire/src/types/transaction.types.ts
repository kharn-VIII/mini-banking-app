import type { Currency } from './currency.type';

export interface Transaction {
  id: string;
  type: 'transfer' | 'exchange';
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: Currency;
  fromAccountId: string | null;
  toAccountId: string | null;
  toUserId: string | null;
  exchangeRate: number | null;
  convertedAmount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransferRequest {
  toUserId: string;
  amount: number;
  currency: Currency;
}

export interface ExchangeRequest {
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: number;
}

export interface TransactionsQueryParams {
  type?: 'transfer' | 'exchange';
  page?: number;
  limit?: number;
}

