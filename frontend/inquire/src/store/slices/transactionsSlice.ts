import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionsApi } from '../../api/transactions';
import type {
  Transaction,
  TransferRequest,
  ExchangeRequest,
  TransactionsQueryParams,
} from '../../types/transaction.types';

interface TransactionsState {
  transactions: Transaction[];
  filters: {
    type?: 'transfer' | 'exchange';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const createTransfer = createAsyncThunk(
  'transactions/createTransfer',
  async (data: TransferRequest, { rejectWithValue }) => {
    try {
      const transaction = await transactionsApi.transfer(data);
      return transaction;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Transfer failed',
      );
    }
  },
);

export const createExchange = createAsyncThunk(
  'transactions/createExchange',
  async (data: ExchangeRequest, { rejectWithValue }) => {
    try {
      const transaction = await transactionsApi.exchange(data);
      return transaction;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Exchange failed',
      );
    }
  },
);

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: TransactionsQueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getTransactions(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transactions',
      );
    }
  },
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Transfer
      .addCase(createTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Exchange
      .addCase(createExchange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExchange.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createExchange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.transactions = action.payload.transactions || [];
          state.pagination = {
            page: state.pagination.page,
            limit: action.payload.limit ?? state.pagination.limit,
            total: action.payload.total ?? state.pagination.total,
            totalPages: action.payload.totalPages ?? state.pagination.totalPages,
          };
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPage, setLimit, setLoading, setError } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;

