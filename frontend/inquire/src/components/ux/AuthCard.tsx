import { type ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-md w-full space-y-8 p-8 bg-violet-950 rounded-lg shadow-lg border border-violet-900">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-violet-100">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;

