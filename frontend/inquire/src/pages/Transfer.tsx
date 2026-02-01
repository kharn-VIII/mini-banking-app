import Header from '../components/layout/Header';
import Card from '../components/ux/Card';
import PageTitle from '../components/ux/PageTitle';
import TransferForm from '../components/forms/TransferForm';
import { useAccounts } from '../hooks/useAccounts';

const Transfer = () => {
  const { loadAccounts } = useAccounts();

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle
          title="Transfer"
          subtitle="Send money to another user"
        />
        <Card>
          <TransferForm
            onSuccess={() => {
              loadAccounts();
            }}
          />
        </Card>
      </main>
    </div>
  );
};

export default Transfer;

