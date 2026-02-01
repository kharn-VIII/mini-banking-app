interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="text-sm text-rose-400 text-center">{message}</div>
  );
};

export default ErrorMessage;

