import type { Account } from '../../types/account.types';
import type { Currency } from '../../types/currency.type';
import { formatCurrency } from '../../utils/format';
import Card from '../ux/Card';

interface AccountCardProps {
  account: Account | null;
  currency: Currency;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, currency }) => {
  const balance = account ? account.balance : 0;
  const currencySymbol = currency === 'USD' ? '$' : '€';
  const accountLabel = `${currency} Account`;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{accountLabel}</p>
          <p className="text-3xl font-bold text-violet-100 mt-2">
            {formatCurrency(balance, currency)}
          </p>
        </div>
        <div className="text-4xl text-violet-400">{currencySymbol}</div>
      </div>
    </Card>
  );
};

export default AccountCard;

