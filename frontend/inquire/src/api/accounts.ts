import { apiClient } from './client';
import type { Account, AccountBalance } from '../types/account.types';

export const accountsApi = {
  getAccounts: async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>('/accounts');
    return response.data;
  },

  getAccountBalance: async (id: string): Promise<AccountBalance> => {
    const response = await apiClient.get<AccountBalance>(
      `/accounts/${id}/balance`,
    );
    return response.data;
  },
};

