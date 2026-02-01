import Header from '../components/layout/Header';
import PageTitle from '../components/ux/PageTitle';
import Card from '../components/ux/Card';
import TransactionList from '../components/widgets/TransactionList';

const TransactionHistory = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle
          title="Transaction History"
          subtitle="View all your transactions"
        />
        <Card>
          <TransactionList showFilters showPagination />
        </Card>
      </main>
    </div>
  );
};

export default TransactionHistory;
