import { format as formatDateFns } from 'date-fns';
import type { Currency } from '../types/currency.type';

export const formatCurrency = (
  amount: number,
  currency: Currency,
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDateFns(date, 'MMM dd, yyyy HH:mm');
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDateFns(date, 'MMM dd, yyyy');
};

