import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="bg-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-xl font-bold text-violet-400 hover:text-violet-300"
            >
              Banking Platform
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-violet-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className="text-slate-300 hover:text-violet-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Transactions
              </Link>
              <Link
                to="/transfer"
                className="text-slate-300 hover:text-violet-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Transfer
              </Link>
              <Link
                to="/exchange"
                className="text-slate-300 hover:text-violet-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Exchange
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-slate-300">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

