import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-violet-950 rounded-lg shadow-lg border border-violet-900 p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

