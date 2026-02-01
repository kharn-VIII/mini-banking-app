import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAccounts, fetchAccountBalance } from '../store/slices/accountsSlice';
import type { Currency } from '../types/currency.type';

export const useAccounts = () => {
  const dispatch = useAppDispatch();
  const { accounts, loading, error } = useAppSelector(
    (state) => state.accounts,
  );

  const loadAccounts = useCallback(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const loadAccountBalance = useCallback(
    (id: string) => {
      dispatch(fetchAccountBalance(id));
    },
    [dispatch],
  );

  const getAccountByCurrency = (currency: Currency) => {
      return accounts.find((account) => account.currency === currency);
  };

  const getUSDAccount = () => {
    return getAccountByCurrency('USD');
  };

  const getEURAccount = () => {
    return getAccountByCurrency('EUR');
  };

  return {
    accounts,
    loading,
    error,
    loadAccounts,
    loadAccountBalance,
    getAccountByCurrency,
    getUSDAccount,
    getEURAccount,
  };
};

export const useAccountsEffect = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);
};

