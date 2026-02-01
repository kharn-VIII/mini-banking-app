import Header from '../components/layout/Header';
import Card from '../components/ux/Card';
import PageTitle from '../components/ux/PageTitle';
import ExchangeForm from '../components/forms/ExchangeForm';
import { useAccounts } from '../hooks/useAccounts';

const Exchange = () => {
  const { loadAccounts } = useAccounts();

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle
          title="Exchange"
          subtitle="Convert between USD and EUR"
        />
        <Card>
          <ExchangeForm
            onSuccess={() => {
              loadAccounts();
            }}
          />
        </Card>
      </main>
    </div>
  );
};

export default Exchange;