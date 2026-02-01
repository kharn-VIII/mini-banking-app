import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import { formatCurrency } from '../../utils/format';
import { CURRENCIES } from '../../utils/constants';
import toast from 'react-hot-toast';
import Input from '../ux/Input';
import Select from '../ux/Select';
import Button from '../ux/Button';
import ErrorMessage from '../ux/ErrorMessage';
import type { Currency } from '../../types/currency.type';

interface TransferFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

const baseTransferSchema = z.object({
  toUserId: z
    .string()
    .min(1, 'Recipient User ID is required'),
  currency: z.enum(['USD', 'EUR'] as const, {
    message: 'Currency is required',
  }),
  amount: z
    .number()
    .min(0.01, 'Amount must be at least 0.01'),
});

type TransferFormData = z.infer<typeof baseTransferSchema>;

const TransferForm: React.FC<TransferFormProps> = ({
  onSuccess,
  compact = false,
}) => {
  const { loading, error, createTransferAsync } = useTransactions();
  const { getUSDAccount, getEURAccount, loadAccounts } = useAccounts();

  const usdAccount = getUSDAccount();
  const eurAccount = getEURAccount();

  const form = useForm<TransferFormData>({
    resolver: zodResolver(baseTransferSchema),
    defaultValues: {
      toUserId: '',
      currency: 'USD',
      amount: 0,
    },
  });

  const selectedCurrency = useWatch({
    control: form.control,
    name: 'currency',
    defaultValue: 'USD',
  }) as Currency;

  const currentAccount =
    selectedCurrency === 'USD' ? usdAccount : eurAccount;
  const maxAmount = currentAccount?.balance;

  const onSubmit = async (data: TransferFormData) => {
    if (maxAmount !== undefined && data.amount > maxAmount) {
      form.setError('amount', {
        message: `Insufficient funds. Maximum: ${formatCurrency(
          maxAmount,
          selectedCurrency,
        )}`,
      });
      return;
    }

    try {
      await createTransferAsync({
        toUserId: data.toUserId,
        amount: data.amount,
        currency: data.currency,
      });
      toast.success('Transfer completed successfully!');
      form.reset();
      await loadAccounts();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err || 'Transfer failed');
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={compact ? 'space-y-4' : 'space-y-6'}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="toUserId"
            className="block text-sm font-medium text-violet-200 mb-1"
          >
            Recipient User ID
          </label>
          <Input
            id="toUserId"
            type="text"
            placeholder="user-id"
            error={form.formState.errors.toUserId?.message}
            {...form.register('toUserId')}
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-violet-200 mb-1"
          >
            Currency
          </label>
          <Select
            id="currency"
            error={form.formState.errors.currency?.message}
            {...form.register('currency', {
              onChange: () => {
                form.setValue('amount', 0);
                form.clearErrors('amount');
              },
            })}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-violet-200 mb-1"
          >
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            error={form.formState.errors.amount?.message}
            {...form.register('amount', {
              valueAsNumber: true,
            })}
          />
          {currentAccount && (
            <p className="mt-1 text-xs text-slate-400">
              Available:{' '}
              {formatCurrency(currentAccount.balance, selectedCurrency)}
            </p>
          )}
        </div>
      </div>

      <ErrorMessage message={error ?? undefined} />

      <Button type="submit" disabled={loading} fullWidth>
        {loading ? 'Processing...' : 'Transfer'}
      </Button>
    </form>
  );
};

export default TransferForm;
