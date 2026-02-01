import type { Account } from '../../types/account.types';
import AccountBalances from './AccountBalances';
import TransferSection from './TransferSection';
import ExchangeSection from './ExchangeSection';
import RecentTransactionsSection from './RecentTransactionsSection';

interface DashboardContentProps {
  usdAccount: Account | null;
  eurAccount: Account | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  usdAccount,
  eurAccount,
}) => {
  return (
    <>
      <AccountBalances usdAccount={usdAccount} eurAccount={eurAccount} />
      <TransferSection />
      <ExchangeSection />
      <RecentTransactionsSection />
    </>
  );
};

export default DashboardContent;

