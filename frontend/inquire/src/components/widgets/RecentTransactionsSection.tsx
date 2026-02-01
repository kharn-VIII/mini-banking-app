import { Link } from 'react-router-dom';
import Card from '../ux/Card';
import TransactionList from './TransactionList';

const RecentTransactionsSection: React.FC = () => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-violet-100">
          Recent Transactions
        </h2>
        <Link
          to="/transactions"
          className="text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
        >
          View All
        </Link>
      </div>
      <TransactionList limit={5} compact />
    </Card>
  );
};

export default RecentTransactionsSection;
