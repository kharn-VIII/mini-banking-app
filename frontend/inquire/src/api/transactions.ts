import { apiClient } from './client';
import type {
  Transaction,
  TransactionsResponse,
  TransferRequest,
  ExchangeRequest,
  TransactionsQueryParams,
} from '../types/transaction.types';

export const transactionsApi = {
  transfer: async (data: TransferRequest): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>(
      '/transactions/transfer',
      data,
    );
    return response.data;
  },

  exchange: async (data: ExchangeRequest): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>(
      '/transactions/exchange',
      data,
    );
    return response.data;
  },

  getTransactions: async (
    params?: TransactionsQueryParams,
  ): Promise<TransactionsResponse> => {
    const response = await apiClient.get<TransactionsResponse>(
      '/transactions',
      { params },
    );
    return response.data;
  },
};

