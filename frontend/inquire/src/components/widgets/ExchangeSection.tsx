import Card from '../ux/Card';
import ExchangeForm from '../forms/ExchangeForm';
import { useAccounts } from '../../hooks/useAccounts';

const ExchangeSection: React.FC = () => {
  const { loadAccounts } = useAccounts();

  return (
    <Card className="mb-6">
      <h2 className="text-xl font-semibold text-violet-100 mb-4">
        Exchange
      </h2>
      <ExchangeForm
        compact
        onSuccess={() => {
          loadAccounts();
        }}
      />
    </Card>
  );
};

export default ExchangeSection;

