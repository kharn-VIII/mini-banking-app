import type { Currency } from "../types/currency.type";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 32;
};

export const validateAmount = (
  amount: number,
  min: number = 0.01,
  max?: number,
): boolean => {
  if (amount < min) return false;
  if (max !== undefined && amount > max) return false;
  return true;
};

export const validateCurrencyPair = (
  from: Currency,
  to: Currency,
): boolean => {
  return from !== to;
};

