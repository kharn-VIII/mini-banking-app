import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTransactions,
  createTransfer,
  createExchange,
  setFilters,
  setPage,
  setLimit,
} from '../store/slices/transactionsSlice';
import type {
  TransactionsQueryParams,
  TransferRequest,
  ExchangeRequest,
} from '../types/transaction.types';

export const useTransactions = () => {
  const dispatch = useAppDispatch();
  const { transactions, filters, pagination, loading, error } =
    useAppSelector((state) => state.transactions);

  const loadTransactions = useCallback(
    (params?: TransactionsQueryParams) => {
      dispatch(fetchTransactions(params));
    },
    [dispatch],
  );

  const createTransferTransaction = useCallback(
    (data: TransferRequest) => {
      dispatch(createTransfer(data));
    },
    [dispatch],
  );

  const createExchangeTransaction = useCallback(
    (data: ExchangeRequest) => {
      dispatch(createExchange(data));
    },
    [dispatch],
  );

  const createTransferAsync = useCallback(
    async (data: TransferRequest) => {
      return dispatch(createTransfer(data)).unwrap();
    },
    [dispatch],
  );

  const createExchangeAsync = useCallback(
    async (data: ExchangeRequest) => {
      return dispatch(createExchange(data)).unwrap();
    },
    [dispatch],
  );

  const updateFilters = useCallback(
    (newFilters: TransactionsQueryParams) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  const updatePage = useCallback(
    (page: number) => {
      dispatch(setPage(page));
    },
    [dispatch],
  );

  const updateLimit = useCallback(
    (limit: number) => {
      dispatch(setLimit(limit));
    },
    [dispatch],
  );

  const getTransactionsByType = useCallback(
    (type: 'transfer' | 'exchange') => {
      return transactions.filter((transaction) => transaction.type === type);
    },
    [transactions],
  );

  const getTransferTransactions = useCallback(() => {
    return getTransactionsByType('transfer');
  }, [getTransactionsByType]);

  const getExchangeTransactions = useCallback(() => {
    return getTransactionsByType('exchange');
  }, [getTransactionsByType]);

  return {
    transactions,
    filters,
    pagination,
    loading,
    error,
    loadTransactions,
    createTransferTransaction,
    createExchangeTransaction,
    createTransferAsync,
    createExchangeAsync,
    updateFilters,
    updatePage,
    updateLimit,
    getTransactionsByType,
    getTransferTransactions,
    getExchangeTransactions,
  };
};

export const useTransactionsEffect = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);
};