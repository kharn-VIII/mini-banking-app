import Card from '../ux/Card';
import TransferForm from '../forms/TransferForm';
import { useAccounts } from '../../hooks/useAccounts';

const TransferSection: React.FC = () => {
  const { loadAccounts } = useAccounts();

  return (
    <Card className="mb-6">
      <h2 className="text-xl font-semibold text-violet-100 mb-4">
        Transfer
      </h2>
      <TransferForm
        compact
        onSuccess={() => {
          loadAccounts();
        }}
      />
    </Card>
  );
};

export default TransferSection;

