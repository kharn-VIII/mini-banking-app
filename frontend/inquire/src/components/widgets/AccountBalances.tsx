import type { Account } from '../../types/account.types';
import AccountCard from '../entities/AccountCard';

interface AccountBalancesProps {
  usdAccount: Account | null;
  eurAccount: Account | null;
}

const AccountBalances: React.FC<AccountBalancesProps> = ({
  usdAccount,
  eurAccount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <AccountCard account={usdAccount} currency="USD" />
      <AccountCard account={eurAccount} currency="EUR" />
    </div>
  );
};

export default AccountBalances;

