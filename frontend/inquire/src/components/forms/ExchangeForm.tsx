import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import { validateCurrencyPair } from '../../utils/validation';
import { formatCurrency } from '../../utils/format';
import { CURRENCIES } from '../../utils/constants';
import toast from 'react-hot-toast';
import Input from '../ux/Input';
import Select from '../ux/Select';
import Button from '../ux/Button';
import ErrorMessage from '../ux/ErrorMessage';
import type { Currency } from '../../types/currency.type';

interface ExchangeFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

const baseExchangeSchema = z.object({
  fromCurrency: z.enum(['USD', 'EUR'] as const, {
    message: 'From currency is required',
  }),
  toCurrency: z.enum(['USD', 'EUR'] as const, {
    message: 'To currency is required',
  }),
  amount: z.number().min(0.01, 'Amount must be at least 0.01'),
}).refine(
  (data) => validateCurrencyPair(data.fromCurrency, data.toCurrency),
  {
    message: 'From and to currencies must be different',
    path: ['toCurrency'],
  },
);

type ExchangeFormData = z.infer<typeof baseExchangeSchema>;

const ExchangeForm: React.FC<ExchangeFormProps> = ({
  onSuccess,
  compact = false,
}) => {
  const { loading, error, createExchangeAsync } = useTransactions();
  const { getUSDAccount, getEURAccount, loadAccounts } = useAccounts();

  const usdAccount = getUSDAccount();
  const eurAccount = getEURAccount();

  const form = useForm<ExchangeFormData>({
    resolver: zodResolver(baseExchangeSchema),
    defaultValues: {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 0,
    },
  });

  const fromCurrency = useWatch({
    control: form.control,
    name: 'fromCurrency',
    defaultValue: 'USD',
  }) as Currency;

  // const toCurrency = useWatch({
  //   control: form.control,
  //   name: 'toCurrency',
  //   defaultValue: 'EUR',
  // }) as Currency;

  const amount = useWatch({
    control: form.control,
    name: 'amount',
    defaultValue: 0,
  });

  const fromAccount =
    fromCurrency === 'USD' ? usdAccount : eurAccount;
  const maxAmount = fromAccount?.balance;

  const onSubmit = async (data: ExchangeFormData) => {
    if (!validateCurrencyPair(data.fromCurrency, data.toCurrency)) {
      form.setError('toCurrency', {
        message: 'From and to currencies must be different',
      });
      return;
    }

    if (maxAmount !== undefined && data.amount > maxAmount) {
      form.setError('amount', {
        message: `Insufficient funds. Maximum: ${formatCurrency(
          maxAmount,
          fromCurrency,
        )}`,
      });
      return;
    }

    try {
      await createExchangeAsync({
        fromCurrency: data.fromCurrency,
        toCurrency: data.toCurrency,
        amount: data.amount,
      });
      toast.success('Exchange completed successfully!');
      form.reset({
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 0,
      });
      await loadAccounts();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err || 'Exchange failed');
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
            htmlFor="fromCurrency"
            className="block text-sm font-medium text-violet-200 mb-1"
          >
            From Currency
          </label>
          <Select
            id="fromCurrency"
            error={form.formState.errors.fromCurrency?.message}
            {...form.register('fromCurrency', {
              onChange: () => {
                form.setValue('amount', 0);
                form.clearErrors(['amount', 'toCurrency']);
                if (form.getValues('toCurrency') === form.getValues('fromCurrency')) {
                  const otherCurrency = form.getValues('fromCurrency') === 'USD' ? 'EUR' : 'USD';
                  form.setValue('toCurrency', otherCurrency);
                }
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
            htmlFor="toCurrency"
            className="block text-sm font-medium text-violet-200 mb-1"
          >
            To Currency
          </label>
          <Select
            id="toCurrency"
            error={form.formState.errors.toCurrency?.message}
            {...form.register('toCurrency', {
              onChange: () => {
                form.clearErrors('toCurrency');
              },
            })}
          >
            {CURRENCIES.filter(
              (currency) => currency !== fromCurrency,
            ).map((currency) => (
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
          {fromAccount && (
            <p className="mt-1 text-xs text-slate-400">
              Available:{' '}
              {formatCurrency(fromAccount.balance, fromCurrency)}
            </p>
          )}
          {amount > 0 && (
            <p className="mt-1 text-xs text-violet-300">
              Exchange rate and converted amount will be shown after
              transaction
            </p>
          )}
        </div>
      </div>

      <ErrorMessage message={error ?? undefined} />

      <Button type="submit" disabled={loading} fullWidth>
        {loading ? 'Processing...' : 'Exchange'}
      </Button>
    </form>
  );
};

export default ExchangeForm;

