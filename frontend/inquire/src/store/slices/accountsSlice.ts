import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountsApi } from '../../api/accounts';
import type { Account } from '../../types/account.types';

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  loading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const accounts = await accountsApi.getAccounts();
      return accounts;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch accounts',
      );
    }
  },
);

export const fetchAccountBalance = createAsyncThunk(
  'accounts/fetchAccountBalance',
  async (id: string, { rejectWithValue }) => {
    try {
      const balance = await accountsApi.getAccountBalance(id);
      return balance;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch account balance',
      );
    }
  },
);

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
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
      // Fetch Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Account Balance
      .addCase(fetchAccountBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountBalance.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAccount = state.accounts.find(
          (acc) => acc.id === action.payload.accountId,
        );
        if (updatedAccount) {
          updatedAccount.balance = action.payload.balance;
        }
      })
      .addCase(fetchAccountBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAccounts, setLoading, setError } = accountsSlice.actions;
export default accountsSlice.reducer;

