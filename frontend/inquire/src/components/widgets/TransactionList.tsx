import { useEffect, useRef } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Transaction } from '../../types/transaction.types';
import LoadingMessage from '../ux/LoadingMessage';
import ErrorMessage from '../ux/ErrorMessage';

interface TransactionListProps {
  limit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  compact?: boolean;
}

const getStatusBadgeClass = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-900 text-green-300 border-green-700';
    case 'pending':
      return 'bg-yellow-900 text-yellow-300 border-yellow-700';
    case 'failed':
      return 'bg-rose-900 text-rose-300 border-rose-700';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-600';
  }
};

const getTypeBadgeClass = (type: Transaction['type']) => {
  switch (type) {
    case 'transfer':
      return 'bg-violet-900 text-violet-300 border-violet-700';
    case 'exchange':
      return 'bg-purple-900 text-purple-300 border-purple-700';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-600';
  }
};

const TransactionList: React.FC<TransactionListProps> = ({
  limit,
  showFilters = false,
  showPagination = false,
  compact = false,
}) => {
  const {
    transactions,
    filters,
    pagination,
    loading,
    error,
    loadTransactions,
    updateFilters,
    updatePage,
    updateLimit,
  } = useTransactions();

  const isPageChangeRef = useRef(false);

  useEffect(() => {
    if (isPageChangeRef.current) {
      isPageChangeRef.current = false;
      return;
    }
    const params: any = {};
    if (limit) {
      params.limit = limit;
    } else if (showPagination) {
      params.limit = pagination.limit;
    }
    if (filters.type) {
      params.type = filters.type;
    }
    if (showPagination) {
      params.page = pagination.page;
    }
    loadTransactions(params);
  }, [
    limit,
    filters.type,
    pagination.page,
    pagination.limit,
    showPagination,
    loadTransactions,
  ]);

  const handleFilterChange = (type: 'transfer' | 'exchange' | 'all') => {
    updateFilters(type === 'all' ? {} : { type });
    if (showPagination) {
      updatePage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    isPageChangeRef.current = true;
    updatePage(newPage);
    const params: any = {
      page: newPage,
    };
    if (limit) {
      params.limit = limit;
    } else if (showPagination) {
      params.limit = pagination.limit;
    }
    if (filters.type) {
      params.type = filters.type;
    }
    loadTransactions(params);
  };

  const handleLimitChange = (newLimit: number) => {
    updateLimit(newLimit);
  };

  if (loading && transactions.length === 0) {
    return <LoadingMessage message="Loading transactions..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No transactions found</p>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {(showFilters || showPagination) && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {showFilters && (
            <div>
              <label
                htmlFor="transactionType"
                className="block text-sm font-medium text-violet-200 mb-2"
              >
                Filter by Type
              </label>
              <select
                id="transactionType"
                value={filters.type || 'all'}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.value as 'transfer' | 'exchange' | 'all',
                  )
                }
                className="appearance-none relative block w-full px-3 py-2 border border-violet-600 bg-slate-900 text-violet-100 focus:outline-none focus:border-violet-500 focus:ring-violet-500 rounded-md sm:text-sm"
              >
                <option value="all">All Transactions</option>
                <option value="transfer">Transfer</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>
          )}
          {showPagination && (
            <div>
              <label
                htmlFor="itemsPerPage"
                className="block text-sm font-medium text-violet-200 mb-2"
              >
                Items per Page
              </label>
              <select
                id="itemsPerPage"
                value={pagination.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="appearance-none relative block w-full px-3 py-2 border border-violet-600 bg-slate-900 text-violet-100 focus:outline-none focus:border-violet-500 focus:ring-violet-500 rounded-md sm:text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-violet-900">
          <thead className="bg-violet-950">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-violet-950 divide-y divide-violet-900">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-violet-900 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-violet-100">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeClass(
                      transaction.type,
                    )}`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                      transaction.status,
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-violet-100">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">
                  {transaction.type === 'exchange' ? (
                    <div className="space-y-1">
                      {transaction.exchangeRate && (
                        <div>
                          Rate: {transaction.exchangeRate.toFixed(4)}
                        </div>
                      )}
                      {transaction.convertedAmount && (
                        <div>
                          Converted:{' '}
                          {formatCurrency(
                            transaction.convertedAmount,
                            transaction.currency === 'USD' ? 'EUR' : 'USD',
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {transaction.toUserId && (
                        <div className="truncate max-w-xs" title={transaction.toUserId}>
                          To: {transaction.toUserId}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-violet-900 pt-4">
          <div className="text-sm text-slate-400">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="px-4 py-2 text-sm font-medium text-violet-100 bg-violet-900 border border-violet-700 rounded-md hover:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={
                pagination.page >= pagination.totalPages || loading
              }
              className="px-4 py-2 text-sm font-medium text-violet-100 bg-violet-900 border border-violet-700 rounded-md hover:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;

