import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAccounts } from '../hooks/useAccounts';
import Header from '../components/layout/Header';
import PageTitle from '../components/ux/PageTitle';
import LoadingMessage from '../components/ux/LoadingMessage';
import DashboardContent from '../components/widgets/DashboardContent';

const Dashboard = () => {
  const { user, loadUser } = useAuth();
  const { loading, loadAccounts, getUSDAccount, getEURAccount } =
    useAccounts();

  useEffect(() => {
    if (!user) {
      loadUser();
    }
    loadAccounts();
  }, [user, loadUser, loadAccounts]);

  const usdAccount = getUSDAccount() ?? null;
  const eurAccount = getEURAccount() ?? null;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle
          title="Dashboard"
          subtitle={`Welcome back, ${user?.email || 'User'}`}
        />

        {loading ? (
          <LoadingMessage message="Loading accounts..." />
        ) : (
          <DashboardContent usdAccount={usdAccount} eurAccount={eurAccount} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
