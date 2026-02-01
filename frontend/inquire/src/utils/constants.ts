export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const DEFAULT_PAGE_SIZE = 10;

export const CURRENCIES = ['USD', 'EUR'] as const;