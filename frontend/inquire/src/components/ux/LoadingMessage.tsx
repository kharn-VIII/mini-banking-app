interface LoadingMessageProps {
  message?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="text-center py-8">
      <p className="text-slate-400">{message}</p>
    </div>
  );
};

export default LoadingMessage;

