import { MdErrorOutline } from 'react-icons/md';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <MdErrorOutline size={40} className="text-red-400 mb-3" />
      <p className="text-red-600 font-medium mb-2">Something went wrong</p>
      <p className="text-sm text-gray-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium underline"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
